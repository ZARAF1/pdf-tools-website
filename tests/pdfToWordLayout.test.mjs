import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const component = await readFile(new URL('../src/components/PdfToWord.jsx', import.meta.url), 'utf8');

test('places the PDF-to-Word description in the upload card without extra top spacing', () => {
  const uploadCopy = component.match(/<div className="merge-pdf-upload-copy">([\s\S]*?)<\/div>/)?.[1];

  assert.ok(uploadCopy?.includes('<p>Convert text-based and scanned PDFs into editable Word documents.</p>'));
  assert.doesNotMatch(component, /<p className="mt-2 text-slate-500">Convert text-based and scanned PDFs into editable Word documents\.<\/p>/);
  assert.match(component, /<div className="max-w-3xl mx-auto">/);
});

test('does not add a top gap between the attached PDF card and conversion controls', () => {
  assert.doesNotMatch(component, /<div className="space-y-6">/);
});
