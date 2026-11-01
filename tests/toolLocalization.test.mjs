import test from 'node:test';
import assert from 'node:assert/strict';
import { getLocalizedTool, TOOL_TRANSLATIONS } from '../src/i18n/toolTranslations.mjs';
import { getMessage, SUPPORTED_LANGUAGES } from '../src/i18n/languageCatalog.mjs';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const toolIds = [
  'merge', 'split', 'rotate', 'protect', 'unlock', 'image', 'pdf-images',
  'word', 'compress', 'edit', 'watermark', 'remove', 'ocr',
  'crop', 'organize-pages', 'redact', 'sign'
];
const toolCardSource = await readFile(
  fileURLToPath(new URL('../src/components/ToolCard.jsx', import.meta.url)),
  'utf8'
);
const homeSource = await readFile(
  fileURLToPath(new URL('../src/components/Home.jsx', import.meta.url)),
  'utf8'
);
const searchSource = await readFile(
  fileURLToPath(new URL('../src/components/ToolSearch.jsx', import.meta.url)),
  'utf8'
);
const toolPageSource = await readFile(
  fileURLToPath(new URL('../src/components/ToolPage.jsx', import.meta.url)),
  'utf8'
);
const stylesheetSource = await readFile(
  fileURLToPath(new URL('../src/index.css', import.meta.url)),
  'utf8'
);
const relatedToolsSource = await readFile(
  fileURLToPath(new URL('../src/components/RelatedToolsCarousel.jsx', import.meta.url)),
  'utf8'
);

test('every supported language localizes names and descriptions for all tools', () => {
  for (const { code } of SUPPORTED_LANGUAGES) {
    for (const id of toolIds) {
      const localized = getLocalizedTool(code, { id, name: id, description: id });
      assert.ok(localized.name, `${code} is missing the ${id} name`);
      assert.ok(localized.description, `${code} is missing the ${id} description`);
      assert.notEqual(localized.name, id, `${code} leaves ${id} name untranslated`);
      assert.notEqual(localized.description, id, `${code} leaves ${id} description untranslated`);
    }
  }
});

test('tool translations are bundled locally and cover the active locale catalog', () => {
  assert.deepEqual(Object.keys(TOOL_TRANSLATIONS).sort(), SUPPORTED_LANGUAGES.map(({ code }) => code).sort());
});

test('Spanish OCR description uses Spanish wording for searchable output', () => {
  const ocrDescription = getLocalizedTool('es', { id: 'ocr', name: 'OCR PDF', description: 'OCR PDF' }).description;
  assert.doesNotMatch(ocrDescription, /\bsearchable\b/i);
  assert.match(ocrDescription, /buscable/i);
});

test('tool cards render metadata from the selected language', () => {
  assert.match(toolCardSource, /getLocalizedTool\(language, tool\)/);
  assert.match(toolCardSource, /\{localizedTool\.name\}/);
  assert.match(toolCardSource, /\{localizedTool\.description\}/);
});

test('homepage tool labels and search results use localized tool metadata', () => {
  assert.match(homeSource, /getLocalizedTool\(language, tool\)/);
  assert.match(homeSource, /translate\(`category\.\$\{category\.id\}`\)/);
  assert.match(searchSource, /getLocalizedTool\(language, tool\)/);
  assert.match(searchSource, /\{localizedTool\.name\}/);
  assert.match(searchSource, /\{localizedTool\.description\}/);
});

test('tool page title and metadata use the selected language', () => {
  assert.match(toolPageSource, /getLocalizedTool\(language, registeredTool\)/);
  assert.match(toolPageSource, /localizedTool\?\.name/);
  assert.match(toolPageSource, /localizedTool\?\.description/);
});

test('mobile tool introductions are summarized with an expandable full description', () => {
  for (const { code } of SUPPORTED_LANGUAGES) {
    for (const key of ['expandDescription', 'collapseDescription']) {
      assert.notEqual(getMessage(code, key), key, `${code} is missing ${key}`);
    }
  }

  assert.match(toolPageSource, /tool-detail-intro-copy/);
  assert.match(toolPageSource, /aria-expanded=\{introExpanded\}/);
  assert.match(toolPageSource, /translate\(introExpanded \? 'collapseDescription' : 'expandDescription'\)/);
  assert.match(stylesheetSource, /@media \(max-width: 760px\)[\s\S]*?\.tool-detail-intro-copy[\s\S]*?-webkit-line-clamp: 4;/);
  assert.match(stylesheetSource, /\.tool-detail-intro\.is-expanded \.tool-detail-intro-copy/);
  assert.match(stylesheetSource, /\.tool-detail-intro-toggle[\s\S]*?text-align: start;/);
});

test('tool page shared guidance headings follow the selected language', () => {
  const keys = ['howToUse', 'howItWorks', 'frequentlyAskedQuestions', 'attachPdfHere', 'attachDocumentHere', 'toolWorkspace'];
  for (const { code } of SUPPORTED_LANGUAGES) {
    for (const key of keys) {
      assert.notEqual(getMessage(code, key), key, `${code} is missing ${key}`);
    }
  }
  assert.match(toolPageSource, /translate\('howToUse'\)/);
  assert.match(toolPageSource, /translate\('frequentlyAskedQuestions'\)/);
  assert.match(toolPageSource, /translate\(attachmentTitleKey\)/);
  assert.match(toolPageSource, /localizedTool\?\.name \|\| localizedContent\.attachment\.infoTitle/);
});

test('related tool section heading follows the selected language', () => {
  assert.match(relatedToolsSource, /translate\('relatedTools'\)/);
});
