export const parsePageRanges = (input, maxPages) => {
  const value = input.trim();
  if (!value) return [];

  const pages = new Set();
  for (const part of value.split(',')) {
    const term = part.trim();
    if (!term) throw new Error('Enter page numbers separated by commas.');

    if (term.includes('-')) {
      const range = term.split('-').map((number) => number.trim());
      if (range.length !== 2 || !range.every((number) => /^\d+$/.test(number))) {
        throw new Error(`Invalid range: ${term}`);
      }
      const [start, end] = range.map(Number);
      if (start < 1 || end > maxPages || start > end) {
        throw new Error(`Invalid range: ${term}`);
      }
      for (let page = start; page <= end; page += 1) pages.add(page);
      continue;
    }

    if (!/^\d+$/.test(term)) throw new Error(`Invalid page: ${term}`);
    const page = Number(term);
    if (page < 1 || page > maxPages) throw new Error(`Invalid page: ${term}`);
    pages.add(page);
  }

  return [...pages].sort((a, b) => a - b);
};

export const formatPageRanges = (pageNumbers) => {
  const pages = [...new Set(pageNumbers)].sort((a, b) => a - b);
  const ranges = [];
  let start;
  let end;

  for (const page of pages) {
    if (start === undefined) {
      start = end = page;
    } else if (page === end + 1) {
      end = page;
    } else {
      ranges.push(start === end ? `${start}` : `${start}-${end}`);
      start = end = page;
    }
  }

  if (start !== undefined) ranges.push(start === end ? `${start}` : `${start}-${end}`);
  return ranges.join(', ');
};

export const parsePageRangesWhileTyping = (input, maxPages) => {
  const value = input.trim();
  if (!value) return [];

  if (value.endsWith(',')) {
    const completeValue = value.slice(0, -1).trim();
    if (!completeValue) return [];
    try {
      return parsePageRanges(completeValue, maxPages);
    } catch {
      return null;
    }
  }

  if (value.endsWith('-')) {
    const partialValue = value.slice(0, -1).trimEnd();
    const lastComma = partialValue.lastIndexOf(',');
    const completeValue = partialValue.slice(0, lastComma).trim();
    const partialStart = partialValue.slice(lastComma + 1).trim();

    try {
      const pages = completeValue ? parsePageRanges(completeValue, maxPages) : [];
      if (!/^\d+$/.test(partialStart)) return pages.length ? pages : null;
      const page = Number(partialStart);
      if (page < 1 || page > maxPages) return null;
      pages.push(page);
      return [...new Set(pages)].sort((a, b) => a - b);
    } catch {
      return null;
    }
  }

  try {
    return parsePageRanges(value, maxPages);
  } catch {
    return null;
  }
};
