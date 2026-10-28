# Project Status — PDF Utility Website

## Current state
The existing React/Vite application exposes 14 working browser-based PDF tools under five active categories: Organize, Convert, Edit & Sign, Protect & Repair, and Extract & Analyze. Shared category navigation, homepage cards with a bottom-up blue hover/focus tint, category-aware search, related tools, and persisted light/dark theme are implemented. The homepage hero has a two-column message and PDF illustration with six decorative tool labels (Merge, Organize, Convert, Sign, Protect, Extract); desktop rendering is browser-verified, while mobile visual verification remains pending because the shared browser page did not apply the requested viewport size. Empty categories are omitted from navigation and the homepage. PDF upload tools reject password-protected inputs before adding them to the selected-file state. Merge PDF accepts at most five files and disables upload at the limit. Excel/PowerPoint conversion routes deliberately explain the missing local renderer rather than accepting files or pretending to convert them. PDF-to-Word may fetch OCR resources from jsDelivr. The shared tool-detail hero has a category/icon/title/summary area and a separate, readable overview panel; it was browser-checked on all 14 tool routes and both Office limitation routes. No dependency was added or changed. Unlock PDF remains unavailable pending approval for a decryption dependency.

## Homepage tool-card hover tint — 2026-10-29
- Replaced the flat muted hover background in `src/index.css` with an animated blue gradient that rises from the bottom of every shared tool card. Matched the tint to the hero palette in light and dark themes and applied it to keyboard focus as well as pointer hover.
- Added the reusable visual rule to `.github/TOOL_DEVELOPMENT_GUIDELINES.md`.
- Browser checked the Merge PDF card on `localhost:5175`: pointer hover raised the gradient fully in both light and dark themes, and keyboard focus raised it in light mode. The light/dark gradient backgrounds and blue hover border were confirmed from computed styles.
- `npm.cmd run build` passed (Vite 8.3.5; 2,595 modules); existing `docx`/`buffer` externalization and large-chunk warnings remain. Problems reported no CSS errors, and `git diff --check` passed.

## Homepage hero tool labels — 2026-10-29
- Added Sign, Protect, and Extract decorative badges around the existing PDF artwork in `src/components/Home.jsx`, complementing Merge, Organize, and Convert. Added deliberate badge positions in `src/index.css`.
- Updated `.github/TOOL_DEVELOPMENT_GUIDELINES.md` with a reusable styling rule for decorative hero illustrations: hide nonessential art from assistive technology, keep labels non-interactive, avoid overlap, and verify theme contrast and narrow layouts.
- Browser verified the desktop hero at `localhost:5175`: all six labels render around the PDF, fit within the illustration bounds, and do not overlap the central document. The screenshot confirms the visual layout. Mobile visual verification remains pending because the shared browser viewport limitation is unchanged.
- `npm.cmd run build` passed (Vite 8.3.5; 2,595 modules); Problems reported no errors in `Home.jsx` or `index.css`. Existing `docx`/`buffer` externalization and large-chunk warnings remain.
- Next: verify all six labels at mobile width in a browser that honors viewport resizing.

## Homepage hero presentation — 2026-10-29
- Reworked the homepage headline section in `src/components/Home.jsx` and `src/index.css` into a responsive two-column hero. Added a “PDF tools, made simple” eyebrow, stronger title/tagline hierarchy, the existing description, a working “Explore PDF tools” anchor, and an aria-hidden layered PDF illustration with labels for existing tool types.
- Browser verified the hero on `localhost:5175` in light and dark themes. Desktop showed the two-column layout, all 14 tool cards remained present, the document had no horizontal overflow, and the CTA navigated to `#toolbox`. Inline screenshots were captured in both themes.
- Mobile stacking and reduced artwork sizing are implemented in the max-width 760px CSS. Mobile visual verification is pending: the shared browser page reports its fixed 1374px inner viewport even after `setViewportSize({ width: 390, height: 844 })`.
- `npm.cmd run build` passed after the final responsive CSS sizing adjustment (Vite 8.3.5; 2,595 modules). Existing `docx`/`buffer` externalization and large-chunk warnings remain. Targeted Problems checks found no errors in `Home.jsx` or `index.css`.
- Next: verify responsive layout in a browser viewport that honors mobile emulation.

