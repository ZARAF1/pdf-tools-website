import React from 'react';
import { FileText, RefreshCw, Trash2 } from 'lucide-react';

export const AttachedFileIcon = () => (
  <span className="pdf-attached-file-icon">
    <FileText aria-hidden="true" />
  </span>
);

export const AttachedFileActions = ({
  fileName,
  onReplace,
  onRemove,
  disabled = false
}) => (
  <span className="pdf-attached-file-actions">
    {onReplace && (
      <button
        type="button"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          onReplace();
        }}
        disabled={disabled}
        aria-label={`Replace ${fileName}`}
        title={`Replace ${fileName}`}
        className="pdf-attached-file-action is-replace"
      >
        <RefreshCw aria-hidden="true" />
      </button>
    )}
    {onRemove && (
      <button
        type="button"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          onRemove();
        }}
        disabled={disabled}
        aria-label={`Remove ${fileName}`}
        title={`Remove ${fileName}`}
        className="pdf-attached-file-action is-remove"
      >
        <Trash2 aria-hidden="true" />
      </button>
    )}
  </span>
);
