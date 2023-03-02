import type { ActionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useActionData } from '@remix-run/react';
import { Button } from '~/components/Button';
import ComboBox from '~/components/CategoryComboBox';
import AccountsComboBox from '~/components/AccountsComboBox';
import { appendForm } from '~/services/auth.server';
import InputField from '~/components/Field';
import { useEffect, useRef } from 'react';
import { z } from 'zod';
import {
  useFormContext,
  useIsSubmitting,
  useIsValid,
  useUpdateControlledField,
  ValidatedForm,
} from 'remix-validated-form';
import { withZod } from '@remix-validated-form/with-zod';

export const validator = withZod(
  z.object({
    item: z.string().min(3, 'Must contain a minimum of 3 characters'),
    amount: z.preprocess(
      (value) => parseFloat(value.replace(/[, ]+/g, '')),
      z
        .number({
          required_error: 'Enter a number',
          invalid_type_error: 'Enter a number',
        })
        .min(0.01, 'Amount should be greater than 0.01')
    ),
  })
);

export const action = async ({ request }: ActionArgs) => {
  const result = await validator.validate(await request.formData());

  if (result.error) {
    return json(result, { status: 400 });
  }

  return await appendForm(request, result.submittedData);
};

const FormPage = () => {
  const data = useActionData<typeof action>();
  const itemInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const isSubmitting = useIsSubmitting('expense-form');
  const isFromValid = useIsValid('expense-form');
  const updateField = useUpdateControlledField('expense-form');
  const formContext = useFormContext('expense-form');

  const isPending = useRef(false);

  useEffect(() => {
    itemInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (isSubmitting && isFromValid) {
      isPending.current = true;
    }

    if (!isSubmitting && isPending.current && isFromValid) {
      isPending.current = false;
      itemInputRef.current?.focus();
      formRef.current?.reset();
      updateField('amount', 0.0);
      console.log('Form submitted');
    }
  });

  return (
    <section className='px-5 mt-4 flex flex-col items-center'>
      <ValidatedForm
        noValidate
        id='expense-form'
        className='container max-w-sm py-3'
        method='post'
        formRef={formRef}
        validator={validator}
      >
        <h2 className='font-semibold text-2xl py-3 text-gray-300'>
          Add an Expense
        </h2>
        <InputField
          name='item'
          label='Item'
          inputProps={{ placeholder: 'Item Description' }}
          ref={itemInputRef}
        />
        <InputField
          name='date'
          label='Transaction Date'
          inputProps={{
            type: 'date',
            defaultValue: new Date().toISOString().split('T')[0],
          }}
        />
        <InputField name='category' label='Category'>
          <ComboBox />
        </InputField>
        <InputField name='account' label='Account'>
          <AccountsComboBox />
        </InputField>
        <InputField name='amount' label='Amount' />
        <div className='h-2'></div>
        <Button
          classNameProps={
            isSubmitting
              ? 'bg-emerald-700 text-slate-200 hover:bg-emerald-900'
              : ''
          }
        >
          {isSubmitting ? '...' : 'Submit'}
        </Button>
        {data?.spreadsheetId && (
          <p className='mt-4 text-green-600'>Expense added successfully! ✅</p>
        )}

        {formContext?.fieldErrors && (
          <>
            <ul className='mt-2'>
              {Object.keys(formContext.fieldErrors).map((key) => (
                <li key={key} className=' text-red-700'>
                  {key}: {formContext.fieldErrors[key]}
                </li>
              ))}
            </ul>
          </>
        )}
      </ValidatedForm>

      {/* {data && <pre>{JSON.stringify(data, null, 2)}</pre>} */}
    </section>
  );
};

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <section className='mx-auto my-5 container bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
      <h1 className='font-bold text-red-700'>Error</h1>
      <p>{error.message}</p>
      <p>The stack trace is:</p>
      <pre className='whitespace-pre-wrap'>{error.stack}</pre>
    </section>
  );
}

export default FormPage;
