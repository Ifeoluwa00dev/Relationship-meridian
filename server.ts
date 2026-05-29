import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Lazy initializers — only created when a request comes in
// by which time Railway has injected the environment variables
const getAI = () => new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
});

const getResend = () => new Resend(process.env.RESEND_API_KEY || '');

const getSupabaseAdmin = () => createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", env: {
    gemini: !!process.env.GEMINI_API_KEY,
    resend: !!process.env.RESEND_API_KEY,
    supabase: !!process.env.SUPABASE_URL,
  }});
});

app.post("/api/admin/run-matching", async (req, res) => {
  const supabaseAdmin = getSupabaseAdmin();

  const { data: profiles, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('is_active', true)
    .eq('is_matched', false);

  if (error) return res.status(500).json({ error: error.message });
  if (!profiles || profiles.length < 2) return res.json({ message: "Not enough profiles to match" });

  const results = [];

  for (let i = 0; i < profiles.length; i++) {
    for (let j = i + 1; j < profiles.length; j++) {
      const profileA = profiles[i];
      const profileB = profiles[j];

      const { data: existingMatch } = await supabaseAdmin
        .from('matches')
        .select('*')
        .or(`profile_a_id.eq.${profileA.id},profile_b_id.eq.${profileA.id}`)
        .or(`profile_a_id.eq.${profileB.id},profile_b_id.eq.${profileB.id}`)
        .not('status', 'eq', 'expired');

      if (existingMatch && existingMatch.length > 0) continue;

      try {
        const matchResult = await evaluateMatch(profileA, profileB);
        if (matchResult.match) {
          const { data: savedMatch } = await supabaseAdmin
            .from('matches')
            .insert({
              profile_a_id: profileA.id,
              profile_b_id: profileB.id,
              score_a_to_b: matchResult.score_a_to_b,
              score_b_to_a: matchResult.score_b_to_a,
              compatibility_brief: matchResult.compatibility_brief,
              status: 'pending'
            })
            .select()
            .single();

          if (savedMatch) {
            results.push({ match_id: savedMatch.id, profiles: [profileA.email, profileB.email] });
            await supabaseAdmin.from('profiles').update({ is_matched: true }).in('id', [profileA.id, profileB.id]);
          }
        }
      } catch (err) {
        console.error("Matching error:", err);
      }
    }
  }

  res.json({ processed: profiles.length, matches_found: results.length, matches: results });
});

async function evaluateMatch(pA: any, pB: any) {
  const ai = getAI();
  const prompt = `
    You are a compatibility analyst for Meridian, a serious relationship matching platform.
    Evaluate whether Person A and Person B are genuinely compatible for a long-term intentional relationship.

    Person A Profile: ${JSON.stringify(pA.form_data)}
    Person B Profile: ${JSON.stringify(pB.form_data)}

    Task:
    1. Check Person A's hard dealbreakers (marked in compromises) against Person B's profile.
    2. Check Person B's hard dealbreakers against Person A's profile.
    3. If any hard dealbreaker is violated, return { "match": false, "reason": "dealbreaker violated", "detail": "..." }
    4. Score how well Person B matches Person A's partner spec (0-100).
    5. Score how well Person A matches Person B's partner spec (0-100).
    6. A valid match requires BOTH scores to be 90 or above.
    7. If match is valid, generate a compatibility brief with:
       - Why you matched (3-5 reasons)
       - Shared values and worldview
       - Aligned positions
       - Notable differences
       - How compromises bridge gaps
       - Closing note (one warm sentence)

    Tone: warm, thoughtful, intelligent.
    Return JSON only:
    {
      "match": boolean,
      "score_a_to_b": number,
      "score_b_to_a": number,
      "compatibility_brief": "string (markdown)",
      "reason": "string (if match is false)"
    }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config: { responseMimeType: "application/json" }
  });

  return JSON.parse(response.text || '{}');
}

async function sendMatchNotification(match: any, profileA: any, profileB: any) {
  const resend = getResend();
  const subject = "Meridian found a potential match";

  const body = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #0d0d0f; color: #e8e4dc;">
      <h1 style="font-size: 28px; font-weight: 300; color: #b49760; letter-spacing: 0.2em;">MERIDIAN</h1>
      <p style="font-size: 15px; line-height: 1.8; margin: 24px 0;">
        We found someone whose values, worldview, and intentions align strongly with yours.
      </p>
      <div style="padding: 24px; border: 1px solid rgba(180,151,96,0.2); border-radius: 8px; margin: 24px 0; line-height: 1.8; font-size: 14px;">
        ${match.compatibility_brief}
      </div>
      <p style="font-size: 14px; line-height: 1.8; color: #8a8078;">
        If you're interested in learning more, reply to this email with the word <strong style="color: #b49760;">INTERESTED</strong> within 7 days.
      </p>
      <p style="font-size: 14px; line-height: 1.8; color: #8a8078;">
        If your match also responds, we'll introduce you properly.
      </p>
      <p style="font-size: 12px; color: #4a4540; margin-top: 32px;">
        Neither of you will know if the other responded until you both have.
      </p>
    </div>
  `;

  await resend.emails.send({
    from: 'Meridian <matches@yourdomain.com>',
    to: [profileA.email],
    subject,
    html: body,
  });

  await resend.emails.send({
    from: 'Meridian <matches@yourdomain.com>',
    to: [profileB.email],
    subject,
    html: body,
  });
}

app.post("/api/admin/send-notifications", async (req, res) => {
  const supabaseAdmin = getSupabaseAdmin();
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  const { data: matches, error } = await supabaseAdmin
    .from('matches')
    .select('*, profile_a:profiles!profile_a_id(*), profile_b:profiles!profile_b_id(*)')
    .eq('status', 'pending')
    .lte('matched_at', threeDaysAgo.toISOString());

  if (error) return res.status(500).json({ error: error.message });

  const sent = [];
  for (const match of (matches || [])) {
    await sendMatchNotification(match, match.profile_a, match.profile_b);
    await supabaseAdmin.from('matches')
      .update({ status: 'notified', notified_at: new Date().toISOString() })
      .eq('id', match.id);
    sent.push(match.id);
  }

  res.json({ notified: sent.length });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`ENV check — GEMINI: ${!!process.env.GEMINI_API_KEY}, RESEND: ${!!process.env.RESEND_API_KEY}, SUPABASE: ${!!process.env.SUPABASE_URL}`);
  });
}

startServer();