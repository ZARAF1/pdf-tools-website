import test from 'node:test';
import assert from 'node:assert/strict';
import { addPageToMergeOrder, normalizePdfFileName, getFitPageDimensions } from '../src/lib/pdfMergeOptions.mjs';

test('selecting pages appends them in interaction order and deselecting removes them', () => {
  const first = { fileId: 'file-1', pageIndex: 0 };
  const second = { fileId: 'file-5', pageIndex: 1 };
  const third = { fileId: 'file-2', pageIndex: 2 };
  const fourth = { fileId: 'file-1', pageIndex: 3 };
  const fifth = { fileId: 'file-3', pageIndex: 4 };

  let order = [];
  for (const page of [first, second, third, fourth, fifth]) {
    order = addPageToMergeOrder(order, page);
  }
  assert.deepEqual(order, [first, second, third, fourth, fifth]);
  assert.deepEqual(addPageToMergeOrder(order, third), [first, second, fourth, fifth]);
});

test('output filename is safe and has one PDF extension', () => {
  assert.equal(normalizePdfFileName(' quarterly report '), 'quarterly report.pdf');
  assert.equal(normalizePdfFileName('merged_document.pdf'), 'merged_document.pdf');
  assert.equal(normalizePdfFileName('bad:/name.pdf'), 'bad_name.pdf');
  assert.throws(() => normalizePdfFileName('   '), /filename/i);
});

test('fit sizing preserves each page aspect ratio inside the chosen paper size', () => {
  const portrait = getFitPageDimensions(600, 800, 'letter');
  const landscape = getFitPageDimensions(800, 600, 'a4');
  assert.deepEqual(portrait, { pageWidth: 612, pageHeight: 792, contentWidth: 594, contentHeight: 792 });
  assert.equal(landscape.pageWidth, 841.89);
  assert.equal(landscape.pageHeight, 595.28);
  assert.ok(Math.abs(landscape.contentWidth - 793.7066666666667) < 1e-8);
  assert.equal(landscape.contentHeight, 595.28);
});
