import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_TOKEN } from '@/lib/constants';
import { routes } from '@/lib/constants/page-routes';
import { endpoints } from './lib/constants/endpoints';
import { cookieOptionsAuth } from './lib/utils/cookie';

export const config = {
  matcher: ['/account', '/dashboard/:path*'],
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const cookieToken = request.cookies.get(AUTH_TOKEN)?.value;
  const queryToken = request.nextUrl.searchParams.get(AUTH_TOKEN);
  const response = NextResponse.next();
  const newPageRedirect = (url: string) => NextResponse.redirect(new URL(url, request.url));

  try {
    if (queryToken) {
      const res = newPageRedirect(routes.dashboard.path);
      res.cookies.set(AUTH_TOKEN, queryToken, cookieOptionsAuth);
      return res;
    }

    if (!cookieToken && pathname.includes(routes.dashboard.path)) {
      return newPageRedirect(
        `${routes.account.path}?${routes.account.keys.auth}=${routes.account.query.login}`
      );
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${endpoints.auth.base}${endpoints.auth.verifyAuth}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${cookieToken}`,
        },
      }
    );
    if (res.status === 500) {
      return newPageRedirect(routes.error);
    }
    if (
      res.status === 401 &&
      (pathname.includes(routes.dashboard.path) || pathname.includes(routes.error))
    ) {
      return newPageRedirect(
        `${routes.account.path}?${routes.account.keys.auth}=${routes.account.query.login}`
      );
    }
    if (
      res.status === 200 &&
      (pathname.includes(routes.account.path) || pathname.includes(routes.error))
    ) {
      return newPageRedirect(routes.dashboard.path);
    }
    return response;
  } catch {
    return newPageRedirect(routes.error);
  }
}
