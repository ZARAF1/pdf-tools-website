import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, FileText, Upload } from 'lucide-react';
import AdSlot from './AdSlot';
import RelatedToolsCarousel from './RelatedToolsCarousel';
import { TOOL_REGISTRY } from './toolRegistry';
import FaqAccordion from './FaqAccordion';
import { getLocalizedTool } from '../i18n/toolTranslations.mjs';
import { getLocalizedResourceLabels } from '../i18n/resourceLocalization.mjs';
import { getLocalizedToolPage } from '../i18n/toolPageLocalization.mjs';
import { useLanguage } from '../i18n/useLanguage';

const TOOL_CONTENT = {
  crop: {
    title: 'Crop PDF',
    description: 'Adjust the visible page boundaries in a PDF.',
    detailPoints: {
      what: `Change the visible boundaries of PDF pages without rasterizing their content.`,
      how: `Set a crop area on the current page or apply the same relative crop to every page, then preview the result.`,
      result: `A separate cropped PDF. Content outside the boundary is hidden, not erased, and may be recoverable.`
    },
    intro: 'Trim the visible area of PDF pages without rasterizing their content. Choose a PDF, navigate to a page, then drag the crop area or resize it with its corner and edge handles. The selection stays aligned as the preview zooms or resizes. Apply a crop to the current page and keep earlier page-specific crops in the same output, or apply the same relative selection to every page; the all-pages option replaces earlier per-page settings. Different page sizes and rotations are mapped to their own page coordinates. Apply the crop to create and validate a separate PDF copy, then preview and download it. The original file is not changed, and the document is processed in your browser. This tool changes the PDF page CropBox; it does not erase content outside the box. Hidden material may be recovered by changing the page boundary, so use genuine redaction for sensitive content. Rewriting may also invalidate existing digital signatures.',
    mechanism: 'PDF.js renders each page and converts the normalized preview selection back to PDF page coordinates, accounting for page scaling and rotation. pdf-lib applies that rectangle to each selected page CropBox and saves a separate output. The content is not rasterized or permanently removed; content outside the new visible boundary may remain recoverable. Processing occurs in the browser.',
    steps: ['Choose a PDF and wait for its pages to load.', 'Navigate to a page and drag the crop boundary or use its handles to position and resize it.', 'Choose Current page only or All pages; the all-pages option applies the same relative selection to each page.', 'Select Apply crop and review the resulting cropped preview and validation message.', 'Select Download cropped PDF to save the separate copy.'],
    faqs: [
      ['Does cropping permanently delete what is outside the selection?', 'No. The tool changes the page CropBox, which hides content outside the visible boundary but does not erase it. Someone may recover it by changing the page box. Use a genuine redaction tool for sensitive information.'],
      ['Can I crop only one page?', 'Yes. Choose Current page only. Crops applied on other pages remain included in the output. The All pages option applies the same relative crop area to each page, scaled to its dimensions and orientation, and replaces those individual settings.'],
      ['Will cropping make the PDF blurry or remove searchable text?', 'The tool changes PDF page boundaries rather than converting pages to images, so it does not intentionally rasterize page content.'],
      ['Will existing digital signatures remain valid?', 'Rewriting a PDF can invalidate its existing digital signatures. Check signed documents and specialized PDF features after cropping.'],
      ['Does the tool upload my PDF?', 'No. The PDF is read, previewed, and modified in your browser; it is not sent to an external processing service. Ordinary website requests and hosting logs are separate.']
    ]
  },
  edit: {
    title: 'Edit PDF',
    description: 'Add text, images, drawings, highlights, and shapes to a PDF copy.',
    detailPoints: {
      what: `Add text, images, drawings, highlights, or shapes, and remove pages from a PDF.`,
      how: `Place and adjust marks over the page preview, then save the edited copy in your browser.`,
      result: `A separate PDF with the new overlays. Existing text is not replaced, and some specialized features may change.`
    },
    intro: 'Place new text or image content on a PDF page, draw freehand marks, add highlights or outlines, and remove pages you no longer need. Choose a page, select an editing tool, and position your marks in the preview; you can move or delete marks, undo or redo edits, and review the result before saving. This editor adds content over the page—it does not select, replace, or reflow existing PDF text. The original file stays unchanged, and the edited copy is generated in your browser. Added text uses a built-in font with Latin and Western European character coverage; unsupported characters are reported rather than silently substituted. Rewriting may affect signatures, forms, annotations, bookmarks, metadata, accessibility tags, or specialized PDF features. Open and inspect the saved copy before sharing it.',
    mechanism: 'PDF.js renders the page preview and maps edits to PDF coordinates. pdf-lib adds text, images, vector marks, and page removals to a separate copy in the browser. No document upload or external PDF-processing service is used.',
    steps: ['Choose a PDF and wait for its pages to load.', 'Select a tool, set its options, then click or drag on the page to add a mark.', 'Select marks to move or delete them; use Undo and Redo to revise edits.', 'Remove pages if needed, then select Save PDF and download the validated copy.', 'Open the downloaded PDF and review its pages and marks before sharing.'],
    faqs: [
      ['Can I change or replace text already in the PDF?', 'No. The editor adds new content over the page; it does not edit, remove, or reflow existing text.'],
      ['Which editing tools are available?', 'You can add text or PNG/JPEG images, draw freehand, place highlights, draw rectangle outlines and lines, move or delete marks, and remove pages.'],
      ['Will the original PDF be changed?', 'No. The editor works from the selected file and creates a separate edited copy when you save.'],
      ['Can I edit a password-protected PDF?', 'No. Encrypted PDFs are rejected.'],
      ['Will every PDF feature be preserved?', 'Not necessarily. Rewriting may affect digital signatures, forms, annotations, bookmarks, metadata, accessibility tags, or specialized features. Review the exported file carefully.'],
      ['Does this tool upload my document?', 'The document preview and edits are processed in this browser; the PDF is not sent to an external processing server. Ordinary website requests and hosting logs are separate.']
    ]
  },
  merge: {
    title: 'Merge PDF',
    description: 'Combine PDFs, select individual pages, and preview their final order.',
    detailPoints: {
      what: `Combine complete PDFs or selected pages from multiple files into one document.`,
      how: `Preview, select, and arrange pages, then merge them in your browser.`,
      result: `A separate PDF in your chosen order, with optional source bookmarks and blank separator pages.`
    },
    intro: 'Bring up to five related PDFs together in a new document. Keep the simple Merge all pages mode to combine whole files in their listed order, or switch to Select pages to choose individual pages from each source. In selective mode, each page you choose is added to a live output preview in that exact order; you can inspect larger thumbnails, remove pages, and reorder the sequence before creating the PDF. Set a custom output filename, add source-file bookmarks, preserve each original page size, or proportionally fit pages to A4 or US Letter. Fitting re-embeds the visible page content and may not retain interactive features such as forms or annotations, so preserve original page sizes when those matter. You can also insert blank pages whenever the output moves between source files. The original PDFs remain unchanged. Page previews and merging happen in your browser; no file is sent to an external processing server.',
    mechanism: 'PDF.js renders source-page previews locally. pdf-lib copies the chosen pages in their displayed output order, optionally adds source bookmarks and blank separator pages, and can re-embed and scale each page proportionally onto A4 or US Letter. Fitting may not retain interactive PDF features such as forms or annotations. The generated document is a separate browser-side PDF.',
    steps: ['Choose two or more PDFs (up to five).', 'Keep Merge all pages to combine complete documents in file order, or choose Select pages.', 'In Select pages, click thumbnails in the order you want them to appear; inspect larger previews and reorder or remove pages in the live output.', 'Choose an output filename and optional bookmarks, page sizing, or blank separators.', 'Select Merge PDFs, then review and download the completed document.'],
    faqs: [
      ['How many PDFs can I merge?', 'You can merge up to five PDF files at a time, and at least two files are required.'],
      ['Will the original files change?', 'No. The merger creates a separate output document; it does not overwrite the selected files.'],
      ['Can I choose and arrange individual pages?', 'Yes. Switch to Select pages, then click source thumbnails. Each newly selected page is appended to the live output in click order. Drag the output thumbnails or use the move controls to change the order; click a selected source page again to remove it.'],
      ['What does the live output preview show?', 'It shows the selected page thumbnails and their order, including where optional blank separator pages will be inserted. It is a sequence preview, not a combined-page canvas.'],
      ['What happens when I fit pages to A4 or US Letter?', 'Each page is centered and scaled proportionally to fit the chosen paper dimensions. Its aspect ratio is preserved; content is not intentionally stretched or cropped, and unused margins may remain. Re-embedding may not retain interactive features such as forms or annotations, so use Preserve original page sizes when those features matter.'],
      ['How do source bookmarks work?', 'When enabled, the output gets a bookmark for each source PDF that points to the first page from that file in the final sequence.'],
      ['When are blank pages inserted?', 'When enabled, a blank page is inserted between adjacent source files. In Select pages mode, this means whenever consecutive output pages switch from one source PDF to another.'],
      ['Can I set the output filename?', 'Yes. Enter a filename in Merge options; the tool adds the .pdf extension if it is missing.']
    ]
  },
  split: {
    title: 'Split / Extract PDF',
    description: 'Extract selected pages into one PDF, split every page, or divide pages into balanced sections.',
    detailPoints: {
      what: `Extract selected pages, create one PDF per page, or divide a document into balanced sections.`,
      how: `Choose pages visually or by range, or use the percentage slider to set 2–10 consecutive sections.`,
      result: `A selected-page PDF, individual PDFs, or a ZIP for larger split sets; the original stays unchanged.`
    },
    intro: 'Use one workspace to extract selected pages, split every page, or divide a PDF into balanced sections. Choose a PDF and review its visual page previews. In Extract selected pages mode, click thumbnails or enter page numbers and ranges such as 1-3, 5; the chosen pages are combined in document order into one PDF. Split every page creates one single-page PDF for each page. Split by percentage uses a slider to divide pages into 2–10 consecutive sections. Since pages cannot be divided, section percentages may differ slightly when the page count does not divide evenly. Part labels show each section boundary in the previews. When either split mode creates more than three PDFs, they are packaged into one ZIP; three or fewer are offered individually. Your original stays unchanged, and PDF handling and ZIP creation occur in your browser.',
    mechanism: 'PDF.js renders a navigable set of page previews. pdf-lib copies selected pages or creates each split section as a separate PDF; the browser ZIP writer packages more than three split outputs locally. The source file is not overwritten.',
    steps: ['Choose one PDF.', 'Select Extract selected pages, Split every page, or Split by percentage.', 'Use page thumbnails or page ranges to choose extraction pages, or adjust the number-of-parts slider.', 'Review the page previews and section labels.', 'Create the output and download the PDF file or ZIP.'],
    faqs: [
      ['How does extraction work?', 'Click the page thumbnails or enter page numbers/ranges. Selected pages are combined into one PDF in their original document order.'],
      ['How does percentage splitting work?', 'Choose 2–10 parts with the slider. Pages are grouped into consecutive sections as evenly as possible, and the previews label each part. Because pages are indivisible, the exact percentages can vary slightly.'],
      ['What happens when I split every page?', 'Each page becomes its own PDF. More than three outputs are packaged into one ZIP; three or fewer are offered as individual PDFs.'],
      ['Can I split by percentages of file size?', 'The percentage slider divides the page count, not the PDF’s byte size. Page content and file sizes can vary.'],
      ['Is my original PDF changed?', 'No. The tool creates new PDF output files in your browser and leaves the selected original unchanged.']
    ]
  },
  rotate: {
    title: 'Rotate PDF',
    description: 'Rotate every page or selected pages in a PDF.',
    detailPoints: {
      what: `Correct sideways or upside-down pages by rotating the whole document or selected pages.`,
      how: `Choose a clockwise angle and optionally specify page numbers or ranges.`,
      result: `A separate PDF with updated page rotation; page content is not flattened into images.`
    },
    intro: 'Correct pages that appear sideways or upside down without changing the text or images into flat pictures. Select a PDF and choose a clockwise rotation of 90, 180, or 270 degrees. You can apply the chosen direction to the entire document or limit it to page numbers and ranges, using page 1 for the first page. Check the selection before starting, especially when only a few pages need adjustment. The tool saves a rotated copy and keeps the original file untouched. Once the new PDF is ready, download it and open it in your usual viewer to confirm the orientation looks right. Your document is processed in your browser and is not sent to an external conversion server.',
    mechanism: 'The browser reads and saves the document with pdf-lib, updating the selected PDF pages’ rotation metadata. It does not rasterize the pages.',
    steps: ['Choose a PDF.', 'Choose 90°, 180°, or 270°; select pages if needed.', 'Select Rotate & Download and save the new PDF.'],
    faqs: [
      ['Which rotation angles are available?', 'The current interface offers 90°, 180°, and 270° clockwise rotations, plus a reset option.'],
      ['Can I rotate only some pages?', 'Yes. Select Selected Pages and enter page numbers or ranges.'],
      ['Does rotation change the page contents?', 'It changes page orientation metadata rather than recreating the page as an image.']
    ]
  },
  protect: {
    title: 'Protect PDF',
    description: 'Create a password-protected copy of a PDF.',
    detailPoints: {
      what: `Add an opening password to a new PDF copy.`,
      how: `Enter and confirm a password, with an optional separate owner password for supported permissions.`,
      result: `An encrypted PDF copy. Keep the password safe; it cannot be recovered by this tool.`
    },
    intro: 'Create a password-protected copy of a PDF for sharing when you want readers to enter a password before opening it. Choose an unprotected PDF, enter an opening password of at least four characters, and confirm it carefully. You may also set a separate owner password for supported document permissions. Keep the password somewhere safe: this tool cannot recover it if it is lost. The protected result is a new file, and the original remains unchanged. Download the encrypted copy and test it in a PDF reader before sharing. Password restrictions are not a replacement for secure access control, and different readers may handle permissions differently. Files are processed in your browser; the PDF is not sent to an external server.',
    mechanism: 'The browser rewrites the PDF with pdf-lib and encrypts the resulting bytes with the installed AES-256 PDF encryption package. The file is handled in the browser; this tool does not upload it.',
    steps: ['Choose one PDF.', 'Enter a password of at least four characters and confirm it.', 'Optionally enter a separate owner password.', 'Select Protect PDF and save the generated encrypted copy.'],
    faqs: [
      ['What does the opening password do?', 'It is required by compatible PDF readers to open the protected output. Keep it somewhere safe; the tool cannot recover it.'],
      ['Can I protect an already password-protected PDF?', 'This tool rejects PDFs it detects as encrypted. Use Unlock PDF with the correct password you are authorized to use, then select the unlocked copy here.'],
      ['Are permission settings unbreakable?', 'No. PDF permission restrictions are honored differently by readers and should not be treated as a substitute for access control.']
    ]
  },
  unlock: {
    title: 'Unlock PDF',
    description: 'Remove PDF opening encryption when you know the correct password.',
    detailPoints: {
      what: `Remove supported opening-password encryption when you know the correct password.`,
      how: `Enter the password you are authorized to use; the tool checks the output and page count.`,
      result: `A separate unlocked PDF. Password guessing and recovery are not supported.`
    },
    intro: 'Remove opening-password encryption from a PDF copy when you know a valid user or owner password and are authorized to use it. Choose the encrypted PDF, enter the password, and let the browser create a separate unlocked copy; the original file is not changed. The tool verifies that the output can be opened without a password and that its page count matches the source. It never guesses, cracks, or recovers passwords. Supported encryption is AES-256 R6 and legacy RC4 R2/R3; AES-128 R4 and other encryption types are not supported. The PDF is rewritten during decryption, so review the downloaded copy carefully, especially if it contains digital signatures, forms, annotations, attachments, or specialized PDF features. The document and password are processed in your browser and are not sent to an external processing server.',
    mechanism: 'The browser uses @pdfsmaller/pdf-decrypt and Web Crypto to decrypt supported PDF objects, then validates the resulting unencrypted document with pdf-lib. It confirms the output page count matches the encrypted source. No PDF or password is uploaded.',
    steps: ['Choose one password-protected PDF that uses a supported encryption type.', 'Enter the correct password you are authorized to use.', 'Select Unlock PDF and wait for the output checks to finish.', 'Review and download the separate unlocked PDF.'],
    faqs: [
      ['Can this tool recover or guess a lost password?', 'No. You must enter a correct password. Password guessing and recovery are not supported.'],
      ['Which encryption types can it unlock?', 'AES-256 R6 and legacy RC4 R2/R3 are supported. AES-128 R4 and other encryption types are not supported.'],
      ['Will all PDF features be preserved?', 'The document is rewritten to remove encryption. The tool checks that the output opens without a password and retains the page count, but you should review forms, signatures, annotations, attachments, and specialized features in your downloaded copy.']
    ]
  },
  'image-pdf': {
    title: 'Images ↔ PDF',
    description: 'Create PDFs from images or export PDF pages as PNG, JPG, or BMP images.',
    detailPoints: {
      what: `Create a multi-page PDF from up to 10 JPEG, PNG, or BMP images, or export up to 50 PDF pages as images.`,
      how: `Choose a direction, arrange images and adjust page layout, or select an image format and optional blank-margin trimming.`,
      result: `A PDF, a single image, or a ZIP of page images, generated in your browser without changing the source files.`
    },
    intro: 'Choose Images to PDF to turn up to 10 JPEG, PNG, or BMP files into a PDF with one image per page. Reorder and rotate images, then set page size, custom dimensions, orientation, background, fit, margins, alignment, resizing, and JPEG quality. Contain keeps the whole image visible; Fill may crop it, and the page color shows through transparent PNG and BMP areas. Choose PDF to Images to export a PDF with 1–50 pages as PNG, JPG, or BMP. Set image quality, output name, and optional automatic trimming of near-white page margins. A single page downloads as an image; multiple pages are packaged in a ZIP. Both directions run in your browser, create separate outputs, and leave the source files unchanged.',
    mechanism: 'For Images to PDF, the browser decodes each image, applies rotation and resize settings, then embeds image data into a PDF with pdf-lib. For PDF to Images, PDF.js renders pages sequentially, optionally detects and trims near-white margins, and encodes the pages in the selected image format. A single-page export is one image; multiple pages are packaged into a ZIP. No selected files are sent to an external conversion server.',
    steps: ['Choose Images to PDF or PDF to Images.', 'Add up to 10 JPEG, PNG, or BMP images, or one unencrypted PDF with 1–50 pages.', 'Adjust the available image, page, quality, output-name, and margin options.', 'Create the output and review it.', 'Download the PDF, image, or ZIP file.'],
    faqs: [
      ['Which directions can I use?', 'Create a PDF from images or export PDF pages as images. Use the direction buttons above the workspace to switch between the two workflows.'],
      ['Which image files can I turn into a PDF?', 'JPEG, PNG, and BMP are supported, up to 10 images. WebP is not supported. You can reorder and rotate images, and configure page size, orientation, fit, alignment, background, and resizing.'],
      ['Which formats can I export PDF pages to?', 'Choose PNG, JPG, or BMP. PNG is lossless, JPG quality is adjustable, and BMP is uncompressed and may create large files.'],
      ['How many PDF pages can I export?', 'The PDF-to-images direction accepts one unencrypted PDF with 1–50 pages. A single page downloads as an image; multiple pages are packaged in a ZIP.'],
      ['What does automatic margin trimming do?', 'It trims near-white blank margins around visible page content and keeps a small border. Pages without visible content are left unchanged.'],
      ['Does converting PDF pages keep searchable text?', 'No. Exported pages are images, so text, links, and PDF form behavior are not retained. The original PDF is not changed.'],
      ['Are my images or PDF uploaded?', 'No. Both conversion directions process files in your browser and do not send them to an external conversion server.']
    ]
  },
  word: {
    title: 'PDF ↔ Word',
    description: 'Convert PDF text to Word or render Word documents as PDFs.',
    detailPoints: {
      what: `Convert selectable PDF text into an editable DOCX, or render a DOCX as a PDF.`,
      how: `Choose a direction; PDF-to-Word can use English OCR, while Word-to-PDF renders pages as images.`,
      result: `A DOCX or image-based PDF. Layout reconstruction is approximate, and PDF output text is not searchable.`
    },
    intro: 'Convert between PDF and Word in one browser workspace. To create an editable Word document, select a PDF; pages with selectable text are reconstructed as DOCX text, and scanned pages can use English OCR. For the reverse direction, select a DOCX file to render its pages and create a PDF. Word-to-PDF output is image-based, so its text is not searchable or selectable; rendering can differ from Microsoft Word, especially for complex layouts, fonts, tables, and floating objects. Legacy .doc files are not supported. PDF-to-Word layout is also approximate, and OCR accuracy depends on scan quality. Your files are processed in this browser and are not uploaded to a conversion server. Review either output before relying on it; the original file stays unchanged.',
    mechanism: 'For PDF-to-Word, PDF.js extracts text and page positions; Tesseract.js performs English OCR on pages without readable text using locally bundled worker, core, and language assets; docx creates the DOCX output. For Word-to-PDF, docx-preview renders DOCX pages to browser HTML, html2canvas captures each page as an image, and pdf-lib creates a PDF containing those images. The reverse output is image-based and has no selectable text.',
    steps: ['Choose PDF → Word or Word → PDF.', 'Select one PDF or one supported DOCX file.', 'Start conversion and review progress; scanned PDFs may require English OCR.', 'Download and inspect the output. Word-to-PDF pages are images, so text cannot be searched or selected.'],
    faqs: [
      ['Can I convert both ways?', 'Yes. Choose PDF → Word to create an editable DOCX, or Word → PDF to create a PDF from a DOCX file.'],
      ['Will Word-to-PDF text be searchable?', 'No. DOCX pages are rendered as images in the PDF, so the resulting text is not searchable or selectable.'],
      ['Which Word files are supported?', 'The reverse converter accepts .docx files only. Legacy .doc files are not supported.'],
      ['Does conversion preserve the exact layout?', 'Not guaranteed. The DOCX renderer and browser can differ from Microsoft Word; complex layouts, fonts, tables, and floating objects may change. PDF-to-Word reconstruction is also approximate.'],
      ['Can scanned PDFs be converted to Word?', 'The tool attempts English OCR for pages without readable text. Recognition quality depends on scan clarity and OCR resources being available.'],
      ['Are my files uploaded?', 'Both directions run in this browser. OCR support resources for scanned PDF pages are bundled with the site; ordinary website requests and hosting logs are separate.'],
    ]
  },
  ocr: {
    title: 'OCR PDF',
    description: 'Recognize text in scanned PDF pages and add a searchable text layer.',
    detailPoints: {
      what: `Make scanned PDF pages searchable while retaining their original page appearance.`,
      how: `Keep existing text and apply English OCR to pages without a usable text layer.`,
      result: `A checked PDF with an invisible, searchable text layer; recognition quality depends on scan clarity.`
    },
    intro: 'Turn scanned, image-only pages into a PDF you can search and select text in, while retaining the original page appearance. Choose a PDF with up to 50 pages. The tool reads the text already present on each page and invokes OCR only for pages that lack a usable text layer, which helps avoid unnecessary recognition work in mixed documents. The OCR engine is currently configured for printed English; handwritten, low-resolution, skewed, or complex pages can be misread, so review important results. Recognized words are added invisibly at their detected positions, and the output is checked for its page count and searchable text before a download is offered. PDF processing and OCR run in your browser using locally bundled Tesseract assets; the PDF itself is not uploaded.',
    mechanism: 'PDF.js checks existing page text and renders pages without usable text. Tesseract.js recognizes English text in the browser using OCR worker, core, and English language assets bundled with this website; pdf-lib adds an invisible text layer to the original pages, preserving their page artwork. The output is reopened and checked for page count and searchable text before download.',
    steps: ['Choose one PDF with up to 50 pages.', 'Review the first-page preview and file details.', 'Select Create searchable PDF and wait while scanned pages are rendered and recognized.', 'Download the validated PDF and use your PDF viewer’s text selection or Find feature to check the OCR result.'],
    faqs: [
      ['Will the result be searchable?', 'The tool adds invisible text at OCR word positions, then reopens the output and checks that recognized text is present before it offers a download. Verify important content with your PDF viewer’s Find or text-selection feature.'],
      ['Which languages are supported?', 'The current version runs English OCR only and does not provide a language selector. It is intended for clear printed English, not handwriting or other languages.'],
      ['What happens with mixed PDFs?', 'Pages with a usable existing text layer are retained without OCR. Pages without enough selectable text are rendered and OCR processed.'],
      ['Does OCR upload my PDF?', 'No. The PDF is read and processed in this browser. OCR uses worker, core, and English language assets bundled with the website, not third-party runtime downloads; ordinary website requests and hosting logs are separate.'],
      ['How accurate is OCR?', 'Recognition depends on image resolution, contrast, orientation, print quality, and page layout. Review the output before relying on its text.']
    ]
  },
  compress: {
    title: 'Compress PDF',
    description: 'Try standard PDF optimization or higher compression.',
    detailPoints: {
      what: `Try to reduce PDF file size with standard optimization or higher compression.`,
      how: `Standard mode rewrites the PDF; higher compression turns pages into JPEG images and may lower quality or remove selectable content.`,
      result: `A download is offered only when the processed file is smaller than the original.`
    },
    intro: 'Try to make PDF files smaller for easier storage or sharing, while checking the result before you replace or send anything. Add up to five PDFs and choose whether to use standard optimization or enable Higher compression. Standard mode aims to retain the document’s selectable text and page content. Higher compression can reduce image-heavy files more, but it turns pages into images, which can lower visual quality and remove selectable text, links, and interactive form fields. Some PDFs are already optimized, so processing may not reduce their size. The tool compares the result and offers a compressed download only when the generated file is smaller than the original. Your source PDFs stay unchanged. All compression is handled in your browser without sending your files to an external server.',
    mechanism: 'Standard mode rewrites the PDF with pdf-lib object streams. High mode renders pages with PDF.js and re-embeds compressed JPEG images. The tool measures output and keeps the original download when no smaller result is produced.',
    steps: ['Choose up to five PDFs.', 'Leave Higher compression off to preserve selectable content, or turn it on after reading its quality warning.', 'Select Compress PDFs and compare the reported sizes.', 'Download is offered only when the generated result is smaller.'],
    faqs: [
      ['Will every PDF become smaller?', 'No. Already-optimized or image-heavy PDFs may not shrink. The tool avoids offering a larger output.'],
      ['What does Higher compression change?', 'It converts each page into an image, which can reduce size but lowers image quality and removes selectable/searchable text and interactive elements.'],
      ['Are files uploaded?', 'The compression code reads and processes the files in the browser. Normal website requests and hosting logs are separate from PDF processing.']
    ]
  },
  watermark: {
    title: 'Watermark PDF',
    description: 'Add a text watermark to all pages or selected pages.',
    detailPoints: {
      what: `Add a visible text watermark to every page or selected pages.`,
      how: `Set the watermark text, size, colour, angle, and opacity, then choose the pages to mark.`,
      result: `A separate PDF with searchable vector text; the source file remains unchanged.`
    },
    intro: 'Add a visible text mark to a PDF to label a draft, identify a copy, or show another short message on the pages you choose. Select one PDF and enter the watermark text, then adjust its size, colour, angle, and opacity to suit the document. Apply it to every page or enter page numbers and ranges such as 1,3,5-7. You can also configure page numbering independently when that option is enabled. Review the settings and page selection before creating the result. The tool saves a separate watermarked PDF and leaves your original file unchanged. After processing, download the new copy and review it in a PDF viewer. Your PDF is handled in your browser and is not sent to an external watermarking server.',
    mechanism: 'The browser uses pdf-lib text drawing APIs to add searchable vector text to the selected pages and saves a separate copy. It does not rasterize pages.',
    steps: ['Choose one PDF and wait for its page count.', 'Enter watermark text and configure size, colour, rotation, and opacity.', 'Choose all pages or enter page numbers/ranges such as 1,3,5-7.', 'Select Add Watermark, then download the new PDF.'],
    faqs: [
      ['Does a watermark preserve the original document?', 'The tool creates a new file and leaves the selected source file unchanged. The output retains the original pages and their content.'],
      ['Can I watermark only certain pages?', 'Yes. Use comma-separated page numbers and inclusive ranges, counted from page 1.'],
      ['Which characters can I use?', 'The current embedded Helvetica font supports WinAnsi characters. Other glyphs are rejected with an error.'],
      ['Can I watermark a password-protected PDF?', 'No. The current tool does not accept encrypted PDFs.']
    ]
  },
  remove: {
    title: 'Remove PDF Pages',
    description: 'Select and remove pages from a PDF of up to 50 pages.',
    detailPoints: {
      what: `Remove selected pages while keeping the remaining pages together in one PDF.`,
      how: `Review page previews, select pages to omit, and remove them in one step; at least one page must remain.`,
      result: `A separate PDF in the original order, ready to download with only the pages you kept.`
    },
    intro: 'Remove unwanted pages while keeping the remaining document together as a new PDF. Choose a file with no more than 50 pages and select pages to omit by clicking previews or entering page numbers and ranges such as 1-3, 5. At least one page must remain. Choose an output filename, then click Remove Selected Pages to create and verify the remaining pages in their original order. A result card appears with a Download PDF button so you can save the output when you are ready. The original PDF is not changed, so you can start again if you remove the wrong page. Page selection and PDF creation happen in your browser; the selected file is not sent to an external server.',
    mechanism: 'PDF.js renders local page thumbnails and pdf-lib copies the unselected pages into a separate PDF. Page order is preserved and the source file is not changed.',
    steps: ['Choose a PDF with no more than 50 pages.', 'Enter page numbers or ranges, or select page thumbnails to remove; both selection methods stay synchronized.', 'Review the selection and set the output filename; at least one page must remain.', 'Click Remove Selected Pages to create the new PDF, then click Download PDF on the result card.'],
    faqs: [
      ['How many pages can I select?', 'This tool accepts PDFs with up to 50 pages and rejects larger files rather than truncating them.'],
      ['Can I remove every page?', 'No. The output must contain at least one page.'],
      ['Does this change my original PDF?', 'No. The tool creates a new file from the remaining pages.']
    ]
  },
  'organize-pages': {
    title: 'Organize PDF',
    description: 'Reorder, rotate, crop, and remove pages from a PDF.',
    detailPoints: {
      what: `Reorder, rotate, crop, or remove PDF pages.`,
      how: `Use page previews and move controls to arrange pages; crop individual pages, rotate them, or remove pages you do not need.`,
      result: `A separate PDF following the displayed order, with at least one page retained. Cropping changes visible bounds but does not permanently remove content outside them.`
    },
    intro: 'Arrange the pages of a PDF to create a cleaner, better-ordered document. Select one PDF with up to 30 pages and review its page previews. Drag the page cards or use the move controls to place pages in the order you want; rotate pages in 90-degree steps, crop individual pages from their tile, or remove pages that are not needed. A crop selection follows its page when you rotate or reorder it. At least one page must remain. Cropping changes the visible boundary only; it does not permanently remove content outside that area. The final document follows the order shown in the workspace and retains the original page content where supported. The source PDF is not changed, so you can reset or select it again if you want to start over. When the arrangement is ready, choose Organize PDF and download the separate result. Your file is processed in your browser, not sent to an external server.',
    mechanism: 'PDF.js renders page previews in your browser. pdf-lib copies the chosen pages in the displayed order and applies their rotations and CropBox boundaries to a separate output PDF without rasterizing page content. CropBox boundaries change what is visible; they do not delete content outside them.',
    steps: ['Choose a PDF and review its pages.', 'Drag pages or use the move controls to reorder them; crop pages individually, rotate or remove pages as needed.', 'Select Organize PDF and download the generated document.'],
    faqs: [
      ['Can I change the order of pages?', 'Yes. Drag page cards or use the move controls; the output follows the displayed order.'],
      ['How many pages are supported?', 'The tool accepts documents with up to 30 pages.'],
      ['Can I remove every page?', 'No. The output must contain at least one page.'],
      ['Will organizing pages rasterize the PDF?', 'No. The tool copies PDF pages with pdf-lib, preserving their vector and text content where supported by the library.']
    ]
  },
  redact: {
    title: 'Redact PDF',
    description: 'Permanently cover sensitive content in a new PDF copy.',
    detailPoints: {
      what: `Cover sensitive page content in a new PDF copy.`,
      how: `Draw opaque marks over each area to redact and review every marked page before saving.`,
      result: `A rasterized PDF with the covered content removed; selectable text and interactive features are lost.`
    },
    intro: 'Cover sensitive information in a new PDF copy before sharing it. Select a document with up to 30 pages, move to the page you want to review, and draw an opaque black box over each item to hide. Use the available undo or clear controls to correct marks before creating the output. Check every marked page carefully: redaction changes are difficult to reverse in the generated file. To prevent covered text from remaining underneath, pages are saved as images. This means the resulting PDF will not keep selectable text, sharp vector artwork, links, forms, or other interactive content. Your original PDF is left untouched. Redaction is performed in your browser, and your selected document is not sent to an external server.',
    mechanism: 'PDF.js renders every page to an image and the tool burns opaque masks into those images before creating a new PDF with pdf-lib. This removes underlying text from the output, but rasterizes all pages and removes selectable text, vectors, links, forms, and other interactive features.',
    steps: ['Choose one PDF and select the page to review.', 'Draw a black box over each item to redact; use Undo or Clear Marks to correct the page.', 'Review all marked pages, then create and download the redacted PDF.'],
    faqs: [
      ['Is the redaction permanent?', 'The original page content is not included in the output; the selected areas are replaced by opaque pixels. Always inspect the output before sharing it.'],
      ['How many pages are supported?', 'The tool accepts documents with up to 30 pages.'],
      ['Does the output keep selectable text?', 'No. To remove hidden text beneath redactions, every page is rasterized. Text search, vector quality, links, forms, and other interactive content are lost.'],
      ['Are my files uploaded?', 'The PDF is rendered and processed in the browser. Normal website requests and hosting logs are separate from PDF processing.']
    ]
  },
  sign: {
    title: 'Sign PDF',
    description: 'Add a visible typed, drawn, or image signature to selected pages.',
    detailPoints: {
      what: `Place a visible typed, drawn, or image signature on selected PDF pages.`,
      how: `Create or upload the signature, then set its position, size, and page selection.`,
      result: `A separate PDF with a visual mark, not a certificate-based digital signature.`
    },
    intro: 'Place a visible signature mark on a PDF using typed text, a drawing, or a PNG or JPEG image. Choose a document, create or upload the mark, and set its position and size. You can apply it to every page or select particular page numbers and ranges. Preview the placement and review the page selection before generating the new PDF. The source file remains unchanged, and you can download the marked copy when it is ready. This tool adds visible content only: it does not verify who signed, use a certificate, or protect the document from later edits. If you need a legally verifiable digital signature, use a certificate-based signing service. Your PDF is processed in your browser and is not uploaded to an external signing server.',
    mechanism: 'The browser adds signature text or an embedded signature image to the selected pages with pdf-lib and saves a new copy. This is a visual mark, not a cryptographic PDF signature; it does not verify identity or protect the document against later changes.',
    steps: ['Choose one PDF and create a typed, drawn, or image signature.', 'Choose the pages and placement for the visible signature.', 'Select Sign PDF and download the new document.'],
    faqs: [
      ['Is this a legally verified digital signature?', 'No. This tool adds visible content only. It does not use a certificate, authenticate the signer, or detect changes made after signing.'],
      ['Can I sign selected pages only?', 'Yes. Choose all pages or enter one-based page numbers and inclusive ranges such as 1,3,5-7.'],
      ['Does signing overwrite the original?', 'No. The tool generates a separate PDF copy.']
    ]
  },
  excel: {
    title: 'Excel to PDF',
    description: 'Excel conversion is not available in this browser-only build.',
    detailPoints: {
      what: `Excel-to-PDF conversion is not currently available on this page.`,
      how: `This page does not accept or process workbook files.`,
      result: `No PDF is generated here; export the workbook using a spreadsheet application.`
    },
    intro: 'Excel-to-PDF conversion is not available on this page yet. A useful spreadsheet export must preserve sheet layouts, cell formatting, formulas, print areas, and page breaks; this site does not currently provide that conversion capability. The page therefore does not accept or process workbook files, and it will not rename a spreadsheet or create a misleading PDF. Your original workbook remains on your device. To make a PDF now, open the workbook in a spreadsheet application you trust and use its built-in export or save-as-PDF option. Check the exported pages for cut-off columns and page breaks before sharing them. We may add a browser-based conversion in the future after a suitable solution is reviewed. No workbook is sent to this site or to a conversion service from this page.',
    mechanism: 'The installed dependencies do not provide Excel workbook rendering. No workbook is accepted, converted, uploaded, or renamed. A future implementation needs a compatible local renderer or an explicitly approved service.',
    steps: ['No conversion workflow is available yet.', 'Keep your original workbook unchanged.', 'Use a trusted spreadsheet application’s export-to-PDF feature in the meantime.'],
    faqs: [
      ['Can I upload an .xlsx or .xls file here?', 'No. This page does not accept or process spreadsheet files.'],
      ['Why is conversion unavailable?', 'A faithful conversion needs worksheet layout, cell formatting, formulas and print-pagination support that the current dependencies do not provide.'],
      ['Will the site send my workbook to another service?', 'No. There is no upload or third-party conversion flow.']
    ]
  },
  powerpoint: {
    title: 'PDF ↔ PowerPoint',
    description: 'Convert selected PDF pages into image-based PowerPoint slides, or selected PowerPoint slides into an image-based PDF.',
    detailPoints: {
      what: `Convert selected PDF pages to slides or selected .pptx slides to PDF pages.`,
      how: `Choose ranges, output name, image quality, and page or slide size; both directions render pages as images.`,
      result: `An image-based .pptx or PDF. Text is not editable or searchable, and font substitutions may request Google Fonts.`
    },
    intro: 'Convert selected PDF pages into PowerPoint slides, or selected slides from a .pptx file into a PDF. Choose page or slide ranges, output name, image quality, slide size, and PDF page size. Both directions create image-based output, so text is not editable or searchable. Files are processed in your browser and are not uploaded. When rendering PowerPoint, font-family names used by the presentation may be sent to Google Fonts to request substitutes; the file and slide content are not sent. Standard quality uses fewer pixels for smaller image assets, while Higher quality adds detail and can increase output size. Matching the original dimensions keeps page or slide proportions; A4, Letter, or widescreen sizing may add margins rather than reflow content. Password-protected PDFs and presentations are not supported; legacy .ppt files are also unsupported. Very large documents may exceed available browser memory.',
    mechanism: 'PDF.js renders selected PDF pages to images and PptxGenJS packages those images into a .pptx file. For the reverse direction, pptx-browser renders selected slides in the browser and pdf-lib places the images into a PDF. The conversion is image-based and cannot preserve editable text, animations, or every presentation effect. Font substitutions may request font assets from Google Fonts; font-family names may be included in those requests, but the presentation file and slide content remain in the browser.',
    steps: ['Choose PDF → PowerPoint or PowerPoint → PDF.', 'Select one PDF or unprotected .pptx file and enter page or slide ranges, or leave the selection blank to include all.', 'Set the output filename, image quality, and available page or slide size.', 'Convert, review the image-based output, and download it.'],
    faqs: [
      ['Can I edit or search the converted text?', 'No. Each selected page or slide is saved as an image. The output preserves appearance rather than editable text.'],
      ['Can I convert only certain pages or slides?', 'Yes. Enter one-based page numbers and inclusive ranges such as 1-3,5. Leave the field blank to include every page or slide.'],
      ['Are my files uploaded?', 'No. Document files are processed in your browser. Rendering PowerPoint may send font-family names to Google Fonts to request substitute fonts, but the presentation file and slide content are not sent.'],
      ['Which PowerPoint files are supported?', 'Only unprotected .pptx files are supported. Legacy .ppt files and password-protected files are not.'],
      ['Will higher image quality make a smaller file?', 'No. Higher quality increases render resolution and can increase output size. Choose standard quality for smaller files.']
    ]
  },
  markdown: {
    title: 'PDF ↔ Markdown',
    description: 'Extract selectable PDF text as Markdown or create a PDF from Markdown content.',
    detailPoints: {
      what: `Extract selectable PDF text as Markdown or create a PDF from Markdown content.`,
      how: `Choose a direction, select pages or edit Markdown, then set page size, orientation, and text size.`,
      result: `Editable Markdown or a text-based PDF. Exact PDF layout, images, and complex tables are not preserved.`
    },
    intro: 'Convert selectable text from a PDF into editable Markdown, or create a PDF from Markdown that you upload, paste, or edit in the text area. PDF-to-Markdown supports selecting pages and optionally adding horizontal separators between pages. Markdown-to-PDF supports A4 or US Letter paper, portrait or landscape orientation, and small, medium, or large text. The PDF renderer supports common headings, paragraphs, lists, quotes, code fences, links, and simple table text; it does not reproduce the original PDF layout. Scanned pages without a text layer need OCR first. Markdown-to-PDF uses built-in standard PDF fonts, so unsupported characters are reported and must be replaced before conversion. Files and text are processed locally in your browser and are not uploaded.',
    mechanism: 'PDF.js reads the selected PDF pages’ text layer and joins text items by their approximate vertical position. pdf-lib lays out supported Markdown blocks as selectable PDF text using built-in fonts. This is a text conversion rather than visual reconstruction; images, complex tables, exact typography, and original page layout are not preserved.',
    steps: ['Choose PDF → Markdown or Markdown → PDF.', 'For PDF to Markdown, select a PDF, optionally enter page numbers or ranges, and choose whether to separate page text.', 'For Markdown to PDF, upload an .md or .txt file or paste and edit text, then select page size, orientation, and text size.', 'Convert and review the extracted or generated content; enter a preferred output filename in the download card.', 'Download the result. All document processing stays in this browser.'],
    faqs: [
      ['Will the Markdown keep the PDF layout and images?', 'No. The tool extracts selectable text and its approximate reading order. It does not preserve precise layout, images, or complex table formatting.'],
      ['Can I convert a scanned PDF?', 'Only if it has a selectable text layer. Run the file through OCR first; this tool does not recognize text in page images.'],
      ['Can I edit Markdown before creating a PDF?', 'Yes. Upload a Markdown file or paste text, then edit it in the text area before converting.'],
      ['Why did Markdown-to-PDF reject a character?', 'The built-in standard PDF fonts have limited character coverage. Replace unsupported characters with supported Latin characters and retry.'],
      ['Are my files uploaded?', 'No. Both conversion directions run in your browser and do not send your PDF or Markdown to an external processing service.']
    ]
  }
};

