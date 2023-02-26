import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { useActionData, Form } from '@remix-run/react';
import { appendForm } from '~/services/auth.server';

// export const loader = async ({ request }: LoaderArgs) => {};

export const action = async ({ request }: ActionArgs) => {
  const values = ['Time', new Date().toLocaleDateString()];

  return await appendForm(request, values);
};

const InputField = ({ label, name }: { label: string; name: string }) => {
  return (
    <div className='mb-2'>
      <label
        htmlFor='default-input'
        className='block mb-2 text-sm font-medium text-gray-90'
      >
        {label}
      </label>
      <input
        type='text'
        id='default-input'
        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
        name={name}
      />
    </div>
  );
};

const FormPage = () => {
  const data = useActionData<typeof action>();
  return (
    <>
      <Form method='post' className='mt-6 container max-w-sm'>
        <InputField label='Name' name='name' />
        <button
          type='submit'
          className='bg-blue-500 text-white p-2 rounded hover:bg-blue-300'
        >
          Enter
        </button>
      </Form>
      {/* <p>Response:</p> */}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </>
  );
};

export default FormPage;
