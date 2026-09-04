import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function initSession() {
      try {
        const { data: { session: sbSession } } = await supabase.auth.getSession()
        if (sbSession) {
          setSession(sbSession)
          if (sbSession.user) await fetchProfile(sbSession.user.id)
        } else {
          const stored = localStorage.getItem('lastresort_custom_session')
          if (stored) {
            try {
              const parsed = JSON.parse(stored)
              if (parsed?.user?.id) {
                setSession(parsed)
                await fetchProfile(parsed.user.id)
              } else {
                setLoading(false)
              }
            } catch (_) {
              setLoading(false)
            }
          } else {
            setLoading(false)
          }
        }
      } catch (err) {
        console.error('Session init error:', err)
        setLoading(false)
      }
    }

    initSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, sbSession) => {
      if (sbSession) {
        setSession(sbSession)
        if (sbSession.user) await fetchProfile(sbSession.user.id)
      } else {
        const stored = localStorage.getItem('lastresort_custom_session')
        if (!stored) {
          setSession(null)
          setProfile(null)
          setLoading(false)
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) throw error
      setProfile(data || null)
    } catch (err) {
      console.error('Failed to fetch profile:', err)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  async function setCustomSession(customSessionData) {
    localStorage.setItem('lastresort_custom_session', JSON.stringify(customSessionData))
    setSession(customSessionData)
    if (customSessionData?.user?.id) {
      await fetchProfile(customSessionData.user.id)
    }
  }

  async function refreshProfile() {
    if (session?.user?.id) await fetchProfile(session.user.id)
  }

  async function signOut() {
    localStorage.removeItem('lastresort_custom_session')
    await supabase.auth.signOut()
    setProfile(null)
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ session, profile, loading, refreshProfile, setCustomSession, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
