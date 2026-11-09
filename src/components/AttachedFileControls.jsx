import React from 'react';
import { FileText, RefreshCw, Trash2 } from 'lucide-react';
import { getLocalizedToolUi, formatToolUiMessage } from '../i18n/toolUiLocalization.mjs';
import { useLanguage } from '../i18n/useLanguage';

export const AttachedFileIcon = () => (
  <span className="pdf-attached-file-icon !rounded-xl !bg-[#f6f1e8] !text-[#7c2d12]">
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
          className="pdf-attached-file-action is-replace hover:!bg-[#f6f1e8] hover:!text-[#7c2d12] focus-visible:!outline focus-visible:!outline-[3px] focus-visible:!outline-offset-2 focus-visible:!outline-[#174ea6]"
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
          className="pdf-attached-file-action is-remove focus-visible:!outline focus-visible:!outline-[3px] focus-visible:!outline-offset-2 focus-visible:!outline-[#174ea6]"
        >
          <Trash2 aria-hidden="true" />
        </button>
      )}
    </span>
  );
};
