import React from 'react';
import { CheckCircle2, Download } from 'lucide-react';
import { formatOutputSize } from '../lib/outputSize.mjs';

const DownloadReadyCard = ({
  fileName,
  sizeBytes,
  downloadLabel = 'Download PDF',
  onDownload,
  href,
  details
}) => (
  <section className="download-ready-card" role="group" aria-label={`${fileName} download`}>
    <div className="download-ready-card-message">
      <CheckCircle2 className="download-ready-card-icon" aria-hidden="true" />
      <div className="download-ready-card-copy">
        <p className="download-ready-card-title" role="status">{fileName} is ready ({formatOutputSize(sizeBytes)})</p>
        {details && <p className="download-ready-card-details">{details}</p>}
      </div>
    </div>
    {href ? (
      <a
        href={href}
        download={fileName}
        onClick={onDownload}
        className="download-ready-card-action"
      >
        <Download aria-hidden="true" />
        {downloadLabel}
      </a>
    ) : (
      <button
        type="button"
        onClick={onDownload}
        className="download-ready-card-action"
      >
        <Download aria-hidden="true" />
        {downloadLabel}
      </button>
    )}
  </section>
);

export default DownloadReadyCard;
