import { PDFDocument } from 'pdf-lib';

export const validateDocxFile = (file) => {
  if (!file?.name?.toLowerCase().endsWith('.docx')) {
    throw new Error('Choose a Word .docx file. Legacy .doc files are not supported.');
  }
};

export const createPdfFromRenderedPages = async (pages) => {
  if (!Array.isArray(pages) || pages.length === 0) {
    throw new Error('No pages could be rendered from this Word document.');
  }

  const pdf = await PDFDocument.create();
  for (const { pngBytes, pageWidth, pageHeight } of pages) {
    if (!(pngBytes instanceof Uint8Array)
      || !Number.isFinite(pageWidth)
      || !Number.isFinite(pageHeight)
      || pageWidth <= 0
      || pageHeight <= 0) {
      throw new Error('A rendered Word page has invalid page dimensions or image data.');
    }

    const image = await pdf.embedPng(pngBytes);
    const page = pdf.addPage([pageWidth, pageHeight]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: pageWidth,
      height: pageHeight
    });
  }

  return pdf.save();
};
