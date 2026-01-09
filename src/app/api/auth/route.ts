import { AUTH_TOKEN } from '@/lib/constants';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AuthResponse } from '../../../../interfaces/auth';
import { endpoints } from '@/lib/constants/endpoints';
import { cookieOptionsAuth } from '@/lib/utils/cookie';
import { apiServerService } from '@/lib/services/api/server';
import { routes } from '@/lib/constants/page-routes';
import { routeErrorHandler } from '@/lib/utils/error-handler';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, authParam } = body;
    const status = authParam === routes.account.query.signup ? 201 : 200;

    const res = await apiServerService.post<AuthResponse>(`${endpoints.auth.base}/${authParam}`, {
      email,
      name,
      password,
    });

    const response = NextResponse.json(
      { message: res.message, user: res.user },
      {
        status: status,
      }
    );

    response.cookies.set(AUTH_TOKEN, res.token, cookieOptionsAuth);

    return response;
  } catch (err: unknown) {
    return routeErrorHandler(err);
  }
}
