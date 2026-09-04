-- =====================================================================
-- LAST RESORT™ — COMPLETE ONE-CLICK SUPABASE SETUP SCRIPT
-- Copy this entire file and paste it into the Supabase SQL Editor → Run
-- =====================================================================

-- 1. Create the profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id                              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                           TEXT UNIQUE NOT NULL,
  username                        TEXT UNIQUE,
  name                            TEXT,
  age                             INTEGER CHECK (age >= 18 AND age <= 120),
  gender                          TEXT,
  location                        TEXT,
  profile_photo                   TEXT,            -- Public URL from Supabase Storage
  bio                             TEXT,
  interests                       TEXT,
  personality                     TEXT,
  hobby                           TEXT,
  favorite_food                   TEXT,
  favorite_number                 INTEGER,
  favorite_color                  TEXT,
  favorite_animal                 TEXT,
  music_type                      TEXT,
  movie_type                      TEXT,
  uselessness_score               INTEGER DEFAULT 0,
  alarms_per_morning              INTEGER DEFAULT 0,
  unread_messages                 INTEGER DEFAULT 0,
  average_reply_time              TEXT,
  most_useless_skill              TEXT,
  weirdest_fear                   TEXT,
  red_flag                        TEXT,
  green_flag                      TEXT,
  most_used_phrase                TEXT,
  last_google_search              TEXT,
  would_survive_zombie_apocalypse BOOLEAN DEFAULT false,
  reason_they_are_single          TEXT,
  created_at                      TIMESTAMPTZ DEFAULT NOW(),
  updated_at                      TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Trigger to automatically update updated_at on change
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

-- 3. Trigger to auto-create profile row when a new user signs up
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

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5. Profiles RLS Policies
DROP POLICY IF EXISTS "Public profiles are viewable by authenticated users" ON public.profiles;
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;
CREATE POLICY "Users can delete their own profile"
  ON public.profiles FOR DELETE TO authenticated USING (auth.uid() = id);

-- 6. Storage Bucket for Profile Photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Authenticated users can upload their photo" ON storage.objects;
CREATE POLICY "Authenticated users can upload their photo"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'profile-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Authenticated users can update their photo" ON storage.objects;
CREATE POLICY "Authenticated users can update their photo"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'profile-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Public can view profile photos" ON storage.objects;
CREATE POLICY "Public can view profile photos"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'profile-photos');

DROP POLICY IF EXISTS "Authenticated users can delete their photo" ON storage.objects;
CREATE POLICY "Authenticated users can delete their photo"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'profile-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
