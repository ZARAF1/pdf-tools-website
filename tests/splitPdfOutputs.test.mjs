import test from 'node:test';
import assert from 'node:assert/strict';
import { PDFDocument } from 'pdf-lib';
import { createSplitPdfOutputs } from '../src/lib/splitPdfOutputs.mjs';

test('percentage splitting creates PDFs with the expected pages and filenames', async () => {
  const sourceDocument = await PDFDocument.create();
  for (let pageIndex = 0; pageIndex < 10; pageIndex += 1) {
    sourceDocument.addPage([500 + pageIndex * 20, 792]);
  }

  const outputs = await createSplitPdfOutputs({
    sourceDocument,
    pageGroups: [[1, 2, 3, 4], [5, 6, 7], [8, 9, 10]],
    fileName: 'source.pdf',
    mode: 'split-percentage'
  });

  assert.deepEqual(outputs.map(({ name }) => name), [
    'part_1_source.pdf',
    'part_2_source.pdf',
    'part_3_source.pdf'
  ]);
  const outputPageWidths = await Promise.all(outputs.map(async ({ bytes }) => {
    const outputDocument = await PDFDocument.load(bytes);
    return outputDocument.getPages().map((page) => page.getWidth());
  }));
  assert.deepEqual(outputPageWidths, [
    [500, 520, 540, 560],
    [580, 600, 620],
    [640, 660, 680]
  ]);
});
