import React, { useEffect, useId, useState } from 'react';
import { CheckCircle2, Download } from 'lucide-react';
import { formatOutputSize } from '../lib/outputSize.mjs';
import { normalizeOutputFileName } from '../lib/outputFileName.mjs';
import { useLanguage } from '../i18n/useLanguage';
import { getLocalizedToolUi } from '../i18n/toolUiLocalization.mjs';

const DownloadReadyCard = ({
  fileName,
  sizeBytes,
  downloadLabel = 'Download PDF',
  onDownload,
  href,
  details,
  showFilenameEditor = true
}) => {
  const { language } = useLanguage();
  const nameInputId = useId();
  const [downloadName, setDownloadName] = useState(fileName);
  const safeDownloadName = normalizeOutputFileName(downloadName, fileName);
  const outputFilenameLabel = getLocalizedToolUi(language).fileActions.outputFilename;

  useEffect(() => {
    setDownloadName(fileName);
  }, [fileName]);

  return (
    <section className="download-ready-card" role="group" aria-label={`${safeDownloadName} download`}>
      <div className="download-ready-card-message">
        <CheckCircle2 className="download-ready-card-icon" aria-hidden="true" />
        <div className="download-ready-card-copy">
          <p className="download-ready-card-title" role="status">{safeDownloadName} is ready ({formatOutputSize(sizeBytes)})</p>
          {details && <p className="download-ready-card-details">{details}</p>}
        </div>
      </div>
      <div className="download-ready-card-controls">
        {showFilenameEditor && (
          <label className="download-ready-card-name" htmlFor={nameInputId}>
            <span>{outputFilenameLabel}</span>
            <input
              id={nameInputId}
              type="text"
              value={downloadName}
              onChange={(event) => setDownloadName(event.target.value)}
              aria-label={outputFilenameLabel}
            />
          </label>
        )}
        {href ? (
          <a
            href={href}
            download={safeDownloadName}
            onClick={() => onDownload?.()}
            className="download-ready-card-action"
          >
            <Download aria-hidden="true" />
            {downloadLabel}
          </a>
        ) : (
          <button
            type="button"
            onClick={() => onDownload?.(safeDownloadName)}
            className="download-ready-card-action"
          >
            <Download aria-hidden="true" />
            {downloadLabel}
          </button>
        )}
      </div>
    </section>
  );
};

export default DownloadReadyCard;
