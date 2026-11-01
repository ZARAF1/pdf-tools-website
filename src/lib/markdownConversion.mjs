import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const PAGE_SIZES = {
  a4: [595.28, 841.89],
  letter: [612, 792]
};

const FONT_SIZES = {
  small: 10,
  medium: 12,
  large: 14
};

export const parseMarkdownPageSelection = (selection, totalPages) => {
  if (!Number.isInteger(totalPages) || totalPages < 1) {
    throw new Error('The PDF has no pages to select.');
  }
  if (!selection.trim()) {
    return Array.from({ length: totalPages }, (_, index) => index);
  }

  const selectedPages = new Set();
  for (const part of selection.split(',')) {
    const match = part.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!match) {
      throw new Error('Enter pages as numbers and ranges, for example 1-3,5.');
    }

    const first = Number(match[1]);
    const last = Number(match[2] || match[1]);
    if (first < 1 || last < first || last > totalPages) {
      throw new Error(`Choose pages between 1 and ${totalPages}.`);
    }
    for (let page = first; page <= last; page += 1) {
      selectedPages.add(page - 1);
    }
  }
  return [...selectedPages].sort((a, b) => a - b);
};

export const buildMarkdownFromPages = (pages, { includePageBreaks = true } = {}) => {
  if (!Array.isArray(pages) || pages.length === 0) {
    throw new Error('No PDF pages were selected for Markdown export.');
  }
  const separator = includePageBreaks ? '\n\n---\n\n' : '\n\n';
  return pages.map((page) => String(page || '').trim()).filter(Boolean).join(separator);
};

const inlineMarkdownToText = (value) => value
  .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
  .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
  .replace(/`([^`]+)`/g, '$1')
  .replace(/\*\*([^*]+)\*\*|__([^_]+)__/g, '$1$2')
  .replace(/~~([^~]+)~~/g, '$1')
  .replace(/(?<!\*)\*([^*]+)\*(?!\*)|(?<!_)_([^_]+)_(?!_)/g, '$1$2')
  .replace(/<[^>]*>/g, '');

const getMarkdownBlocks = (markdown) => {
  const blocks = [];
  let paragraph = [];
  let codeLines = [];
  let inCodeBlock = false;
  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: 'paragraph', text: inlineMarkdownToText(paragraph.join(' ')) });
      paragraph = [];
    }
  };
  const flushCode = () => {
    if (codeLines.length) {
      blocks.push({ type: 'code', text: codeLines.join(' ') });
      codeLines = [];
    }
  };

  for (const line of markdown.replace(/\r\n?/g, '\n').split('\n')) {
    if (/^\s*```/.test(line)) {
      flushParagraph();
      if (inCodeBlock) flushCode();
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }
    if (!line.trim()) {
      flushParagraph();
      continue;
    }
    const heading = line.match(/^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (heading) {
      flushParagraph();
      blocks.push({ type: 'heading', level: heading[1].length, text: inlineMarkdownToText(heading[2]) });
      continue;
    }
    if (/^\s{0,3}([-*_]\s*){3,}$/.test(line)) {
      flushParagraph();
      blocks.push({ type: 'spacer', text: '' });
      continue;
    }
    const listItem = line.match(/^\s{0,3}([-+*]|\d+[.)])\s+(.+)$/);
    if (listItem) {
      flushParagraph();
      blocks.push({ type: 'list', text: `${/^\d/.test(listItem[1]) ? `${listItem[1]} ` : '• '}${inlineMarkdownToText(listItem[2])}` });
      continue;
    }
    const quote = line.match(/^\s{0,3}>\s?(.*)$/);
    if (quote) {
      flushParagraph();
      blocks.push({ type: 'quote', text: inlineMarkdownToText(quote[1]) });
      continue;
    }
    if (/^\s*\|?[\s:|-]+\|?\s*$/.test(line) && line.includes('|')) {
      flushParagraph();
      continue;
    }
    if (line.includes('|')) {
      flushParagraph();
      blocks.push({ type: 'paragraph', text: inlineMarkdownToText(line.replace(/^\s*\||\|\s*$/g, '').replace(/\s*\|\s*/g, ' | ')) });
      continue;
    }
    paragraph.push(line.trim());
  }
  flushParagraph();
  flushCode();
  return blocks;
};

