import { NextResponse } from 'next/server';
import { routes } from '../constants/page-routes';
import { AUTH_TOKEN } from '../constants';
import { cookieOptionsAuth } from './cookie';
import { jwtVerify } from 'jose';
import { endpoints } from '../constants/endpoints';

export const setCookieHandler = (
  newPageRedirect: (url: string) => NextResponse,
  queryToken: string
) => {
  const res = newPageRedirect(routes.dashboard.path);
  res.cookies.set(AUTH_TOKEN, queryToken, cookieOptionsAuth);
  return res;
};

export const redirectToLoginHandler = (newPageRedirect: (url: string) => NextResponse) => {
  return newPageRedirect(
    `${routes.account.path}?${routes.account.keys.auth}=${routes.account.query.login}`
  );
};

export const verifyAuthHandler = (
  newPageRedirect: (url: string) => NextResponse,
  status: number,
  pathname: string
): NextResponse | undefined => {
  if (status === 500) {
    return newPageRedirect(routes.error);
  }
  if (
    status === 401 &&
    (pathname.includes(routes.dashboard.path) || pathname.includes(routes.error))
  ) {
    return redirectToLoginHandler(newPageRedirect);
  }
  if (
    status === 200 &&
    (pathname.includes(routes.account.path) || pathname.includes(routes.error))
  ) {
    return newPageRedirect(routes.dashboard.path);
  }
  return undefined;
};

export const verifyAuthToken = async (token: string): Promise<Response> => {
  return fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${endpoints.auth.base}${endpoints.auth.verifyAuth}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// export const verifyAuthToken = async (
//   token: string
// ): Promise<{ status: number; error?: string }> => {
//   try {
//     const secret = new TextEncoder().encode(process.env.JWT_SECRET);
//     await jwtVerify(token, secret, {
//       algorithms: ['HS256'],
//     });
//     return { status: 200 };
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : String(error);
//     return { status: 401, error: errorMessage };
//   }
// };
