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
const sharedStyles = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');
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

test('the shared result card supports an optional output filename editor', async () => {
  const component = await readFile(new URL('../src/components/DownloadReadyCard.jsx', import.meta.url), 'utf8');
  assert.match(component, /aria-label=\{[^}]*outputFilename/i);
  assert.match(component, /onDownload\?\.\(safeDownloadName\)/);
  assert.match(component, /showFilenameEditor = true/);
  assert.match(component, /\{showFilenameEditor && \(/);
});

test('download-ready cards stay compact and use restrained success color', () => {
  const cardStyles = sharedStyles.match(/\.download-ready-card\s*\{([^}]*)\}/)?.[1];
  const controlsStyles = sharedStyles.match(/\.download-ready-card-controls\s*\{([^}]*)\}/)?.[1];
  const actionStyles = sharedStyles.match(/\.download-ready-card-action\s*\{([^}]*)\}/)?.[1];

  assert.ok(cardStyles, 'shared download-ready card styles exist');
  assert.match(cardStyles, /background:\s*var\(--surface-muted\)/);
  assert.match(cardStyles, /border:\s*1px solid var\(--border-color\)/);
  assert.ok(controlsStyles, 'shared download controls styles exist');
  assert.match(controlsStyles, /flex:\s*0 1 auto/);
  assert.ok(actionStyles, 'shared download action styles exist');
  assert.match(actionStyles, /background:\s*#2563eb/);
});

test('download handlers accept the filename selected in the shared result card', async () => {
  for (const componentName of filenameAwareComponents) {
    const source = await readFile(new URL(`../src/components/${componentName}`, import.meta.url), 'utf8');
    assert.match(source, /downloadFileName/, `${componentName} should use the selected output filename`);
  }
});
