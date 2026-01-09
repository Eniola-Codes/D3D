'use client';

import { useRouter } from 'next/navigation';
import { userStore } from '@/store/user';
import { routes } from '@/lib/constants/page-routes';
import { logout } from '@/lib/utils/auth/form-handlers';

export const useLogout = () => {
  const clearUser = userStore(state => state.clearUser);
  const router = useRouter();

  const logoutHandler = async () => {
    const result = await logout();

    if (result) {
      clearUser();
      router.replace(
        `${routes.account.path}?${routes.account.keys.auth}=${routes.account.query.login}`
      );
    }
  };

  return { logoutHandler };
};
