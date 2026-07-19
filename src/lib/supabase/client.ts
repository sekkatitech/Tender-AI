import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY. Copy .env.example to .env and fill in your project's values."
  )
}

/**
 * No schema exists yet (Phase 2 builds the database). This client is wired
 * for connectivity only — every table/RPC call comes in a later phase.
 */
export const supabase = createClient(supabaseUrl, supabaseKey)
