-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  age INTEGER,
  gender TEXT,
  location TEXT,
  form_data JSONB NOT NULL,
  media_urls JSONB NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  locked_until TIMESTAMP WITH TIME ZONE,
  reflection_note TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_matched BOOLEAN DEFAULT FALSE
);

-- Matches table
CREATE TABLE matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_a_id UUID REFERENCES profiles(id),
  profile_b_id UUID REFERENCES profiles(id),
  score_a_to_b INTEGER,
  score_b_to_a INTEGER,
  compatibility_brief TEXT,
  matched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notified_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' -- notified, mutual, expired
);

-- RLS Rules (Example)
ALTER TABLE profiles ENABLE RECURSIVE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
