import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeOutputFileName } from '../src/lib/outputFileName.mjs';

test('download filenames preserve the output extension and sanitize path characters', () => {
  assert.equal(
    normalizeOutputFileName('../quarterly report.txt', 'converted.pdf'),
    'quarterly report.pdf'
  );
});

test('empty and reserved download filenames fall back to the generated name', () => {
  assert.equal(normalizeOutputFileName('  ', 'result.docx'), 'result.docx');
  assert.equal(normalizeOutputFileName('CON', 'result.pdf'), 'result.pdf');
});

test('filename normalization rejects outputs without a valid extension', () => {
  assert.throws(() => normalizeOutputFileName('result', 'result'), /extension/i);
});
