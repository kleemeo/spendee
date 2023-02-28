import type { HTMLInputTypeAttribute } from 'react';
import { useState } from 'react';
import React from 'react';

const MoneyField = () => {
  return (
    <div className='flex'>
      <span className='inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600'>
        $
      </span>
      <input
        type='number'
        name='amount'
        step={0.01}
        min='0'
        className='px-2 py-2 shadow-sm ring-[.5px] ring-gray-700 placeholder:text-gray-500 focus:ring-1 focus:outline-none focus:ring-gray-300 block w-full sm:text-sm border-gray-300 rounded-r-md'
        placeholder='0.00'
      />
    </div>
  );
};

const Field = ({
  name,
  label,
  type,
  placeholder,
  inputProps,
  children,
  required,
}: {
  name: string;
  label: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  children?: React.ReactNode;
  required?: boolean;
}) => {
  return (
    <div className='mb-2'>
      <label htmlFor={name} className='text-sm text-gray-400'>
        {label}
      </label>
      <div className='mt-1'>
        {name === 'amount' ? (
          <MoneyField />
        ) : (
          children ?? (
            <input
              required={required}
              type={type ?? 'text'}
              name={name}
              id={name}
              placeholder={placeholder ?? ''}
              className='px-2 py-2 shadow-sm ring-[.5px] ring-gray-700 placeholder:text-gray-500 focus:ring-1 focus:outline-none focus:ring-gray-300 block w-full sm:text-sm border-gray-300 rounded-md'
              {...inputProps}
            />
          )
        )}
      </div>
    </div>
  );
};

export default Field;
