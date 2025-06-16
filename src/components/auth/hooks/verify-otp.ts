import { useState } from 'react';
import { toastFunc } from '@/lib/utils/toasts';
import { createValidationHandler } from '@/lib/utils/form-handlers';
import { otpSchema, FormErrors } from '@/lib/validations/auth';
import { UNEXPECTED_ERROR } from '@/lib/constants/messages';
import axios from 'axios';
import { authService } from '@/lib/services/api/auth';

export function useOtpForm(email: string, onSuccess: (otp: string) => void) {
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
    try {
      const res = await authService.verifyOtp(email, otp);
      toastFunc(res.message, true);
      onSuccess(otp);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        toastFunc(error.response.data.message, false);
      } else {
        toastFunc(UNEXPECTED_ERROR, false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    setIsLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      toastFunc(res.message, true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        toastFunc(error.response.data.message, false);
      } else {
        toastFunc(UNEXPECTED_ERROR, false);
      }
    } finally {
      setIsLoading(false);
    }
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
