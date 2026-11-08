import React from 'react';
import { LoaderCircle } from 'lucide-react';
import FocusRing from './FocusRing';

const VARIANT_CLASSES = {
  primary: 'bg-brand-700 text-white hover:bg-brand-800 dark:bg-brand-900 dark:text-surface-50 dark:hover:bg-brand-800',
  secondary: 'border border-brand-600 bg-surface-100 text-brand-700 hover:bg-brand-50 dark:bg-surface-100 dark:text-surface-fg dark:hover:bg-surface-200',
  ghost: 'bg-transparent text-brand-700 hover:bg-brand-50 dark:text-brand-700 dark:hover:bg-surface-100',
  danger: 'bg-danger text-danger-foreground hover:brightness-95 dark:hover:brightness-110',
};

const SIZE_CLASSES = {
  sm: 'min-h-11 gap-1.5 px-3 py-1 text-base',
  md: 'min-h-11 gap-2 px-4 py-2 text-base',
  lg: 'min-h-[52px] gap-2.5 px-5 py-3 text-lg',
};

const Button = React.forwardRef(function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  iconLeft,
  iconRight,
  as = 'button',
  children,
  className = '',
  onClick,
  type = 'button',
  ...rest
}, ref) {
  if (!Object.hasOwn(VARIANT_CLASSES, variant)) {
    throw new Error(`Unsupported Button variant: ${variant}`);
  }
  if (!Object.hasOwn(SIZE_CLASSES, size)) {
    throw new Error(`Unsupported Button size: ${size}`);
  }
  if (as !== 'button' && as !== 'a') {
    throw new Error('Button must render as a button or anchor.');
  }

  const Component = as;
  const isDisabled = disabled || loading;
  if (as === 'a' && !isDisabled && !rest.href) {
    throw new Error('An enabled Button rendered as an anchor requires an href.');
  }

  const classes = [
    'inline-flex min-w-[44px] items-center justify-center rounded-md font-semibold leading-5 transition-colors',
    'focus-visible:z-10',
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
    className,
  ].filter(Boolean).join(' ');

  const handleClick = (event) => {
    if (isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    onClick?.(event);
  };

  const props = {
    ...rest,
    ref,
    className: classes,
    onClick: handleClick,
    'aria-busy': loading ? 'true' : rest['aria-busy'],
    'aria-disabled': as === 'a' && isDisabled ? true : rest['aria-disabled'],
  };

  if (as === 'button') {
    props.type = type;
    props.disabled = isDisabled;
  } else if (as === 'a' && isDisabled) {
    props.tabIndex = -1;
    props.href = undefined;
  }

  return (
    <FocusRing>
      <Component {...props}>
        {loading && (
          <LoaderCircle
            className="h-4 w-4 shrink-0 animate-spin motion-reduce:animate-none"
            aria-hidden="true"
          />
        )}
        {!loading && iconLeft && <span className="inline-flex shrink-0" aria-hidden="true">{iconLeft}</span>}
        {children}
        {!loading && iconRight && <span className="inline-flex shrink-0" aria-hidden="true">{iconRight}</span>}
      </Component>
    </FocusRing>
  );
});

export default Button;
