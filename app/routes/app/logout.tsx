import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { deleteSession } from '~/services/auth.server';

export const loader = async ({ request }: LoaderArgs) => {
  return deleteSession(request);
};

export const action = async ({ request }: ActionArgs) => {
  return deleteSession(request);
};
