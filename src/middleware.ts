import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_TOKEN } from '@/lib/constants';
import { routes } from '@/lib/constants/page-routes';
import {
  redirectToLoginHandler,
  setCookieHandler,
  verifyAuthHandler,
  verifyAuthToken,
} from './lib/utils/middleware';

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
      return setCookieHandler(newPageRedirect, queryToken);
    }
    if (!cookieToken && pathname.includes(routes.dashboard.path)) {
      return redirectToLoginHandler(newPageRedirect);
    }
    if (cookieToken) {
      const res = await verifyAuthToken(cookieToken);
      const authResponse = verifyAuthHandler(newPageRedirect, res.status, pathname);
      if (authResponse) {
        return authResponse;
      }
    }
    return response;
  } catch {
    return newPageRedirect(routes.error);
  }
}
