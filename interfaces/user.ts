export interface IUser {
  email: string;
  id: string;
  name: string;
  avatar: string | undefined;
}

export interface IUserState {
  user: IUser;
  setUser: (newUser: Partial<IUser>) => void;
  clearUser: () => void;
}

export interface UserResponse {
  user: IUser;
  message: string;
}
