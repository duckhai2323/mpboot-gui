import React from 'react';

export const MButton = (
  props: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
) => {
  const { children, type = 'button', ...rest } = props;

  return (
    <button
      {...rest}
      type={type}
    >
      {children}
    </button>
  );
};
