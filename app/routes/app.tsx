import type { LoaderArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { isAuthenticated } from '~/services/auth.server';

export const loader = async ({ request }: LoaderArgs) => {
  const authenticated = await isAuthenticated(request);

  if (!authenticated) {
    return redirect('/');
  }

  return { authenticated };
};

const TopNav = () => {
  return (
    <nav className='flex justify-between items-center py-2 px-5 border-b border-slate-400'>
      <h1 className='font-sans text-2xl font-bold'>Spendee</h1>
      <Link to={'/app/logout'} className='text-blue-500'>
        Logout
      </Link>
    </nav>
  );
};

export default function App() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <TopNav />
      <Outlet />
    </div>
  );
}
