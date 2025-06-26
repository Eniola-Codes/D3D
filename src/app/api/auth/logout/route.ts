import { AUTH_TOKEN } from '@/lib/constants';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AuthResponse } from '../../../../../interfaces/auth';
import { endpoints } from '@/lib/constants/endpoints';
import { cookieOptionsUnAuth } from '@/lib/utils/cookie';
import { apiServerService } from '@/lib/services/api/server';
import { AUTH_FAILED } from '@/lib/constants/messages';
import { isAxiosError } from 'axios';

export async function POST(req: NextRequest) {
  try {
    await req.json();

    const res = await apiServerService.post<AuthResponse>(
      `${endpoints.auth.base}${endpoints.auth.logout}`,
      {}
    );

    const response = NextResponse.json(
      { message: res.message },
      {
        status: 200,
      }
    );

    response.cookies.set(AUTH_TOKEN, '', cookieOptionsUnAuth);

    return response;
  } catch (err: unknown) {
    if (isAxiosError(err) && err.response) {
      return NextResponse.json(
        {
          message: err.response.data?.message || AUTH_FAILED,
        },
        { status: err.response.status }
      );
    }
    return NextResponse.json(
      {
        message: AUTH_FAILED,
      },
      { status: 500 }
    );
  }
}
