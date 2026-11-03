import React, { lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getLocalizedTool } from '../i18n/toolTranslations.mjs';
import { useLanguage } from '../i18n/useLanguage';

const ImageToPdf = lazy(() => import('./ImageToPdf'));
const PdfToImages = lazy(() => import('./PdfToImages'));

const ImagePdf = () => {
  const { language, translate } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const direction = searchParams.get('direction') === 'pdf-to-images'
    ? 'pdf-to-images'
    : 'images-to-pdf';
  const imageToPdfLabel = getLocalizedTool(language, {
    id: 'image',
    name: 'Image to PDF',
    description: 'Create a PDF from images.'
  }).name;
  const pdfToImagesLabel = getLocalizedTool(language, {
    id: 'pdf-images',
    name: 'PDF to Images',
    description: 'Export PDF pages as image files.'
  }).name;
  const toolLabel = getLocalizedTool(language, {
    id: 'image-pdf',
    name: 'Images ↔ PDF',
    description: 'Convert between images and PDF.'
  }).name;

  const selectDirection = (nextDirection) => {
    setSearchParams({ direction: nextDirection }, { replace: true });
  };

  return (
    <div className="image-pdf-tool space-y-6">
      <div className="image-pdf-direction-switch" role="group" aria-label={toolLabel}>
        <button
          type="button"
          aria-pressed={direction === 'images-to-pdf'}
          onClick={() => selectDirection('images-to-pdf')}
        >
          {imageToPdfLabel}
        </button>
        <button
          type="button"
          aria-pressed={direction === 'pdf-to-images'}
          onClick={() => selectDirection('pdf-to-images')}
        >
          {pdfToImagesLabel}
        </button>
      </div>
      <div hidden={direction !== 'images-to-pdf'}>
        <Suspense fallback={<p role="status">{translate('loadingTool')}</p>}>
          <ImageToPdf />
        </Suspense>
      </div>
      <div hidden={direction !== 'pdf-to-images'}>
        <Suspense fallback={<p role="status">{translate('loadingTool')}</p>}>
          <PdfToImages />
        </Suspense>
      </div>
    </div>
  );
};

export default ImagePdf;
