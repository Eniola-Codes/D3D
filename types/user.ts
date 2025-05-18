export type AuthResponse = {
  token: string;
  user: {
    id: string;
    email: string;
  };
  message: string;
};

export type FormData = {
  email: string;
  password: string;
  confirmPassword?: string;
};
