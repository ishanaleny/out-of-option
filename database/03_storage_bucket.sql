-- =====================================================================
-- LAST RESORT™ — SQL File 03: Supabase Storage Bucket for Profile Photos
-- Paste this in Supabase SQL Editor → Run  (after 01 and 02)
-- =====================================================================

-- Create the profile-photos storage bucket (public so photos are viewable by anyone)
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- RLS: Allow authenticated users to upload their own photo
DROP POLICY IF EXISTS "Authenticated users can upload their photo" ON storage.objects;
CREATE POLICY "Authenticated users can upload their photo"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'profile-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- RLS: Allow authenticated users to update their own photo
DROP POLICY IF EXISTS "Authenticated users can update their own photo" ON storage.objects;
CREATE POLICY "Authenticated users can update their own photo"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'profile-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- RLS: Allow anyone (public) to read profile photos (since bucket is public)
DROP POLICY IF EXISTS "Public can view profile photos" ON storage.objects;
CREATE POLICY "Public can view profile photos"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'profile-photos');

-- RLS: Allow authenticated users to delete their own photo
DROP POLICY IF EXISTS "Authenticated users can delete their own photo" ON storage.objects;
CREATE POLICY "Authenticated users can delete their own photo"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'profile-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
