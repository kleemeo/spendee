import type { ActionArgs } from '@remix-run/node';
import { deleteSession } from '~/services/auth.server';

export const action = async ({ request }: ActionArgs) => {
  return deleteSession(request);
};
