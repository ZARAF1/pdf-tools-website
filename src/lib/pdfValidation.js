import { PDFDocument } from 'pdf-lib';
import { PDF_ENCRYPTION_RESTRICTION_MESSAGE } from './pdfEncryptionMessage.mjs';

export const PASSWORD_PROTECTED_PDF_MESSAGE = PDF_ENCRYPTION_RESTRICTION_MESSAGE;

export const validateUnencryptedPdf = async (file) => {
  try {
    const pdf = await PDFDocument.load(await file.arrayBuffer(), { updateMetadata: false });
    if (pdf.isEncrypted) throw new Error(PASSWORD_PROTECTED_PDF_MESSAGE);
    return pdf;
  } catch (error) {
    if (error?.message?.toLowerCase().includes('is encrypted')) {
      throw new Error(PASSWORD_PROTECTED_PDF_MESSAGE);
    }
    throw error;
  }
};
