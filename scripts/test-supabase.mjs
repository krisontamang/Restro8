// Read-only connectivity probe. Never logs credentials or restaurant records.
try { process.loadEnvFile('.env'); } catch { /* Environment variables can be supplied by the shell. */ }
const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;
if (!url || !key || key.startsWith('sb_secret_')) {
  console.error('Set VITE_SUPABASE_URL and a publishable/anon VITE_SUPABASE_ANON_KEY.');
  process.exitCode = 1;
} else {
  try {
    // The OpenAPI root now requires a secret key. Probe an explicitly public table instead.
    const response = await fetch(`${url.replace(/\/$/, '')}/rest/v1/r8_billing_plans?select=id&limit=0`, {
      headers: { apikey: key },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error(`Data API returned HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('Unexpected Data API response');
    console.log('PASS: Public plans Data API reachable with the publishable key.');
    console.log('This does not verify operational cloud sync, row policies, or multi-device writes.');
  } catch (error) {
    console.error(`FAIL: ${error.message}`);
    process.exitCode = 1;
  }
}
