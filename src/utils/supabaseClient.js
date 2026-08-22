import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseConfigured = Boolean(url && anonKey && !anonKey.startsWith('paste-'))

// Only construct the client when configured — avoids crashing the whole app
// on a missing env var before the Supabase project's Google provider is set up.
export const supabase = supabaseConfigured ? createClient(url, anonKey) : null
