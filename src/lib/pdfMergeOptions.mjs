const PAPER_SIZES = {
  a4: { width: 595.28, height: 841.89 },
  letter: { width: 612, height: 792 }
};

export function addPageToMergeOrder(order, page) {
  const index = order.findIndex((entry) => entry.fileId === page.fileId && entry.pageIndex === page.pageIndex);
  if (index >= 0) return order.filter((_, entryIndex) => entryIndex !== index);
  return [...order, page];
}

export function normalizePdfFileName(value) {
  const enteredName = String(value).trim();
  const nameWithoutExtension = enteredName.replace(
    /\.pdf$/i.test(enteredName) ? /\.pdf$/i : /\.[^.]*$/,
    ''
  );
  const baseName = nameWithoutExtension
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_')
    .replace(/_+/g, '_')
    .replace(/[. ]+$/g, '')
    .trim();
  if (!baseName) throw new RangeError('Enter a valid PDF filename.');
  return `${baseName}.pdf`;
}

export function getFitPageDimensions(sourceWidth, sourceHeight, paper) {
  const size = PAPER_SIZES[paper];
  if (!size) throw new RangeError('Choose a supported paper size.');
  if (!Number.isFinite(sourceWidth) || sourceWidth <= 0 || !Number.isFinite(sourceHeight) || sourceHeight <= 0) {
    throw new RangeError('Page dimensions must be positive finite numbers.');
  }

  const landscape = sourceWidth > sourceHeight;
  const pageWidth = landscape ? size.height : size.width;
  const pageHeight = landscape ? size.width : size.height;
  const scale = Math.min(pageWidth / sourceWidth, pageHeight / sourceHeight);

  return {
    pageWidth,
    pageHeight,
    contentWidth: sourceWidth * scale,
    contentHeight: sourceHeight * scale
  };
}
