import type { ActionArgs } from '@remix-run/node';
import { json, LoaderArgs } from '@remix-run/node';
import { useActionData, Form, useNavigation } from '@remix-run/react';
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

// export const loader = async ({ request }: LoaderArgs) => {};

export const validator = withZod(
  z.object({
    item: z.string().min(1, 'Item should contain at least 3 characters'),
    amount: z.coerce.number().min(0.01, 'Amount should be greater than 0.01'),
  })
);

export const action = async ({ request }: ActionArgs) => {
  await new Promise((res) => setTimeout(res, 500));

  const result = await validator.validate(await request.formData());

  if (result.error) {
    return json(result, { status: 400 });
  }
  // return result;
  return result;
  // return await appendForm(request, result.submittedData);
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
    if (isSubmitting && isFromValid) {
      isPending.current = true;
    }

    if (!isSubmitting && isPending.current) {
      isPending.current = false;
      itemInputRef.current?.focus();
      formRef.current?.reset();
      updateField('amount', 0.0);
      console.log('Form submitted');
    }
  });

  return (
    <section className='px-5 mt-4 divide-y divide-gray-600'>
      <h2 className='text-2xl py-3 text-gray-300'>Add an Expense</h2>
      <ValidatedForm
        id='expense-form'
        className='container max-w-sm py-3'
        method='post'
        formRef={formRef}
        validator={validator}
      >
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
        {formContext.fieldErrors && (
          <>
            <ul className='pl-4'>
              {Object.keys(formContext.fieldErrors).map((key) => (
                <li key={key} className='list-disc text-red-600'>
                  {key}: {formContext.fieldErrors[key]}
                </li>
              ))}
            </ul>
            <pre>{JSON.stringify(formContext.fieldErrors, null, 2)}</pre>
          </>
        )}
        {data?.error && (
          <ul className='pl-4'>
            {data.error.issues.map((issue) => (
              <li key={issue.code} className='list-disc text-red-600'>
                {issue?.path[0]}: {issue.message}
              </li>
            ))}
          </ul>
        )}
      </ValidatedForm>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </section>
  );
};

export function ErrorBoundary({ error }) {
  return (
    <div>
      <h1>Error</h1>
      <p>{error.message}</p>
      <p>The stack trace is:</p>
      <pre>{error.stack}</pre>
    </div>
  );
}

export default FormPage;
