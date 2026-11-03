import test from 'node:test';
import assert from 'node:assert/strict';
import JSZip from 'jszip';
import { PDFDocument } from 'pdf-lib';
import { createImagePdfArchive } from '../src/lib/imagePdfArchive.mjs';

const makePdfBytes = async () => {
  const document = await PDFDocument.create();
  document.addPage();
  return document.save();
};

test('separate image PDFs are packaged with safe, unique names in one ZIP', async () => {
  const firstPdf = await makePdfBytes();
  const secondPdf = await makePdfBytes();
  const archive = await createImagePdfArchive([
    { imageName: 'album/portrait.png', bytes: firstPdf },
    { imageName: 'portrait.jpg', bytes: secondPdf },
    { imageName: 'holiday photo.bmp', bytes: secondPdf }
  ]);
  const zip = await JSZip.loadAsync(archive.blob);

  assert.equal(archive.name, 'images_to_pdf.zip');
  assert.deepEqual(Object.keys(zip.files), ['portrait.pdf', 'portrait_2.pdf', 'holiday photo.pdf']);
  assert.deepEqual([...await zip.file('portrait.pdf').async('uint8array')], [...firstPdf]);
  assert.deepEqual([...await zip.file('portrait_2.pdf').async('uint8array')], [...secondPdf]);
});

test('image PDF archive rejects empty output lists', async () => {
  await assert.rejects(createImagePdfArchive([]), /at least one PDF/i);
});
