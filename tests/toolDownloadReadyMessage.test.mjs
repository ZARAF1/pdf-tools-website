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

test('tool workflows do not show the generic download-ready notification', async () => {
  for (const component of toolComponents) {
    const source = await readFile(new URL(`../src/components/${component}`, import.meta.url), 'utf8');
    assert.doesNotMatch(source, /FILE_DOWNLOAD_READY_MESSAGE|File download ready\./, component);
    assert.match(source, /download/i, `${component} should retain its output download action`);
  }
});
