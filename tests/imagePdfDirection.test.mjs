import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { TOOL_GUIDES } from '../src/components/toolGuides.mjs';
import { getLocalizedTool, TOOL_TRANSLATIONS } from '../src/i18n/toolTranslations.mjs';
import { SUPPORTED_LANGUAGES } from '../src/i18n/languageCatalog.mjs';

const app = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8');
const directionSwitcher = await readFile(new URL('../src/components/ImagePdf.jsx', import.meta.url), 'utf8');
const toolPage = await readFile(new URL('../src/components/ToolPage.jsx', import.meta.url), 'utf8');
const registry = await readFile(new URL('../src/components/toolRegistry.js', import.meta.url), 'utf8');
const imageToPdf = await readFile(new URL('../src/components/ImageToPdf.jsx', import.meta.url), 'utf8');

test('one Images ↔ PDF route preserves both workflows and the previous URLs', () => {
  assert.match(app, /<Route path="\/image-pdf" element=\{<ToolPage tool="image-pdf"><ImagePdf \/><\/ToolPage>\} \/>/);
  assert.match(app, /path="\/image-to-pdf" element=\{<Navigate to="\/image-pdf\?direction=images-to-pdf" replace \/>/);
  assert.match(app, /path="\/pdf-to-images" element=\{<Navigate to="\/image-pdf\?direction=pdf-to-images" replace \/>/);
  assert.match(directionSwitcher, /const ImageToPdf = lazy\(\(\) => import\('\.\/ImageToPdf'\)\)/);
  assert.match(directionSwitcher, /const PdfToImages = lazy\(\(\) => import\('\.\/PdfToImages'\)\)/);
  assert.match(directionSwitcher, /<div hidden=\{direction !== 'images-to-pdf'\}>[\s\S]*?<ImageToPdf \/>/);
  assert.match(directionSwitcher, /<div hidden=\{direction !== 'pdf-to-images'\}>[\s\S]*?<PdfToImages \/>/);
  assert.match(directionSwitcher, /setSearchParams\(\{ direction: nextDirection \}, \{ replace: true \}\)/);
  assert.match(registry, /id: 'image-pdf',\s+name: 'Images ↔ PDF',\s+path: '\/image-pdf'/);
  assert.doesNotMatch(registry, /id: 'pdf-images'/);
  assert.doesNotMatch(registry, /id: 'image',\s+name: 'Image to PDF'/);
  assert.match(toolPage, /'image-pdf': \{\s+title: 'Images ↔ PDF'/);
});

test('the combined guide explains both directions and their distinct outputs', () => {
  const guide = TOOL_GUIDES['image-pdf'];
  assert.ok(guide);
  assert.match(guide.what, /up to 10 JPEG, PNG, or BMP images/);
  assert.match(guide.what, /1–50 page PDF/);
  assert.match(guide.how, /images to PDF/);
  assert.match(guide.how, /PDF to images/);
  assert.match(guide.result, /ZIP/);
  assert.equal(TOOL_GUIDES.image, undefined);
  assert.equal(TOOL_GUIDES['pdf-images'], undefined);
});

test('the combined tool label is localized for every supported language', () => {
  for (const { code } of SUPPORTED_LANGUAGES) {
    const tool = getLocalizedTool(code, {
      id: 'image-pdf',
      name: 'Images ↔ PDF',
      description: 'Create a PDF from images or export PDF pages as image files.'
    });
    assert.match(tool.name, /↔/, `${code} tool name should show the bidirectional arrow`);
    assert.ok(tool.description.trim(), `${code} description should not be empty`);
    assert.doesNotMatch(tool.description, /use this tool.*use this tool/i, `${code} repeats the same tool description`);
  }
  assert.ok(SUPPORTED_LANGUAGES.every(({ code }) => TOOL_TRANSLATIONS[code]['image-pdf']));
  assert.equal(TOOL_TRANSLATIONS.en['image-pdf'].description, 'Create a PDF from images or export PDF pages as image files.');
});

test('Images to PDF uses the shared attachment shell, guidance card, and direct upload layout', async () => {
  const styles = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');
  const attachmentStart = imageToPdf.indexOf('className="tool-attachment-section image-pdf-attachment-section"');
  const settingsStart = imageToPdf.indexOf('className="image-to-pdf-settings-shell"');
  const attachment = imageToPdf.slice(attachmentStart, settingsStart);

  assert.ok(attachmentStart >= 0, 'the image workflow should use the shared attachment shell');
  assert.match(imageToPdf, /className="pdf-tool-workflow image-to-pdf-workflow space-y-6"/, 'the image workflow should not constrain the shared shell width');
  assert.ok(settingsStart > attachmentStart, 'the settings should remain outside and after the attachment shell');
  assert.match(attachment, /tool-attachment-heading/);
  assert.match(attachment, /translate\('attachImagesHere'\)/);
  assert.match(attachment, /formatToolUiMessage\(imageUi\.uploadDescription, \{ max: MAX_IMAGES \}\)/);
  assert.match(attachment, /tool-attachment-guidance/);
  assert.ok(
    attachment.indexOf('tool-attachment-guidance') < attachment.indexOf('tool-attachment-content'),
    'the guidance card should precede the image upload workflow'
  );
  assert.match(attachment, /pdf-workflow-upload pdf-upload-zone merge-pdf-upload-zone/);
  assert.match(
    imageToPdf,
    /\{images\.length > 0 && \(\s*<section\s+className="conversion-selected-file-section image-to-pdf-selected-file-section"[\s\S]*?<header className="image-to-pdf-file-section-header"/
  );
  assert.match(imageToPdf, /className="image-to-pdf-image-count"[^>]*>[\s\S]*imageUi\.imageCount/);
  assert.match(styles, /\.tool-attachment-section\.image-pdf-attachment-section[\s\S]*background:\s*var\(--surface-muted\)/);
  assert.match(styles, /\.image-pdf-attachment-section\s+\.tool-attachment-guidance\s*\{\s*background:\s*var\(--surface-background\)/);
  assert.match(styles, /\.tool-attachment-section\s*\{[^}]*animation:\s*tool-attachment-border-pulse/s);
  assert.match(styles, /\.image-pdf-attachment-section\s+\.image-to-pdf-file-section,\s*\.pdf-images-attachment-section\s+\.pdf-images-file-section\s*\{[^}]*background:\s*transparent/s);
});
