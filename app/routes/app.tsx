import type { LoaderArgs } from '@remix-run/node';
import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { isAuthenticated } from '~/services/auth.server';

export const loader = async ({ request }: LoaderArgs) => {
  const authenticated = await isAuthenticated(request);

  return { authenticated };
};

export default function App() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <h1>Home</h1>
      <ul>
        <li>
          <Link to={'/app/login'}>Login</Link>
        </li>
        {data.authenticated && (
          <li>
            <Link to={'/app/form'}>Form</Link>
          </li>
        )}
      </ul>
      <div>
        <Outlet />
      </div>
    </>
  );
}
