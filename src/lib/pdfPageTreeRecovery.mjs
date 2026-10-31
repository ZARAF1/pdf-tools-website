import { PDFArray, PDFDict, PDFName, PDFNumber, PDFPageLeaf, PDFPageTree } from 'pdf-lib';

const pageTreeType = PDFName.of('Type');
const pagesType = PDFName.of('Pages');
const kidsKey = PDFName.of('Kids');
const countKey = PDFName.of('Count');

export const recoverPdfPageTreeRoot = (document) => {
  const root = document.catalog.Pages();
  if (root instanceof PDFPageTree) return root;

  if (!(root instanceof PDFDict) || root.get(pageTreeType) !== undefined) {
    throw new Error('This PDF has an unsupported page structure and cannot be split.');
  }

  const kids = root.context.lookupMaybe(root.get(kidsKey), PDFArray);
  const count = root.context.lookupMaybe(root.get(countKey), PDFNumber);
  if (!kids || !count || count.asNumber() < 1) {
    throw new Error('This PDF has an unsupported page structure and cannot be split.');
  }

  for (let index = 0; index < kids.size(); index += 1) {
    const child = root.context.lookupMaybe(kids.get(index), PDFDict);
    if (!(child instanceof PDFPageTree) && !(child instanceof PDFPageLeaf)) {
      throw new Error('This PDF has an unsupported page structure and cannot be split.');
    }
  }

  Object.setPrototypeOf(root, PDFPageTree.prototype);
  root.set(pageTreeType, pagesType);
  return root;
};
