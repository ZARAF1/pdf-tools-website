import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const component = await readFile(new URL('../src/components/PdfProtector.jsx', import.meta.url), 'utf8');
const stylesheet = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');

test('Protect PDF attachment content has no extra top padding', () => {
  assert.match(component, /className="protect-pdf-workspace space-y-8"/);
  assert.match(
    stylesheet,
    /\.tool-attachment-content:has\(> \.protect-pdf-workspace\)\s*\{\s*padding-top:\s*0;?\s*\}/
  );
});
