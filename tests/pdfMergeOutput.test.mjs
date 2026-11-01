import test from 'node:test';
import assert from 'node:assert/strict';
import { PDFArray, PDFDict, PDFDocument, PDFName, degrees } from 'pdf-lib';
import { buildMergedPdf } from '../src/lib/pdfMergeOutput.mjs';

const makePdfFile = async (name, widths) => {
  const document = await PDFDocument.create();
  for (const width of widths) {
    const page = document.addPage([width, 400]);
    page.drawText(`${name} ${width}`);
  }
  return new File([await document.save()], name, { type: 'application/pdf' });
};

const loadOutput = async (bytes) => PDFDocument.load(bytes);

test('selective merge follows clicked page order, adds source-boundary blanks, and bookmarks sources', async () => {
  const files = [
    { id: 'one', name: 'one.pdf', pageCount: 2, file: await makePdfFile('one', [200, 201]) },
    { id: 'two', name: 'two.pdf', pageCount: 2, file: await makePdfFile('two', [300, 301]) },
    { id: 'three', name: 'three.pdf', pageCount: 1, file: await makePdfFile('three', [400]) }
  ];
  const bytes = await buildMergedPdf({
    files,
    mode: 'select',
    selectedPages: [
      { fileId: 'one', pageIndex: 0 },
      { fileId: 'three', pageIndex: 0 },
      { fileId: 'two', pageIndex: 1 },
      { fileId: 'one', pageIndex: 1 }
    ],
    addBlankPages: true,
    addBookmarks: true,
    pageSize: 'preserve'
  });
  const output = await loadOutput(bytes);
  const widths = output.getPages().map((page) => page.getWidth());
  assert.deepEqual(widths, [200, 200, 400, 400, 301, 301, 201]);

  const outlines = output.catalog.lookup(PDFName.of('Outlines'), PDFDict);
  const firstOutline = outlines.lookup(PDFName.of('First'), PDFDict);
  const firstTitle = firstOutline.lookup(PDFName.of('Title'));
  const nextOutline = firstOutline.lookup(PDFName.of('Next'), PDFDict);
  const firstDestination = firstOutline.lookup(PDFName.of('Dest'), PDFArray);
  const secondDestination = nextOutline.lookup(PDFName.of('Dest'), PDFArray);
  assert.equal(firstTitle.decodeText(), 'one.pdf');
  assert.equal(firstDestination.get(0).toString(), output.getPages()[0].ref.toString());
  assert.equal(nextOutline.lookup(PDFName.of('Title')).decodeText(), 'three.pdf');
  assert.equal(secondDestination.get(0).toString(), output.getPages()[2].ref.toString());
  assert.equal(nextOutline.lookup(PDFName.of('Next'), PDFDict).lookup(PDFName.of('Title')).decodeText(), 'two.pdf');
});

test('merge-all preserves file and page order while adding one blank between files', async () => {
  const files = [
    { id: 'first', name: 'first.pdf', pageCount: 2, file: await makePdfFile('first', [210, 211]) },
    { id: 'second', name: 'second.pdf', pageCount: 1, file: await makePdfFile('second', [310]) }
  ];
  const bytes = await buildMergedPdf({
    files,
    mode: 'all',
    addBlankPages: true,
    addBookmarks: false,
    pageSize: 'preserve'
  });
  const output = await loadOutput(bytes);
  assert.deepEqual(output.getPages().map((page) => page.getWidth()), [210, 211, 211, 310]);
  assert.equal(output.catalog.get(PDFName.of('Outlines')), undefined);
});

test('fit mode puts portrait and landscape page content on the selected paper size', async () => {
  const files = [
    { id: 'fit', name: 'fit.pdf', pageCount: 2, file: await makePdfFile('fit', [300, 500]) }
  ];
  const bytes = await buildMergedPdf({
    files,
    mode: 'all',
    addBlankPages: false,
    addBookmarks: false,
    pageSize: 'letter'
  });
  const output = await loadOutput(bytes);
  assert.deepEqual(output.getPages().map((page) => [page.getWidth(), page.getHeight()]), [
    [612, 792],
    [792, 612]
  ]);
});

test('fit mode accounts for an existing quarter-turn page rotation', async () => {
  const document = await PDFDocument.create();
  const page = document.addPage([300, 500]);
  page.setRotation(degrees(90));
  page.drawText('Rotated source');
  const files = [{
    id: 'rotated',
    name: 'rotated.pdf',
    pageCount: 1,
    file: new File([await document.save()], 'rotated.pdf', { type: 'application/pdf' })
  }];
  const bytes = await buildMergedPdf({
    files,
    mode: 'all',
    pageSize: 'letter'
  });
  const output = await loadOutput(bytes);
  assert.deepEqual(output.getPages().map((outputPage) => [outputPage.getWidth(), outputPage.getHeight()]), [
    [792, 612]
  ]);
});
