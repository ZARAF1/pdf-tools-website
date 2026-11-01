import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, FileText, Upload } from 'lucide-react';
import AdSlot from './AdSlot';
import RelatedToolsCarousel from './RelatedToolsCarousel';
import { TOOL_CATEGORIES, TOOL_REGISTRY } from './toolRegistry';
import FaqAccordion from './FaqAccordion';
import { getLocalizedTool } from '../i18n/toolTranslations.mjs';
import { getLocalizedToolPage } from '../i18n/toolPageLocalization.mjs';
import { useLanguage } from '../i18n/useLanguage';

const TOOL_CONTENT = {
  crop: {
    title: 'Crop PDF',
    description: 'Adjust the visible page boundaries in a PDF.',
    intro: 'Trim the visible area of PDF pages without rasterizing their content. Choose a PDF, navigate to a page, then drag the crop area or resize it with its corner and edge handles. The selection stays aligned as the preview zooms or resizes. Apply a crop to the current page and keep earlier page-specific crops in the same output, or apply the same relative selection to every page; the all-pages option replaces earlier per-page settings. Different page sizes and rotations are mapped to their own page coordinates. Apply the crop to create and validate a separate PDF copy, then preview and download it. The original file is not changed, and the document is processed in your browser. This tool changes the PDF page CropBox; it does not erase content outside the box. Hidden material may be recovered by changing the page boundary, so use genuine redaction for sensitive content. Rewriting may also invalidate existing digital signatures.',
    mechanism: 'PDF.js renders each page and converts the normalized preview selection back to PDF page coordinates, accounting for page scaling and rotation. pdf-lib applies that rectangle to each selected page CropBox and saves a separate output. The content is not rasterized or permanently removed; content outside the new visible boundary may remain recoverable. Processing occurs in the browser.',
    steps: ['Choose an unencrypted PDF and wait for its pages to load.', 'Navigate to a page and drag the crop boundary or use its handles to position and resize it.', 'Choose Current page only or All pages; the all-pages option applies the same relative selection to each page.', 'Select Apply crop and review the resulting cropped preview and validation message.', 'Select Download cropped PDF to save the separate copy.'],
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
    intro: 'Place new text or image content on a PDF page, draw freehand marks, add highlights or outlines, and remove pages you no longer need. Choose a page, select an editing tool, and position your marks in the preview; you can move or delete marks, undo or redo edits, and review the result before saving. This editor adds content over the page—it does not select, replace, or reflow existing PDF text. The original file stays unchanged, and the edited copy is generated in your browser. Added text uses a built-in font with Latin and Western European character coverage; unsupported characters are reported rather than silently substituted. Rewriting may affect signatures, forms, annotations, bookmarks, metadata, accessibility tags, or specialized PDF features. Open and inspect the saved copy before sharing it.',
    mechanism: 'PDF.js renders the page preview and maps edits to PDF coordinates. pdf-lib adds text, images, vector marks, and page removals to a separate copy in the browser. No document upload or external PDF-processing service is used.',
    steps: ['Choose an unencrypted PDF and wait for its pages to load.', 'Select a tool, set its options, then click or drag on the page to add a mark.', 'Select marks to move or delete them; use Undo and Redo to revise edits.', 'Remove pages if needed, then select Save PDF and download the validated copy.', 'Open the downloaded PDF and review its pages and marks before sharing.'],
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
    intro: 'Bring up to five related PDFs together in a new document. Keep the simple Merge all pages mode to combine whole files in their listed order, or switch to Select pages to choose individual pages from each source. In selective mode, each page you choose is added to a live output preview in that exact order; you can inspect larger thumbnails, remove pages, and reorder the sequence before creating the PDF. Set a custom output filename, add source-file bookmarks, preserve each original page size, or proportionally fit pages to A4 or US Letter. Fitting re-embeds the visible page content and may not retain interactive features such as forms or annotations, so preserve original page sizes when those matter. You can also insert blank pages whenever the output moves between source files. The original PDFs remain unchanged. Page previews and merging happen in your browser; no file is sent to an external processing server.',
    mechanism: 'PDF.js renders source-page previews locally. pdf-lib copies the chosen pages in their displayed output order, optionally adds source bookmarks and blank separator pages, and can re-embed and scale each page proportionally onto A4 or US Letter. Fitting may not retain interactive PDF features such as forms or annotations. The generated document is a separate browser-side PDF.',
    steps: ['Choose two or more unencrypted PDFs (up to five).', 'Keep Merge all pages to combine complete documents in file order, or choose Select pages.', 'In Select pages, click thumbnails in the order you want them to appear; inspect larger previews and reorder or remove pages in the live output.', 'Choose an output filename and optional bookmarks, page sizing, or blank separators.', 'Select Merge PDFs, then review and download the completed document.'],
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
    intro: 'Use one workspace to extract selected pages, split every page, or divide a PDF into balanced sections. Choose a PDF and review its visual page previews. In Extract selected pages mode, click thumbnails or enter page numbers and ranges such as 1-3, 5; the chosen pages are combined in document order into one PDF. Split every page creates one single-page PDF for each page. Split by percentage uses a slider to divide pages into 2–10 consecutive sections. Since pages cannot be divided, section percentages may differ slightly when the page count does not divide evenly. Part labels show each section boundary in the previews. When either split mode creates more than three PDFs, they are packaged into one ZIP; three or fewer are offered individually. Your original stays unchanged, and PDF handling and ZIP creation occur in your browser.',
    mechanism: 'PDF.js renders a navigable set of page previews. pdf-lib copies selected pages or creates each split section as a separate PDF; the browser ZIP writer packages more than three split outputs locally. The source file is not overwritten.',
    steps: ['Choose one unencrypted PDF.', 'Select Extract selected pages, Split every page, or Split by percentage.', 'Use page thumbnails or page ranges to choose extraction pages, or adjust the number-of-parts slider.', 'Review the page previews and section labels.', 'Create the output and download the PDF file or ZIP.'],
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
    intro: 'Remove opening-password encryption from a PDF copy when you know a valid user or owner password and are authorized to use it. Choose the encrypted PDF, enter the password, and let the browser create a separate unlocked copy; the original file is not changed. The tool verifies that the output can be opened without a password and that its page count matches the source. It never guesses, cracks, or recovers passwords. Supported encryption is AES-256 R6 and legacy RC4 R2/R3; AES-128 R4 and other encryption types are not supported. The PDF is rewritten during decryption, so review the downloaded copy carefully, especially if it contains digital signatures, forms, annotations, attachments, or specialized PDF features. The document and password are processed in your browser and are not sent to an external processing server.',
    mechanism: 'The browser uses @pdfsmaller/pdf-decrypt and Web Crypto to decrypt supported PDF objects, then validates the resulting unencrypted document with pdf-lib. It confirms the output page count matches the encrypted source. No PDF or password is uploaded.',
    steps: ['Choose one password-protected PDF that uses a supported encryption type.', 'Enter the correct password you are authorized to use.', 'Select Unlock PDF and wait for the output checks to finish.', 'Review and download the separate unlocked PDF.'],
    faqs: [
      ['Can this tool recover or guess a lost password?', 'No. You must enter a correct password. Password guessing and recovery are not supported.'],
      ['Which encryption types can it unlock?', 'AES-256 R6 and legacy RC4 R2/R3 are supported. AES-128 R4 and other encryption types are not supported.'],
      ['Will all PDF features be preserved?', 'The document is rewritten to remove encryption. The tool checks that the output opens without a password and retains the page count, but you should review forms, signatures, annotations, attachments, and specialized features in your downloaded copy.']
    ]
  },
  image: {
    title: 'Image to PDF',
    description: 'Create a PDF from up to 10 images with custom pages, rotation, orientation, background, alignment, and resizing.',
    intro: 'Turn up to 10 JPEG, PNG, or BMP images into a PDF, with one image per page. Arrange the pages and rotate individual images before creating the document. Choose A4, Letter, image-fit, or custom page dimensions in millimeters; use a fixed portrait or landscape orientation, or automatically orient each page to its image. Set the page background color, image fit, margins, and horizontal and vertical alignment. Resize bounds, scale, aspect ratio, and JPEG quality let you adjust image output; Fill can crop the image, while Contain keeps the full image visible. The page color shows through transparent areas in PNG and BMP images. The converter creates a separate PDF and leaves your original image files unchanged. Image decoding and PDF creation happen in your browser; selected images are not uploaded to an external conversion server.',
    mechanism: 'The browser decodes each selected image, applies its requested quarter-turn rotation, creates a resized canvas copy, and embeds JPEG or PNG data into a new PDF with pdf-lib. Page dimensions, orientation, background, fit, and alignment are applied independently to each output page. PNG and BMP inputs are encoded as PNG; JPEG inputs use the selected JPEG quality. BMP decoding depends on browser image support; source files are not changed.',
    steps: ['Choose up to 10 JPEG, PNG, or BMP images.', 'Arrange or rotate images and set page size, orientation, fit, alignment, background, and resize options.', 'Create and download your PDF.'],
    faqs: [
      ['Which image types are supported?', 'JPEG and PNG are embedded directly. BMP files are decoded by the browser and converted to PNG data before embedding. WebP is not supported.'],
      ['Can I change page order and rotate images?', 'Yes. Use the move controls to arrange pages and each image card’s rotation buttons to turn that image by 90 degrees.'],
      ['What do Contain and Fill mean?', 'Contain keeps the entire image visible; Fill scales to fill the available area and may crop parts outside it.'],
      ['Can I set custom page dimensions or orientation?', 'Yes. Choose Custom dimensions and enter a width and height in millimeters. You can apply one portrait or landscape orientation to all pages, or enable automatic orientation to match each page to its rotated image.'],
      ['What is the page background color for?', 'The selected color fills each page behind the image and is visible through transparent areas in PNG or BMP images.'],
      ['Are image resizing settings destructive?', 'No. The converter creates temporary, resized copies for its output and leaves the original selected files unchanged.']
    ]
  },
  'pdf-images': {
    title: 'PDF to Images',
    description: 'Convert each PDF page into a PNG, JPG, or BMP image.',
    intro: 'Create an image of every page in a PDF and collect the images in one ZIP download. Select a PDF containing between 1 and 50 pages, choose PNG, JPG, or BMP, and select Standard or High quality. The tool keeps the page sequence and names the image files in order, so it is straightforward to find a particular page after extracting the ZIP. Higher quality and large pages can require more memory and take longer to prepare. The original PDF is not modified. After conversion finishes, download the ZIP and open it with your usual archive tool. Page rendering and image creation happen in your browser; your PDF and its pages are not sent to an external conversion server.',
    mechanism: 'Your browser renders the pages one at a time, encodes each page in the format you selected, and places the images into a ZIP download. The PDF is not sent to an external conversion server. Larger pages and high quality can use more browser memory.',
    steps: ['Choose one unencrypted PDF with 1–50 pages.', 'Select PNG, JPG, or BMP and choose Standard or High quality.', 'Select Convert PDF to Images and wait for every page and the ZIP to finish.', 'Select Download ZIP to save the images in page order.'],
    faqs: [
      ['How many pages can I convert?', 'The tool accepts PDFs with 1–50 pages. It checks the actual document page count and rejects larger files.'],
      ['Which image formats are available?', 'PNG is lossless, JPG is usually smaller and has an adjustable quality setting, and BMP is uncompressed and may create large files. The file contents are encoded in the selected format.'],
      ['What is inside the ZIP?', 'It contains one image for each PDF page, named in order from page-001 to the final page. The filename extension matches the selected format.'],
      ['Can I convert a password-protected PDF?', 'No. Password-protected PDFs are rejected.'],
      ['Does conversion change or upload my PDF?', 'No. Pages are rendered in your browser and the original file is left unchanged. The website can still make ordinary hosting and third-party resource requests.']
    ]
  },
  word: {
    title: 'PDF ↔ Word',
    description: 'Convert PDF text to Word or render Word documents as PDFs.',
    intro: 'Convert between PDF and Word in one browser workspace. To create an editable Word document, select a PDF; pages with selectable text are reconstructed as DOCX text, and scanned pages can use English OCR. For the reverse direction, select a DOCX file to render its pages and create a PDF. Word-to-PDF output is image-based, so its text is not searchable or selectable; rendering can differ from Microsoft Word, especially for complex layouts, fonts, tables, and floating objects. Legacy .doc files are not supported. PDF-to-Word layout is also approximate, and OCR accuracy depends on scan quality. Your files are processed in this browser and are not uploaded to a conversion server. Review either output before relying on it; the original file stays unchanged.',
    mechanism: 'For PDF-to-Word, PDF.js extracts text and page positions; Tesseract.js performs English OCR on pages without readable text using locally bundled worker, core, and language assets; docx creates the DOCX output. For Word-to-PDF, docx-preview renders DOCX pages to browser HTML, html2canvas captures each page as an image, and pdf-lib creates a PDF containing those images. The reverse output is image-based and has no selectable text.',
    steps: ['Choose PDF → Word or Word → PDF.', 'Select one unencrypted PDF or one supported DOCX file.', 'Start conversion and review progress; scanned PDFs may require English OCR.', 'Download and inspect the output. Word-to-PDF pages are images, so text cannot be searched or selected.'],
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
    intro: 'Turn scanned, image-only pages into a PDF you can search and select text in, while retaining the original page appearance. Choose an unencrypted PDF with up to 50 pages. The tool reads the text already present on each page and invokes OCR only for pages that lack a usable text layer, which helps avoid unnecessary recognition work in mixed documents. The OCR engine is currently configured for printed English; handwritten, low-resolution, skewed, or complex pages can be misread, so review important results. Recognized words are added invisibly at their detected positions, and the output is checked for its page count and searchable text before a download is offered. PDF processing and OCR run in your browser using locally bundled Tesseract assets; the PDF itself is not uploaded.',
    mechanism: 'PDF.js checks existing page text and renders pages without usable text. Tesseract.js recognizes English text in the browser using OCR worker, core, and English language assets bundled with this website; pdf-lib adds an invisible text layer to the original pages, preserving their page artwork. The output is reopened and checked for page count and searchable text before download.',
    steps: ['Choose one unencrypted PDF with up to 50 pages.', 'Review the first-page preview and file details.', 'Select Create searchable PDF and wait while scanned pages are rendered and recognized.', 'Download the validated PDF and use your PDF viewer’s text selection or Find feature to check the OCR result.'],
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
    intro: 'Remove unwanted pages while keeping the remaining document together as a new PDF. Choose a file with no more than 50 pages and review the page previews in the grid. Select the pages you want to omit, then double-check the selection before creating the result; at least one page must remain. The output follows the original document order, regardless of the order in which you selected pages. The original PDF is not changed, so you can start again if you remove the wrong page. When the new document is ready, download it and verify that the pages you wanted to keep are present. Page selection and PDF creation happen in your browser; the selected file is not sent to an external server.',
    mechanism: 'PDF.js renders local page thumbnails and pdf-lib copies the unselected pages into a separate PDF. Page order is preserved and the source file is not changed.',
    steps: ['Choose a PDF with no more than 50 pages.', 'Select pages to remove in the thumbnail grid.', 'Review the selection and confirm removal; at least one page must remain.', 'Download the generated PDF manually.'],
    faqs: [
      ['How many pages can I select?', 'This tool accepts PDFs with up to 50 pages and rejects larger files rather than truncating them.'],
      ['Can I remove every page?', 'No. The output must contain at least one page.'],
      ['Does this change my original PDF?', 'No. The tool creates a new file from the remaining pages.']
    ]
  },
  'organize-pages': {
    title: 'Organize PDF',
    description: 'Reorder, rotate, and remove pages from a PDF.',
    intro: 'Arrange the pages of a PDF to create a cleaner, better-ordered document. Select one PDF with up to 30 pages and review its page previews. Drag the page cards or use the move controls to place pages in the order you want; you can also rotate pages in 90-degree steps or remove pages that are not needed. At least one page must remain. The final document follows the order shown in the workspace and retains the original page content where supported. The source PDF is not changed, so you can reset or select it again if you want to start over. When the arrangement is ready, choose Organize PDF and download the separate result. Your file is processed in your browser, not sent to an external server.',
    mechanism: 'PDF.js renders page previews in your browser. pdf-lib copies the chosen pages in the displayed order and applies their rotations to a separate output PDF without rasterizing page content.',
    steps: ['Choose a pdf and review its pages.', 'Drag pages or use the move controls to reorder them; rotate or remove pages as needed.', 'Select Organize PDF and download the generated document.'],
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
    intro: 'Cover sensitive information in a new PDF copy before sharing it. Select a document with up to 15 pages, move to the page you want to review, and draw an opaque black box over each item to hide. Use the available undo or clear controls to correct marks before creating the output. Check every marked page carefully: redaction changes are difficult to reverse in the generated file. To prevent covered text from remaining underneath, pages are saved as images. This means the resulting PDF will not keep selectable text, sharp vector artwork, links, forms, or other interactive content. Your original PDF is left untouched. Redaction is performed in your browser, and your selected document is not sent to an external server.',
    mechanism: 'PDF.js renders every page to an image and the tool burns opaque masks into those images before creating a new PDF with pdf-lib. This removes underlying text from the output, but rasterizes all pages and removes selectable text, vectors, links, forms, and other interactive features.',
    steps: ['Choose one PDF and select the page to review.', 'Draw a black box over each item to redact; use Undo or Clear Marks to correct the page.', 'Review all marked pages, then create and download the redacted PDF.'],
    faqs: [
      ['Is the redaction permanent?', 'The original page content is not included in the output; the selected areas are replaced by opaque pixels. Always inspect the output before sharing it.'],
      ['How many pages are supported?', 'The tool accepts documents with up to 15 pages.'],
      ['Does the output keep selectable text?', 'No. To remove hidden text beneath redactions, every page is rasterized. Text search, vector quality, links, forms, and other interactive content are lost.'],
      ['Are my files uploaded?', 'The PDF is rendered and processed in the browser. Normal website requests and hosting logs are separate from PDF processing.']
    ]
  },
  sign: {
    title: 'Sign PDF',
    description: 'Add a visible typed, drawn, or image signature to selected pages.',
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
    title: 'PowerPoint to PDF',
    description: 'PowerPoint conversion is not available in this browser-only build.',
    intro: 'PowerPoint-to-PDF conversion is not available on this page yet. Converting slides reliably requires preserving their layout, fonts, images, shapes, transitions where relevant, and page dimensions; this site does not currently provide a presentation renderer. The page does not accept or process presentation files and will not produce a renamed copy or claim a conversion took place. Keep your original presentation on your device. To create a PDF now, open it in presentation software you trust and choose its export or save-as-PDF option. Review the resulting pages for missing fonts, shifted objects, or clipped content before sending them to others. A browser-based option may be considered later if a suitable converter is reviewed. No presentation is sent to this site or to an external conversion service from this page.',
    mechanism: 'The installed dependencies do not render PowerPoint slide visuals. No presentation is accepted, converted, uploaded, or renamed. A future implementation needs a compatible local renderer or an explicitly approved service.',
    steps: ['No conversion workflow is available yet.', 'Keep your original presentation unchanged.', 'Use a trusted presentation application’s export-to-PDF feature in the meantime.'],
    faqs: [
      ['Can I upload a .pptx or .ppt file here?', 'No. This page does not accept or process presentation files.'],
      ['Why is conversion unavailable?', 'Correct slide rendering requires support for layout, fonts, graphics, tables, backgrounds and page dimensions not provided by the current dependencies.'],
      ['Will the site send my presentation to another service?', 'No. There is no upload or third-party conversion flow.']
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
  image: {
    title: 'Attach Images Here',
    ruleKey: 'images10',
    rule: 'Up to 10 JPEG, PNG, or BMP images',
    infoTitle: 'Create a PDF from images',
    info: 'Arrange and rotate images, then adjust page size, background, fit, alignment, and resizing.'
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
    info: 'Reorder, rotate, or remove pages; at least one page must remain.'
  },
  redact: {
    title: 'Attach PDF Here',
    ruleKey: 'pdf15',
    rule: 'One unencrypted PDF · up to 15 pages',
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
  'pdf-images': {
    title: 'Attach PDF Here',
    ruleKey: 'pdf50',
    rule: 'One unencrypted PDF · up to 50 pages',
    infoTitle: 'Convert PDF pages to images',
    info: 'Export pages as PNG, JPG, or BMP files in a ZIP archive.'
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
  const [expandedIntro, setExpandedIntro] = useState({ tool, isExpanded: false });
  const introExpanded = expandedIntro.tool === tool && expandedIntro.isExpanded;
  const content = TOOL_CONTENT[tool];
  const registeredTool = TOOL_REGISTRY.find((item) => item.id === tool);
  const localizedTool = registeredTool ? getLocalizedTool(language, registeredTool) : null;
  const pageTitleText = localizedTool?.name || content.title;
  const pageDescription = localizedTool?.description || content.description;
  const ProcessingIcon = localizedTool?.icon;
  const ToolIcon = ProcessingIcon || FileText;
  const category = TOOL_CATEGORIES.find((item) => item.id === registeredTool?.category);
  const categoryName = category ? translate(`category.${category.id}`) : translate('conversionStatus');
  const attachmentTitleKey = tool === 'word'
    ? 'attachDocumentHere'
    : tool === 'image'
      ? 'attachImagesHere'
      : tool === 'merge' || tool === 'compress'
        ? 'attachPdfsHere'
        : 'attachPdfHere';
  const attachmentRule = ATTACHMENT_RULES[tool] || (
    tool === 'excel' || tool === 'powerpoint'
      ? null
      : {
          title: translate(attachmentTitleKey),
          rule: 'One unencrypted PDF · no fixed page cap',
          infoTitle: pageTitleText,
          info: pageDescription
        }
  );
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
    <article className="space-y-8">
      <header className="tool-detail-hero">
        <div className="tool-detail-hero-main">
          <div className="tool-detail-heading">
            <span className="tool-detail-icon" aria-hidden="true">
              <ToolIcon className="h-7 w-7" />
            </span>
            <p className="tool-detail-category">{categoryName}</p>
            <h1 className="tool-detail-title">{pageTitleText}</h1>
            <p className="tool-detail-description">{pageDescription}</p>
          </div>
        </div>
        <div className={`tool-detail-intro${introExpanded ? ' is-expanded' : ''}`}>
          <p id={`${tool}-intro`} className="tool-detail-intro-copy">{localizedContent.intro}</p>
          <button
            type="button"
            className="tool-detail-intro-toggle"
            aria-controls={`${tool}-intro`}
            aria-expanded={introExpanded}
            onClick={() => setExpandedIntro({ tool, isExpanded: !introExpanded })}
          >
            {translate(introExpanded ? 'collapseDescription' : 'expandDescription')}
          </button>
        </div>
      </header>

      <section aria-labelledby="tool-workspace-heading">
        <h2 id="tool-workspace-heading" className="sr-only">{pageTitleText} {translate('toolWorkspace')}</h2>
        {attachmentRule ? (
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
