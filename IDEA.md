# Project Idea: Free Online PDF Utility Website

Build and continuously improve a beautiful, modern website that provides free PDF tools directly in the browser. The project already exists at `C:\Projects\pdf`. This is an existing application that must be continued, not replaced with a newly scaffolded project.

## Vision

Create a polished, trustworthy online PDF toolkit where users can perform common PDF tasks through a simple interface without installing desktop software. The long-term goal is to offer a broad collection of useful PDF utilities, attract organic search traffic, and potentially monetise the website through Google AdSense, subject to its policies and approval.

## Existing Application

The current application uses React 19, Vite, React Router, Tailwind CSS, Lucide React, `pdf-lib`, PDF.js, and `react-dropzone`. Check `package.json` and source before changing dependencies.

The active tool registry lists 17 browser-side tools across five categories, ordered as follows:

- **Organize PDF:** Merge, Rotate, Remove Pages, Organize PDF, and Crop PDF.
- **Convert Files:** Image to PDF, PDF to Images, and PDF ↔ Word (editable DOCX from PDFs or image-based PDFs from DOCX).
- **Edit & Sign:** Edit PDF, Watermark PDF, Redact PDF, and Sign PDF. Redaction rasterizes every page and removes selectable text and interactive features; Sign PDF adds a visible mark, not a cryptographic signature.
- **Protect & Repair:** Protect PDF, Unlock PDF, and Compress PDF.
- **Extract:** Split / Extract PDF combines visual page extraction, per-page splitting, and percentage-based sections; OCR PDF recognizes scanned text.

PDF to Images is available at `/pdf-to-images`; it converts pages to PNG, JPG, or BMP images and provides them in one ZIP. Image to PDF and PDF to Images belong under Convert Files. `/excel-to-pdf` and `/powerpoint-to-pdf` explain that local conversion is unavailable. See `.github/project-status.md` for current verification and limitations.

## Design Direction — Extremely Important

Preserve the website's existing visual identity. Its current design is the foundation for every future tool.

Maintain the established typography and font choices, heading hierarchy, colour palette, backgrounds, spacing, alignment, borders, shadows, buttons, icons, cards, navigation, animations, responsive layouts, and overall look and feel.

Every new PDF tool must look like a natural part of the same website. Reuse existing page layouts, components, styling conventions, and interaction patterns rather than inventing a new design system. Do not redesign the homepage or alter unrelated pages when implementing a new feature.

When improving the design, make only targeted changes that are justified by an identified problem. Prefer consistency and refinement over redesign.

## Development Principles

1. Continue working in `C:\Projects\pdf` and build on the existing codebase.
2. Read `.github/project-instructions.md` and `.github/project-status.md` at the start of each session. For Copilot, begin at `.github/copilot-instructions.md`; consult the shared-tool guidelines and readiness checklist when relevant.
3. Inspect the relevant source files before editing. Do not assume that a feature works merely because it is listed in the status file.
4. Preserve working functionality, routes, design, dependencies, and configuration. Do not change `package.json`, install packages, or alter global settings without a clear need and appropriate approval.
5. Work incrementally, performing one operation at a time. After every file edit, reread the saved file and verify the result.
6. Avoid repeated failed tool calls and fragile search-and-replace edits. If an operation fails, report the exact error and stop repeating the same failed action. If the same underlying issue occurs twice, stop and explain the blocker.
7. Test actual behaviour, not just whether the code looks correct. Run the available build checks and, where possible, test tools in the browser using real sample files.
8. Update `.github/project-status.md` only after verified changes. Clearly distinguish implemented, tested, unverified, and planned features.
9. Never claim a feature works, a build passes, or a test succeeded without evidence.

## Product Goals

Gradually expand the website with useful PDF utilities while maintaining high quality and a consistent user experience. Prioritise tools that solve real user problems, work reliably, load quickly, handle errors gracefully, and protect users' documents.

Provide clear upload areas, file information, progress and completion states, helpful validation messages, accessible controls, and useful download actions. Where practical, process documents locally in the browser so users do not need to upload private files to a server.

Future monetisation should not compromise the tool experience. Keep pages fast, mobile-friendly, accessible, search-engine friendly, and suitable for a trustworthy free utility website. Any advertising or analytics integrations should be considered separately and implemented only when appropriate.

## Immediate Priority

Continue verifying untested existing flows, visual output, and real browser downloads. Resolve the Unlock PDF dependency decision before exposing a route or card. Keep deployment and legal/privacy owner actions in the project status checklist.

## Definition of Success

The project should become a cohesive collection of reliable, easy-to-use PDF tools, with a distinctive and consistent visual design, verified functionality, maintainable code, minimal unnecessary dependencies, and a realistic path to sustainable website traffic and monetisation.
