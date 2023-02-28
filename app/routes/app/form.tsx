import type { ActionArgs } from '@remix-run/node';
import { json, LoaderArgs } from '@remix-run/node';
import { useActionData, Form, useNavigation } from '@remix-run/react';
import { Button } from '~/components/Button';
import ComboBox from '~/components/CategoryComboBox';
import AccountsComboBox from '~/components/AccountsComboBox';
import { appendForm } from '~/services/auth.server';
import Field from '~/components/Field';
import { useEffect, useRef } from 'react';
import { z } from 'zod';

// export const loader = async ({ request }: LoaderArgs) => {};

const schema = z.object({
  item: z.string().min(1, 'Item is required'),
  amount: z.string().min(1, 'Amount is required'),
});

export const action = async ({ request }: ActionArgs) => {
  const body = await request.formData();
  const formDataObject = Object.fromEntries(body.entries());
  try {
    const parsedObject = schema.parse(formDataObject);
  } catch (error) {
    return json(
      { error, entries: Object.fromEntries(body.entries()) },
      { status: 400 }
    );
  }
  return await appendForm(request, formDataObject);
};

const FormPage = () => {
  const data = useActionData<typeof action>();

  const formRef = useRef<HTMLFormElement>(null);
  const firstInputRef = useRef<HTMLInputElement | null>(null);

  const navigation = useNavigation();

  const isSubmitting = navigation.state === 'submitting';

  useEffect(() => {
    if (!isSubmitting && firstInputRef.current?.value) {
      firstInputRef.current?.focus();
      formRef.current?.reset();
    }
  }, [isSubmitting]);

  return (
    <section className='px-5 mt-4 divide-y divide-gray-600'>
      <h2 className='py-3 text-gray-300'>Add an Expense</h2>
      <Form method='post' className='container max-w-sm py-3' ref={formRef}>
        <Field
          name='item'
          label='Item'
          placeholder='Item description'
          inputProps={{ ref: firstInputRef }}
        />
        <Field
          name='date'
          type={'date'}
          label='Transaction Date'
          inputProps={{ defaultValue: new Date().toISOString().split('T')[0] }}
        />
        <Field name='category' label='Category'>
          <ComboBox />
        </Field>
        <Field name='account' label='Account'>
          <AccountsComboBox />
        </Field>
        <Field
          name='amount'
          label='Amount'
          placeholder='$ 0.00'
          type='number'
        />
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
        {data?.error && (
          <ul className='pl-4'>
            {data.error.issues.map((issue) => (
              <li key={issue.code} className='list-disc text-red-600'>
                {issue?.path[0]}: {issue.message}
              </li>
            ))}
          </ul>
        )}
      </Form>
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
