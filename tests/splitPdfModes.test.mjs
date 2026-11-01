import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import {
  createPageGroupRangesByPartCount,
  createPageGroupsByPartCount,
  parsePageRanges
} from '../src/lib/splitPdfPages.mjs';

const splitterSource = await readFile(
  fileURLToPath(new URL('../src/components/PdfSplitter.jsx', import.meta.url)),
  'utf8'
);
const pageGridSource = await readFile(
  fileURLToPath(new URL('../src/components/PdfPageGrid.jsx', import.meta.url)),
  'utf8'
);
const registrySource = await readFile(
  fileURLToPath(new URL('../src/components/toolRegistry.js', import.meta.url)),
  'utf8'
);
const appSource = await readFile(
  fileURLToPath(new URL('../src/App.jsx', import.meta.url)),
  'utf8'
);

test('percentage splitting divides pages into balanced consecutive parts', () => {
  assert.deepEqual(createPageGroupsByPartCount(10, 3), [
    [1, 2, 3, 4],
    [5, 6, 7],
    [8, 9, 10]
  ]);
});

test('percentage splitting assigns every page once and supports at most ten parts', () => {
  const groups = createPageGroupsByPartCount(17, 10);
  assert.equal(groups.length, 10);
  assert.deepEqual(groups.flat(), Array.from({ length: 17 }, (_, index) => index + 1));
  assert.throws(() => createPageGroupsByPartCount(3, 4), /between 2 and 3/);
  assert.throws(() => createPageGroupsByPartCount(20, 11), /between 2 and 10/);
});

test('percentage preview ranges stay compact while representing each page group', () => {
  const ranges = createPageGroupRangesByPartCount(10, 3);
  assert.deepEqual(ranges, [
    { startPage: 1, endPage: 4 },
    { startPage: 5, endPage: 7 },
    { startPage: 8, endPage: 10 }
  ]);
  assert.throws(() => createPageGroupRangesByPartCount(1, 2), /at least two pages/);
});

test('page range parsing accepts ordered unique pages and rejects malformed entries', () => {
  assert.deepEqual(parsePageRanges('1-3, 5, 3', 8), [1, 2, 3, 5]);
  assert.throws(() => parsePageRanges('2x', 8), /Invalid page/);
  assert.throws(() => parsePageRanges('5-2', 8), /Invalid range/);
  assert.throws(() => parsePageRanges('1,', 8), /empty entries/);
  assert.throws(() => parsePageRanges('9', 8), /Invalid page/);
});

test('one Split PDF workflow uses visual pages for extraction and both split modes', () => {
  assert.match(splitterSource, /PdfPageGrid/);
  assert.match(splitterSource, /selectionEnabled=\{mode === 'extract-selected'\}/);
  assert.match(splitterSource, /pageLabels=\{pageLabels\}/);
  assert.match(splitterSource, /Split by percentage/);
  assert.match(splitterSource, /type="range"/);
  assert.match(splitterSource, /createSplitPdfOutputs\(/);
  assert.match(splitterSource, /percentageRanges\.length > 3/);
  assert.doesNotMatch(splitterSource, /percentageGroups/);
  assert.match(pageGridSource, /selectionEnabled/);
  assert.match(pageGridSource, /typeof pageLabels === 'function'/);
});

test('Extract PDF Pages is consolidated into Split PDF with its old route redirected', () => {
  assert.doesNotMatch(registrySource, /id: 'extract',\s+name: 'Extract PDF Pages'/);
  assert.match(appSource, /<Route path="\/extract-pages" element=\{<Navigate to="\/split" replace \/>} \/>/);
});
