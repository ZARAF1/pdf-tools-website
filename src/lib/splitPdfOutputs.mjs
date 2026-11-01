import { PDFDocument } from 'pdf-lib';

export const createSplitPdfOutputs = async ({ sourceDocument, pageGroups, fileName, mode }) => {
  const outputs = [];
  for (let index = 0; index < pageGroups.length; index += 1) {
    const destinationDocument = await PDFDocument.create();
    const pageIndices = pageGroups[index].map((page) => page - 1);
    const copiedPages = await destinationDocument.copyPages(sourceDocument, pageIndices);
    copiedPages.forEach((page) => destinationDocument.addPage(page));
    const bytes = await destinationDocument.save();
    const name = mode === 'extract-selected'
      ? `extracted_${fileName}`
      : mode === 'split-percentage'
        ? `part_${index + 1}_${fileName}`
        : `page_${index + 1}_${fileName}`;
    outputs.push({ bytes, name });
  }
  return outputs;
};
