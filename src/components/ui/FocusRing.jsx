import React from 'react';

const FocusRing = ({ children, focusableOnly = true, className = '' }) => {
  const child = React.Children.only(children);

  if (!React.isValidElement(child)) {
    throw new Error('FocusRing requires one focusable React element.');
  }

  const focusClass = focusableOnly
    ? 'focus-visible:outline-none focus-visible:shadow-focusRing'
    : 'focus:outline-none focus:shadow-focusRing';
  const childClassName = [child.props.className, focusClass, className]
    .filter(Boolean)
    .join(' ');

  return React.cloneElement(child, { className: childClassName });
};

export default FocusRing;
