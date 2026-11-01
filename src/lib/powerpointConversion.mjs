import { PDFDocument } from 'pdf-lib';
import pptxgen from 'pptxgenjs';

export const validatePowerPointFile = (file) => {
  if (!file?.name?.toLowerCase().endsWith('.pptx')) {
    throw new Error('Choose a PowerPoint .pptx file. Legacy .ppt files are not supported.');
  }
  if (!Number.isFinite(file.size) || file.size <= 0) {
    throw new Error('The PowerPoint file is empty or invalid.');
  }
};

export const sanitizeOutputFileName = (value, extension) => {
  if (!['pdf', 'pptx'].includes(extension)) {
    throw new Error('Choose a supported output file format.');
  }

  const fileName = String(value || '').split(/[\\/]/).pop() || '';
  let baseName = fileName
    .trim()
    .replace(/\.(?:pdf|pptx)$/i, '')
    .replace(/[<>:"|?*\x00-\x1f]/g, '_')
    .replace(/[. ]+$/g, '')
    .replace(/^\.+/, '');

  if (!baseName || /^(con|prn|aux|nul|com\d|lpt\d)$/i.test(baseName)) {
    baseName = 'converted_document';
  }

  return `${baseName}.${extension}`;
};

export const parsePageSelection = (selection, totalPages) => {
  if (!Number.isInteger(totalPages) || totalPages < 1) {
    throw new Error('The document has no pages to select.');
  }

  const value = selection.trim();
  if (!value) {
    return Array.from({ length: totalPages }, (_, index) => index);
  }

  const pages = new Set();
  for (const part of value.split(',')) {
    const match = part.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!match) {
      throw new Error('Enter pages as numbers and ranges, for example 1-3,5.');
    }

    const start = Number(match[1]);
    const end = match[2] ? Number(match[2]) : start;
    if (start < 1 || end < start || end > totalPages) {
      throw new Error(`Choose pages between 1 and ${totalPages}.`);
    }

    for (let page = start; page <= end; page += 1) {
      pages.add(page - 1);
    }
  }

  return [...pages].sort((a, b) => a - b);
};

const decodeImageData = (imageData) => {
  const match = typeof imageData === 'string'
    ? imageData.match(/^data:(image\/(?:png|jpeg));base64,([A-Za-z0-9+/=]+)$/)
    : null;
  if (!match) {
    throw new Error('A rendered slide has invalid image data.');
  }

  const binary = atob(match[2]);
  return {
    type: match[1],
    bytes: Uint8Array.from(binary, (character) => character.charCodeAt(0))
  };
};

const getPdfPageSize = (pageSize, slide) => {
  if (pageSize === 'match') {
    if (!Number.isFinite(slide.slideWidthInches)
      || !Number.isFinite(slide.slideHeightInches)
      || slide.slideWidthInches <= 0
      || slide.slideHeightInches <= 0) {
      throw new Error('The original slide dimensions are invalid.');
    }
    return [slide.slideWidthInches * 72, slide.slideHeightInches * 72];
  }

  const sizes = {
    a4: [595.28, 841.89],
    letter: [612, 792]
  };
  const size = sizes[pageSize];
  if (!size) {
    throw new Error('Choose a supported PDF page size.');
  }

  return slide.width > slide.height ? [size[1], size[0]] : size;
};

export const createPdfFromRenderedSlides = async (slides, { pageSize = 'match' } = {}) => {
  if (!Array.isArray(slides) || slides.length === 0) {
    throw new Error('No PowerPoint slides were rendered for the PDF.');
  }

  const pdf = await PDFDocument.create();
  for (const slide of slides) {
    if (!Number.isFinite(slide?.width)
      || !Number.isFinite(slide?.height)
      || slide.width <= 0
      || slide.height <= 0) {
      throw new Error('A rendered slide has invalid dimensions.');
    }

    const { type, bytes } = decodeImageData(slide.imageData);
    const image = type === 'image/png'
      ? await pdf.embedPng(bytes)
      : await pdf.embedJpg(bytes);
    const [pageWidth, pageHeight] = getPdfPageSize(pageSize, slide);
    const page = pdf.addPage([pageWidth, pageHeight]);
    const scale = Math.min(pageWidth / image.width, pageHeight / image.height);
    const imageWidth = image.width * scale;
    const imageHeight = image.height * scale;
    page.drawImage(image, {
      x: (pageWidth - imageWidth) / 2,
      y: (pageHeight - imageHeight) / 2,
      width: imageWidth,
      height: imageHeight
    });
  }

  return pdf.save();
};

export const createPowerPointFromRenderedPages = async (
  pages,
  { slideSize = 'wide', outputType = 'blob' } = {}
) => {
  if (!Array.isArray(pages) || pages.length === 0) {
    throw new Error('No PDF pages were rendered for the PowerPoint.');
  }
  if (!['wide', 'original'].includes(slideSize)) {
    throw new Error('Choose a supported PowerPoint slide size.');
  }

  for (const page of pages) {
    if (typeof page?.imageData !== 'string'
      || !/^data:image\/(?:png|jpeg);base64,/.test(page.imageData)
      || !Number.isFinite(page.width)
      || !Number.isFinite(page.height)
      || page.width <= 0
      || page.height <= 0) {
      throw new Error('A rendered PDF page has invalid image data or dimensions.');
    }
  }

  const presentation = new pptxgen();
  let slideWidth = 13.333;
  let slideHeight = 7.5;
  if (slideSize === 'wide') {
    presentation.layout = 'LAYOUT_WIDE';
  } else {
    const aspectRatio = pages[0].width / pages[0].height;
    slideHeight = Math.min(7.5, 13.333 / aspectRatio);
    slideWidth = slideHeight * aspectRatio;
    presentation.defineLayout({
      name: 'ORIGINAL_PAGE_ASPECT',
      width: slideWidth,
      height: slideHeight
    });
    presentation.layout = 'ORIGINAL_PAGE_ASPECT';
  }

  presentation.author = 'PDF Tools';
  presentation.subject = 'Image-based slides rendered from selected PDF pages';
  for (const page of pages) {
    const slide = presentation.addSlide();
    slide.background = { color: 'FFFFFF' };
    const scale = Math.min(slideWidth / page.width, slideHeight / page.height);
    const imageWidth = page.width * scale;
    const imageHeight = page.height * scale;
    slide.addImage({
      data: page.imageData,
      x: (slideWidth - imageWidth) / 2,
      y: (slideHeight - imageHeight) / 2,
      w: imageWidth,
      h: imageHeight
    });
  }

  return presentation.write({ outputType });
};
