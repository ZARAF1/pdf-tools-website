import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PDF_ENCRYPTION_RESTRICTION_MESSAGE } from '../src/lib/pdfEncryptionMessage.mjs';

test('encrypted PDFs receive a clear restriction notice, including when no password prompt appears', () => {
  assert.equal(
    PDF_ENCRYPTION_RESTRICTION_MESSAGE,
    'This PDF uses encryption or security restrictions that this tool cannot process, even if it opens without a password. Remove the restrictions and select the PDF again.'
  );
});

test('Merge output validation uses the same encrypted-PDF notice as file selection', async () => {
  const source = await readFile(new URL('../src/lib/pdfMergeOutput.mjs', import.meta.url), 'utf8');
  const validationSource = await readFile(new URL('../src/lib/pdfValidation.js', import.meta.url), 'utf8');
  assert.match(validationSource, /import \{ PDF_ENCRYPTION_RESTRICTION_MESSAGE \} from '\.\/pdfEncryptionMessage\.mjs';/);
  assert.match(validationSource, /export const PASSWORD_PROTECTED_PDF_MESSAGE = PDF_ENCRYPTION_RESTRICTION_MESSAGE;/);
  assert.match(source, /import \{ PDF_ENCRYPTION_RESTRICTION_MESSAGE \} from '\.\/pdfEncryptionMessage\.mjs';/);
  assert.match(source, /throw new Error\(PDF_ENCRYPTION_RESTRICTION_MESSAGE\)/);
});
