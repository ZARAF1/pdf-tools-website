import React, { useId } from 'react';
import FocusRing from './FocusRing';

const SIZE_CLASSES = {
  md: 'min-h-11',
  lg: 'min-h-[52px]',
};

const Input = React.forwardRef(function Input({
  label,
  hint,
  error,
  size = 'md',
  id,
  className = '',
  'aria-describedby': describedBy,
  'aria-invalid': ariaInvalid,
  ...rest
}, ref) {
  if (label === undefined || label === null || label === '') {
    throw new Error('Input requires a visible label.');
  }
  if (!Object.hasOwn(SIZE_CLASSES, size)) {
    throw new Error(`Unsupported Input size: ${size}`);
  }

  const generatedId = useId();
  const inputId = id || `ui-input-${generatedId}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const descriptionIds = [describedBy, hintId, errorId].filter(Boolean).join(' ') || undefined;
  const inputClasses = [
    'block w-full rounded-md border bg-surface-100 px-3 text-base leading-6 text-surface-fg',
    'placeholder:text-surface-fg-muted focus-visible:outline-none',
    'disabled:cursor-not-allowed disabled:opacity-60',
    SIZE_CLASSES[size],
    error ? '!border-danger' : '!border-brand-600 dark:!border-brand-700',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className="grid gap-1.5">
      <label htmlFor={inputId} className="text-base font-semibold leading-6 text-surface-fg">
        {label}
      </label>
      <FocusRing>
        <input
          {...rest}
          ref={ref}
          id={inputId}
          className={inputClasses}
          aria-invalid={error ? true : ariaInvalid}
          aria-describedby={descriptionIds}
        />
      </FocusRing>
      {hint && <p id={hintId} className="text-base leading-6 text-surface-fg-secondary">{hint}</p>}
      {error && (
        <p id={errorId} role="alert" className="text-base font-medium leading-6 text-danger">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
