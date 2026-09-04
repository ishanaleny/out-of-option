-- =====================================================================
-- LAST RESORT™ — SQL File 01: profiles table
-- Paste this in Supabase SQL Editor → Run
-- =====================================================================

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id                          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                       TEXT UNIQUE NOT NULL,
  username                    TEXT UNIQUE,
  name                        TEXT,
  age                         INTEGER CHECK (age >= 18 AND age <= 120),
  gender                      TEXT,
  location                    TEXT,
  profile_photo               TEXT,            -- Supabase Storage public URL
  bio                         TEXT,
  interests                   TEXT,
  personality                 TEXT,
  hobby                       TEXT,
  favorite_food               TEXT,
  favorite_number             INTEGER,
  favorite_color              TEXT,
  favorite_animal             TEXT,
  music_type                  TEXT,
  movie_type                  TEXT,
  uselessness_score           INTEGER DEFAULT 0,
  alarms_per_morning          INTEGER DEFAULT 0,
  unread_messages             INTEGER DEFAULT 0,
  average_reply_time          TEXT,
  most_useless_skill          TEXT,
  weirdest_fear               TEXT,
  red_flag                    TEXT,
  green_flag                  TEXT,
  most_used_phrase            TEXT,
  last_google_search          TEXT,
  would_survive_zombie_apocalypse BOOLEAN DEFAULT false,
  reason_they_are_single      TEXT,
  created_at                  TIMESTAMPTZ DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create profile row when a new user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at, updated_at)
  VALUES (NEW.id, NEW.email, NOW(), NOW())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
