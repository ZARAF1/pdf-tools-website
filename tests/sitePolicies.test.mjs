import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import {
  getMessage,
  SUPPORTED_LANGUAGES
} from '../src/i18n/languageCatalog.mjs';

const app = await readFile(
  fileURLToPath(new URL('../src/App.jsx', import.meta.url)),
  'utf8'
);
const footer = await readFile(
  fileURLToPath(new URL('../src/components/Footer.jsx', import.meta.url)),
  'utf8'
);
const pages = await readFile(
  fileURLToPath(new URL('../src/components/SitePages.jsx', import.meta.url)),
  'utf8'
);

test('security and cookie policies have routes and translated footer links', () => {
  assert.match(app, /<Route path="\/security" element=\{<SitePages page="security" \/>\} \/>/);
  assert.match(app, /<Route path="\/cookies" element=\{<SitePages page="cookies" \/>\} \/>/);
  assert.match(footer, /to="\/security"[^>]*>\{translate\('security'\)\}/);
  assert.match(footer, /to="\/cookies"[^>]*>\{translate\('cookiePolicy'\)\}/);

  for (const { code } of SUPPORTED_LANGUAGES) {
    assert.notEqual(getMessage(code, 'security'), 'security', `${code} is missing the security label`);
    assert.notEqual(getMessage(code, 'cookiePolicy'), 'cookiePolicy', `${code} is missing the cookie label`);
  }
});

test('privacy and security disclosures match the browser-first implementation', () => {
  assert.match(pages, /title: 'Privacy Policy/);
  assert.match(pages, /the app does not upload documents to an application conversion server/);
  assert.match(pages, /pdf-tools-language/);
  assert.match(pages, /title: 'Security Policy/);
  assert.match(pages, /browser extensions/);
  assert.match(pages, /absolute security guarantee/i);
  assert.match(pages, /security contact.*not configured/i);
});

test('terms and cookie policy are specific to current site behavior and disclose review needs', () => {
  assert.match(pages, /title: 'Terms of Use/);
  assert.match(pages, /documents you are authorized to process/);
  assert.match(pages, /review it with qualified counsel/);
  assert.match(pages, /title: 'Cookie Policy/);
  assert.match(pages, /localStorage/);
  assert.match(pages, /no application cookies are configured/i);
  assert.match(pages, /hosting provider.*not identified/i);
});
