-- =====================================================================
-- LAST RESORT™ — SQL File 02: Row Level Security Policies
-- Paste this in Supabase SQL Editor → Run  (after 01_profiles_table.sql)
-- =====================================================================

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Public profiles are viewable by authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can delete profiles" ON public.profiles;

-- POLICY 1: All users can READ all profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT TO public USING (true);

-- POLICY 2: Anyone can INSERT profiles
CREATE POLICY "Anyone can insert profiles"
  ON public.profiles FOR INSERT TO public WITH CHECK (true);

-- POLICY 3: Anyone can UPDATE profiles
CREATE POLICY "Anyone can update profiles"
  ON public.profiles FOR UPDATE TO public USING (true) WITH CHECK (true);

-- POLICY 4: Anyone can DELETE profiles
CREATE POLICY "Anyone can delete profiles"
  ON public.profiles FOR DELETE TO public USING (true);
