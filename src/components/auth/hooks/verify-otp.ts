import { useState } from 'react';
import {
  createValidationHandler,
  submitForgetPasswordFormData,
  submitVerifyOtpFormData,
} from '@/lib/utils/auth/form-handlers';
import { otpSchema, FormErrors } from '@/lib/utils/auth/validations';
import { routes } from '@/lib/constants/page-routes';
import { useRouter } from 'next/navigation';

export function useOtpForm(email: string) {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = createValidationHandler(otpSchema, { otp }, setErrors);
  const handleChange = (value: string) => {
    setOtp(value);
    if (errors.otp) {
      setErrors(prev => ({ ...prev, otp: undefined }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    const otpcode = await submitVerifyOtpFormData(email, otp);
    if (otpcode) {
      router.push(
        `?${routes.account.keys.auth}=${routes.account.query.resetPassword}&email=${email}&otp=${otpcode}`
      );
    }
    setIsLoading(false);
  };

  const resendOtp = async () => {
    setIsLoading(true);
    await submitForgetPasswordFormData(email);
    setIsLoading(false);
  };

  return {
    otp,
    errors,
    isLoading,
    handleChange,
    handleSubmit,
    resendOtp,
  };
}
