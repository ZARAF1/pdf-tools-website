import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getLocalizedResources,
  RESOURCE_TRANSLATIONS
} from '../src/i18n/resourceLocalization.mjs';
import { SUPPORTED_LANGUAGES } from '../src/i18n/languageCatalog.mjs';

const articles = {
  'pdf-compression': {
    title: 'What PDF compression can and cannot do',
    description: 'Understand PDF compression, image-heavy files, and quality tradeoffs.',
    sections: [
      ['Why a PDF may already be compact', 'PDF files can contain compressed image streams and fonts.'],
      ['Check the result, not the label', 'Compare the original and output sizes. See the [Compress PDF](/compress) tool.']
    ]
  },
  'local-pdf-processing': {
    title: 'What local PDF processing means',
    description: 'Learn what browser-side PDF processing protects and what it does not.',
    sections: [['The selected document', 'A browser-side PDF library can read a file.']]
  },
  'scanned-pdf-to-word': {
    title: 'Converting scanned PDFs to Word',
    description: 'Understand OCR, scan quality, and layout limitations when converting PDFs.',
    sections: [['Text PDFs and scanned PDFs differ', 'A PDF with a text layer can expose selectable characters.']]
  }
};

test('resource index and guide articles localize for every supported language', () => {
  for (const { code } of SUPPORTED_LANGUAGES) {
    const localized = getLocalizedResources(code, articles);
    assert.ok(localized.title, `${code} is missing the guide index title`);
    assert.ok(localized.intro, `${code} is missing the guide index introduction`);
    assert.ok(localized.readGuide, `${code} is missing the read-guide label`);
    assert.ok(localized.backToResources, `${code} is missing the back link`);
    if (code !== 'en') {
      assert.notEqual(localized.title, 'PDF Guides and Resources', `${code} index title is still English`);
      assert.notEqual(localized.articles['pdf-compression'].title, articles['pdf-compression'].title);
      assert.ok(RESOURCE_TRANSLATIONS[code], `${code} is missing bundled guide copy`);
      for (const article of Object.values(localized.articles)) {
        assert.equal(article.sections.length, 3, `${code} has incomplete guide sections`);
        assert.ok(article.sections.every(([heading, body]) => heading && body), `${code} has empty guide copy`);
      }
    } else {
      assert.deepEqual(localized.articles, articles);
    }
  }
});

test('resource translation keeps embedded tool links and leaves English unchanged', () => {
  const localized = getLocalizedResources('es', articles).articles['pdf-compression'];
  assert.ok(localized.sections[2][1].includes('(/compress)'));
  for (const code of SUPPORTED_LANGUAGES.filter(({ code }) => code !== 'en').map(({ code }) => code)) {
    const translated = getLocalizedResources(code, articles).articles;
    for (const [slug, article] of Object.entries(translated)) {
      assert.ok(article.sections.flatMap(([, body]) => body).some((body) => /\]\(\/[^)]+\)/.test(body)), `${code}/${slug} is missing its internal link`);
    }
  }
  assert.deepEqual(getLocalizedResources('en', articles).articles, articles);
  assert.deepEqual(
    Object.keys(RESOURCE_TRANSLATIONS).sort(),
    SUPPORTED_LANGUAGES.filter(({ code }) => code !== 'en').map(({ code }) => code).sort()
  );
});