const splitLongWord = (word, font, fontSize, maxWidth) => {
  const fragments = [];
  let fragment = '';
  for (const character of word) {
    if (fragment && font.widthOfTextAtSize(fragment + character, fontSize) > maxWidth) {
      fragments.push(fragment);
      fragment = character;
    } else {
      fragment += character;
    }
  }
  if (fragment) fragments.push(fragment);
  return fragments;
};

const wrapText = (text, font, fontSize, maxWidth) => {
  const lines = [];
  let currentLine = '';
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, fontSize) <= maxWidth) {
      currentLine = candidate;
      continue;
    }
    if (currentLine) lines.push(currentLine);
    if (font.widthOfTextAtSize(word, fontSize) > maxWidth) {
      const fragments = splitLongWord(word, font, fontSize, maxWidth);
      lines.push(...fragments.slice(0, -1));
      currentLine = fragments.at(-1) || '';
    } else {
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
};

export const createPdfFromMarkdown = async (
  markdown,
  { pageSize = 'a4', orientation = 'portrait', fontSize = 'medium' } = {}
) => {
  if (typeof markdown !== 'string' || !markdown.trim()) {
    throw new Error('Enter or upload Markdown content before converting.');
  }
  const baseSize = PAGE_SIZES[pageSize];
  if (!baseSize) {
    throw new Error('Choose a supported PDF page size.');
  }
  if (!['portrait', 'landscape'].includes(orientation)) {
    throw new Error('Choose a supported page orientation.');
  }
  const bodySize = FONT_SIZES[fontSize];
  if (!bodySize) {
    throw new Error('Choose a supported Markdown text size.');
  }

  const [pageWidth, pageHeight] = orientation === 'landscape'
    ? [Math.max(...baseSize), Math.min(...baseSize)]
    : [Math.min(...baseSize), Math.max(...baseSize)];
  const margin = 48;
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const italic = await pdf.embedFont(StandardFonts.HelveticaOblique);
  const mono = await pdf.embedFont(StandardFonts.Courier);
  let page = pdf.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;
  const createPage = () => {
    page = pdf.addPage([pageWidth, pageHeight]);
    y = pageHeight - margin;
  };

  try {
    for (const block of getMarkdownBlocks(markdown)) {
      if (block.type === 'spacer') {
        y -= bodySize;
        if (y < margin) createPage();
        continue;
      }

      const blockSize = block.type === 'heading'
        ? Math.max(bodySize, 22 - block.level * 2)
        : bodySize;
      const font = block.type === 'heading' || block.type === 'list'
        ? bold
        : block.type === 'quote' ? italic : block.type === 'code' ? mono : regular;
      const indent = block.type === 'list' ? 16 : block.type === 'quote' ? 12 : 0;
      const maxWidth = pageWidth - margin * 2 - indent;
      const lines = wrapText(block.text, font, blockSize, maxWidth);
      y -= block.type === 'heading' ? blockSize * 0.4 : bodySize * 0.35;

      for (const line of lines) {
        const lineHeight = blockSize * 1.4;
        if (y - lineHeight < margin) createPage();
        page.drawText(line, {
          x: margin + indent,
          y: y - lineHeight,
          size: blockSize,
          font,
          color: block.type === 'quote' ? rgb(0.25, 0.3, 0.4) : rgb(0.08, 0.1, 0.15)
        });
        y -= lineHeight;
      }
      y -= block.type === 'heading' ? bodySize * 0.7 : bodySize * 0.45;
    }
  } catch (error) {
    if (/WinAnsi|encode/i.test(error.message || '')) {
      throw new Error('This Markdown contains characters not supported by the built-in PDF fonts. Replace them with supported Latin characters and try again.');
    }
    throw error;
  }

  return pdf.save();
};
