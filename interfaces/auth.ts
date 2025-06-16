export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
  message: string;
}

export interface LogoutResponse {
  message: string;
}

export interface AuthFormData {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
  [key: string]: string;
}

export interface LoginSignupProps extends React.ComponentPropsWithoutRef<'form'> {
  authParam: string;
  errorParam: string | undefined;
}

export interface inputOTPProps extends React.ComponentPropsWithoutRef<'form'> {
  email: string;
}

export interface resetPasswordProps extends React.ComponentPropsWithoutRef<'form'> {
  email: string;
  token: string;
}

export interface searchParamPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export interface urlQueryParams {
  auth: string | undefined;
  mail: string | undefined;
  otp: string | undefined;
  error: string | undefined;
}