## Shared tool-detail presentation — 2026-10-29
- Replaced the centered title-and-long-paragraph header in `src/components/ToolPage.jsx` with a responsive hero panel: category label, registry icon, single prominent H1 and short description sit alongside a left-aligned tool overview. Office limitation pages use a neutral conversion-status label and document icon.
- Added light/dark and mobile styling in `src/index.css`. The overview text and tool behavior were not changed.
- Browser checked all 16 tool/limitation routes on `localhost:5175`: each had one H1, a category label, short description, overview, and visible hero. At 1280 px the hero used a two-column layout; at 390 px it stacked into one column. Document width matched the 375 px CSS viewport in mobile emulation. Light and dark colors were inspected, and desktop/mobile screenshots were captured inline.
- `npm.cmd run build` passed (Vite 8.3.5; 2,595 modules). Targeted Problems checks found no errors in `ToolPage.jsx` and `index.css`. Existing `docx`/`buffer` externalization and large-chunk warnings remain.
- Next: gather user feedback on the shared appearance; check other page sections only if requested.

## Browser-processing and network disclosures
- Audited the PDF-tool source for document-submission calls: no `fetch`, `XMLHttpRequest`, Axios, `FormData`, or `sendBeacon` document-upload flow was found. PDF-to-Word is the exception for supporting resource requests: its Tesseract.js setup may load the OCR worker, core software, and English language data from jsDelivr; OCR recognition itself runs in the browser. The optional AdSense loader is disabled in the inspected configuration.
- Changed the shared workflow label to “Process document in browser” and kept its privacy note high-level: selected files are processed in the browser and are not uploaded to a processing server. Detailed network/OCR disclosures remain in the FAQ and Privacy Policy. Updated the Protect PDF encryption notice to distinguish local document work from ordinary site/resource requests.
- Browser checked the concise shared disclosure on `/merge` and `/pdf-to-word`, and the detailed policy on `/privacy`. Static source search found only the conditional AdSense script URL and PDF-to-Word's OCR worker creation among network/API request patterns.
- `npm.cmd run build` passed (Vite 8.3.5; 2,595 modules). Existing `docx` buffer-externalization and large-chunk warnings remain. Targeted Problems checks found no errors in the three edited source files.
- Not verified: no live browser network capture was performed during an OCR conversion; hosting-provider request logging/retention is unknown and depends on deployment.

## Category labels, tool introductions, and Organize actions — 2026-10-28
- Renamed the shared category labels to Organize and Convert; related-tool headings now use the requested “Other … tools” wording for all five categories.
- Expanded all 16 tool/limitation page introductions to 100–200 words each with customer-facing, tool-specific guidance. Changed the Organize PDF guide step to “Choose a pdf and review its pages.”
- Organize PDF and Reset controls now render only after a PDF is selected.
- Browser verified all 16 routes render introductions (115–129 words), the five category labels and corresponding related-tool headings, and the Organize PDF guide wording. On `/organize`, both action buttons were absent before selection, appeared after selecting a one-page PDF, and disappeared again after Reset.
- `npm.cmd run build` passed (Vite 8.3.5; 2,595 modules; minified app chunk 1,790.05 kB). Existing `docx` buffer-externalization and large-chunk warnings remain. Targeted Problems checks found no errors in the four edited source files.

## Category menu and repeated tool headings — 2026-10-28
- Removed the empty Image Tools category from the shared registry. The menu and homepage now show only the five categories with active tools; all 14 registered cards remain available.
- Removed the repeated tool-name headings inside Watermark PDF, Compress PDF, and PDF to Word workspaces while preserving their descriptive text. The shared tool page heading remains the single tool-name heading.
- Browser verified each named tool has exactly one exact-name heading and one page `<h1>`. The homepage and category menu showed the same five categories; all 14 cards remained present. Homepage layouts at 360, 768, and 1280 px showed 1, 2, and 3 columns respectively with no horizontal overflow.
- `npm.cmd run build` passed (Vite 8.3.5; 2,595 modules; minified app chunk 1,780.14 kB). Existing `docx` buffer-externalization and large-chunk warnings remain.

