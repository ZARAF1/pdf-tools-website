import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { formatOutputSize } from '../src/lib/outputSize.mjs';

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
  'PdfPowerPoint.jsx',
  'PdfMarkdown.jsx',
  'PdfPowerPoint.jsx',
  'PdfToWord.jsx',
  'PdfWatermarker.jsx',
  'RedactPdf.jsx',
  'SignPdf.jsx',
  'UnlockPdf.jsx'
];
const filenameAwareComponents = [
  'CropPdf.jsx',
  'EditPdf.jsx',
  'ImageToPdf.jsx',
  'OcrPdf.jsx',
  'OrganizePdf.jsx',
  'PageSelectionTool.jsx',
  'PdfCompressor.jsx',
  'PdfMerger.jsx',
  'PdfPowerPoint.jsx',
  'PdfProtector.jsx',
  'PdfRotator.jsx',
  'PdfSplitter.jsx',
  'PdfToWord.jsx',
  'PdfWatermarker.jsx',
  'RedactPdf.jsx',
  'SignPdf.jsx',
  'UnlockPdf.jsx',
  'PdfMarkdown.jsx'
];

test('download-ready file sizes use consistent human-readable units', () => {
  assert.equal(formatOutputSize(576), '576 B');
  assert.equal(formatOutputSize(739100), '721.8 KB');
  assert.equal(formatOutputSize(2 * 1024 * 1024), '2.0 MB');
  assert.throws(() => formatOutputSize(-1), RangeError);
  assert.throws(() => formatOutputSize(Number.NaN), RangeError);
});

test('every PDF workflow uses the shared download-ready card', async () => {
  for (const component of toolComponents) {
    const source = await readFile(new URL(`../src/components/${component}`, import.meta.url), 'utf8');
    assert.match(source, /<DownloadReadyCard\b/, `${component} should use the shared result card`);
  }
});

test('the shared result card lets users name every generated file before download', async () => {
  const component = await readFile(new URL('../src/components/DownloadReadyCard.jsx', import.meta.url), 'utf8');
  assert.match(component, /aria-label=\{[^}]*outputFilename/i);
  assert.match(component, /onDownload\?\.\(safeDownloadName\)/);
});

test('download handlers accept the filename selected in the shared result card', async () => {
  for (const componentName of filenameAwareComponents) {
    const source = await readFile(new URL(`../src/components/${componentName}`, import.meta.url), 'utf8');
    assert.match(source, /downloadFileName/, `${componentName} should use the selected output filename`);
  }
});
