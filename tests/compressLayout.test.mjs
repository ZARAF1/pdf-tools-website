import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const component = await readFile(new URL('../src/components/PdfCompressor.jsx', import.meta.url), 'utf8');

test('Compress PDF omits the standalone intro and its extra margin', () => {
  assert.doesNotMatch(
    component,
    /Reduce file size with standard or higher compression\. Files are processed in your browser\./
  );
  assert.doesNotMatch(component, /<div className="mb-8 text-center">/);
  assert.match(component, /className="compress-pdf-workspace space-y-8"/);
  assert.match(component, /<p>Try to reduce PDF file size with standard or higher compression\.<\/p>/);
});

test('Compress PDF upload card has no extra top margin', async () => {
  const stylesheet = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');

  assert.match(
    stylesheet,
    /\.tool-attachment-content \.compress-pdf-workspace > \.pdf-workflow-upload\s*\{\s*margin-top:\s*0;?\s*\}/
  );
});
