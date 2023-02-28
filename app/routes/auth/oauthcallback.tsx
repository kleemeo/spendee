import type { LoaderArgs } from '@remix-run/node';
import { redirect } from 'react-router';
import { setGoogleAuthTokens } from '~/services/auth.server';

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  let code = searchParams.get('code');
  let cookie = '';
  if (code) {
    cookie = await setGoogleAuthTokens(request, code);
  }

  return redirect('/app/form', { headers: { 'Set-Cookie': cookie } });
}
