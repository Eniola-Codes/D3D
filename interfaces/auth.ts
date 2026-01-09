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
}
export interface LoginSignupProps extends React.ComponentPropsWithoutRef<'form'> {
  authParam: string;
  errorParam?: string;
}

export interface InputOTPProps extends React.ComponentPropsWithoutRef<'form'> {
  email: string;
}

export interface ResetPasswordProps extends React.ComponentPropsWithoutRef<'form'> {
  email: string;
  token: string;
}

// Page prop types
export interface SearchParamPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export interface UrlQueryParams {
  auth?: string;
  mail?: string;
  otp?: string;
  error?: string;
}
