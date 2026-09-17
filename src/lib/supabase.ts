import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

/**
 * Security Guard: Validates that the key is strictly an anonymous/public key
 * and NEVER a sensitive service_role or backend secret key.
 */
function isSafePublicKey(key?: string): boolean {
  if (!key) return false;
  // Block any keys starting with secret prefixes
  if (key.startsWith('sb_secret_') || key.startsWith('service_role')) {
    if (import.meta.env.DEV) {
      console.error('[Security Alert] Service-role key detected! Never expose secret keys in client-side VITE_* variables.');
    }
    return false;
  }

  // If key is a JWT, verify the payload role is NOT 'service_role'
  if (key.split('.').length === 3) {
    try {
      const payloadPart = key.split('.')[1];
      const normalizedBase64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = JSON.parse(atob(normalizedBase64));
      if (decodedPayload?.role === 'service_role') {
        if (import.meta.env.DEV) {
          console.error('[Security Alert] Refusing to initialize Supabase client: JWT role is service_role. Use the public anon key only.');
        }
        return false;
      }
    } catch {
      // If parsing fails, fall back to basic checks
    }
  }

  return true;
}

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

// No implicit connection to a hard-coded project. The app can run safely with local offline storage.
export const supabase = isConfigured
  ? createClient(rawUrl!, rawAnonKey!, {
      auth: {
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
    const endpoint = `${rawUrl!.replace(/\/$/, '')}/rest/v1/`;
    const response = await fetch(endpoint, {
      headers: {
        apikey: rawAnonKey!,
        Accept: 'application/openapi+json',
      },
      signal: AbortSignal.timeout(8000),
      cache: 'no-store',
    });

    if (!response.ok) {
      return { connected: false, message: `Data API returned HTTP ${response.status}.` };
    }
    return {
      connected: true,
      message: 'Supabase Data API is reachable. Operational cloud sync is active.',
    };
  } catch (error) {
    return {
      connected: false,
      message: error instanceof Error ? error.message : 'Cloud connection probe failed.',
    };
  }
}

export default supabase;
