import type { LoaderArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import {
  authUrl,
  getTokensFromCookie,
  isAuthenticated,
} from '~/services/auth.server';

export const loader = async ({ request }: LoaderArgs) => {
  let data = null;

  try {
    data = await getTokensFromCookie(request);
  } catch (error) {
    console.log(error);
  }

  return { data, authenticated: await isAuthenticated(request) };
};

export const action = async () => {
  return redirect(authUrl);
};

export default function Login() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      {!data.authenticated && (
        <Form method='post'>
          <button type='submit'>Sign In with Google</button>
        </Form>
      )}
      {data.authenticated && (
        <Form method='post' action='../logout'>
          <button type='submit'>Sign out with Google</button>
        </Form>
      )}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}
