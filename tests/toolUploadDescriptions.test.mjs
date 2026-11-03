import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const expectedDescriptions = new Map([
  ['CropPdf.jsx', 'Crop PDF pages to adjust the visible page area.'],
  ['EditPdf.jsx', 'Add text, images, drawings, highlights, and shapes to a PDF copy.'],
  ['PdfMerger.jsx', 'Combine PDFs into a single document in your chosen order.'],
  ['PdfSplitter.jsx', 'Extract selected pages, split every page, or divide the PDF into percentage-based sections.'],
  ['PdfRotator.jsx', 'Rotate all pages or selected pages in a PDF.'],
  ['PdfProtector.jsx', 'Add an opening password to protect a PDF.'],
  ['UnlockPdf.jsx', 'Remove supported PDF encryption with the correct password.'],
  ['ImageToPdf.jsx', 'Create a PDF from up to 10 JPEG, PNG, or BMP images.'],
  ['PdfToImages.jsx', 'Trim blank page margins automatically, then save one image or a ZIP of all pages.'],
  ['PdfToWord.jsx', 'Convert text-based and scanned PDFs into editable Word documents.'],
  ['PdfCompressor.jsx', 'Try to reduce PDF file size with standard or higher compression.'],
  ['PdfWatermarker.jsx', 'Add a text watermark and page numbers to selected PDF pages.'],
  ['PageSelectionTool.jsx', 'Remove selected pages from a PDF. Extract selected pages into a new PDF.'],
  ['OcrPdf.jsx', 'Recognize scanned text and add a searchable text layer to PDF pages.'],
  ['OrganizePdf.jsx', 'Reorder, rotate, or remove PDF pages.'],
  ['RedactPdf.jsx', 'Permanently cover selected content on PDF pages.'],
  ['SignPdf.jsx', 'Add a visible typed, drawn, or image signature to PDF pages.']
]);

test('every PDF tool upload card describes its task instead of file limits or processing location', async () => {
  for (const [fileName, description] of expectedDescriptions) {
    const source = await readFile(new URL(`../src/components/${fileName}`, import.meta.url), 'utf8');
    const uploadCopies = [...source.matchAll(/<div className="merge-pdf-upload-copy">([\s\S]*?)<\/div>/g)]
      .map((match) => match[1]);
    const allUploadCopy = uploadCopies.join('\n');

    assert.ok(uploadCopies.length, `${fileName} should contain an upload-card description`);
    if (fileName === 'PageSelectionTool.jsx') {
      assert.ok(allUploadCopy.includes("{isRemoving ? 'Remove selected pages from a PDF.' : 'Extract selected pages into a new PDF.'}"));
    } else if (fileName === 'ImageToPdf.jsx') {
      assert.ok(allUploadCopy.includes('formatToolUiMessage(imageUi.uploadDescription, { max: MAX_IMAGES })'));
    } else if (fileName === 'PdfToWord.jsx') {
      assert.match(allUploadCopy, /Convert text-based and scanned PDFs into editable Word documents/);
      assert.match(allUploadCopy, /Render DOCX pages as images in a PDF/);
    } else {
      assert.ok(allUploadCopy.includes(`<p>${description}</p>`), `${fileName} should show its tool-specific description`);
    }
    assert.doesNotMatch(allUploadCopy, /processed in your browser|One unencrypted PDF|One PDF file|PDF files · processed/);
  }
});

test('Sign PDF does not repeat its signature guidance above the attachment section', async () => {
  const source = await readFile(new URL('../src/components/SignPdf.jsx', import.meta.url), 'utf8');

  assert.doesNotMatch(source, /Add a visible signature|Choose a typed, drawn, or image signature/);
});