## Customer-facing tool workflow — 2026-10-28
- Replaced the technical “How it works” paragraphs on active tool pages with a responsive icon flow: Upload to tool → Process document in browser → Download. The middle step reuses each tool's homepage registry icon.
- Added a plain-language note that selected files are processed locally and are not uploaded to a processing server, while the website still requests its pages and assets. PDF-to-Word's optional OCR resource requests are disclosed. Excel/PowerPoint limitation pages instead state that no upload or processing occurs.
- Browser verified the flow on Merge PDF and Watermark PDF, the unavailable-state message on Excel to PDF, and no horizontal overflow at 390 px. Production build passed (Vite 8.3.5; 2,595 modules); existing `docx` buffer-externalization and large-chunk warnings remain.

## PDF to Images — 2026-10-28
- Added `src/components/PdfToImages.jsx` and registered `/pdf-to-images`. Added `src/lib/imageArchive.js` for valid 24-bit BMP encoding and ZIP creation; no dependency was added.
- The browser validates one unencrypted PDF with 1–50 pages, renders each page locally through PDF.js, and provides PNG, JPG, or BMP output with Standard/High quality. Output is sequentially named and delivered as one ZIP, with progress, cancel, reset, and ZIP-retry handling. A 16-million-pixel per-page cap and 400 MiB cumulative image-byte cap constrain memory use.
- Updated the central tool registry so Image to PDF and PDF to Images are under Convert (originally labelled Convert Files). Image Tools was initially shown with an empty state; it has since been removed from the active category list because no image-manipulation tools are registered.
- Browser verified three-page PNG/JPG/BMP ZIP contents and order, format signatures, CRCs, and decodable images; one- and 50-page BMP ZIP output; Standard/High PNG dimensions; and rejection of 51-page, corrupt, and password-protected PDFs. Category order, Convert Files recommendations, and omission of the current tool from related links were checked.
- At 390 px, the PDF-to-Images page had no horizontal overflow. In dark mode, the upload control used the dark surface token. The hover rule references the muted theme token, but the hidden browser page prevented verification of its rendered hover color.
- `npm.cmd run build` passed after the final upload-zone styling change (Vite 8.3.5; 2,595 modules; 1,375.83 kB PDF.js worker and 1,778.64 kB minified app chunk). Existing `docx` buffer-externalization and large-chunk warnings remain. VS Code test discovery found no test controller.
- The generated ZIP Blob contents were inspected, but a browser download event was not captured; the browser automation page was hidden and its click action timed out. Desktop PDF/image-viewer inspection and physical-browser testing remain unverified.

## Encrypted inputs, Merge PDF limit, and FAQ keyboard — 2026-10-28
- Added `src/lib/pdfValidation.js` to identify encrypted PDFs using the installed `pdf-lib` default load behavior and a clear rejection message. Wired it into all PDF upload workflows; files are assigned to selected-file state only after validation. The Protect PDF tool still creates encrypted output copies but cannot accept an already protected input.
- Updated `src/components/PdfMerger.jsx` to allow a maximum of five valid PDFs, display `Limit reached (max 5)`, disable the upload input at 5/5, and re-enable it after removing a file. The existing page-copy merge and download flow remains intact.
- Updated Merge PDF instructions and both its FAQ and the main FAQ to say five files. Reworded Merge PDF’s “How it works” in customer-friendly terms about selecting, ordering, downloading, and local browser processing without mentioning implementation libraries.
- Added shared Escape-to-close handling for FAQ disclosures in `src/lib/detailsEscape.js`, used on the main FAQ page and every tool FAQ. Changed the organizing related-tools title to “Other organizing tools”.
- Browser verified encrypted-PDF rejection on all 12 PDF-input routes (`/merge`, `/split`, `/rotate`, `/protect`, `/compress`, `/pdf-to-word`, `/watermark`, `/remove-pages`, `/extract-pages`, `/organize`, `/redact`, `/sign`); `/image-to-pdf` rejected a PDF by its image-only format filter. Verified the five-file cap, disabled state, message, removal/re-enable, and successful merge. Verified FAQ Escape after Tab focus, the five-file FAQ answers, and the Organize heading with three related tools. Protect PDF still produced a ready-to-download protected output from a valid unencrypted input.
- `npm.cmd run build` passed (Vite 8.3.5; 2,593 modules; minified app chunk 1,758.74 kB). Existing `docx` buffer-externalization and large-chunk warnings remain. Temporary test PDFs were removed.
- Limitations: the five-input output was generated successfully but its pages were not independently reopened to inspect their order; only prior repeated-source merge output has been parsed. No automated test/lint script is available.
- Next: inspect output content/order for a five-distinct-file merge and continue verifying actual browser downloads.

