import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const component = await readFile(new URL('../src/components/OcrPdf.jsx', import.meta.url), 'utf8');
const stylesheet = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');

test('OCR PDF notice has no extra top margin', () => {
  assert.match(component, /className="ocr-pdf-notice rounded-2xl border border-blue-100 bg-blue-50 p-5 text-sm text-blue-900"/);
  assert.match(
    stylesheet,
    /\.tool-attachment-content \.ocr-pdf-workspace > \.ocr-pdf-notice\s*\{\s*margin-top:\s*0;?\s*\}/
  );
});
