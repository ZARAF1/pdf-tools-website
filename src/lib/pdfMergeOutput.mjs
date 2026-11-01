import { degrees, PDFDocument, PDFHexString, PDFName } from 'pdf-lib';
import { recoverPdfPageTreeRoot } from './pdfPageTreeRecovery.mjs';
import { getFitPageDimensions } from './pdfMergeOptions.mjs';

const loadSourcePdf = async (file) => {
  try {
    const document = await PDFDocument.load(await file.arrayBuffer(), { updateMetadata: false });
    if (document.isEncrypted) throw new Error('Password-protected PDFs cannot be used with this tool.');
    return document;
  } catch (error) {
    if (error?.message?.toLowerCase().includes('is encrypted')) {
      throw new Error('Password-protected PDFs cannot be used with this tool.');
    }
    throw error;
  }
};

const createMergeSequence = (files, mode, selectedPages) => {
  if (mode === 'all') {
    return files.flatMap((source) => Array.from(
      { length: source.pageCount },
      (_, pageIndex) => ({ fileId: source.id, pageIndex })
    ));
  }
  if (mode !== 'select') throw new RangeError('Choose a supported merge mode.');
  if (!selectedPages.length) throw new RangeError('Select at least one page to merge.');
  return selectedPages;
};

const addSourceBookmarks = (document, bookmarks) => {
  if (!bookmarks.length) return;

  const context = document.context;
  const outlines = context.obj({ Type: 'Outlines', Count: bookmarks.length });
  const outlineRef = context.register(outlines);
  const items = bookmarks.map(({ name, page }) => context.register(context.obj({
    Title: PDFHexString.fromText(name),
    Parent: outlineRef,
    Dest: [page.ref, PDFName.of('Fit')]
  })));

  items.forEach((item, index) => {
    const dict = context.lookup(item);
    if (index > 0) dict.set(PDFName.of('Prev'), items[index - 1]);
    if (index < items.length - 1) dict.set(PDFName.of('Next'), items[index + 1]);
  });

  outlines.set(PDFName.of('First'), items[0]);
  outlines.set(PDFName.of('Last'), items[items.length - 1]);
  document.catalog.set(PDFName.of('Outlines'), outlineRef);
  document.catalog.set(PDFName.of('PageMode'), PDFName.of('UseOutlines'));
};

export async function buildMergedPdf({
  files,
  mode,
  selectedPages = [],
  addBlankPages = false,
  addBookmarks = false,
  pageSize = 'preserve'
}) {
  const sourceFiles = new Map(files.map((file) => [file.id, file]));
  const sourceDocuments = new Map();
  for (const file of files) {
    const document = await loadSourcePdf(file.file);
    recoverPdfPageTreeRoot(document);
    if (document.getPageCount() !== file.pageCount) {
      throw new Error(`${file.name} changed after its page previews were loaded. Remove and add it again.`);
    }
    sourceDocuments.set(file.id, document);
  }

  const sequence = createMergeSequence(files, mode, selectedPages);
  const seenPages = new Set();
  for (const entry of sequence) {
    const source = sourceFiles.get(entry.fileId);
    if (!source || !Number.isInteger(entry.pageIndex) || entry.pageIndex < 0 || entry.pageIndex >= source.pageCount) {
      throw new RangeError('A selected page is no longer available. Review the page selection and try again.');
    }
    const key = `${entry.fileId}:${entry.pageIndex}`;
    if (seenPages.has(key)) throw new RangeError('A page cannot be added to the merged PDF more than once.');
    seenPages.add(key);
  }

  const output = await PDFDocument.create();
  const bookmarks = [];
  let previousFileId = null;
  let previousPage = null;

  for (const entry of sequence) {
    const source = sourceFiles.get(entry.fileId);
    const sourceDocument = sourceDocuments.get(entry.fileId);
    if (addBlankPages && previousFileId !== null && previousFileId !== entry.fileId) {
      output.addPage([previousPage.getWidth(), previousPage.getHeight()]);
    }

    let outputPage;
    if (pageSize === 'preserve') {
      [outputPage] = await output.copyPages(sourceDocument, [entry.pageIndex]);
      output.addPage(outputPage);
    } else {
      const [embeddedPage] = await output.embedPdf(sourceDocument, [entry.pageIndex]);
      const sourceRotation = ((sourceDocument.getPage(entry.pageIndex).getRotation().angle % 360) + 360) % 360;
      const isQuarterTurn = sourceRotation === 90 || sourceRotation === 270;
      const visualWidth = isQuarterTurn ? embeddedPage.height : embeddedPage.width;
      const visualHeight = isQuarterTurn ? embeddedPage.width : embeddedPage.height;
      const dimensions = getFitPageDimensions(visualWidth, visualHeight, pageSize);
      outputPage = output.addPage([dimensions.pageWidth, dimensions.pageHeight]);
      const scale = dimensions.contentWidth / visualWidth;
      const left = (dimensions.pageWidth - dimensions.contentWidth) / 2;
      const bottom = (dimensions.pageHeight - dimensions.contentHeight) / 2;
      const drawnWidth = embeddedPage.width * scale;
      const drawnHeight = embeddedPage.height * scale;
      const x = sourceRotation === 90
        ? left + drawnHeight
        : sourceRotation === 180
          ? left + drawnWidth
          : left;
      const y = sourceRotation === 180
        ? bottom + drawnHeight
        : sourceRotation === 270
          ? bottom + drawnWidth
          : bottom;
      outputPage.drawPage(embeddedPage, {
        x,
        y,
        width: drawnWidth,
        height: drawnHeight,
        rotate: degrees(sourceRotation)
      });
    }

    if (addBookmarks && !bookmarks.some((bookmark) => bookmark.fileId === entry.fileId)) {
      bookmarks.push({ fileId: entry.fileId, name: source.name, page: outputPage });
    }
    previousFileId = entry.fileId;
    previousPage = outputPage;
  }

  if (addBookmarks) addSourceBookmarks(output, bookmarks);
  return output.save();
}
