import test from 'node:test';
import assert from 'node:assert/strict';
import { PDFDict, PDFDocument, PDFName, PDFPageTree } from 'pdf-lib';

const pageTreeRecoveryModule = await import('../src/lib/pdfPageTreeRecovery.mjs').catch(() => null);

test('Split PDF recovers a page tree root with a missing Pages type marker', async () => {
  assert.ok(pageTreeRecoveryModule, 'The Split PDF page-tree recovery helper must exist.');

  const document = await PDFDocument.create();
  document.addPage();
  const root = document.catalog.Pages();
  root.delete(PDFName.of('Type'));
  Object.setPrototypeOf(root, PDFDict.prototype);

  pageTreeRecoveryModule.recoverPdfPageTreeRoot(document);

  assert.ok(root instanceof PDFPageTree);
  assert.equal(root.get(PDFName.of('Type')).toString(), '/Pages');
  assert.equal(document.getPageCount(), 1);

  const output = await PDFDocument.create();
  const [copiedPage] = await output.copyPages(document, [0]);
  output.addPage(copiedPage);
  const savedOutput = await output.save();
  assert.equal((await PDFDocument.load(savedOutput)).getPageCount(), 1);
});
