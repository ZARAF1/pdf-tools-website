import test from 'node:test';
import assert from 'node:assert/strict';
import { deflateSync } from 'node:zlib';
import { PDFDocument } from 'pdf-lib';
import { createPdfFromRenderedPages, validateDocxFile } from '../src/lib/docxToPdf.mjs';

const crc32 = (bytes) => {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
};

const pngChunk = (name, data) => {
  const type = Buffer.from(name);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(Buffer.concat([type, data])));
  return Buffer.concat([length, type, data, checksum]);
};

const createPng = (width, height) => {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 6;
  const rows = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y += 1) {
    rows[y * (width * 4 + 1)] = 0;
    for (let x = 0; x < width; x += 1) {
      const offset = y * (width * 4 + 1) + 1 + x * 4;
      rows[offset] = 30;
      rows[offset + 1] = 90;
      rows[offset + 2] = 160;
      rows[offset + 3] = 255;
    }
  }
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk('IHDR', header),
    pngChunk('IDAT', deflateSync(rows)),
    pngChunk('IEND', Buffer.alloc(0))
  ]);
};

test('DOCX page images become a valid PDF with each rendered page size preserved', async () => {
  const bytes = await createPdfFromRenderedPages([
    {
      pngBytes: createPng(8, 10),
      pageWidth: 612,
      pageHeight: 792
    },
    {
      pngBytes: createPng(10, 8),
      pageWidth: 792,
      pageHeight: 612
    }
  ]);
  const pdf = await PDFDocument.load(bytes);
  assert.deepEqual(pdf.getPages().map((page) => [page.getWidth(), page.getHeight()]), [
    [612, 792],
    [792, 612]
  ]);
});

test('DOCX-to-PDF rejects missing rendered pages and invalid page dimensions', async () => {
  await assert.rejects(() => createPdfFromRenderedPages([]), /No pages could be rendered/);
  await assert.rejects(() => createPdfFromRenderedPages([{
    pngBytes: createPng(1, 1),
    pageWidth: 0,
    pageHeight: 792
  }]), /invalid page dimensions/i);
});

test('DOCX input validation accepts only the modern Word file extension', () => {
  assert.doesNotThrow(() => validateDocxFile({ name: 'document.DOCX' }));
  assert.throws(() => validateDocxFile({ name: 'document.doc' }), /Legacy \.doc files are not supported/);
  assert.throws(() => validateDocxFile(null), /Legacy \.doc files are not supported/);
});
