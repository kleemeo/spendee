import type { LinksFunction, MetaFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import stylesheet from './styles/global.css';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
  { rel: 'icon', href: '/favicon-16.ico' },
];

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Spendee',
  viewport: 'width=device-width,initial-scale=1',
});

export default function App() {
  return (
    <html lang='en' className='dark'>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
