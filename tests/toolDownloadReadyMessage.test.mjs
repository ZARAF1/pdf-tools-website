import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const toolComponents = [
  'CropPdf.jsx',
  'EditPdf.jsx',
  'ImageToPdf.jsx',
  'OcrPdf.jsx',
  'OrganizePdf.jsx',
  'PageSelectionTool.jsx',
  'PdfCompressor.jsx',
  'PdfMerger.jsx',
  'PdfProtector.jsx',
  'PdfRotator.jsx',
  'PdfSplitter.jsx',
  'PdfToImages.jsx',
  'PdfToWord.jsx',
  'PdfWatermarker.jsx',
  'RedactPdf.jsx',
  'SignPdf.jsx',
  'UnlockPdf.jsx',
];

test('every successful tool workflow uses the shared download-ready message', async () => {
  const { FILE_DOWNLOAD_READY_MESSAGE } = await import('../src/lib/toolMessages.mjs');
  assert.equal(FILE_DOWNLOAD_READY_MESSAGE, 'File download ready.');

  for (const component of toolComponents) {
    const source = await readFile(new URL(`../src/components/${component}`, import.meta.url), 'utf8');
    assert.match(
      source,
      /FILE_DOWNLOAD_READY_MESSAGE/,
      `${component} should show the shared download-ready message on success`
    );
  }
});
