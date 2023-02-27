import type { ReactNode } from 'react';

export const Button = ({ children, ...rest }: { children?: ReactNode }) => {
  return (
    <button
      type='submit'
      className='bg-[var(--blue4)] text-[var(--blue11)] w-full px-3 py-1 rounded mt-2 hover:bg-[var(--blue6)] focus:outline focus:outline-2 focus:outline-[var(--blue9)]'
      {...rest}
    >
      {children}
    </button>
  );
};
