import React from 'react';

const TONE_CLASSES = {
  neutral: 'bg-surface-200 text-surface-900 dark:bg-surface-200 dark:text-surface-900',
  brand: 'bg-brand-100 text-brand-900 dark:bg-brand-100 dark:text-brand-900',
  success: 'bg-success text-success-foreground',
  warning: 'bg-warning text-warning-foreground',
  danger: 'bg-danger text-danger-foreground',
};

const SIZE_CLASSES = {
  sm: 'min-h-6 px-2 text-xs',
  md: 'min-h-7 px-2.5 text-sm',
};

const Badge = ({ tone = 'neutral', size = 'sm', children, className = '', ...rest }) => {
  if (!Object.hasOwn(TONE_CLASSES, tone)) {
    throw new Error(`Unsupported Badge tone: ${tone}`);
  }
  if (!Object.hasOwn(SIZE_CLASSES, size)) {
    throw new Error(`Unsupported Badge size: ${size}`);
  }

  return (
    <span
      {...rest}
      className={[
        'inline-flex w-fit items-center justify-center rounded-full font-semibold leading-5',
        TONE_CLASSES[tone],
        SIZE_CLASSES[size],
        className,
      ].filter(Boolean).join(' ')}
    >
      {children}
    </span>
  );
};

export default Badge;
