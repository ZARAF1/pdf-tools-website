import test from 'node:test';
import assert from 'node:assert/strict';
import { createPdfImageDownload } from '../src/lib/pdfImageOutput.mjs';

const pngFormat = { mimeType: 'image/png', extension: 'png' };
const image = (name, value) => ({ name, bytes: Uint8Array.of(value, value + 1, value + 2) });

test('a single rendered page is returned as a named image instead of a ZIP', async () => {
  const bytes = image('page-001.png', 10).bytes;
  const output = await createPdfImageDownload({
    images: [{ name: 'page-001.png', bytes }],
    format: pngFormat,
    outputBaseName: 'weekend:photos',
    fallbackBaseName: 'source'
  });

  assert.equal(output.fileName, 'weekend_photos.png');
  assert.equal(output.downloadLabel, 'Download Image');
  assert.equal(output.blob.type, 'image/png');
  assert.deepEqual(new Uint8Array(await output.blob.arrayBuffer()), bytes);
});

test('multiple rendered pages remain ordered together in a named ZIP', async () => {
  const output = await createPdfImageDownload({
    images: [image('page-001.png', 10), image('page-002.png', 20)],
    format: pngFormat,
    outputBaseName: 'trip',
    fallbackBaseName: 'source'
  });
  const signature = new Uint8Array(await output.blob.slice(0, 4).arrayBuffer());

  assert.equal(output.fileName, 'trip.zip');
  assert.equal(output.downloadLabel, 'Download ZIP');
  assert.equal(output.blob.type, 'application/zip');
  assert.deepEqual(signature, Uint8Array.of(0x50, 0x4b, 0x03, 0x04));
});

test('rejects empty output instead of creating a success-shaped file', async () => {
  await assert.rejects(
    createPdfImageDownload({
      images: [],
      format: pngFormat,
      outputBaseName: 'trip',
      fallbackBaseName: 'source'
    }),
    /at least one image/i
  );
});
