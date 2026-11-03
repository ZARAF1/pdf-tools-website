import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const expectedAttachments = new Map([
  ['crop', ['One unencrypted PDF · no fixed page cap', 'Crop PDF pages', 'Cropping changes the visible page boundary; it does not permanently remove content outside it.']],
  ['edit', ['One unencrypted PDF · no fixed page cap', 'Add content to PDF pages', 'Add text, images, drawings, highlights, or shapes, and remove pages. Existing text is not edited or replaced; added marks are overlays.']],
  ['merge', ['2–5 unencrypted PDF files', 'Combine PDFs into one file', 'Merge whole files, or choose individual pages and arrange their final output order.']],
  ['split', ['One unencrypted PDF · no fixed page cap', 'Split / Extract PDF', 'Select pages visually, split every page, or divide the PDF into percentage-based sections.']],
  ['rotate', ['One unencrypted PDF · no fixed page cap', 'Rotate PDF pages', 'Rotate every page or only the pages and ranges you select.']],
  ['protect', ['One unencrypted PDF · no fixed page cap', 'Protect a PDF with a password', 'Add an opening password to a new copy; keep the password because it cannot be recovered here.']],
  ['unlock', ['One password-protected PDF · AES-256 R6 or RC4 R2/R3 only', 'Unlock a PDF with its password', 'A correct password is required; password guessing and recovery are not supported.']],
  ['word', ['One unencrypted PDF or unprotected .docx file · no fixed page cap', 'Convert PDF ↔ Word', 'Create editable DOCX text from PDFs, or image-based PDFs from DOCX. Reverse-conversion text is not searchable; .doc files are unsupported.']],
  ['powerpoint', ['One unencrypted PDF or unprotected .pptx file · page count depends on available browser memory', 'Convert PDF ↔ PowerPoint', 'Select pages or slides, name the output, and choose image quality and page or slide sizing. Results are image-based and may not be editable.']],
  ['markdown', ['One unencrypted PDF, .md, or plain-text file', 'Convert PDF ↔ Markdown', 'Extract selectable PDF text or create a PDF from editable Markdown. Scanned pages need OCR first.']],
  ['compress', ['Up to 5 unencrypted PDF files', 'Try to reduce PDF file size', 'Higher compression rasterizes pages and can reduce image quality and remove selectable text; larger outputs are not offered.']],
  ['watermark', ['One unencrypted PDF · no fixed page cap', 'Add watermarks to PDF pages', 'Add text watermarks and optional page numbers to all or selected pages.']],
  ['remove', ['One unencrypted PDF · up to 50 pages', 'Remove selected PDF pages', 'Choose pages to omit; at least one page must remain in the output.']],
  ['ocr', ['One unencrypted PDF · up to 50 pages', 'Make scanned PDF text searchable', 'English OCR adds an invisible text layer to pages without readable text.']],
  ['organize-pages', ['One unencrypted PDF · up to 30 pages', 'Organize PDF pages', 'Reorder, rotate, or remove pages; at least one page must remain.']],
  ['redact', ['One unencrypted PDF · up to 15 pages', 'Permanently redact page content', 'Drag over sensitive text or images to mark them. Every page is rasterized in the output so the original text beneath a redaction is not retained.']],
  ['sign', ['One unencrypted PDF · no fixed page cap', 'Add a visible signature to PDF pages', 'Use a typed, drawn, or image signature; this is not a certificate-based digital signature.']]
]);
const expectedRuleKeys = new Map([
  ['crop', 'pdfOne'], ['edit', 'pdfOne'], ['merge', 'pdf2To5'], ['split', 'pdfOne'],
  ['rotate', 'pdfOne'], ['protect', 'pdfOne'], ['unlock', 'passwordPdf'],
  ['word', 'docxPdfOne'], ['powerpoint', 'powerpointPdfOne'], ['markdown', 'markdownFileOne'], ['compress', 'pdfUpTo5'], ['watermark', 'pdfOne'],
  ['remove', 'pdf50'], ['ocr', 'pdf50'], ['organize-pages', 'pdf30'],
  ['redact', 'pdf15'], ['sign', 'pdfOne']
]);

const source = await readFile(new URL('../src/components/ToolPage.jsx', import.meta.url), 'utf8');
const rulesBlock = source.match(/const ATTACHMENT_RULES = \{([\s\S]*?)\r?\n\};/)?.[1];

test('every attach section documents accurate input limits and tool-specific guidance', () => {
  assert.ok(rulesBlock, 'ToolPage should define shared attachment guidance');
  const actualKeys = [...rulesBlock.matchAll(/^  (?:'([^']+)'|([\w-]+)): \{$/gm)]
    .map(([, quotedKey, bareKey]) => quotedKey || bareKey);
  assert.deepEqual(new Set(actualKeys), new Set(expectedAttachments.keys()));

  for (const [tool, [rule, title, description]] of expectedAttachments) {
    const key = /^\w+$/.test(tool) ? tool : `'${tool}'`;
    const escapePattern = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const entryPattern = new RegExp(
      `^  ${escapePattern(key)}: \\{\\r?\\n` +
      `    title: '${tool === 'markdown' ? 'Attach a PDF or Markdown File Here' : 'Attach (?:PDF|PDFs|Images)(?: or PowerPoint)? Here'}',\\r?\\n` +
      `    ruleKey: '${escapePattern(expectedRuleKeys.get(tool))}',\\r?\\n` +
      `    rule: '${escapePattern(rule)}',\\r?\\n` +
      `    infoTitle: '${escapePattern(title)}',\\r?\\n` +
      `    info: '${escapePattern(description)}'\\r?\\n` +
      `  \\}`,
      'm'
    );
    assert.match(rulesBlock, entryPattern, `${tool} should document its input limits, purpose, and important limitations`);
  }
});

test('shared attachment section renders the guidance panel and redact copy is not duplicated', async () => {
  assert.match(source, /<aside className="tool-attachment-guidance" aria-labelledby=/);
  assert.match(source, /<h3 id=\{attachmentGuidanceHeadingId\}>\{localizedTool\?\.name \|\| localizedContent\.attachment\.infoTitle\}<\/h3>/);
  assert.match(source, /<p>\{localizedContent\.attachment\.info\}<\/p>/);

  const redactComponent = await readFile(new URL('../src/components/RedactPdf.jsx', import.meta.url), 'utf8');
  assert.doesNotMatch(redactComponent, /Permanently redact page content/);
});

test('the combined image and PDF tool uses each direction’s own attachment workflow', () => {
  assert.match(source, /tool === 'image-pdf'[\s\S]*?\? null/);
});
