import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
const configured = Boolean(supabaseUrl && supabaseAnonKey && !supabaseAnonKey.startsWith('sb_secret_'));

// No implicit connection to a hard-coded project. The app can run locally.
export const supabase = configured ? createClient(supabaseUrl!, supabaseAnonKey!, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  db: { schema: 'public' },
}) : null;

/** Checks an actual network response, not the locally cached auth session. */
export async function checkSupabaseConnection(): Promise<{ connected: boolean; message: string }> {
  if (!configured) return { connected: false, message: 'Cloud connection is not configured. Records are stored in this browser.' };
  try {
    const response = await fetch(`${supabaseUrl!.replace(/\/$/, '')}/rest/v1/`, {
      headers: { apikey: supabaseAnonKey!, Accept: 'application/openapi+json' },
      signal: AbortSignal.timeout(8000),
      cache: 'no-store',
    });
    if (!response.ok) return { connected: false, message: `Data API returned HTTP ${response.status}.` };
    return { connected: true, message: 'Supabase Data API is reachable. Operational cloud sync is not yet configured.' };
  } catch (error) {
    return { connected: false, message: error instanceof Error ? error.message : 'Cloud connection failed.' };
  }
}
export default supabase;
