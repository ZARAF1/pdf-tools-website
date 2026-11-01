import test from 'node:test';
import assert from 'node:assert/strict';
import JSZip from 'jszip';
import { PDFDocument } from 'pdf-lib';
import {
  parsePageSelection,
  createPdfFromRenderedSlides,
  createPowerPointFromRenderedPages,
  sanitizeOutputFileName,
  validatePowerPointFile
} from '../src/lib/powerpointConversion.mjs';

const pngBytes = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/lWQAAAAASUVORK5CYII=',
  'base64'
);

test('page selections expand ordered 1-based page ranges to zero-based indexes', () => {
  assert.deepEqual(parsePageSelection('1-3, 5', 5), [0, 1, 2, 4]);
});

test('invalid page selections and unsupported PowerPoint formats are rejected', () => {
  assert.deepEqual(parsePageSelection('', 3), [0, 1, 2]);
  assert.throws(() => parsePageSelection('0', 3), /between 1 and 3/);
  assert.throws(() => parsePageSelection('2-1', 3), /between 1 and 3/);
  assert.throws(() => parsePageSelection('1,4', 3), /between 1 and 3/);
  assert.doesNotThrow(() => validatePowerPointFile({ name: 'slides.PPTX', size: 100 }));
  assert.throws(() => validatePowerPointFile({ name: 'slides.ppt', size: 100 }), /\.pptx/);
});

test('output names are normalized to a safe filename and requested extension', () => {
  assert.equal(sanitizeOutputFileName('../final deck.pptx', 'pdf'), 'final deck.pdf');
  assert.equal(sanitizeOutputFileName('  ', 'pptx'), 'converted_document.pptx');
});

test('rendered PDF pages become a PowerPoint with one image slide per page', async () => {
  const bytes = await createPowerPointFromRenderedPages(
    [{ imageData: `data:image/png;base64,${pngBytes.toString('base64')}`, width: 1, height: 1 }],
    { slideSize: 'wide' }
  );
  const archive = await JSZip.loadAsync(bytes);
  const slideFiles = Object.keys(archive.files).filter((path) => /^ppt\/slides\/slide\d+\.xml$/.test(path));
  const imageFiles = Object.keys(archive.files).filter((path) => /^ppt\/media\/.+\.png$/.test(path));
  assert.equal(slideFiles.length, 1);
  assert.equal(imageFiles.length, 1);
  const slideXml = await archive.file(slideFiles[0]).async('string');
  const imageDimensions = slideXml.match(/<p:pic>[\s\S]*?<a:ext cx="(\d+)" cy="(\d+)"\/>/);
  assert.ok(imageDimensions);
  assert.equal(imageDimensions[1], imageDimensions[2]);
});

test('rendered PowerPoint slides become a PDF with the selected slide-matching page size', async () => {
  const bytes = await createPdfFromRenderedSlides(
    [{
      imageData: `data:image/png;base64,${pngBytes.toString('base64')}`,
      width: 4,
      height: 3,
      slideWidthInches: 10,
      slideHeightInches: 7.5
    }],
    { pageSize: 'match' }
  );
  const pdf = await PDFDocument.load(bytes);
  assert.deepEqual(pdf.getPages().map((page) => [page.getWidth(), page.getHeight()]), [[720, 540]]);
});
