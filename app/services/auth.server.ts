import { json, LoaderArgs, redirect } from '@remix-run/node';
import { google } from 'googleapis';
import { commitSession, getSession, destroySession } from '~/sessions';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// oauth2Client.on('tokens', (tokens) => {
//   if (tokens.refresh_token) {
//     // store the refresh_token in my database!
//     console.log('refresh_token:', tokens.refresh_token);
//   }
//   console.log('access_token:', tokens.access_token);
// });

const scopes = ['https://www.googleapis.com/auth/spreadsheets'];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
});

const setGoogleAuthTokens = async (request: Request, code: string) => {
  const session = await getSession(request.headers.get('Cookie'));
  const { tokens } = await oauth2Client.getToken(code);
  session.set('code', code);
  session.set('tokens', tokens);
  const cookie = await commitSession(session);
  oauth2Client.setCredentials(tokens);
  return cookie;
};

const getTokensFromCookie = async (request: Request) => {
  const session = await getSession(request.headers.get('Cookie'));
  return session.get('tokens');
};

const isAuthenticated = async (request: Request) => {
  try {
    const tokens = await getTokensFromCookie(request);
    console.log('authenticating with tokens', tokens);
    return !!tokens;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const authRedirect = (request: Request) => {
  if (!isAuthenticated(request)) {
    return redirect('/');
  }
};

const appendForm = async (request: Request, values: IFormSubmittedData) => {
  const tokens = await getTokensFromCookie(request);
  oauth2Client.setCredentials(tokens);

  const client = await google.sheets({
    version: 'v4',
    auth: oauth2Client,
  });

  const spreadsheetId: string =
    process.env.NODE_ENV === 'production'
      ? '1ri-3WqTKFSkOWtwCMXCpBBYLY73NzYpatc55wr9S8fY'
      : '1CYFGdJUfSW_yPbjduIkMqpcLEBcRnpr3bkypyqCqpic';

  const formattedValues = [
    new Date().toISOString(),
    values.date,
    new Date(values.date).getMonth() + 1,
    values.item,
    values.amount,
    values.category.Code,
    values.category.Category,
    values.account.Account,
  ];

  const requestBody: {
    spreadsheetId: string;
    range: string;
    valueInputOption: 'USER_ENTERED' | 'RAW';
    resource: {
      values: string[][];
    };
  } = {
    spreadsheetId: spreadsheetId,
    range: 'EXPENSES!A1:B1',
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [formattedValues],
    },
  };

  try {
    console.log(`Appending to spreadsheet ${spreadsheetId}`);
    const results = await client.spreadsheets.values.append(requestBody);
    return { data: results?.data, values: results?.config?.data?.values };
  } catch (err) {
    const message = err?.message ?? 'No message';
    const error = {
      message: 'Submission to spreadsheet failed.',
      errorMessage: message,
      path: ['submission'],
    };
    console.error(err);
    return json({ error }, { status: 400 });
  }
};

const deleteSession = async (request: Request) => {
  const session = await getSession(request.headers.get('Cookie'));
  return redirect('/', {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  });
};

export {
  authRedirect,
  isAuthenticated,
  getTokensFromCookie,
  oauth2Client,
  authUrl,
  appendForm,
  setGoogleAuthTokens,
  deleteSession,
};
