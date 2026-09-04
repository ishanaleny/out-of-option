-- =====================================================================
-- LAST RESORT™ — SQL File 02: Row Level Security Policies
-- Paste this in Supabase SQL Editor → Run  (after 01_profiles_table.sql)
-- =====================================================================

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Public profiles are viewable by authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;

-- POLICY 1: All authenticated users can READ all profiles (for the feed / matching)
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- POLICY 2: Users can INSERT their own profile row
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- POLICY 3: Users can UPDATE only their own profile row
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- POLICY 4: Users can DELETE only their own profile row
CREATE POLICY "Users can delete their own profile"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- NOTE: For anon reads during registration (username check), temporarily allow:
-- CREATE POLICY "Allow username check for registration" ON public.profiles FOR SELECT TO anon USING (true);
-- (Remove / restrict this after launch)
