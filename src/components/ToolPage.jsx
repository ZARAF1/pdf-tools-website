import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, Upload } from 'lucide-react';
import AdSlot from './AdSlot';
import RelatedToolsCarousel from './RelatedToolsCarousel';
import { TOOL_REGISTRY } from './toolRegistry';
import { closeDisclosureOnEscape } from '../lib/detailsEscape';

const TOOL_CONTENT = {
  merge: {
    title: 'Merge PDF',
    description: 'Combine PDF files into one document, with control over their order.',
    intro: 'Bring related documents together in one PDF that is easier to save, share, and review. Choose at least two files and add no more than five, then arrange the file list into the sequence you want. The pages from each document stay together; this tool changes the order of whole files, not individual pages within a file. Before merging, check that the correct PDFs are listed and that their order makes sense for the finished document. The tool creates a new combined copy, so your original files remain unchanged. When processing finishes, use the download control to save the result. Your selected PDFs are handled in your browser and are not sent to an external server for merging.',
    mechanism: 'Choose your PDF files, arrange them in the order you want, and select Merge PDFs. The combined file is created in your browser for you to download. Your files stay in your browser and are not sent to an external server.',
    steps: ['Choose two or more PDF files (up to five).', 'Reorder the files with drag-and-drop or the move buttons.', 'Select Merge PDFs and download the combined document.'],
    faqs: [
      ['How many PDFs can I merge?', 'You can merge up to five PDF files at a time, and at least two files are required.'],
      ['Will the original files change?', 'No. The merger creates a separate output document; it does not overwrite the selected files.'],
      ['Can I change the page order?', 'You can reorder whole input files before merging. This version does not reorder pages within an individual file.']
    ]
  },
  split: {
    title: 'Split PDF',
    description: 'Extract selected pages or save a PDF as separate page files.',
    intro: 'Separate a PDF into the pages you need, either as one selected-page document or as individual page files. Choose a PDF, then decide whether you want to extract a specific set of pages or split the whole document into one-page PDFs. For an extraction, enter page numbers and ranges such as 1-3, 5; page numbers begin at 1. Review the selection before you start so the output contains the pages you intended. The original PDF is left unchanged, and the result is created as a separate file. When splitting every page, your browser may ask permission for multiple downloads. Page handling takes place in your browser, without sending the selected PDF to an external server.',
    mechanism: 'The browser loads the PDF with pdf-lib, copies the requested pages into new PDF documents, and downloads the outputs locally. The source file is not overwritten.',
    steps: ['Choose one PDF.', 'Select Extract Pages or Split All Pages.', 'For extraction, enter page numbers/ranges such as 1-3, 5.', 'Start the operation and save the generated PDF file(s).'],
    faqs: [
      ['Are page numbers one-based?', 'Yes. Page 1 means the first page in the document.'],
      ['Can I extract non-consecutive pages?', 'Use comma-separated entries such as 1,3,5-7.'],
      ['What happens in Split All Pages mode?', 'The tool creates one single-page PDF for every page. Your browser may prompt separately for multiple downloads.']
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
      ['Can I protect an already password-protected PDF?', 'The current implementation rejects PDFs it detects as encrypted. Remove the existing password first.'],
      ['Are permission settings unbreakable?', 'No. PDF permission restrictions are honored differently by readers and should not be treated as a substitute for access control.']
    ]
  },
  image: {
    title: 'Image to PDF',
    description: 'Resize and arrange supported images in a new PDF.',
    intro: 'Turn supported pictures into a PDF you can view and share as one document. Choose JPEG, PNG, or BMP images, arrange them in the order you want, and review the list before continuing. Set the page size and orientation, then choose how each image should fit; depending on the selected options, an image may be resized or parts may be cropped. Each image is placed into the new PDF as a page. The conversion creates a separate document and does not replace your original pictures. When the PDF is ready, use the download button to save it. Image preparation and document creation happen in your browser. The image files you select are not uploaded to an external conversion server.',
    mechanism: 'The browser decodes the selected images, creates resized working copies in a canvas, and embeds the resulting JPEG or PNG data into a new PDF with pdf-lib. BMP decoding depends on browser image support; source files are not changed.',
    steps: ['Choose JPEG, PNG, or BMP images.', 'Arrange the images and configure output size, orientation, fit, margin, and resize options.', 'Generate the PDF and use the explicit download button.'],
    faqs: [
      ['Which image types are supported?', 'JPEG and PNG are embedded directly. BMP files are decoded by the browser and converted to PNG data before embedding. WebP is not supported.'],
      ['Can I change the page order?', 'Yes. Use the move controls or drag the image list into the desired order.'],
      ['What do Contain and Fill mean?', 'Contain keeps the entire image visible; Fill scales to fill the available area and may crop parts outside it.'],
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
    title: 'PDF to Word',
    description: 'Extract text and create an editable Word document.',
    intro: 'Create an editable Word document from text in a PDF. Select one PDF and start conversion; pages with selectable text are read and laid out as editable text in a DOCX file. The result is a practical starting point, not an exact reproduction of every original page. Complex columns, tables, unusual fonts, headers, and images may need adjustments in Word. For scanned pages without readable text, the tool can attempt English optical character recognition, but accuracy depends on scan quality and the final text should be checked. OCR may load its recognition resources from jsDelivr; these resources support the conversion and are separate from your document. Your PDF is processed in the browser rather than uploaded to a conversion server. Download and review the DOCX before relying on it.',
    mechanism: 'PDF.js extracts text and page positions in the browser; Tesseract.js performs English OCR for pages without readable text; docx builds the output file. When OCR is needed, this setup defaults to loading Tesseract worker/core and English language resources from jsDelivr. Complex layouts are reconstructed approximately.',
    steps: ['Choose one PDF.', 'Start conversion and wait while pages are read; scanned pages may require OCR setup and recognition.', 'Download the DOCX and review its formatting and text.'],
    faqs: [
      ['Does this preserve the exact PDF layout?', 'No. Text positions and simple aligned rows are reconstructed; complex columns, tables, forms, and typography may need manual cleanup.'],
      ['Can scanned pages be converted?', 'The tool attempts English OCR for pages without readable text. Recognition quality depends on scan clarity and OCR resources being available.'],
      ['Does the whole process stay offline?', 'No. PDF reading and conversion run in the browser, but the current OCR configuration can fetch its worker, core, and English language data from jsDelivr when needed.']
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
  extract: {
    title: 'Extract PDF Pages',
    description: 'Choose pages from a PDF of up to 50 pages and save them separately.',
    intro: 'Copy only the pages you need into a separate PDF. Choose a document with up to 50 pages, then use the page previews to select the pages for your new file. You may select nonconsecutive pages; the finished PDF keeps them in their original document order, rather than the order in which you clicked them. Check the selected-page summary before extracting to make sure it matches your needs. The original PDF remains unchanged, and the selected pages are saved to a new document that you can download. This is useful for sharing a short excerpt or keeping a smaller subset for reference. The work is performed in your browser and your PDF is not sent to an external extraction server.',
    mechanism: 'PDF.js renders page previews locally; pdf-lib copies selected pages in ascending source order into a new document.',
    steps: ['Choose a PDF with no more than 50 pages.', 'Select one or more pages in the thumbnail grid.', 'Check the selected-page summary and extract.', 'Download the generated PDF manually.'],
    faqs: [
      ['Does selection order control output order?', 'No. Pages remain in their original document order regardless of the order in which you selected them.'],
      ['How many pages are supported?', 'The actual PDF page count is checked and documents over 50 pages are rejected.'],
      ['Is this the same as splitting every page?', 'No. This creates one PDF containing only the pages you selected.']
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

const ToolPage = ({ tool, children }) => {
  const content = TOOL_CONTENT[tool];
  const registeredTool = TOOL_REGISTRY.find((item) => item.id === tool);
  const ProcessingIcon = registeredTool?.icon;

  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.content;
    document.title = `${content.title} | PDF Merge Pro`;
    if (description) description.content = content.description;

    return () => {
      document.title = previousTitle;
      if (description && previousDescription !== undefined) {
        description.content = previousDescription;
      }
    };
  }, [content]);

  return (
    <article className="space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{content.title}</h1>
        <p className="text-slate-600 max-w-3xl mx-auto">{content.intro}</p>
      </header>

      <section aria-label={`${content.title} workspace`}>
        {children}
      </section>

      <section aria-labelledby="how-to-heading" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 id="how-to-heading" className="text-2xl font-bold text-slate-800 mb-4">How to Use {content.title}</h2>
        <ol className="list-decimal space-y-3 pl-5 text-slate-600">
          {content.steps.map((step) => <li key={step}>{step}</li>)}
        </ol>
      </section>

      <section aria-labelledby="how-it-works-heading" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 id="how-it-works-heading" className="text-2xl font-bold text-slate-800 mb-3">How it works</h2>
        {ProcessingIcon ? (
          <>
            <ol aria-label="How this tool works" className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
              <li className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-col sm:justify-center sm:text-center">
                <span className="tool-card-icon h-12 w-12" aria-hidden="true">
                  <Upload className="h-6 w-6" />
                </span>
                <span className="text-sm font-semibold text-slate-800">Upload to tool</span>
              </li>
              <li aria-hidden="true" className="flex justify-center text-slate-400">
                <ArrowRight className="h-5 w-5 rotate-90 sm:rotate-0" />
              </li>
              <li className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-col sm:justify-center sm:text-center">
                <span className="tool-card-icon h-12 w-12" aria-hidden="true">
                  <ProcessingIcon className="h-6 w-6" />
                </span>
                <span className="text-sm font-semibold text-slate-800">Process document in browser</span>
              </li>
              <li aria-hidden="true" className="flex justify-center text-slate-400">
                <ArrowRight className="h-5 w-5 rotate-90 sm:rotate-0" />
              </li>
              <li className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-col sm:justify-center sm:text-center">
                <span className="tool-card-icon h-12 w-12" aria-hidden="true">
                  <Download className="h-6 w-6" />
                </span>
                <span className="text-sm font-semibold text-slate-800">Download</span>
              </li>
            </ol>
            <p className="mt-4 text-sm text-slate-600">
              Your selected files are processed in your browser and are not uploaded to a processing server. Learn more in our <Link className="underline hover:text-blue-700" to="/privacy">Privacy Policy</Link>.
            </p>
          </>
        ) : (
          <p className="text-slate-600 leading-relaxed">
            This conversion is not available yet. No files are uploaded or processed by this tool.
          </p>
        )}
      </section>

      <section aria-labelledby="tool-faq-heading" className="space-y-3">
        <h2 id="tool-faq-heading" className="text-2xl font-bold text-slate-800">Frequently Asked Questions</h2>
        {content.faqs.map(([question, answer]) => (
          <details
            key={question}
            className="group bg-white rounded-xl border border-slate-200 p-4"
            onKeyDown={closeDisclosureOnEscape}
          >
            <summary className="cursor-pointer font-semibold text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
              {question}
            </summary>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">{answer}</p>
          </details>
        ))}
      </section>

      <RelatedToolsCarousel currentToolId={tool} />
      <AdSlot placement="toolSupportingContent" />
    </article>
  );
};

export default ToolPage;