const ATTACHMENT_RULES = {
  merge: {
    title: 'Attach PDFs Here',
    ruleKey: 'pdf2To5',
    rule: '2–5 unencrypted PDF files',
    infoTitle: 'Combine PDFs into one file',
    info: 'Merge whole files, or choose individual pages and arrange their final output order.'
  },
  compress: {
    title: 'Attach PDFs Here',
    ruleKey: 'pdfUpTo5',
    rule: 'Up to 5 unencrypted PDF files',
    infoTitle: 'Try to reduce PDF file size',
    info: 'Higher compression rasterizes pages and can reduce image quality and remove selectable text; larger outputs are not offered.'
  },
  edit: {
    title: 'Attach PDF Here',
    ruleKey: 'pdfOne',
    rule: 'One unencrypted PDF · no fixed page cap',
    infoTitle: 'Add content to PDF pages',
    info: 'Add text, images, drawings, highlights, or shapes, and remove pages. Existing text is not edited or replaced; added marks are overlays.'
  },
  watermark: {
    title: 'Attach PDF Here',
    ruleKey: 'pdfOne',
    rule: 'One unencrypted PDF · no fixed page cap',
    infoTitle: 'Add watermarks to PDF pages',
    info: 'Add text watermarks and optional page numbers to all or selected pages.'
  },
  word: {
    title: 'Attach PDF Here',
    ruleKey: 'docxPdfOne',
    rule: 'One unencrypted PDF or unprotected .docx file · no fixed page cap',
    infoTitle: 'Convert PDF ↔ Word',
    info: 'Create editable DOCX text from PDFs, or image-based PDFs from DOCX. Reverse-conversion text is not searchable; .doc files are unsupported.'
  },
  powerpoint: {
    title: 'Attach PDF or PowerPoint Here',
    ruleKey: 'powerpointPdfOne',
    rule: 'One unencrypted PDF or unprotected .pptx file · page count depends on available browser memory',
    infoTitle: 'Convert PDF ↔ PowerPoint',
    info: 'Select pages or slides, name the output, and choose image quality and page or slide sizing. Results are image-based and may not be editable.'
  },
  markdown: {
    title: 'Attach a PDF or Markdown File Here',
    ruleKey: 'markdownFileOne',
    rule: 'One unencrypted PDF, .md, or plain-text file',
    infoTitle: 'Convert PDF ↔ Markdown',
    info: 'Extract selectable PDF text or create a PDF from editable Markdown. Scanned pages need OCR first.'
  },
  protect: {
    title: 'Attach PDF Here',
    ruleKey: 'pdfOne',
    rule: 'One unencrypted PDF · no fixed page cap',
    infoTitle: 'Protect a PDF with a password',
    info: 'Add an opening password to a new copy; keep the password because it cannot be recovered here.'
  },
  unlock: {
    title: 'Attach PDF Here',
    ruleKey: 'passwordPdf',
    rule: 'One password-protected PDF · AES-256 R6 or RC4 R2/R3 only',
    infoTitle: 'Unlock a PDF with its password',
    info: 'A correct password is required; password guessing and recovery are not supported.'
  },
  split: {
    title: 'Attach PDF Here',
    ruleKey: 'pdfOne',
    rule: 'One unencrypted PDF · no fixed page cap',
    infoTitle: 'Split / Extract PDF',
    info: 'Select pages visually, split every page, or divide the PDF into percentage-based sections.'
  },
  ocr: {
    title: 'Attach PDF Here',
    ruleKey: 'pdf50',
    rule: 'One unencrypted PDF · up to 50 pages',
    infoTitle: 'Make scanned PDF text searchable',
    info: 'English OCR adds an invisible text layer to pages without readable text.'
  },
  'organize-pages': {
    title: 'Attach PDF Here',
    ruleKey: 'pdf30',
    rule: 'One unencrypted PDF · up to 30 pages',
    infoTitle: 'Organize PDF pages',
    info: 'Reorder, rotate, crop, or remove pages; cropping changes visible bounds only, and at least one page must remain.'
  },
  redact: {
    title: 'Attach PDF Here',
    ruleKey: 'pdf30',
    rule: 'One unencrypted PDF · up to 30 pages',
    infoTitle: 'Permanently redact page content',
    info: 'Drag over sensitive text or images to mark them. Every page is rasterized in the output so the original text beneath a redaction is not retained.'
  },
  sign: {
    title: 'Attach PDF Here',
    ruleKey: 'pdfOne',
    rule: 'One unencrypted PDF · no fixed page cap',
    infoTitle: 'Add a visible signature to PDF pages',
    info: 'Use a typed, drawn, or image signature; this is not a certificate-based digital signature.'
  },
  remove: {
    title: 'Attach PDF Here',
    ruleKey: 'pdf50',
    rule: 'One unencrypted PDF · up to 50 pages',
    infoTitle: 'Remove selected PDF pages',
    info: 'Choose pages to omit; at least one page must remain in the output.'
  },
  rotate: {
    title: 'Attach PDF Here',
    ruleKey: 'pdfOne',
    rule: 'One unencrypted PDF · no fixed page cap',
    infoTitle: 'Rotate PDF pages',
    info: 'Rotate every page or only the pages and ranges you select.'
  },
  crop: {
    title: 'Attach PDF Here',
    ruleKey: 'pdfOne',
    rule: 'One unencrypted PDF · no fixed page cap',
    infoTitle: 'Crop PDF pages',
    info: 'Cropping changes the visible page boundary; it does not permanently remove content outside it.'
  }
};

