import { create } from 'zustand';
import { IUserState } from '../../interfaces/user';

export const userStore = create<IUserState>(set => ({
  user: {
    email: '',
    name: '',
    id: '',
    avatar: undefined,
  },
  setUser: newUser =>
    set(state => ({
      user: { ...state.user, ...newUser },
    })),
  clearUser: () =>
    set(() => ({
      user: {
        email: '',
        name: '',
        id: '',
        avatar: undefined,
      },
    })),
}));
