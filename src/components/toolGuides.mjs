import { FileType } from 'lucide-react';

export const TOOL_GUIDES = {
  merge: {
    what: 'Merge whole PDFs or select particular pages from several documents and combine them into one ordered file. This is useful when separate records, forms, or report sections need to become a single document for review or distribution.',
    how: 'Add the PDFs, preview their pages, choose which pages to keep, and arrange the final sequence. The browser reads the selected files and writes a new PDF; the source files remain unchanged. PDFs carrying encryption or security restrictions are rejected, even if they open without a password.',
    result: 'The result is a separate PDF in the order you selected, with optional source bookmarks and blank separator pages. Review the merged pages and check any forms, signatures, bookmarks, or other specialized features before sharing because rewriting a PDF can affect them.',
    applications: 'Combine monthly statements for an accountant, assemble signed forms with supporting evidence, or place a cover sheet and appendices in the right order for a submission.'
  },
  split: {
    what: 'Split a PDF by selecting pages for one new document, exporting each page separately, or dividing the document into balanced sections. These choices cover both selective extraction and breaking a large document into smaller deliverables.',
    how: 'Load the PDF, inspect page thumbnails, then choose a split mode and set the page selection or number of sections. The tool creates the requested files in the browser and packages multiple outputs together when needed.',
    result: 'Depending on the chosen mode, you receive one PDF, multiple page PDFs, or balanced section PDFs in a ZIP file. Check the page ranges and filenames before distributing the outputs; the original PDF is not changed.',
    applications: 'Extract a contract exhibit, send individual application pages to different reviewers, or divide a long report into smaller parts that are easier to email and handle.'
  },
  rotate: {
    what: 'Correct the viewing orientation of every page or only the pages that you select. Rotation changes how pages are displayed without needing to turn their content into images.',
    how: 'Choose a PDF, set the rotation direction and scope, and apply it to all pages or selected pages and ranges. The tool writes a new document in the browser while leaving the source file unchanged.',
    result: 'You get a separate PDF with the selected pages rotated. Inspect mixed-orientation documents after processing and review signatures or specialized features, which may be affected when a PDF is rewritten.',
    applications: 'Fix sideways scans before reading, make landscape charts display correctly in a portrait report, or prepare selected pages for consistent printing.'
  },
  protect: {
    what: 'Add an opening password to a PDF so supported viewers ask for that password before displaying the document. This adds a barrier to opening the file; it does not replace careful sharing or storage practices.',
    how: 'Select a PDF, enter and confirm the password, then create the protected copy in the browser. Choose a password you can share securely with intended recipients because this tool cannot recover it later.',
    result: 'The output is a separately encrypted PDF that requires the chosen opening password in compatible viewers. Test the password with a recipient-style viewer and retain the original securely in case the password is lost.',
    applications: 'Protect a private draft before sending it through a channel where the password can be shared separately, or restrict casual access to a document stored on a shared device.'
  },
  unlock: {
    what: 'Remove supported PDF opening encryption when you already know the correct password. It is intended for authorized access to a document, not for guessing, bypassing, or recovering an unknown password.',
    how: 'Choose the encrypted PDF, enter its correct password, and let the browser create a decrypted copy if the encryption format is supported. The original remains unchanged and is not submitted to an external conversion service.',
    result: 'A separate PDF that no longer asks for the supplied opening password, when processing succeeds. Confirm you have permission to remove the protection and review the resulting document before sharing it.',
    applications: 'Prepare your own password-protected report for a workflow that cannot open encrypted files, or remove a password from a document you are authorized to manage.'
  },
  'image-pdf': {
    what: 'Create a PDF from up to 10 JPEG, PNG, or BMP images, or export the pages of a 1–50 page PDF as PNG, JPG, or BMP images. Each direction keeps the original files unchanged.',
    how: 'Choose a direction in the shared workspace. For images to PDF, arrange and rotate the images and set page layout and resizing options. For PDF to images, set the format, quality, output name, and optional blank-margin trimming.',
    result: 'Images-to-PDF creates an image-based PDF with one image per page. PDF-to-images downloads one image for a single-page file or a ZIP for multiple pages; exported images do not retain selectable text, links, or PDF form behavior.',
    applications: 'Assemble receipts or scanned forms into a PDF, create a simple printable image catalog, or export PDF pages as visual previews for a presentation or review.'
  },
  word: {
    what: 'Convert selectable PDF text into an editable Word document, and render supported DOCX documents into image-based PDFs. The two directions serve different needs: editing text versus preserving page appearance.',
    how: 'Choose the conversion direction, load a supported file, and let the browser extract text or render document pages. OCR uses English for scanned pages without readable text; DOCX-to-PDF output is image-based and may depend on available browser resources.',
    result: 'PDF-to-Word produces editable text with reconstructed layout that may need cleanup; scanned-page OCR can miss or misread content. DOCX-to-PDF produces image pages, so its text is not searchable or selectable. Review the output carefully.',
    applications: 'Reuse text from a text-based PDF in a Word draft, make a scanned document editable with OCR as a starting point, or produce a fixed visual copy of a DOCX for sharing.'
  },
  powerpoint: {
    what: 'Convert selected PDF pages into PowerPoint slides or selected PPTX slides into a PDF. Both directions render pages or slides as images to prioritize their visible appearance over editable text.',
    how: 'Select the direction, file, page or slide ranges, output name, and available image and page-size options. Rendering runs in the browser; PowerPoint rendering may request substitute font assets using font-family names, not the presentation file or slide content.',
    result: 'You receive an image-based PPTX or PDF. Text cannot be edited or searched in the exported images, and font substitutions or large documents may affect the result. Inspect the output on the intended device before presenting or distributing it.',
    applications: 'Place selected report pages into a visual slide deck, create a PDF handout from selected slides, or share a static visual preview when editable slide content is not required.'
  },
  markdown: {
    what: 'Extract selectable PDF text into editable Markdown, or create a text-based PDF from Markdown content. It moves text between formats rather than reproducing the exact visual design of the source PDF.',
    how: 'Choose the conversion direction, select PDF pages or enter Markdown, then set the available page size, orientation, and text-size options. The browser extracts the PDF text layer or lays out supported Markdown blocks as PDF text.',
    result: 'PDF-to-Markdown provides text that can be edited in a Markdown editor; Markdown-to-PDF produces selectable text on new pages. Scanned pages need OCR first, and images, exact typography, complex tables, and original page layout are not preserved.',
    applications: 'Reuse a report’s selectable text in documentation, prepare notes for a Markdown-based knowledge base, or turn a concise Markdown draft into a printable text PDF.'
  },
  compress: {
    what: 'Try structural optimization or higher compression to reduce a PDF’s file size. Structural optimization preserves page content where possible, while higher compression rasterizes pages and trades fidelity for smaller image data.',
    how: 'Choose the compression level and process the PDF in the browser. The higher-compression option can lower image quality and remove searchable or selectable text; the tool checks the output size and does not offer a result that is larger than the source.',
    result: 'When the output is smaller, you can review and download a separate PDF; if processing does not reduce its size, the tool reports that instead. Always inspect important text and images, and keep the original until quality is acceptable.',
    applications: 'Try structural optimization for routine sharing, or compare the higher-compression output when a size limit matters more than perfect image and text fidelity, such as a low-priority visual reference.'
  },
  edit: {
    what: 'Add text, images, drawings, highlights, and shapes over PDF pages, and remove pages from a copy. Existing PDF text is not replaced or reflowed; new marks are overlays.',
    how: 'Select a page and an editing tool, position and adjust marks in the preview, and use the available undo, redo, or delete controls. Save a separate edited PDF in the browser when the changes are ready.',
    result: 'You receive a new PDF with the added overlays and selected page removals. Check glyphs, placements, and document features after saving; overlays are not a substitute for editing underlying text or securely redacting information.',
    applications: 'Annotate a draft for review, highlight passages for discussion, add a label or image to a page, or remove unneeded pages before sending a copy.'
  },
  watermark: {
    what: 'Place text watermarks and optional page numbers on all pages or a selected range. Watermarks are visible additions to the PDF page, not access controls or proof of ownership.',
    how: 'Choose the text, placement, appearance, and pages to mark, preview the result, and generate a new PDF in the browser. Keep the original unchanged so you can revise or remove the marks later.',
    result: 'The separate output contains the requested text overlays and page numbering. Review readability and placement across different page sizes, and remember that a visible watermark can be cropped or covered by later editing.',
    applications: 'Label a draft as “Review,” add a distribution note to a copy, or number pages in a document that lacks consistent page numbering.'
  },
  remove: {
    what: 'Choose pages to omit from a PDF and create a shorter document. At least one page must remain, so this tool is for removing unwanted pages rather than producing an empty file.',
    how: 'Load the document, enter page numbers and ranges such as 1-3, 5 or select thumbnails; both selection methods stay synchronized. Review the pages to remove, choose an output filename, and click Remove Selected Pages. Once the PDF is verified, use Download PDF on the result card to save it; the source document is not modified.',
    result: 'A separate PDF contains the pages that were not selected for removal and is offered on a result card with a Download PDF button. Verify the remaining page count and sequence, especially for documents where references or page numbering depend on removed material.',
    applications: 'Remove duplicate scans, omit blank pages from a packet, or prepare a shorter sharing copy that excludes irrelevant sections.'
  },
  ocr: {
    what: 'Recognize printed English text on scanned PDF pages and add a text layer so the recognized content can be searched and selected. OCR is a recognition aid, not a guarantee of an accurate transcript.',
    how: 'Select the PDF and pages to recognize, then run OCR in the browser using the bundled English language data. Clear, upright printed pages generally work better than low-resolution, skewed, handwritten, or damaged scans.',
    result: 'The output is a PDF with recognized text layered over the page images. Inspect extracted words and search results for errors or omissions; handwriting and languages other than English are not supported by this OCR workflow.',
    applications: 'Make a scanned English handout searchable, locate terms in archived paper records, or add a text layer to scans before using PDF text extraction.'
  },
  crop: {
    what: 'Change the visible page boundaries to trim margins or focus on a selected region, without rasterizing page content. Cropping changes what is displayed, not what is permanently removed.',
    how: 'Choose a page and adjust the crop boundary in its preview, then apply it to that page or use the same relative crop on all pages. The browser writes the crop rectangle to a separate PDF copy.',
    result: 'The output displays the chosen page area while content outside the boundary may remain in the file and could be revealed by changing the page box. Do not use cropping to conceal sensitive information; use genuine redaction instead.',
    applications: 'Trim excess white margins around scans, make a chart more prominent in a reading copy, or standardize the visible framing of a document before printing.'
  },
  'organize-pages': {
    what: 'Reorder, rotate, crop, or remove PDF pages in one workflow. The page overview helps you check the new sequence and each page crop before creating a document copy.',
    how: 'Load a PDF, drag pages into the desired order or use each page\'s move controls, crop a page from its tile, rotate pages when needed, and remove pages you do not want. Crop selections stay with their page as you reorder or rotate it. The browser creates a separate output from those choices.',
    result: 'A new PDF reflects the selected page order, rotations, crops, and removals. Cropping changes the visible page boundary but does not permanently remove content outside it. Review the full sequence and check signatures, bookmarks, forms, and other features after the document is rewritten.',
    applications: 'Move a signed form to the front of a packet, crop a page to focus on its content, group related pages together, correct a sideways scan, or remove a page while arranging a final submission.'
  },
  redact: {
    what: 'Permanently cover selected areas of a PDF page to remove sensitive visual content from the generated copy. This is different from drawing a movable black shape over text.',
    how: 'Mark the regions to redact, review the page previews, and apply redaction to create a new output. The tool rasterizes pages as part of the process so the original selectable text beneath the marks is not retained in the output.',
    result: 'The result is a rasterized PDF with the marked regions covered. Text and vector sharpness may be lost, and pages may be larger; inspect the saved file and verify that the sensitive information is no longer visible or selectable before sharing.',
    applications: 'Remove visible account details from a copy of a statement, cover personal identifiers on a form before distribution, or prepare a review copy with private regions withheld.'
  },
  sign: {
    what: 'Add a visible typed, drawn, or image signature to selected PDF pages. It adds page content but does not authenticate a signer or apply a certificate-based digital signature.',
    how: 'Choose a signature method, set its appearance and placement, select the pages to mark, and create a separate PDF in the browser. Review the preview to ensure the mark is positioned as intended.',
    result: 'You get a PDF copy containing a visible signature mark. This does not establish identity, document integrity, or legal validity; confirm that this type of signature meets the recipient’s requirements.',
    applications: 'Place a handwritten-style mark on a personal form, add a signature image to a draft, or prepare a visual approval copy when a cryptographic signature is not required.'
  },
  excel: {
    what: 'The Excel-to-PDF page explains the intended conversion but does not currently provide a working spreadsheet conversion. It deliberately does not accept workbook files or create a renamed or misleading output.',
    how: 'No workbook is processed on this page. For a real export, open the workbook in a spreadsheet application and use its built-in PDF export, which can account for print areas, page breaks, formulas, and worksheet layout.',
    result: 'This site does not generate a PDF from Excel yet. Export the workbook with a trusted spreadsheet application, then inspect page breaks, scaling, and cut-off columns before sharing the resulting PDF.',
    applications: 'Use spreadsheet software’s export feature to prepare a printable budget, invoice, schedule, or worksheet. Check each sheet’s print settings because wide tables and page breaks can change how the PDF reads.'
  }
};

export const GUIDE_ONLY_TOOLS = [
  {
    id: 'excel',
    name: 'Excel to PDF',
    path: '/excel-to-pdf',
    category: 'convert',
    description: 'Excel conversion is not available in this browser-only build.',
    icon: FileType
  }
];
