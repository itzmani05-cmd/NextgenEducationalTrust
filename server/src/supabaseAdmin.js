import { createClient } from '@supabase/supabase-js'

let client = null
export function getSupabaseAdmin() {
  if (client) return client

  const url = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    throw new Error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set.')
  }

  client = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  return client
}

export const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'documents'
