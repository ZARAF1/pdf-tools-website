import { PDFDocument } from 'pdf-lib';

export const PASSWORD_PROTECTED_PDF_MESSAGE =
  'Password-protected PDFs cannot be used with this tool. Remove the password first and select the PDF again.';

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
