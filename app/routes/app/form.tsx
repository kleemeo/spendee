import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { useActionData, Form } from '@remix-run/react';
import { Button } from '~/components/Button';
import ComboBox from '~/components/CategoryComboBox';
import AccountsComboBox from '~/components/AccountsComboBox';
import { appendForm } from '~/services/auth.server';
import Field from '~/components/Field';

// export const loader = async ({ request }: LoaderArgs) => {};

export const action = async ({ request }: ActionArgs) => {
  const body = await request.formData();
  // const values = Object.fromEntries(body.entries());

  return Object.fromEntries(body.entries());

  // return await appendForm(request, values);
};

const FormPage = () => {
  const data = useActionData<typeof action>();
  return (
    <section className='px-5 mt-4 divide-y divide-gray-600'>
      <h2 className='py-3 text-gray-300'>Add an Expense</h2>
      <Form method='post' className='container max-w-sm py-3'>
        <Field
          name='item'
          label='Item'
          placeholder='Item description'
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
        />
        <div className='h-2'></div>
        <Button>Add</Button>
      </Form>
      {/* <p>Response:</p> */}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </section>
  );
};

export default FormPage;
