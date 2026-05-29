# Meridian

> *The point where everything aligns.*

Meridian is not a dating app. There is no swiping, no browsing, no shortcuts. Users fill out three deep intentional forms, upload photos and a short video, and the system quietly finds matches in the background. If a strong match is found, both parties are notified by email in 3 days. Photos and video are only revealed after both parties have expressed mutual interest.

---

## Stack

- **Frontend** — React, TypeScript, Tailwind CSS, Framer Motion
- **Backend** — Node.js, Express
- **Database** — Supabase (PostgreSQL + Auth + Storage)
- **Matching Engine** — Google Gemini API
- **Email** — Resend
- **Build Tool** — Vite

---

## Run Locally

**Prerequisites:** Node.js

1. Clone the repository
```bash
   git clone https://github.com/YOUR_USERNAME/meridian-app.git
   cd meridian-app
```

2. Install dependencies
```bash
   npm install
```

3. Create a `.env` file in the root directory
```env
   GEMINI_API_KEY=your_gemini_api_key
   RESEND_API_KEY=your_resend_api_key
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key
   APP_URL=http://localhost:3000
```

4. Run the app
```bash
   npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

---

## How It Works

1. **About You** — Deep personal form covering family background, faith, values, health, and positions on serious life topics
2. **Build Your Partner** — Intentional questions about the kind of partner you are looking for
3. **Where You Stand** — Compromise form separating dealbreakers from flexible preferences
4. **Photos & Video** — Uploaded privately, only revealed after mutual interest is confirmed

The matching engine scores compatibility in both directions. A valid match requires 90% alignment or above from both sides. Matched users receive a compatibility brief by email after 3 days — no names, no photos, just why they matched. Photos and video are shared only after both parties reply.

---

## Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key for the matching engine |
| `RESEND_API_KEY` | Resend API key for email delivery |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `VITE_SUPABASE_URL` | Supabase URL exposed to the frontend |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key for client-side auth |
| `APP_URL` | Base URL of the deployed app |

---

*Built by Jay Adelegan*