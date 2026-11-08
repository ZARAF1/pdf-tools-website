import React from 'react';
import FocusRing from './FocusRing';

const VARIANT_CLASSES = {
  default: 'border border-surface-500 bg-surface-100 shadow-card',
  featured: 'border border-brand-600 bg-surface-100 shadow-card',
  interactive: 'border border-surface-500 bg-surface-100 shadow-card transition-shadow hover:shadow-cardHover',
};

const Card = ({ variant = 'default', as, children, className = '', ...rest }) => {
  if (!Object.hasOwn(VARIANT_CLASSES, variant)) {
    throw new Error(`Unsupported Card variant: ${variant}`);
  }

  const isInteractive = variant === 'interactive';
  const Component = as || (isInteractive ? 'button' : 'div');

  if (isInteractive && Component !== 'button' && Component !== 'a') {
    throw new Error('Interactive Card must render as a button or anchor.');
  }
  if (isInteractive && Component === 'a' && !rest.href) {
    throw new Error('Interactive Card rendered as an anchor requires an href.');
  }

  const props = {
    ...rest,
    className: [
      'block rounded-lg p-4 text-left text-surface-fg',
      VARIANT_CLASSES[variant],
      isInteractive ? 'cursor-pointer' : '',
      className,
    ].filter(Boolean).join(' '),
  };

  if (isInteractive && Component === 'button') {
    props.type = rest.type || 'button';
  }

  const card = <Component {...props}>{children}</Component>;
  return isInteractive ? <FocusRing>{card}</FocusRing> : card;
};

export default Card;
