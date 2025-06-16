import { LoginSignup } from './login-signup';
import { ForgetPassword } from './forget-password';
import { VerifyOTP } from './verify-otp';
import { ResetPassword } from './reset-password';
import { routes } from '@/lib/constants/page-routes';
import { urlQueryParams } from '../../../interfaces/auth';

export const AuthForms: React.FC<{ params: urlQueryParams }> = ({ params }) => {
  const { auth, mail, otp, error } = params;

  return (
    <div>
      <div className="flex flex-col items-center gap-4 md:items-start">
        <p className="mt-8 text-3xl sm:text-4xl md:mt-12">
          {auth === routes.account.query.login && 'Welcome Back!'}
          {auth === routes.account.query.signup && 'Get Started!'}
          {auth === routes.account.query.forgetPassword && 'Forget Password'}
          {auth === routes.account.query.inputOTP && 'Verify Account'}
          {auth === routes.account.query.resetPassword && 'Reset Password'}
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {auth === routes.account.query.login && 'Please enter your details below to login'}
          {auth === routes.account.query.signup && 'Begin your journey with us in simple steps.'}
          {auth === routes.account.query.forgetPassword &&
            'Please enter the email address associated with your account'}
          {auth === routes.account.query.inputOTP && `We have sent a one time password to ${mail}`}
          {auth === routes.account.query.resetPassword &&
            `Create a new password for your account (${mail})`}
        </p>
      </div>
      {(auth === routes.account.query.login || auth === routes.account.query.signup) && (
        <LoginSignup authParam={auth} errorParam={error} />
      )}
      {auth === routes.account.query.forgetPassword && <ForgetPassword />}
      {auth === routes.account.query.inputOTP && <VerifyOTP email={mail as string} />}
      {auth === routes.account.query.resetPassword && (
        <ResetPassword email={mail as string} token={otp as string} />
      )}
    </div>
  );
};
