import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextResponse } from 'next/server';
import { AUTH_TOKEN, JWT_ALGORITHM } from '@/lib/constants';
import { routes } from '@/lib/constants/page-routes';
import {
  setCookieHandler,
  redirectToLoginHandler,
  verifyAuthHandler,
  verifyAuthToken,
} from '../lib/utils/middleware';
import { cookieOptionsAuth } from '@/lib/utils/cookie';
import { jwtVerify } from 'jose';

// Mock jose at the top level (hoisted)
vi.mock('jose', () => ({
  jwtVerify: vi.fn(),
}));

describe('setCookieHandler', () => {
  let mockNewPageRedirect: ReturnType<typeof vi.fn>;
  let mockResponse: NextResponse;

  beforeEach(() => {
    mockResponse = {
      cookies: {
        set: vi.fn(),
      },
    } as unknown as NextResponse;

    mockNewPageRedirect = vi.fn(() => mockResponse);
  });

  it('should redirect to dashboard path', () => {
    const queryToken = 'test-token-123';
    setCookieHandler(mockNewPageRedirect, queryToken);

    expect(mockNewPageRedirect).toHaveBeenCalledTimes(1);
    expect(mockNewPageRedirect).toHaveBeenCalledWith(routes.dashboard.path);
  });

  it('should set cookie with correct token', () => {
    const queryToken = 'test-token-123';
    setCookieHandler(mockNewPageRedirect, queryToken);

    expect(mockResponse.cookies.set).toHaveBeenCalledTimes(1);
    expect(mockResponse.cookies.set).toHaveBeenCalledWith(
      AUTH_TOKEN,
      queryToken,
      cookieOptionsAuth
    );
  });

  it('should set cookie with correct options', () => {
    const queryToken = 'test-token-456';
    setCookieHandler(mockNewPageRedirect, queryToken);

    const cookieSetCall = (mockResponse.cookies.set as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(cookieSetCall[0]).toBe(AUTH_TOKEN);
    expect(cookieSetCall[1]).toBe(queryToken);
    expect(cookieSetCall[2]).toEqual(cookieOptionsAuth);
  });

  it('should return the response from newPageRedirect', () => {
    const queryToken = 'test-token-789';
    const result = setCookieHandler(mockNewPageRedirect, queryToken);

    expect(result).toBe(mockResponse);
  });

  it('should handle different token values', () => {
    const tokens = ['token1', 'token2', 'very-long-token-string-12345'];

    tokens.forEach(token => {
      vi.clearAllMocks();
      setCookieHandler(mockNewPageRedirect, token);

      expect(mockResponse.cookies.set).toHaveBeenCalledWith(AUTH_TOKEN, token, cookieOptionsAuth);
    });
  });

  it('should use correct dashboard path from routes', () => {
    const queryToken = 'test-token';
    setCookieHandler(mockNewPageRedirect, queryToken);

    expect(mockNewPageRedirect).toHaveBeenCalledWith('/dashboard');
  });
});

describe('redirectToLoginHandler', () => {
  let mockNewPageRedirect: ReturnType<typeof vi.fn>;
  let mockResponse: NextResponse;

  beforeEach(() => {
    mockResponse = {} as NextResponse;
    mockNewPageRedirect = vi.fn(() => mockResponse);
  });

  it('should redirect to login page with correct query parameters', () => {
    redirectToLoginHandler(mockNewPageRedirect);

    const expectedUrl = `${routes.account.path}?${routes.account.keys.auth}=${routes.account.query.login}`;
    expect(mockNewPageRedirect).toHaveBeenCalledTimes(1);
    expect(mockNewPageRedirect).toHaveBeenCalledWith(expectedUrl);
  });

  it('should return the response from newPageRedirect', () => {
    const result = redirectToLoginHandler(mockNewPageRedirect);

    expect(result).toBe(mockResponse);
  });

  it('should use correct account path from routes', () => {
    redirectToLoginHandler(mockNewPageRedirect);

    expect(mockNewPageRedirect).toHaveBeenCalledWith(expect.stringContaining(routes.account.path));
  });

  it('should construct URL in correct format', () => {
    redirectToLoginHandler(mockNewPageRedirect);

    const expectedUrl = `/account?auth=login`;
    expect(mockNewPageRedirect).toHaveBeenCalledWith(expectedUrl);
  });
});

describe('verifyAuthHandler', () => {
  let mockNewPageRedirect: ReturnType<typeof vi.fn>;
  let mockResponse: NextResponse;

  beforeEach(() => {
    mockResponse = {} as NextResponse;
    mockNewPageRedirect = vi.fn(() => mockResponse);
    vi.clearAllMocks();
  });

  describe('Status 500', () => {
    it('should redirect to error page when status is 500', () => {
      const result = verifyAuthHandler(mockNewPageRedirect, 500, '/any-path');

      expect(mockNewPageRedirect).toHaveBeenCalledTimes(1);
      expect(mockNewPageRedirect).toHaveBeenCalledWith(routes.error);
      expect(result).toBe(mockResponse);
    });

    it('should redirect to error page regardless of pathname when status is 500', () => {
      const pathnames = [routes.dashboard.path, routes.account.path, routes.error];

      pathnames.forEach(pathname => {
        vi.clearAllMocks();
        verifyAuthHandler(mockNewPageRedirect, 500, pathname);
        expect(mockNewPageRedirect).toHaveBeenCalledWith(routes.error);
      });
    });
  });

  describe('Status 401', () => {
    it('should redirect to login when status is 401 and pathname includes dashboard', () => {
      const result = verifyAuthHandler(mockNewPageRedirect, 401, routes.dashboard.path);

      const expectedUrl = `${routes.account.path}?${routes.account.keys.auth}=${routes.account.query.login}`;
      expect(mockNewPageRedirect).toHaveBeenCalledTimes(1);
      expect(mockNewPageRedirect).toHaveBeenCalledWith(expectedUrl);
      expect(result).toBe(mockResponse);
    });

    it('should redirect to login when status is 401 and pathname includes error', () => {
      const result = verifyAuthHandler(mockNewPageRedirect, 401, routes.error);

      const expectedUrl = `${routes.account.path}?${routes.account.keys.auth}=${routes.account.query.login}`;
      expect(mockNewPageRedirect).toHaveBeenCalledTimes(1);
      expect(mockNewPageRedirect).toHaveBeenCalledWith(expectedUrl);
      expect(result).toBe(mockResponse);
    });

    it('should return undefined when status is 401 but pathname does not include dashboard or error', () => {
      const result = verifyAuthHandler(mockNewPageRedirect, 401, routes.account.path);

      expect(mockNewPageRedirect).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should return undefined when status is 401 and pathname is unrelated', () => {
      const result = verifyAuthHandler(mockNewPageRedirect, 401, routes.home);

      expect(mockNewPageRedirect).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });

  describe('Status 200', () => {
    it('should redirect to dashboard when status is 200 and pathname includes account', () => {
      const result = verifyAuthHandler(mockNewPageRedirect, 200, routes.account.path);

      expect(mockNewPageRedirect).toHaveBeenCalledTimes(1);
      expect(mockNewPageRedirect).toHaveBeenCalledWith(routes.dashboard.path);
      expect(result).toBe(mockResponse);
    });

    it('should redirect to dashboard when status is 200 and pathname includes error', () => {
      const result = verifyAuthHandler(mockNewPageRedirect, 200, routes.error);

      expect(mockNewPageRedirect).toHaveBeenCalledTimes(1);
      expect(mockNewPageRedirect).toHaveBeenCalledWith(routes.dashboard.path);
      expect(result).toBe(mockResponse);
    });

    it('should return undefined when status is 200 but pathname does not include account or error', () => {
      const result = verifyAuthHandler(mockNewPageRedirect, 200, routes.dashboard.path);

      expect(mockNewPageRedirect).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should return undefined when status is 200 and pathname is unrelated', () => {
      const result = verifyAuthHandler(mockNewPageRedirect, 200, routes.home);

      expect(mockNewPageRedirect).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });
});

describe('verifyAuthToken', () => {
  const originalEnv = process.env;
  const mockJwtSecret = 'test-secret-key-12345';

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv, JWT_SECRET: mockJwtSecret };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  describe('Successful token verification', () => {
    it('should return status 200 when token is valid', async () => {
      const validToken = 'valid-jwt-token';
      vi.mocked(jwtVerify).mockResolvedValueOnce({} as unknown as Awaited<ReturnType<typeof jwtVerify>>);

      const result = await verifyAuthToken(validToken);

      expect(result).toEqual({ status: 200 });
      expect(result.error).toBeUndefined();
    });

    it('should call jwtVerify with correct parameters', async () => {
      const token = 'test-token';
      vi.mocked(jwtVerify).mockResolvedValueOnce({} as unknown as Awaited<ReturnType<typeof jwtVerify>>);

      await verifyAuthToken(token);

      const expectedSecret = new TextEncoder().encode(mockJwtSecret);
      expect(jwtVerify).toHaveBeenCalledTimes(1);
      expect(jwtVerify).toHaveBeenCalledWith(token, expectedSecret, {
        algorithms: [JWT_ALGORITHM],
      });
    });

    it('should use HS256 algorithm', async () => {
      const token = 'test-token';
      vi.mocked(jwtVerify).mockResolvedValueOnce({} as unknown as Awaited<ReturnType<typeof jwtVerify>>);

      await verifyAuthToken(token);

      const callArgs = vi.mocked(jwtVerify).mock.calls[0];
      const optionsArg = callArgs[2];

      expect(optionsArg).toEqual({ algorithms: [JWT_ALGORITHM] });
    });
  });

  describe('Failed token verification', () => {
    it('should return status 401 with error message when token is invalid', async () => {
      const invalidToken = 'invalid-token';
      const errorMessage = 'Invalid token';
      vi.mocked(jwtVerify).mockRejectedValueOnce(new Error(errorMessage));

      const result = await verifyAuthToken(invalidToken);

      expect(result).toEqual({ status: 401, error: errorMessage });
    });

    it('should handle undefined errors', async () => {
      const token = 'invalid-token';
      vi.mocked(jwtVerify).mockRejectedValueOnce(undefined);

      const result = await verifyAuthToken(token);

      expect(result.status).toBe(401);
      expect(result.error).toBe('undefined');
    });
  });
});