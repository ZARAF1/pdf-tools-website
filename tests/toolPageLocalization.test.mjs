import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getLocalizedToolPage,
  TOOL_PAGE_FAQ_TRANSLATIONS,
  TOOL_PAGE_TRANSLATIONS
} from '../src/i18n/toolPageLocalization.mjs';
import { getLocalizedTool } from '../src/i18n/toolTranslations.mjs';
import { SUPPORTED_LANGUAGES } from '../src/i18n/languageCatalog.mjs';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const toolPageSource = await readFile(
  fileURLToPath(new URL('../src/components/ToolPage.jsx', import.meta.url)),
  'utf8'
);

const imageTool = {
  id: 'image-pdf',
  name: 'Images ↔ PDF',
  description: 'Create PDFs from images or export PDF pages as images.'
};

const imageContent = {
  intro: 'Create PDFs from images or export PDF pages as images.',
  detailPoints: {
    what: 'Create PDFs from images or export PDF pages as images.',
    how: 'Choose a direction and adjust its settings.',
    result: 'A separate PDF, image, or ZIP of images.'
  },
  steps: ['Choose a direction.', 'Add images or a PDF.', 'Configure options.', 'Create and download the output.'],
  faqs: [['Which directions can I use?', 'Create a PDF from images or export PDF pages as images.']]
};
const ruleKeys = ['pdfOne', 'docxPdfOne', 'powerpointPdfOne', 'pdf15', 'pdf30', 'pdf50', 'pdfUpTo5', 'pdf2To5', 'images10', 'passwordPdf'];

test('tool page intro, attachment details, and guide update to the selected language', () => {
  const localizedTool = getLocalizedTool('es', imageTool);
  const localized = getLocalizedToolPage('es', 'image-pdf', localizedTool, imageContent, null);

  assert.notEqual(localized.intro, imageContent.intro);
  assert.equal(localized.intro, TOOL_PAGE_TRANSLATIONS.es.introSuffix);
  assert.equal(localized.attachment, null);
  assert.equal(localized.steps.length, 4);
  assert.ok(localized.steps.every((step) => !imageContent.steps.includes(step)));
});

test('English tool-page content remains unchanged', () => {
  const english = getLocalizedToolPage('en', 'image-pdf', imageTool, imageContent, null);
  assert.equal(english.intro, imageContent.intro);
  assert.deepEqual(english.steps, imageContent.steps);
  assert.equal(english.attachment, null);
  assert.deepEqual(english.faqs, imageContent.faqs);
});

test('tool FAQs update questions and answers for every supported language', () => {
  for (const { code } of SUPPORTED_LANGUAGES) {
    if (code === 'en') continue;
    const localized = getLocalizedToolPage(
      code,
      'image-pdf',
      getLocalizedTool(code, imageTool),
      imageContent,
      null
    );
    assert.equal(localized.faqs.length, 5, `${code} is missing localized FAQs`);
    assert.ok(TOOL_PAGE_FAQ_TRANSLATIONS[code], `${code} is missing FAQ translations`);
    for (const [question, answer] of localized.faqs) {
      assert.ok(question, `${code} has an empty FAQ question`);
      assert.ok(answer, `${code} has an empty FAQ answer`);
      assert.ok(!imageContent.faqs.some(([englishQuestion]) => englishQuestion === question), `${code} leaves an FAQ question in English`);
      assert.ok(!imageContent.faqs.some(([, englishAnswer]) => englishAnswer === answer), `${code} leaves an FAQ answer in English`);
    }
  }
  assert.deepEqual(
    Object.keys(TOOL_PAGE_FAQ_TRANSLATIONS).sort(),
    SUPPORTED_LANGUAGES.filter(({ code }) => code !== 'en').map(({ code }) => code).sort()
  );
});

test('all supported languages have translated tool page guides and attachment limits', () => {
  assert.deepEqual(
    Object.keys(TOOL_PAGE_TRANSLATIONS).sort(),
    SUPPORTED_LANGUAGES.map(({ code }) => code).sort()
  );
  for (const { code } of SUPPORTED_LANGUAGES) {
    if (code === 'en') continue;
    const localized = getLocalizedToolPage(
      code,
      'image-pdf',
      getLocalizedTool(code, imageTool),
      imageContent,
      null
    );
    assert.ok(localized.intro, `${code} is missing the localized introduction`);
    assert.equal(localized.steps.length, 4, `${code} is missing guide steps`);
    assert.equal(localized.attachment, null, `${code} should leave direction-specific attachment guidance to each workflow`);
    for (const ruleKey of ruleKeys) {
      assert.ok(TOOL_PAGE_TRANSLATIONS[code].rules[ruleKey], `${code} is missing ${ruleKey}`);
    }
  }
});

test('compression and other tool-specific cautions use localized attachment guidance', () => {
  for (const { code } of SUPPORTED_LANGUAGES) {
    if (code === 'en') continue;
    const localized = getLocalizedToolPage(
      code,
      'compress',
      getLocalizedTool(code, { id: 'compress', name: 'Compress PDF', description: 'Reduce PDF size.' }),
      imageContent,
      { ruleKey: 'pdfUpTo5', rule: 'Up to 5 unencrypted PDF files', info: 'English compression warning.' }
    );
    assert.notEqual(localized.attachment.info, 'English compression warning', `${code} leaves the warning in English`);
  }
});

test('translated Unlock PDF limits retain the supported encryption algorithms', () => {
  for (const { code } of SUPPORTED_LANGUAGES) {
    if (code === 'en') continue;
    const localized = getLocalizedToolPage(
      code,
      'unlock',
      getLocalizedTool(code, { id: 'unlock', name: 'Unlock PDF', description: 'Unlock PDF.' }),
      imageContent,
      { ruleKey: 'passwordPdf', rule: 'English rule', info: 'English guidance.' }
    );
    assert.match(localized.attachment.rule, /AES-256 R6/);
    assert.match(localized.attachment.rule, /RC4 R2\/R3/);
  }
});

test('tool page renders the three detail points, attachment guidance, and guide steps', () => {
  assert.match(toolPageSource, /getLocalizedToolPage\(/);
  assert.match(toolPageSource, /localizedContent\.detailPoints\.map/);
  assert.match(toolPageSource, /localizedContent\.detailPointHeadings\[key\]/);
  assert.match(toolPageSource, /\{localizedContent\.attachment\.rule\}/);
  assert.match(toolPageSource, /\{localizedContent\.attachment\.info\}/);
  assert.match(toolPageSource, /localizedContent\.steps\.map/);
  assert.match(toolPageSource, /<FaqAccordion items=\{localizedContent\.faqs\} \/>/);
});