## FAQ Escape behavior — 2026-10-28
- Updated `src/components/SitePages.jsx` so Escape closes the open FAQ disclosure when its summary is focused, while keeping focus on the question.
- Browser verified on `/faq`: opened “Are my PDF files uploaded?”, pressed Escape, confirmed the disclosure closed and its summary retained focus.
- `npm.cmd run build` passed (Vite 8.3.5; 2,591 modules). Existing `docx` buffer-externalization and large-chunk warnings remain; the minified app chunk is 1,757.15 kB.
- Next: continue verifying remaining tool flows, responsive layouts, and actual browser PDF downloads.

## Shared navigation, cards, search, and theme — 2026-10-28
- Replaced independent native category disclosures with a controlled menu: one open category at a time; trigger click toggles; outside click, Escape, and route selection dismiss; Escape restores trigger focus. On narrow screens the two-column menu expands in document flow instead of overlapping neighboring controls.
- Added a shared compact `ToolCard` for the homepage and related-tool grid. At that stage the homepage grouped 13 cards under six category labels. The registry remains the source for homepage, header categories, search, and same-category related links.
- Made search a labelled searchbox with keyboard-accessible suggestions, ArrowUp/Down and Enter selection, Escape dismissal, clear-query behavior, and no-results status.
- Added theme-token styling for the shared cards, category menus, search suggestions, and file-upload controls. Upload-trigger styling was applied to the relevant image, organize, redact, sign, page-selection, and watermark components; PDF processing logic was not changed.
- Updated `.github/project-instructions.md`, `.github/TOOL_DEVELOPMENT_GUIDELINES.md`, `IDEA.md`, and created `.github/copilot-instructions.md`. OpenCode already loads the four shared project documents; `opencode.json` was inspected and left unchanged.
- Verification: `npm.cmd run build` passed after the source changes (Vite 8.3.5; 2,591 modules). Browser checks covered desktop/mobile menu behavior, outside/Escape dismissal and focus restoration, route selection, search keyboard paths, 13 homepage cards and keyboard activation, responsive 1/2/3-column layouts at 360/768/1280 px, and light/dark upload and menu states. Detailed evidence is in `.github/adsense-readiness-checklist.md`.
- Limitations: individual activation of all 13 cards, remaining tool-page breakpoints, reduced-motion behavior, and additional browsers were not verified. The category assignment is pragmatic: Compress PDF is under Protect & Repair; Optimize is not a separate category. Unlock remains unimplemented pending dependency approval.
- Next: exercise the remaining homepage card destinations and keyboard paths across representative tool routes, then verify actual browser downloads for generated PDFs.

## Routes
- `/` — Home
- `/merge` — Merge PDF
- `/split` — Split PDF
- `/rotate` — Rotate PDF
- `/protect` — Protect PDF
- `/image-to-pdf` — Image to PDF
- `/pdf-to-word` — PDF to Word
- `/compress` — Compress PDF
- `/watermark` — Watermark PDF
- `/remove-pages` — Remove PDF Pages
- `/extract-pages` — Extract PDF Pages
- `/organize` — Organize PDF
- `/redact` — Redact PDF
- `/sign` — Sign PDF (visible signature mark, not cryptographic signing)
- `/pdf-to-images` — PDF to Images
- `/excel-to-pdf`, `/powerpoint-to-pdf` — limitation notices; conversion is unavailable
- `/faq`, `/resources`, `/resources/:articleSlug`
- `/privacy`, `/terms`, `/about`, `/contact`
- Unknown paths use a not-found page; unknown resource slugs also fall back safely.

