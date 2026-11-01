import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const cropPdf = await readFile(new URL('../src/components/CropPdf.jsx', import.meta.url), 'utf8');
const styles = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');

test('Crop PDF places Reset crop alongside the equal-width bounds fields', () => {
  const boundsStart = cropPdf.indexOf('<fieldset className="crop-pdf-bounds"');
  const boundsEnd = cropPdf.indexOf('</fieldset>', boundsStart);
  const resetIndex = cropPdf.indexOf('Reset crop');

  assert.ok(boundsStart >= 0, 'crop bounds fieldset is present');
  assert.ok(resetIndex > boundsStart && resetIndex < boundsEnd, 'Reset crop is inside the bounds fieldset');
  assert.match(styles, /\.crop-pdf-bounds-grid\s*\{[^}]*grid-template-columns:\s*repeat\(5,\s*minmax\(0,\s*1fr\)\)/s);
  assert.match(styles, /\.crop-pdf-bounds-grid\s*>\s*\.crop-pdf-button\s*\{[^}]*width:\s*100%/s);
});

test('Crop PDF Apply crop fills a wide row in the processing actions', () => {
  assert.match(cropPdf, /className="crop-pdf-button crop-pdf-button-primary"[^>]*onClick=\{applyCrop\}/);
  assert.match(styles, /\.crop-pdf-actions\s+\.crop-pdf-button-primary\s*\{[^}]*flex:\s*1\s+1\s+100%[^}]*width:\s*100%/s);
});
