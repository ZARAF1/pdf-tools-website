# Website Audit Plan

## Current Architecture

- React 19 and React Router application built with Vite.
- Shared registry in `src/components/toolRegistry.js` drives category pages, navigation, search, and related-tool discovery.
- Browser-side PDF processing uses PDF-lib, PDF.js, Tesseract.js, and specialized PDF encrypt/decrypt packages.
- Tool workflows are implemented as route-level components under `src/components/`; shared upload validation is in `src/lib/pdfValidation.js`.
- The five category groups are Organize, Convert, Edit & Sign, Protect & Repair, and Extract.

## Confirmed Tool Routes

- Implemented registry tools: Merge, Split, Rotate, Protect, Unlock, Image to PDF, PDF to Images, PDF to Word, OCR, Compress, Edit, Watermark, Remove Pages, Extract Pages, Crop, Organize, Redact, and Sign.
- Information routes: FAQ, resources, privacy, terms, about, contact, and not-found handling.
- Office conversion routes currently exist as explicit limitation notices rather than genuine conversion workflows.

## Audit Risks and Priorities

1. Verify every upload path rejects encrypted and corrupt files without changing a valid existing document.
2. Verify every PDF operation creates an independently valid output and preserves the original file.
3. Test keyboard, focus, semantics, status/error announcements, target size, zoom/reflow, and reduced motion across representative tool workflows.
4. Audit dependencies, client-side storage, third-party resources, route behavior, secrets, unsafe rendering, and hosting/security configuration.
5. Verify mobile navigation/search, popovers, page headings, metadata, 404 behavior, resource links, and footer/navigation destinations.
6. Preserve current uncommitted navigation/search/documentation work and do not reset, revert, commit, or push changes.

## Verification Strategy

- Read the complete implementation for each tool before changing shared behavior.
- Use synthetic non-sensitive PDFs and images generated inside the workspace.
- Run `npm.cmd run build`, `npm.cmd audit --omit=dev`, `npm.cmd audit`, and `git diff --check`.
- Add only lightweight compatible test tooling if existing scripts or browser capabilities cannot cover verified defects.
- Reopen generated PDFs using PDF-lib/PDF.js and independently inspect page count, text/image/rotation/content changes, encryption, and output size.
- Use browser route sweeps for headings, metadata, overflow, keyboard navigation, focus restoration, dialogs, themes, and mobile layouts.
- Record executed evidence only in `.github/adsense-readiness-checklist.md` and `.github/project-status.md`.

## Architecture Changes

- Prefer shared helpers and existing registry patterns over new abstractions.
- Make no routing, processing, password, download, or output-format changes merely to simplify refactoring.
- Add dependencies only after a demonstrated defect requires tooling unavailable in the repository; get approval before external services, paid tools, API keys, or dependency additions.
- No code change is complete until build/source verification and relevant workflow evidence are recorded.
