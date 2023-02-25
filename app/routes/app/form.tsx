import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { useActionData, Form } from '@remix-run/react';
import { appendForm } from '~/services/auth.server';

// export const loader = async ({ request }: LoaderArgs) => {};

export const action = async ({ request }: ActionArgs) => {
  const values = ['Time', new Date().toLocaleDateString()];

  return await appendForm(request, values);
};

const FormPage = () => {
  const data = useActionData<typeof action>();
  return (
    <>
      <Form method='post'>
        <button type='submit'>Test Submit</button>
      </Form>
      <p>Response:</p>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </>
  );
};

export default FormPage;
