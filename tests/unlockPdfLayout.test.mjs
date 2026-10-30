import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const component = await readFile(new URL('../src/components/UnlockPdf.jsx', import.meta.url), 'utf8');
const stylesheet = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');

test('Unlock PDF upload section has no top margin', () => {
  assert.match(component, /className="unlock-pdf-workspace mx-auto max-w-4xl space-y-6"/);
  assert.match(
    stylesheet,
    /\.tool-attachment-content \.unlock-pdf-workspace > section\.pdf-upload-trigger\s*\{\s*margin-top:\s*0;?\s*\}/
  );
});
