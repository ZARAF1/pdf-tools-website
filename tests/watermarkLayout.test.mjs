import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const component = await readFile(new URL('../src/components/PdfWatermarker.jsx', import.meta.url), 'utf8');
const stylesheet = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');

test('Watermark PDF has no standalone intro or extra attachment top spacing', () => {
  assert.doesNotMatch(component, /Add a custom text watermark to all pages or selected pages/);
  assert.match(component, /className="watermark-tool-workspace space-y-8"/);
  assert.match(
    stylesheet,
    /\.tool-attachment-content:has\(> \.watermark-tool-workspace\)\s*\{\s*padding-top:\s*0;?\s*\}/
  );
});
