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
  id: 'image',
  name: 'Image to PDF',
  description: 'Create a PDF from images.'
};

const imageContent = {
  intro: 'Turn images into a PDF with multiple options.',
  steps: ['Choose images.', 'Configure options.', 'Create the PDF.'],
  faqs: [['Does this tool upload my PDF?', 'No. The file is processed in your browser.']]
};

const imageAttachment = {
  ruleKey: 'images10',
  rule: 'Up to 10 JPEG, PNG, or BMP images',
  info: 'Arrange images and adjust the page settings.'
};
const ruleKeys = ['pdfOne', 'docxPdfOne', 'pdf15', 'pdf30', 'pdf50', 'pdfUpTo5', 'pdf2To5', 'images10', 'passwordPdf'];

test('tool page intro, attachment details, and guide update to the selected language', () => {
  const localizedTool = getLocalizedTool('es', imageTool);
  const localized = getLocalizedToolPage('es', 'image', localizedTool, imageContent, imageAttachment);

  assert.notEqual(localized.intro, imageContent.intro);
  assert.equal(localized.intro, TOOL_PAGE_TRANSLATIONS.es.introSuffix);
  assert.notEqual(localized.attachment.rule, imageAttachment.rule);
  assert.match(localized.attachment.rule, /10/);
  assert.notEqual(localized.attachment.info, imageAttachment.info);
  assert.equal(localized.steps.length, 4);
  assert.ok(localized.steps.every((step) => !imageContent.steps.includes(step)));
});

test('English tool-page content remains unchanged', () => {
  const english = getLocalizedToolPage('en', 'image', imageTool, imageContent, imageAttachment);
  assert.equal(english.intro, imageContent.intro);
  assert.deepEqual(english.steps, imageContent.steps);
  assert.deepEqual(english.attachment, imageAttachment);
  assert.deepEqual(english.faqs, imageContent.faqs);
});

test('tool FAQs update questions and answers for every supported language', () => {
  for (const { code } of SUPPORTED_LANGUAGES) {
    if (code === 'en') continue;
    const localized = getLocalizedToolPage(
      code,
      'image',
      getLocalizedTool(code, imageTool),
      imageContent,
      imageAttachment
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
      'image',
      getLocalizedTool(code, imageTool),
      imageContent,
      imageAttachment
    );
    assert.ok(localized.intro, `${code} is missing the localized introduction`);
    assert.equal(localized.steps.length, 4, `${code} is missing guide steps`);
    assert.notEqual(localized.attachment.rule, imageAttachment.rule, `${code} leaves attachment limits in English`);
    assert.ok(localized.attachment.info, `${code} is missing attachment guidance`);
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

test('tool page renders the localized introduction, attachment guidance, and guide steps', () => {
  assert.match(toolPageSource, /getLocalizedToolPage\(/);
  assert.match(toolPageSource, /className="tool-detail-intro-copy">\{localizedContent\.intro\}<\/p>/);
  assert.match(toolPageSource, /\{localizedContent\.attachment\.rule\}/);
  assert.match(toolPageSource, /\{localizedContent\.attachment\.info\}/);
  assert.match(toolPageSource, /localizedContent\.steps\.map/);
  assert.match(toolPageSource, /<FaqAccordion items=\{localizedContent\.faqs\} \/>/);
});
