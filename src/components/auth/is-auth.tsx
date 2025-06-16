'use client';

import { userStore } from '@/store/user';
import { useEffect } from 'react';
import { IUser } from '../../../interfaces/user';

const IsAuth: React.FC<{ user: IUser | null }> = ({ user }) => {
  const setUser = userStore(state => state.setUser);

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  return null;
};

export default IsAuth;