const ToolPage = ({ tool, children }) => {
  const { language, translate } = useLanguage();
  const localizedResources = getLocalizedResourceLabels(language);
  const content = TOOL_CONTENT[tool];
  const registeredTool = TOOL_REGISTRY.find((item) => item.id === tool);
  const localizedTool = registeredTool ? getLocalizedTool(language, registeredTool) : null;
  const pageTitleText = localizedTool?.name || content.title;
  const pageDescription = localizedTool?.description || content.description;
  const ProcessingIcon = localizedTool?.icon;
  const ToolIcon = ProcessingIcon || FileText;
  const attachmentTitleKey = tool === 'powerpoint'
    ? 'attachPdfOrPowerPointHere'
    : tool === 'word'
    ? 'attachWordFileHere'
    : tool === 'image'
      ? 'attachImagesHere'
      : tool === 'merge' || tool === 'compress'
        ? 'attachPdfsHere'
        : 'attachPdfHere';
  const attachmentRule = tool === 'image-pdf' || tool === 'excel' || tool === 'powerpoint'
    ? null
    : ATTACHMENT_RULES[tool] || {
        title: translate(attachmentTitleKey),
        rule: 'One unencrypted PDF · no fixed page cap',
        infoTitle: pageTitleText,
        info: pageDescription
      };
  const localizedContent = getLocalizedToolPage(
    language,
    tool,
    localizedTool,
    content,
    attachmentRule
  );
  const attachmentGuidanceHeadingId = `${tool}-attachment-guidance-heading`;

  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.content;
    document.title = `${pageTitleText} | PDF Merge Pro`;
    if (description) description.content = pageDescription;

    return () => {
      document.title = previousTitle;
      if (description && previousDescription !== undefined) {
        description.content = previousDescription;
      }
    };
  }, [content, pageDescription, pageTitleText]);

  return (
    <article className={tool === 'merge' ? 'space-y-8 merge-tool-page' : 'space-y-8'}>
      <header className="tool-detail-hero">
        <div className="tool-detail-hero-main">
          <div className="tool-detail-heading">
            <span className="tool-detail-icon" aria-hidden="true">
              <ToolIcon className="h-7 w-7" />
            </span>
            <h1 className="tool-detail-title">{pageTitleText}</h1>
            <p className="tool-detail-description">{pageDescription}</p>
          </div>
        </div>
        <div className="tool-detail-intro">
          <ul id={`${tool}-detail-points`} className="tool-detail-point-list">
            {localizedContent.detailPoints.map(({ key, text }) => (
              <li key={key} className="tool-detail-point">
                <ToolIcon className="tool-detail-point-icon" aria-hidden="true" />
                <span>
                  <strong>{localizedContent.detailPointHeadings[key]}</strong>
                  {text}
                  {key === 'result' && (
                    <Link
                      className="mt-2 block w-fit font-semibold text-blue-700 underline hover:text-blue-800"
                      to={`/resources/tools/${tool}`}
                    >
                      {localizedResources.readMore}
                    </Link>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <section aria-labelledby="tool-workspace-heading">
        <h2 id="tool-workspace-heading" className="sr-only">{pageTitleText} {translate('toolWorkspace')}</h2>
        {attachmentRule && tool !== 'word' && tool !== 'markdown' ? (
          <div className="tool-attachment-section">
            <div className="tool-attachment-heading">
              <span className="tool-attachment-icon" aria-hidden="true">
                <Upload className="h-5 w-5" />
              </span>
              <div>
                <h2>{translate(attachmentTitleKey)}</h2>
                <p>{localizedContent.attachment.rule}</p>
              </div>
            </div>
            <aside className="tool-attachment-guidance" aria-labelledby={attachmentGuidanceHeadingId}>
              <h3 id={attachmentGuidanceHeadingId}>{localizedTool?.name || localizedContent.attachment.infoTitle}</h3>
              <p>{localizedContent.attachment.info}</p>
            </aside>
            <div className="tool-attachment-content">{children}</div>
          </div>
        ) : children}
      </section>

      <section aria-label={`${pageTitleText} ${translate('instructionsAndWorkflow')}`} className="grid gap-4 lg:grid-cols-2">
        <div aria-labelledby="how-to-heading" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 id="how-to-heading" className="text-2xl font-bold text-slate-800 mb-4">{translate('howToUse')} {pageTitleText}</h2>
          <ol className="list-decimal space-y-3 pl-5 text-slate-600">
            {localizedContent.steps.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </div>

        <div aria-labelledby="how-it-works-heading" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 id="how-it-works-heading" className="text-2xl font-bold text-slate-800 mb-3">{translate('howItWorks')}</h2>
          {ProcessingIcon ? (
            <>
              <ol aria-label={translate('howItWorks')} className="flex flex-col items-stretch gap-3 xl:flex-row xl:items-center xl:gap-4">
                <li className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 xl:flex-col xl:justify-center xl:text-center">
                  <span className="tool-card-icon h-12 w-12" aria-hidden="true">
                    <Upload className="h-6 w-6" />
                  </span>
                  <span className="text-sm font-semibold text-slate-800">{translate('uploadToTool')}</span>
                </li>
                <li aria-hidden="true" className="flex justify-center text-slate-400">
                  <ArrowRight className="h-5 w-5 rotate-90 xl:rotate-0" />
                </li>
                <li className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 xl:flex-col xl:justify-center xl:text-center">
                  <span className="tool-card-icon h-12 w-12" aria-hidden="true">
                    <ProcessingIcon className="h-6 w-6" />
                  </span>
                  <span className="text-sm font-semibold text-slate-800">{translate('processDocumentInBrowser')}</span>
                </li>
                <li aria-hidden="true" className="flex justify-center text-slate-400">
                  <ArrowRight className="h-5 w-5 rotate-90 xl:rotate-0" />
                </li>
                <li className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 xl:flex-col xl:justify-center xl:text-center">
                  <span className="tool-card-icon h-12 w-12" aria-hidden="true">
                    <Download className="h-6 w-6" />
                  </span>
                  <span className="text-sm font-semibold text-slate-800">{translate('download')}</span>
                </li>
              </ol>
              <p className="mt-4 text-sm text-slate-600">
                {translate('filesStayInBrowser')} <Link className="underline hover:text-blue-700" to="/privacy">{translate('privacyPolicy')}</Link>.
              </p>
            </>
          ) : (
            <p className="text-slate-600 leading-relaxed">
              This conversion is not available yet. No files are uploaded or processed by this tool.
            </p>
          )}
        </div>
      </section>

      <section aria-labelledby="tool-faq-heading" className="space-y-3">
        <h2 id="tool-faq-heading" className="text-2xl font-bold text-slate-800">{translate('frequentlyAskedQuestions')}</h2>
        <FaqAccordion items={localizedContent.faqs} />
      </section>

      <RelatedToolsCarousel currentToolId={tool} />
      <AdSlot placement="toolSupportingContent" />
    </article>
  );
};

export default ToolPage;
