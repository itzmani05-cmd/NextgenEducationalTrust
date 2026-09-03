const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseConfigured = Boolean(url && anonKey && !anonKey.startsWith('paste-'))

// The Supabase SDK is ~57KB gzipped — dynamically importing it keeps it out
// of the initial bundle so it can't block first paint/LCP. It's still
// fetched right away (AuthContext calls this on mount), just off the
// critical rendering path, and every caller shares the same cached client.
let clientPromise = null

export function getSupabase() {
  if (!supabaseConfigured) return Promise.resolve(null)
  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(url, anonKey)
    )
  }
  return clientPromise
}
