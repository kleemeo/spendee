import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { useActionData, Form, useNavigation } from '@remix-run/react';
import { Button } from '~/components/Button';
import ComboBox from '~/components/CategoryComboBox';
import AccountsComboBox from '~/components/AccountsComboBox';
import { appendForm } from '~/services/auth.server';
import Field from '~/components/Field';
import { useEffect, useRef } from 'react';

// export const loader = async ({ request }: LoaderArgs) => {};

export const action = async ({ request }: ActionArgs) => {
  const delay = await new Promise((resolve) => setTimeout(resolve, 1000));

  const body = await request.formData();
  // const values = Object.fromEntries(body.entries());

  return Object.fromEntries(body.entries());

  // return await appendForm(request, values);
};

const FormPage = () => {
  const data = useActionData<typeof action>();

  const formRef = useRef<HTMLFormElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef(null);

  const navigation = useNavigation();

  const isSubmitting = navigation.state === 'submitting';

  useEffect(() => {
    if (!isSubmitting && data) {
      formRef.current?.reset();
      firstInputRef.current?.focus();
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
          required
        />
        <Field
          name='date'
          type={'date'}
          label='Transaction Date'
          inputProps={{ defaultValue: new Date().toISOString().split('T')[0] }}
          required
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
          required
          amountRef={amountRef}
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
      </Form>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </section>
  );
};

export default FormPage;
