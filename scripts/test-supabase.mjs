// Read-only connectivity probe. Never logs credentials or restaurant records.
try { process.loadEnvFile('.env'); } catch { /* Environment variables can be supplied by the shell. */ }
const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;
if (!url || !key || key.startsWith('sb_secret_')) {
  console.error('Set VITE_SUPABASE_URL and a publishable/anon VITE_SUPABASE_ANON_KEY.');
  process.exitCode = 1;
} else {
  try {
    const response = await fetch(`${url.replace(/\/$/, '')}/rest/v1/`, {
      headers: { apikey: key, Accept: 'application/openapi+json' },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error(`Data API returned HTTP ${response.status}`);
    const schema = await response.json();
    console.log(`PASS: Data API reachable; ${Object.keys(schema.paths ?? {}).filter(path => path !== '/').length} exposed paths.`);
    console.log('This does not verify operational cloud sync, row policies, or multi-device writes.');
  } catch (error) {
    console.error(`FAIL: ${error.message}`);
    process.exitCode = 1;
  }
}
