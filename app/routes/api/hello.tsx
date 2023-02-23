import { json } from '@remix-run/node';

import { google } from 'googleapis';

export async function loader() {
  const oauth2Client = new google.auth.OAuth2();

  return json({ name: process.env.TEST });
}
