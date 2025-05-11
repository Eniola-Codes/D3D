'use client';

import { useSearchParams } from 'next/navigation';
import { LoginSignup } from './login-signup';
import { ForgetPassword } from './forget-password';
import { InputOneTimePassword } from './input-otp';
import { ResetPassword } from './reset-password';
import { routes } from '@/lib/routes';

export const AuthForms: React.FC = () => {
  const searchParams = useSearchParams();
  const auth = searchParams.get(routes.account.authQueryKey);

  return (
    <div>
      <div className="flex flex-col items-center gap-4 md:items-start">
        <p className="mt-8 text-4xl md:mt-12">
          {auth === routes.account.login.query.value && 'Welcome Back!'}
          {auth === routes.account.signup.query.value && 'Get Started!'}
          {auth === routes.account.forgetPassword.query.value && 'Forget Password'}
          {auth === routes.account.inputOTP.query.value && 'Verify Account'}
          {auth === routes.account.resetPassword.query.value && 'Reset Password'}
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {auth === routes.account.login.query.value && 'Please enter your details below to login'}
          {auth === routes.account.signup.query.value &&
            'Begin your journey with us in simple steps.'}
          {auth === routes.account.forgetPassword.query.value &&
            'Please enter the email address associated with your account'}
          {auth === routes.account.inputOTP.query.value &&
            'We have sent a one time password to nathansmt@example.com'}
          {auth === routes.account.resetPassword.query.value &&
            'Create a new password for your account (nathansmt@gmail.com)'}
        </p>
      </div>
      {(auth === routes.account.login.query.value ||
        auth === routes.account.signup.query.value) && <LoginSignup />}
      {auth === routes.account.forgetPassword.query.value && <ForgetPassword />}
      {auth === routes.account.inputOTP.query.value && <InputOneTimePassword />}
      {auth === routes.account.resetPassword.query.value && <ResetPassword />}
    </div>
  );
};