## Site-wide work — 2026-10-28
- Added `.github/TOOL_DEVELOPMENT_GUIDELINES.md` and `.github/adsense-readiness-checklist.md`; updated `.github/project-instructions.md` and `opencode.json` so the standards and evidence checklist are referenced by the project.
- Added `src/components/ToolPage.jsx` with shared tool intros, instructions, technical explanations, FAQs, and related-tool links. Tool pages now provide route-specific titles/descriptions and a single main heading.
- Added `src/components/SitePages.jsx` for FAQ, resources and three guides, privacy, terms, about, contact, and not-found pages. Unknown article slugs now render a recovery page instead of attempting to render missing content.
- Updated navigation/footer links; removed the dead Pricing/Feedback links and decorative ad placeholders. Added `src/components/AdSlot.jsx` with ads disabled, no consent, IDs, or placements configured.
- Added global visible-focus and reduced-motion behavior, route metadata defaults, and `public/robots.txt`. Removed the Tailwind CDN script; CSS is built locally.
- No production domain, operator/contact details, hosting provider/log-retention details, AdSense publisher ID, or consent platform were supplied. Legal pages are drafts that need owner and jurisdiction-specific review. No approval or deployment readiness is claimed.

## Watermark PDF — 2026-10-28
- Added `src/components/PdfWatermarker.jsx`, registered `/watermark` in `src/App.jsx`, and added an active matching homepage card in `src/components/Home.jsx`.
- Uses installed `pdf-lib` APIs (`drawText`, `StandardFonts.Helvetica`, `rgb`, `degrees`, and text opacity) to add centered, rotated text without rasterizing pages or changing the source file.
- Supports text, 8–96 pt size, colour, -180° to 180° rotation, 0–100% opacity, all pages, and strict 1-based page/range selection.
- Also supports independent page numbering with starting number, top/bottom placement, alignment, colour, size, margin, and an independent page range.
- Displays file size and loaded page count; supports replacing, removing, and resetting the selected file. Output page count and order are retained.
- Limitations: built-in Helvetica has WinAnsi character coverage, so unsupported text is rejected; password-protected PDFs are not supported.

## Expanded site and tool workflows — 2026-10-28
- Added a shared tool registry and header search, persisted light/dark theme selection, a category-limited related-tools grid placed after each tool's FAQ, and explicit notices for unavailable Excel/PowerPoint conversion.
- The registry defines six categories (Organize PDF, Convert Files, Edit & Sign, Protect & Repair, Image Tools, Extract & Analyze) and drives homepage groups, category navigation, search, and related tools. It has 13 active tools; Unlock is intentionally excluded.
- Added `/remove-pages` and `/extract-pages` using a shared PDF.js thumbnail grid and `pdf-lib` output copying. The grid supports up to 50 pages and preserves source order.
- Updated Image to PDF for JPEG/PNG/BMP decoding, resizing, scale/quality controls, and manual output download. Output pages are validated with `pdf-lib`.
- Tool outputs are now offered through explicit Download buttons. `PdfMerger.jsx` was changed to keep its download button outside the Merge button and to avoid saying a download already started.
- Added `src/lib/pdfjsClient.js`, which sets PDF.js's worker URL explicitly. PDF.js renders used for offscreen thumbnails, higher compression, and OCR now use print intent so rendering continues when the browser tab is backgrounded.

## Organize, Redact, Sign, and category navigation
- Added `src/components/OrganizePdf.jsx`, `src/components/RedactPdf.jsx`, and `src/components/SignPdf.jsx`, registered their routes in `src/App.jsx`, and added their active cards to the existing category-grouped homepage.
- Organize PDF reorders, rotates, and removes pages with real previews, then uses `pdf-lib` to preserve the selected pages and produce a new document. The tested output retained two pages in reordered source order, retained text, and applied the configured 90-degree rotation.
- Redact PDF draws opaque masks and outputs rasterized pages so masked source content is not left extractable beneath a cover. Browser verification confirmed the same page count, no extracted text on the output pages, an opaque black sample mask pixel, and visible unmasked source content. Rasterization loses selectable text, vector fidelity, links, forms, and other interactive features.
- Sign PDF supports typed, drawn, and PNG/JPEG signature marks, page selection, and placement controls. Outputs are visible marks only; they do not authenticate identity, prevent document changes, or constitute certificate-backed signatures.
- Category-aware related tools render as a responsive same-category grid (excluding the current tool). Browser checks confirmed Sign shows only Watermark and Redact; Organize shows three peers under “Other organizing tools”.
- Menu dismissal, focus restoration, mobile category switching, search keyboard behavior, and homepage card focus/activation were verified; detailed evidence is in the current navigation section and checklist.
- Upload controls were checked in light and dark themes for normal, hover, focus, pressed, disabled, and simulated drag-active states. Dark menu panel and text colors were also checked; computed styles and browser evidence are recorded in the checklist.
- Unlock PDF is not implemented or registered. The installed encryption package only encrypts; a separate decrypt package was identified, but no explicit approval to add a dependency was received. No dependency was installed.

