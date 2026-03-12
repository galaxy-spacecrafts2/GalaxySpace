// lib/supabaseClient.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

/**
 * Returns a Supabase client when credentials are present.
 * In build/prerender environments where env vars are absent, this returns null
 * so importing modules won't throw during static prerender.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!url || !anonKey) {
    // Guard: avoid creating client during build time when keys aren't provided
    // This prevents @supabase/ssr errors during prerender/build.
    return null;
  }

  // Create a client. It's safe to create here for server use as long as you
  // don't store per-request auth state on module-level singletons.
  return createClient(url, anonKey);
}
