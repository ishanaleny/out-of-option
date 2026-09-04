import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://plblppbbdvyhnwjulezz.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYmxwcGJiZHZ5aG53anVsZXp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NTU4NjMsImV4cCI6MjEwNDAzMTg2M30.l7ptAHukRTQBURhxuA-AjaUKhb-hS5sIC6Ug08_I1Lw'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export const STORAGE_URL = `${SUPABASE_URL}/storage/v1/object/public/profile-photos`

/**
 * Get a public URL for a profile photo by userId
 */
export function getProfilePhotoUrl(userId, filename) {
  if (!userId || !filename) return null
  return `${STORAGE_URL}/${userId}/${filename}`
}

/**
 * Upload a profile photo to Supabase Storage
 * Returns the public URL or null on error
 */
export async function uploadProfilePhoto(userId, file) {
  const ext = file.name.split('.').pop()
  const filename = `avatar.${ext}`
  const path = `${userId}/${filename}`

  const { error } = await supabase.storage
    .from('profile-photos')
    .upload(path, file, { upsert: true })

  if (error) {
    console.error('Photo upload error:', error)
    return null
  }

  return getProfilePhotoUrl(userId, filename)
}

/**
 * Fetch all profiles EXCEPT the current user
 */
export async function fetchAllProfiles(excludeUserId) {
  let query = supabase.from('profiles').select('*').order('created_at', { ascending: false })
  if (excludeUserId) {
    query = query.neq('id', excludeUserId)
  }
  const { data, error } = await query
  if (error) throw error
  return data || []
}

/**
 * Update current user's profile with new data
 */
export async function updateProfile(userId, updates) {
  const { error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)

  if (error) throw error
}
