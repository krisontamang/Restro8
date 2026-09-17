import { createClient } from '@supabase/supabase-js';
import { isSafePublicKey } from './accountRules';

const rawUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

/**
 * Security Guard: Validate URL protocol
 */
function isSafeSupabaseUrl(url?: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    if (import.meta.env.PROD && parsed.protocol !== 'https:') {
      console.error('[Security Alert] Production Supabase URL must use HTTPS.');
      return false;
    }
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

const isConfigured = Boolean(
  rawUrl &&
  rawAnonKey &&
  isSafeSupabaseUrl(rawUrl) &&
  isSafePublicKey(rawAnonKey)
);

// Missing configuration fails closed on public/account routes. Local demo data is development-only.
export const supabase = isConfigured
  ? createClient(rawUrl!, rawAnonKey!, {
      auth: {
        flowType: 'pkce',
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      db: { schema: 'public' },
    })
  : null;

/** Checks connectivity without exposing API keys or credentials. */
export async function checkSupabaseConnection(): Promise<{ connected: boolean; message: string }> {
  if (!isConfigured) {
    return {
      connected: false,
      message: 'Cloud connection is not configured or uses restricted credentials. Records are safely stored in this browser.',
    };
  }

  try {
    const endpoint = `${rawUrl!.replace(/\/$/, '')}/rest/v1/r8_billing_plans?select=id&limit=0`;
    const response = await fetch(endpoint, {
      headers: {
        apikey: rawAnonKey!,
      },
      signal: AbortSignal.timeout(8000),
      cache: 'no-store',
    });

    if (!response.ok) {
      return { connected: false, message: `Data API returned HTTP ${response.status}.` };
    }
    return {
      connected: true,
      message: 'Supabase Data API is reachable. This does not verify operational sync or billing.',
    };
  } catch (error) {
    return {
      connected: false,
      message: error instanceof Error ? error.message : 'Cloud connection probe failed.',
    };
  }
}

export default supabase;
