import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const component = await readFile(new URL('../src/components/PdfSplitter.jsx', import.meta.url), 'utf8');
const stylesheet = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');

test('Split PDF upload card has no extra top margin', () => {
  assert.match(component, /className="split-pdf-workspace space-y-8"/);
  assert.match(
    stylesheet,
    /\.tool-attachment-content \.split-pdf-workspace > \.pdf-workflow-upload\s*\{\s*margin-top:\s*0;?\s*\}/
  );
});
