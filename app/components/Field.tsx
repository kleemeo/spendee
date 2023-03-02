import type { InputHTMLAttributes, Ref } from 'react';
import { forwardRef } from 'react';
import { useControlField, useField } from 'remix-validated-form';
import CurrencyInput from 'react-currency-input-field';

const InputFieldTw =
  'px-2 py-2 shadow-sm ring-[.5px] ring-gray-700 placeholder:text-gray-500 focus:ring-1 focus:outline-none focus:ring-gray-300 block w-full sm:text-sm border-gray-300 rounded-md';

const InputFieldMoney = (
  { inputProps }: { inputProps?: InputHTMLAttributes<HTMLInputElement> },
  ref: Ref<HTMLInputElement>
) => {
  const { error, getInputProps } = useField('amount');
  const [amountValue, setAmountValue] = useControlField(
    'amount',
    'expense-form'
  );

  return (
    <div className={`flex focus:ring-1 focus:outline-none focus:ring-gray-300`}>
      <span
        className={`inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600 ${
          error ? 'border border-red-500' : ''
        }`}
      >
        $
      </span>
      <CurrencyInput
        className={InputFieldTw + 'rounded-none rounded-r-md'}
        decimalScale={2}
        ref={ref}
        {...getInputProps({
          id: 'amount',
          value: amountValue as string,
          onChange: (e) => setAmountValue(e.target.value),
          placeholder: '0.00',
        })}
      />
    </div>
  );
};

const InputFieldMoneyWithRef = forwardRef(InputFieldMoney);

const InputField = (
  {
    name,
    label,
    inputProps,
    children,
  }: {
    name: string;
    label: string;
    inputProps?: InputHTMLAttributes<HTMLInputElement>;
    children?: React.ReactNode;
  },
  ref: Ref<HTMLInputElement>
) => {
  const { error, getInputProps } = useField(name);

  return (
    <div className='mb-2'>
      <label htmlFor={name} className='text-sm text-gray-400'>
        {label}
      </label>
      <div className='mt-1'>
        {name === 'amount' ? (
          <InputFieldMoneyWithRef inputProps={inputProps} ref={ref} />
        ) : (
          children ?? (
            <>
              <input
                ref={ref}
                className={
                  InputFieldTw + ` ${error ? 'border border-red-500' : ''}`
                }
                {...getInputProps({ id: name })}
                {...inputProps}
              />
            </>
          )
        )}
      </div>
    </div>
  );
};

export default forwardRef(InputField);
