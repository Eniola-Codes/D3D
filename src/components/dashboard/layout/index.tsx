'use client';

import React, { ReactNode } from 'react';
import { useLogout } from '@/components/auth/hooks/logout';
import { userStore } from '@/store/user';
import Link from 'next/link';

const DashboardLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { logoutHandler } = useLogout();
  const user = userStore(state => state.user);

  return (
    <div>
      <p>
        {children} {user.name || user.email}
      </p>
      <button onClick={logoutHandler}>Log out</button>
      <Link href="/error">Change</Link>
    </div>
  );
};

export default DashboardLayout;