## Verification actually performed
- The later final `npm.cmd run build` passed after all source updates (Vite 8.3.5; 2,593 modules). It emits a 1,375.83 kB PDF.js worker and a 1,758.74 kB minified app chunk. Existing warnings remain for `docx` externalizing `buffer` and the large app chunk.
- `opencode.json` parsed successfully. Local `/robots.txt` returned HTTP 200 with `User-agent: *` and `Allow: /`.
- Prior browser route sweep covered the original eight tools, FAQ, resource index and three valid resource articles, Privacy, Terms, About, Contact, and unknown routes. New Remove/Extract, Organize, Redact, Sign, category navigation, search, related grid, and theme paths were exercised. Office limitation routes are registered but were not directly browser-tested.
- Browser verified theme toggle persistence after reload; search was exercised using browser Tab, Shift+Tab, ArrowDown, Enter, Escape, clear, and no-results paths. Category menu pointer and keyboard focus behavior and homepage card Tab/Enter activation were verified. Physical keyboard hardware behavior remains unverified in this headless browser.
- Browser confirmed FAQs precede Related Tools, the current tool is omitted from related links, and the 1280px page had no body overflow. On Remove PDF Pages at 360/768/1280px, a 50-page PDF produced all 50 previews with no horizontal overflow. A 51-page PDF was rejected with an explicit limit message.
- Remove PDF Pages: selected page 2 for removal from a 3-page synthetic PDF; the generated PDF parsed as two pages with original page text `TEST PAGE 1`, `TEST PAGE 3`. Select All covered all pages, the all-pages removal attempt was rejected, and Clear Selection cleared the grid.
- Extract PDF Pages: selected pages in order 3 then 1; generated output parsed as two pages in source order (`TEST PAGE 1`, `TEST PAGE 3`).
- Watermark numbering: numbering-only mode with start 7 and selected pages 1,3 generated three pages; extracted text showed 7 on page 1, no number on page 2, and 8 on page 3. Text watermark mode with range 2-3 generated text on only those pages and preserved original text. Oversized text on a small synthetic page was rejected.
- Image to PDF: a synthetic 2×2 BMP was accepted; at 50% scale and Fit image dimensions, its output parsed as a one-page PDF with 48.75×48.75 pt page dimensions.
- Merge PDF: merging the 3-page synthetic PDF twice yielded six pages with source text in order. The download control is no longer nested inside the merge action button.
- Compress PDF: higher-compression warning was shown, PDF.js raster processing completed, and when the synthetic text PDF produced no smaller result the original-size result was not offered as a compressed download.
- Browser inspections captured generated PDF blobs and reopened them with PDF.js to verify page count/order/text. A real browser download event was not captured; watermark appearance was not visually inspected. Do not claim visual verification.
- Organize PDF: generated from a three-page synthetic source after moving page 2 first, rotating it 90 degrees, and removing page 3. PDF.js verified a two-page output in source order 2 then 1, with source text retained and page 1 rotated 90 degrees.
- Redact PDF: generated from a three-page synthetic source with a drag-drawn mask. PDF.js verified three pages and empty text extraction on all pages; sampled mask pixel was black `[0,0,0]`, and unmasked source-text pixels remained visible. This confirms content removal via rasterization for the test fixture, not general visual fidelity.
- Sign PDF: typed signature output retained original text and placed the mark only on selected pages 2-3. Drawn and uploaded-PNG modes produced image-paint operations while preserving source text. Reversed (`3-1`) and out-of-range (`4` for three pages) selections were rejected; Reset cleared the file and alert.
- Search was tested with browser keyboard events: Tab reached Clear Search and a visible suggestion; Shift+Tab returned to the input; Enter opened `/compress`; ArrowDown/Enter opened `/split`; Escape returned focus; clear and no-results behavior worked. Category navigation opened `/redact`; menu dismissal and mobile category switching also worked.
- Dark menu/upload and light/dark upload states were inspected, including simulated drag-active and keyboard focus. Homepage layouts at 360, 768, and 1280 px showed 1, 2, and 3 columns without horizontal overflow; other tool-page breakpoints remain unverified.
- Generated Organize, Redact, and Sign output Blobs were reopened and parsed with PDF.js. Browser download events for these new tools were not captured, so an actual saved download remains unverified.
- Browser verified the Watermark card navigates to `/watermark`, a synthetic three-page PDF's filename/size/page count, invalid out-of-range selection rejection, selected/all processing states, replacement picker, and reset.
- Earlier Node/PDF.js verification reopened generated watermarked PDFs, retained four pages and original text, and extracted watermarks only on selected pages or all pages as requested. The test exercised colour, rotation, and opacity.
- Browser resource inspection found no AdSense or Tailwind CDN requests on inspected routes. This does not verify OCR-time network requests or hosting logs.
- VS Code test discovery found no test controller or matching test items. No project test/lint runner was available in the initial inventory. Git status is unavailable because `C:\Projects\pdf` is not a Git repository.

