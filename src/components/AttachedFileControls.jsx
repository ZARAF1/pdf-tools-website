import React from 'react';
import { FileText, RefreshCw, Trash2 } from 'lucide-react';
import { getLocalizedToolUi, formatToolUiMessage } from '../i18n/toolUiLocalization.mjs';
import { useLanguage } from '../i18n/useLanguage';

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
}) => {
  const { language } = useLanguage();
  const { fileActions } = getLocalizedToolUi(language);
  const replaceLabel = formatToolUiMessage(fileActions.replace, { fileName });
  const removeLabel = formatToolUiMessage(fileActions.remove, { fileName });

  return (
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
          aria-label={replaceLabel}
          title={replaceLabel}
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
          aria-label={removeLabel}
          title={removeLabel}
          className="pdf-attached-file-action is-remove"
        >
          <Trash2 aria-hidden="true" />
        </button>
      )}
    </span>
  );
};
