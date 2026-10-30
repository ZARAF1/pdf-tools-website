import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { FAQ_TRANSLATIONS, getLocalizedFaq } from '../src/i18n/faqLocalization.mjs';
import { SUPPORTED_LANGUAGES } from '../src/i18n/languageCatalog.mjs';

const faqSource = await readFile(
  fileURLToPath(new URL('../src/components/SitePages.jsx', import.meta.url)),
  'utf8'
);
const styles = await readFile(
  fileURLToPath(new URL('../src/index.css', import.meta.url)),
  'utf8'
);

test('standalone FAQ content and metadata are complete for every supported language', () => {
  assert.deepEqual(
    Object.keys(FAQ_TRANSLATIONS).sort(),
    SUPPORTED_LANGUAGES.map(({ code }) => code).sort()
  );

  const english = FAQ_TRANSLATIONS.en;
  assert.equal(english.items.length, 8);
  for (const { code } of SUPPORTED_LANGUAGES) {
    const localized = getLocalizedFaq(code);
    assert.ok(localized.title, `${code} is missing the FAQ title`);
    assert.ok(localized.intro, `${code} is missing the FAQ introduction`);
    assert.ok(localized.description, `${code} is missing the page description`);
    assert.ok(localized.sectionLabel, `${code} is missing the FAQ section label`);
    assert.ok(localized.toolsLabel, `${code} is missing the tools link label`);
    assert.ok(localized.guidesLabel, `${code} is missing the guides link label`);
    assert.equal(localized.items.length, 8, `${code} has an incomplete FAQ list`);
    for (const [index, [question, answer]] of localized.items.entries()) {
      assert.ok(question, `${code} FAQ ${index + 1} has no question`);
      assert.ok(answer, `${code} FAQ ${index + 1} has no answer`);
      if (code !== 'en') {
        assert.notEqual(question, english.items[index][0], `${code} FAQ ${index + 1} question is still English`);
        assert.notEqual(answer, english.items[index][1], `${code} FAQ ${index + 1} answer is still English`);
      }
    }
  }
});

test('unknown FAQ locales fall back to the bundled English content', () => {
  assert.deepEqual(getLocalizedFaq('unknown-locale'), getLocalizedFaq('en'));
});

test('standalone FAQ renders the selected locale', () => {
  assert.match(faqSource, /getLocalizedFaq\(language\)/);
  assert.match(faqSource, /usePageMeta\(localizedFaq\.pageTitle,\s*localizedFaq\.description\)/);
  assert.match(faqSource, /<FaqAccordion items=\{localizedFaq\.items\} \/>/);
  assert.match(faqSource, /aria-label=\{localizedFaq\.sectionLabel\}/);
  assert.match(faqSource, /<p className="text-sm text-slate-600"><Link/);
  assert.doesNotMatch(faqSource, /localizedFaq\.toolsLabel\}:/);
});

test('wrapped All tools navigation label is left aligned', () => {
  const allToolsRule = styles.match(/\.site-left-all-tools\s*\{([^}]*)\}/)?.[1];
  assert.ok(allToolsRule, 'The All tools navigation rule must exist');
  assert.match(allToolsRule, /text-align:\s*left/);
});
