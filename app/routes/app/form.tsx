import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { useActionData, Form } from '@remix-run/react';
import type { HTMLInputTypeAttribute } from 'react';
import { Button } from '~/components/Button';
import { appendForm } from '~/services/auth.server';

// export const loader = async ({ request }: LoaderArgs) => {};

export const action = async ({ request }: ActionArgs) => {
  const values = ['Time', new Date().toLocaleDateString()];

  return await appendForm(request, values);
};

const Field = ({
  name,
  label,
  type,
  placeholder,
  inputProps,
}: {
  name: string;
  label: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}) => {
  return (
    <div className='mb-2'>
      <label htmlFor={name} className='text-sm text-gray-400'>
        {label}
      </label>
      <div className='mt-1'>
        <input
          type={type ?? 'text'}
          name={name}
          id={name}
          placeholder={placeholder ?? ''}
          className='px-2 py-2 shadow-sm ring-[.5px] ring-gray-700 placeholder:text-gray-500 focus:ring-1 focus:outline-none focus:ring-gray-300 block w-full sm:text-sm border-gray-300 rounded-md'
          {...inputProps}
        />
      </div>
    </div>
  );
};

const FormPage = () => {
  const data = useActionData<typeof action>();
  return (
    <section className='px-5 mt-4 divide-y divide-gray-600'>
      <h2 className='py-3 text-gray-300'>Add an Expense</h2>
      <Form method='post' className='container max-w-sm py-3'>
        <Field name='item' label='Item' placeholder='Item description' />
        <Field
          name='date'
          type={'date'}
          label='Transaction Date'
          inputProps={{ defaultValue: new Date().toISOString().split('T')[0] }}
        />
        <Field name='category' label='Category' placeholder='e.g. Groceries' />
        <Field name='account' label='Account' placeholder='e.g. AMEX' />
        <Field name='amount' label='Amount' placeholder='$0.00' />
        <div className='h-2'></div>
        <Button>Add</Button>
      </Form>
      {/* <p>Response:</p> */}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </section>
  );
};

export default FormPage;
