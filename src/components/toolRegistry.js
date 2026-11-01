import {
  Archive,
  Crop,
  FileStack,
  FileType,
  FileImage as FileImageIcon,
  Image as ImageIcon,
  Lock,
  PenLine,
  Pencil,
  RotateCw,
  ScanText,
  ShieldAlert,
  Scissors,
  StretchHorizontal,
  Stamp,
  Trash2,
  Unlock
} from 'lucide-react';

export const TOOL_CATEGORIES = [
  {
    id: 'organize',
    name: 'Organize',
    path: '/categories/organize',
    description: 'Combine PDF files, rotate pages, remove unwanted pages, crop the visible page area, or rearrange and rotate pages into a new order. These tools help prepare a document’s page sequence and framing before you share it.'
  },
  {
    id: 'convert',
    name: 'Convert',
    path: '/categories/convert',
    description: 'Create PDFs from JPG, PNG, or BMP images, export PDF pages as PNG, JPG, or BMP images, or turn PDF text into an editable Word document. PDF-to-Word can use OCR for scanned pages and explains its layout limitations.'
  },
  {
    id: 'edit-sign',
    name: 'Edit & Sign',
    path: '/categories/edit-sign',
    description: 'Add text, images, drawings, highlights, and shapes to a PDF copy; apply text watermarks or page numbers; add a visible signature; or permanently redact selected areas. Editing adds overlays rather than replacing existing text, while redaction rasterizes pages.'
  },
  {
    id: 'protect-repair',
    name: 'Protect & Repair',
    path: '/categories/protect-repair',
    description: 'Add an opening password, remove encryption when you know the correct password, or try to reduce a PDF’s file size. Higher compression rasterizes pages and can reduce image and text quality; compare the measured output before downloading.'
  },
  {
    id: 'extract-analyze',
    name: 'Extract',
    path: '/categories/extract',
    description: 'Choose pages visually to make one PDF, split every page, divide a document into percentage-based sections, or recognize text in scanned pages. OCR may download supporting language resources when first used.'
  }
];

export const TOOL_REGISTRY = [
  {
    id: 'merge',
    name: 'Merge PDF',
    path: '/merge',
    category: 'organize',
    description: 'Combine PDF files into one document.',
    keywords: 'combine join concatenate',
    icon: FileStack,
    color: 'bg-blue-500'
  },
  {
    id: 'split',
    name: 'Split PDF',
    path: '/split',
    category: 'extract-analyze',
    description: 'Select pages visually, split every page, or create balanced percentage-based sections.',
    keywords: 'divide separate pages select thumbnails percentage parts',
    icon: Scissors,
    color: 'bg-purple-500'
  },
  {
    id: 'rotate',
    name: 'Rotate PDF',
    path: '/rotate',
    category: 'organize',
    description: 'Rotate all or selected PDF pages.',
    keywords: 'turn orientation',
    icon: RotateCw,
    color: 'bg-amber-500'
  },
  {
    id: 'protect',
    name: 'Protect PDF',
    path: '/protect',
    category: 'protect-repair',
    description: 'Encrypt a PDF with an opening password.',
    keywords: 'password encrypt secure',
    icon: Lock,
    color: 'bg-red-500'
  },
  {
    id: 'unlock',
    name: 'Unlock PDF',
    path: '/unlock',
    category: 'protect-repair',
    description: 'Remove PDF opening encryption when you know the correct password.',
    keywords: 'decrypt remove password unprotect',
    icon: Unlock,
    color: 'bg-blue-500'
  },
  {
    id: 'image',
    name: 'Image to PDF',
    path: '/image-to-pdf',
    category: 'convert',
    description: 'Arrange images and create a PDF.',
    keywords: 'jpg jpeg png bmp photo pictures',
    icon: ImageIcon,
    color: 'bg-emerald-500'
  },
  {
    id: 'pdf-images',
    name: 'PDF to Images',
    path: '/pdf-to-images',
    category: 'convert',
    description: 'Convert PDF pages to PNG, JPG, or BMP images in a ZIP.',
    keywords: 'export pages png jpg jpeg bmp zip convert',
    icon: FileImageIcon,
    color: 'bg-sky-500'
  },
  {
    id: 'word',
    name: 'PDF to Word',
    path: '/pdf-to-word',
    category: 'convert',
    description: 'Extract PDF text into an editable Word document.',
    keywords: 'docx convert text OCR',
    icon: FileType,
    color: 'bg-indigo-500'
  },
  {
    id: 'compress',
    name: 'Compress PDF',
    path: '/compress',
    category: 'protect-repair',
    description: 'Try structural optimization or higher compression.',
    keywords: 'reduce size shrink optimize',
    icon: Archive,
    color: 'bg-violet-500'
  },
  {
    id: 'edit',
    name: 'Edit PDF',
    path: '/edit-pdf',
    category: 'edit-sign',
    description: 'Add text, images, drawings, highlights, and shapes to a PDF copy.',
    keywords: 'edit annotate markup text image draw highlight shape',
    icon: Pencil,
    color: 'bg-blue-500'
  },
  {
    id: 'watermark',
    name: 'Watermark PDF',
    path: '/watermark',
    category: 'edit-sign',
    description: 'Add text watermarks and page numbers.',
    keywords: 'stamp number pages',
    icon: Stamp,
    color: 'bg-cyan-500'
  },
  {
    id: 'remove',
    name: 'Remove PDF Pages',
    path: '/remove-pages',
    category: 'organize',
    description: 'Select and remove pages from a PDF.',
    keywords: 'delete erase omit',
    icon: Trash2,
    color: 'bg-rose-500'
  },
  {
    id: 'ocr',
    name: 'OCR PDF',
    path: '/ocr-pdf',
    category: 'extract-analyze',
    description: 'Recognize text in scanned PDF pages and add a searchable text layer.',
    keywords: 'optical character recognition scanned image search text layer recognize',
    icon: ScanText,
    color: 'bg-cyan-500'
  },
  {
    id: 'crop',
    name: 'Crop PDF',
    path: '/crop-pdf',
    category: 'organize',
    description: 'Crop the visible page area in a PDF without rasterizing its content.',
    keywords: 'trim page boundary crop box resize margins',
    icon: Crop,
    color: 'bg-indigo-500'
  },
  {
    id: 'organize-pages',
    name: 'Organize PDF',
    path: '/organize',
    category: 'organize',
    description: 'Reorder, rotate, or remove PDF pages.',
    keywords: 'rearrange reorder move rotate delete pages',
    icon: StretchHorizontal,
    color: 'bg-teal-500'
  },
  {
    id: 'redact',
    name: 'Redact PDF',
    path: '/redact',
    category: 'edit-sign',
    description: 'Permanently cover sensitive page content.',
    keywords: 'censor hide black out remove sensitive information',
    icon: ShieldAlert,
    color: 'bg-orange-500'
  },
  {
    id: 'sign',
    name: 'Sign PDF',
    path: '/sign',
    category: 'edit-sign',
    description: 'Add a visible typed, drawn, or image signature.',
    keywords: 'signature sign initials',
    icon: PenLine,
    color: 'bg-fuchsia-500'
  }
];
