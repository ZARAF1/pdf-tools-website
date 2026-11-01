import test from 'node:test';
import assert from 'node:assert/strict';
import { PDFDocument } from 'pdf-lib';
import { createSplitPdfArchive } from '../src/lib/splitPdfArchive.mjs';

const makeOutputs = (count) => Array.from({ length: count }, (_, index) => ({
  name: `page_${index + 1}.pdf`,
  bytes: Uint8Array.of(0x25, 0x50, 0x44, 0x46, index)
}));

const readStoredZipEntries = async (blob) => {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const view = new DataView(bytes.buffer);
  const decoder = new TextDecoder();
  const entries = [];
  let offset = 0;

  while (view.getUint32(offset, true) === 0x04034b50) {
    const nameLength = view.getUint16(offset + 26, true);
    const extraLength = view.getUint16(offset + 28, true);
    const contentLength = view.getUint32(offset + 18, true);
    const nameStart = offset + 30;
    const contentStart = nameStart + nameLength + extraLength;
    entries.push({
      name: decoder.decode(bytes.subarray(nameStart, nameStart + nameLength)),
      bytes: bytes.slice(contentStart, contentStart + contentLength)
    });
    offset = contentStart + contentLength;
  }

  return entries;
};

test('three split pages remain individual PDF outputs', async () => {
  assert.equal(await createSplitPdfArchive(makeOutputs(3), 'source.pdf'), null);
});

test('percentage-part archives use a concise parts filename', async () => {
  const archive = await createSplitPdfArchive(makeOutputs(4), 'source.pdf', 'parts');
  assert.equal(archive.name, 'source_parts.zip');
});

test('more than three split pages are packaged in one named ZIP with every PDF', async () => {
  const source = await PDFDocument.create();
  for (let index = 0; index < 4; index += 1) {
    source.addPage([100 + index * 10, 200]);
  }
  const sourceBytes = await source.save();
  const sourceDocument = await PDFDocument.load(sourceBytes);
  const outputs = [];
  for (let index = 0; index < sourceDocument.getPageCount(); index += 1) {
    const pageDocument = await PDFDocument.create();
    const [page] = await pageDocument.copyPages(sourceDocument, [index]);
    pageDocument.addPage(page);
    outputs.push({ name: `page_${index + 1}_source.pdf`, bytes: await pageDocument.save() });
  }
  const archive = await createSplitPdfArchive(outputs, 'source.pdf');

  assert.equal(archive.name, 'source_split_pages.zip');
  assert.equal(archive.blob.type, 'application/zip');
  const entries = await readStoredZipEntries(archive.blob);
  assert.deepEqual(entries.map(({ name }) => name), outputs.map(({ name }) => name));
  assert.deepEqual(entries.map(({ bytes }) => [...bytes]), outputs.map(({ bytes }) => [...bytes]));
  for (const [index, entry] of entries.entries()) {
    const document = await PDFDocument.load(entry.bytes);
    assert.equal(document.getPageCount(), 1);
    assert.equal(document.getPage(0).getWidth(), 100 + index * 10);
  }
});

test('split archives support more than the image converter 50-file limit', async () => {
  const outputs = makeOutputs(51);
  const archive = await createSplitPdfArchive(outputs, 'source.pdf');

  assert.equal((await readStoredZipEntries(archive.blob)).length, 51);
});
