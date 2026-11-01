const getPageGroupSizes = (pageCount, partCount) => {
  if (!Number.isInteger(pageCount) || pageCount < 2) {
    throw new Error('Percentage splitting requires a PDF with at least two pages.');
  }

  const maxParts = Math.min(10, pageCount);
  if (!Number.isInteger(partCount) || partCount < 2 || partCount > maxParts) {
    throw new Error(`Choose between 2 and ${maxParts} parts.`);
  }

  const baseSize = Math.floor(pageCount / partCount);
  const remainder = pageCount % partCount;
  return Array.from({ length: partCount }, (_, index) => baseSize + (index < remainder ? 1 : 0));
};

export const createPageGroupRangesByPartCount = (pageCount, partCount) => {
  const groupSizes = getPageGroupSizes(pageCount, partCount);
  let firstPage = 1;
  return groupSizes.map((groupSize) => {
    const range = { startPage: firstPage, endPage: firstPage + groupSize - 1 };
    firstPage = range.endPage + 1;
    return range;
  });
};

export const createPageGroupsByPartCount = (pageCount, partCount) => {
  const groups = [];
  for (const { startPage, endPage } of createPageGroupRangesByPartCount(pageCount, partCount)) {
    const pages = Array.from({ length: endPage - startPage + 1 }, (_, pageIndex) => startPage + pageIndex);
    groups.push(pages);
  }
  return groups;
};

export const parsePageRanges = (input, maxPages) => {
  if (typeof input !== 'string' || !Number.isInteger(maxPages) || maxPages < 1) {
    throw new Error('Enter valid page numbers or ranges.');
  }

  const pages = new Set();
  for (const rawPart of input.split(',')) {
    const part = rawPart.trim();
    if (!part) throw new Error('Page selections cannot contain empty entries.');

    if (part.includes('-')) {
      const range = part.split('-');
      if (range.length !== 2 || !/^\d+$/.test(range[0].trim()) || !/^\d+$/.test(range[1].trim())) {
        throw new Error(`Invalid range: ${part}`);
      }
      const [start, end] = range.map((value) => Number(value.trim()));
      if (start < 1 || end > maxPages || start > end) {
        throw new Error(`Invalid range: ${part}`);
      }
      for (let page = start; page <= end; page += 1) pages.add(page);
    } else {
      if (!/^\d+$/.test(part)) throw new Error(`Invalid page: ${part}`);
      const page = Number(part);
      if (page < 1 || page > maxPages) throw new Error(`Invalid page: ${part}`);
      pages.add(page);
    }
  }

  if (!pages.size) throw new Error('Enter at least one page number or range.');
  return [...pages].sort((a, b) => a - b);
};
