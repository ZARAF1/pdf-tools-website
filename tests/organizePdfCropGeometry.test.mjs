import test from 'node:test';
import assert from 'node:assert/strict';
import { degrees, PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import {
  adjustOrganizeCrop,
  clampOrganizeCrop,
  hasOrganizeChanges,
  rotateOrganizeCropClockwise,
  selectionToPdfRectangle
} from '../src/lib/organizePdfCrop.mjs';

const makePage = async () => {
  const document = await PDFDocument.create();
  const page = document.addPage([200, 300]);
  page.setCropBox(10, 20, 180, 260);
  return page;
};

test('organize changes are detected only when page order or appearance differs', () => {
  const original = [
    { sourceIndex: 0, rotation: 0, crop: null },
    { sourceIndex: 1, rotation: 0, crop: null }
  ];

  assert.equal(hasOrganizeChanges(original, 2), false);
  assert.equal(hasOrganizeChanges([{ ...original[1] }, { ...original[0] }], 2), true);
  assert.equal(hasOrganizeChanges([{ ...original[0], rotation: 90 }, original[1]], 2), true);
  assert.equal(hasOrganizeChanges([{ ...original[0], crop: { x: 0.1, y: 0.1, width: 0.8, height: 0.8 } }, original[1]], 2), true);
  assert.equal(hasOrganizeChanges([original[0]], 2), true);
  assert.equal(hasOrganizeChanges(original, 2), false);
});

test('page crop selections map from the displayed page to its PDF crop box', async () => {
  const page = await makePage();
  const viewport = {
    width: 180,
    height: 260,
    convertToPdfPoint: (x, y) => [x + 10, 280 - y]
  };

  assert.deepEqual(
    selectionToPdfRectangle(viewport, page, { x: 0.1, y: 0.2, width: 0.5, height: 0.4 }),
    { x: 28, y: 124, width: 90, height: 104 }
  );
});

test('page crop selections map correctly when the displayed page is rotated', async () => {
  const page = await makePage();
  const viewport = {
    width: 260,
    height: 180,
    convertToPdfPoint: (x, y) => [y + 10, x + 20]
  };

  assert.deepEqual(
    selectionToPdfRectangle(viewport, page, { x: 0.1, y: 0.25, width: 0.5, height: 0.5 }),
    { x: 55, y: 46, width: 90, height: 130 }
  );
});

test('dragging a crop selection resizes from its chosen edge without leaving the page', () => {
  const crop = { x: 0.2, y: 0.2, width: 0.5, height: 0.4 };
  assert.deepEqual(adjustOrganizeCrop(crop, 'nw', 0.1, 0.05), {
    x: 0.3,
    y: 0.25,
    width: 0.4,
    height: 0.35
  });
  assert.deepEqual(clampOrganizeCrop({ x: 0.9, y: -0.1, width: 0.4, height: 0.5 }), {
    x: 0.6,
    y: 0,
    width: 0.4,
    height: 0.5
  });
});

test('rotating a page keeps its crop around the same physical page content', () => {
  assert.deepEqual(rotateOrganizeCropClockwise({ x: 0.2, y: 0.2, width: 0.6, height: 0.5 }), {
    x: 0.3,
    y: 0.2,
    width: 0.5,
    height: 0.6
  });
});

for (const rotation of [0, 90]) {
  test(`saved crop boxes match PDF.js selection coordinates at ${rotation} degrees`, async () => {
    const document = await PDFDocument.create();
    const sourcePage = document.addPage([200, 300]);
    sourcePage.setCropBox(10, 20, 180, 260);
    const sourceBytes = await document.save();
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(sourceBytes) });
    const previewDocument = await loadingTask.promise;
    try {
      const previewPage = await previewDocument.getPage(1);
      const viewport = previewPage.getViewport({ scale: 1, rotation });
      const selection = rotation === 0
        ? { x: 0.1, y: 0.2, width: 0.5, height: 0.4 }
        : { x: 0.1, y: 0.25, width: 0.5, height: 0.5 };
      const rectangle = selectionToPdfRectangle(viewport, sourcePage, selection);
      sourcePage.setCropBox(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
      sourcePage.setRotation(degrees(rotation));
      const output = await PDFDocument.load(await document.save());
      const cropBox = output.getPage(0).getCropBox();

      assert.deepEqual(cropBox, rectangle);
      assert.equal(output.getPage(0).getRotation().angle, rotation);
    } finally {
      await previewDocument.destroy();
    }
  });
}

test('copied organized pages reopen in PDF.js with the cropped visible dimensions', async () => {
  const document = await PDFDocument.create();
  const sourcePage = document.addPage([400, 600]);
  const sourceBytes = await document.save();
  const inputTask = pdfjsLib.getDocument({ data: new Uint8Array(sourceBytes) });
  const inputDocument = await inputTask.promise;
  const sourcePreviewPage = await inputDocument.getPage(1);
  const selection = { x: 0.2, y: 0.2, width: 0.6, height: 0.5 };
  const rectangle = selectionToPdfRectangle(
    sourcePreviewPage.getViewport({ scale: 1 }),
    sourcePage,
    selection
  );
  const output = await PDFDocument.create();
  const [copiedPage] = await output.copyPages(document, [0]);
  copiedPage.setCropBox(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
  output.addPage(copiedPage);

  const outputTask = pdfjsLib.getDocument({ data: new Uint8Array(await output.save()) });
  const outputDocument = await outputTask.promise;
  try {
    const outputPage = await outputDocument.getPage(1);
    const viewport = outputPage.getViewport({ scale: 1 });
    assert.equal(viewport.width, 240);
    assert.equal(viewport.height, 300);
  } finally {
    await inputDocument.destroy();
    await outputDocument.destroy();
  }
});
