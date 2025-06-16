// lib/hooks/useLogout.ts
'use client';

import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services/api/auth';
import { toastFunc } from '@/lib/utils/toasts';
import { UNEXPECTED_ERROR } from '@/lib/constants/messages';
import { userStore } from '@/store/user';
import { routes } from '@/lib/constants/page-routes';
import axios from 'axios';

export const useLogout = () => {
  const clearUser = userStore(state => state.clearUser);
  const router = useRouter();

  const logoutHandler = async () => {
    try {
      const response = await authService.logout();
      toastFunc(response.data.message, true);
      clearUser();
      router.replace(
        `${routes.account.path}?${routes.account.keys.auth}=${routes.account.query.login}`
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        toastFunc(error.response.data.message, false);
      } else {
        toastFunc(UNEXPECTED_ERROR, false);
      }
    }
  };

  return { logoutHandler };
};
