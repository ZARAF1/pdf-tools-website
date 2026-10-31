import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const readProjectFile = (path) => readFile(fileURLToPath(new URL(path, root)), 'utf8');

test('Netlify serves application routes through the SPA entry point', async () => {
  const redirects = await readProjectFile('public/_redirects');
  assert.match(redirects, /^\/\* \/index\.html 200\s*$/m);
});

test('Node runtime is pinned to the version used for verification', async () => {
  const runtime = await readProjectFile('.nvmrc');
  assert.equal(runtime.trim(), '24.22.0');
});

test('Netlify applies safe baseline security headers without an unverified CSP', async () => {
  const headers = await readProjectFile('public/_headers');
  assert.match(headers, /^\/\*$/m);
  assert.match(headers, /X-Content-Type-Options: nosniff/i);
  assert.match(headers, /Referrer-Policy: strict-origin-when-cross-origin/i);
  assert.match(headers, /X-Frame-Options: DENY/i);
  assert.match(headers, /Permissions-Policy: camera=\(\), microphone=\(\), geolocation=\(\)/i);
  assert.doesNotMatch(headers, /Content-Security-Policy/i);
});
