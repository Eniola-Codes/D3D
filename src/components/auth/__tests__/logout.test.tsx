import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { toastFunc } from '@/lib/utils/toasts';
import { routes } from '@/lib/constants/page-routes';
import { logout } from '@/lib/utils/auth/form-handlers';
import { toastErrorHandler } from '@/lib/utils/error-handler';
import { useLogout } from '../hooks/logout';
import React from 'react';
import { IUser } from '../../../../interfaces/user';

const mockClearUser = vi.fn();
const mockRouterReplace = vi.fn();

vi.mock('@/lib/services/auth', () => ({
  authService: {
    logout: vi.fn(() => {
      return Promise.resolve({
        data: {
          message: 'Logout successful',
        },
      });
    }),
  },
}));

vi.mock('@/lib/utils/error-handler', () => ({
  toastErrorHandler: vi.fn(),
}));

vi.mock('@/lib/utils/toasts', () => ({
  toastFunc: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockRouterReplace,
  }),
}));

vi.mock('@/store/user', () => ({
  userStore: (selector: (unknown: unknown) => IUser) => {
    const state = {
      user: {
        email: 'test@example.com',
        name: 'Test User',
        id: '123',
        avatar: undefined,
      },
      clearUser: mockClearUser,
    };
    return selector(state);
  },
}));

describe('logout()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Logout flow', () => {
    it('should handle successful logout', async () => {
      const result = await logout();

      expect(result).toBe(true);
      expect(toastFunc).toHaveBeenCalledWith('Logout successful', true);
    });
  });
});

const LogoutButton: React.FC = () => {
  const { logoutHandler } = useLogout();
  return <button onClick={logoutHandler}>Log out</button>;
};

describe('useLogout Hook (UI Tests)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render logout button', () => {
      render(<LogoutButton />);
      expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
    });
  });

  describe('Logout Functionality', () => {
    it('should call logout handler on button click', async () => {
      render(<LogoutButton />);
      const logoutButton = screen.getByRole('button', { name: /log out/i });

      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(toastFunc).toHaveBeenCalledWith('Logout successful', true);
      });
    });

    it('should clear user store after successful logout', async () => {
      render(<LogoutButton />);
      const logoutButton = screen.getByRole('button', { name: /log out/i });

      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(mockClearUser).toHaveBeenCalledTimes(1);
      });
    });

    it('should navigate to login page after successful logout', async () => {
      render(<LogoutButton />);
      const logoutButton = screen.getByRole('button', { name: /log out/i });

      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(mockRouterReplace).toHaveBeenCalledWith(
          `${routes.account.path}?${routes.account.keys.auth}=${routes.account.query.login}`
        );
      });
    });

    it('should handle logout error gracefully', async () => {
      const { authService } = await import('@/lib/services/auth');
      vi.mocked(authService.logout).mockRejectedValueOnce(new Error('Logout failed'));

      render(<LogoutButton />);
      const logoutButton = screen.getByRole('button', { name: /log out/i });

      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(toastErrorHandler).toHaveBeenCalled();
      });

      // Should not clear user or navigate on error
      expect(mockClearUser).not.toHaveBeenCalled();
      expect(mockRouterReplace).not.toHaveBeenCalled();
    });
  });
});
