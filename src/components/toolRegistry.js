import {
  Archive,
  FileStack,
  FileText,
  FileType,
  FileImage as FileImageIcon,
  Image as ImageIcon,
  Lock,
  PenLine,
  RotateCw,
  ShieldAlert,
  Scissors,
  StretchHorizontal,
  Stamp,
  Trash2
} from 'lucide-react';

export const TOOL_CATEGORIES = [
  {
    id: 'organize',
    name: 'Organize',
    path: '/categories/organize',
    description: 'Bring PDFs into a clearer order. Combine documents, rearrange pages, correct orientation, or remove pages you no longer need.'
  },
  {
    id: 'convert',
    name: 'Convert',
    path: '/categories/convert',
    description: 'Convert supported PDFs and images into useful formats for reading, sharing, and editing. Each tool explains its supported files and current limitations.'
  },
  {
    id: 'edit-sign',
    name: 'Edit & Sign',
    path: '/categories/edit-sign',
    description: 'Add visible marks and signatures, or permanently remove sensitive page content. Review each tool’s capabilities and output trade-offs before you begin.'
  },
  {
    id: 'protect-repair',
    name: 'Protect & Repair',
    path: '/categories/protect-repair',
    description: 'Use the available protection and optimization tools for PDF files. Check each tool’s settings and results to understand what changed in the output.'
  },
  {
    id: 'extract-analyze',
    name: 'Extract',
    path: '/categories/extract',
    description: 'Pull selected pages from a PDF or split a document into separate files, so it is easier to share or work with only the pages you need.'
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
    description: 'Extract pages or create separate page files.',
    keywords: 'divide separate pages',
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
    id: 'extract',
    name: 'Extract PDF Pages',
    path: '/extract-pages',
    category: 'extract-analyze',
    description: 'Save selected pages as a new PDF.',
    keywords: 'copy selected pages',
    icon: FileText,
    color: 'bg-sky-500'
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