## Remaining work / owner actions
- Verify actual browser downloads and visually inspect generated watermark/compression/image/Organize/Redact/Sign outputs. Browser-automation capture of the download event remains unavailable.
- Manually verify physical keyboard/pointer interactions, reduced-motion behavior, representative dark-theme contrast, and responsive layouts on remaining routes.
- Test other tool flows and their invalid inputs; test JPEG/PNG image inputs and actual OCR behavior/network requests.
- Test production-host direct refresh/SPA fallback and deployed `robots.txt`; provide a production domain before configuring canonical URLs or a sitemap.
- Supply legal operator/contact, hosting/log-retention and jurisdiction details; obtain legal review of Privacy and Terms.
- Keep advertising disabled until the owner supplies genuine publisher/ad-unit IDs, chooses target regions, configures an appropriate consent platform, reviews current policies, and deploys a valid `ads.txt`.
- Inspect Tesseract network behavior during an actual scanned-PDF conversion and obtain hosting-provider request/log details.

## Change log
- 2026-10-28: Rejected password-protected PDF inputs across PDF tools, raised Merge PDF's maximum to five with matching FAQ/customer copy, added FAQ Escape dismissal, and renamed the Organize related-tools heading. Build and browser evidence are recorded above.
- 2026-10-28: Added theme/search/related-tools navigation, Remove/Extract Pages, page numbering, image resize/BMP support, and honest Office conversion notices. Fixed PDF.js background-tab rendering and merger manual-download markup; verified synthetic PDF outputs and production build.
- 2026-10-28: Added client-side PDF-to-Images export to PNG/JPG/BMP ZIPs and moved Image to PDF into Convert Files. Verified generated archive contents and validation paths; production build passed. Browser download capture remains unverified.
- 2026-10-28: Added site content/readiness documentation and shared page shell; improved metadata, navigation, focus/motion defaults, safe-off ad infrastructure, and local crawler configuration. Fixed unknown resource-slug fallback and verified routes/build.
- 2026-10-28: Added Watermark PDF route, homepage card, local PDF watermarking, page-range validation, and implementation checks.
- Added Organize, Redact, and Sign PDF routes and workflows; grouped tools into six categories; made related tools category-aware; corrected search focus behavior and dark upload hover styling. Final production build passed; synthetic-PDF and browser checks are recorded above.
- 2026-10-28: Added shared compact homepage/related cards, controlled responsive category navigation, accessible search keyboard behavior, and theme-aware menu/upload states. Updated project guidance and recorded build/browser evidence.
- 2026-10-27: Added Compress PDF route, homepage card, and local batch-processing UI. No dependency changes.
- 2026-10-27: Confirmed Image to PDF reorder controls in source; browser conversion/order checks remain outstanding.
