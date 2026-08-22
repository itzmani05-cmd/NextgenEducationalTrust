import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, supabaseConfigured } from '../utils/supabaseClient.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(supabaseConfigured)

  useEffect(() => {
    if (!supabaseConfigured) return

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    if (!supabaseConfigured) throw new Error('Sign-in is not configured yet.')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.href },
    })
    if (error) throw error
  }

  const signInWithPassword = async (email, password) => {
    if (!supabaseConfigured) throw new Error('Sign-in is not configured yet.')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signUpWithPassword = async ({ name, email, password }) => {
    if (!supabaseConfigured) throw new Error('Sign-in is not configured yet.')
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })
    if (error) throw error
    return data
  }

  const signOut = () => supabaseConfigured && supabase.auth.signOut()

  const value = {
    user: session?.user || null,
    accessToken: session?.access_token || null,
    loading,
    configured: supabaseConfigured,
    signInWithGoogle,
    signInWithPassword,
    signUpWithPassword,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
