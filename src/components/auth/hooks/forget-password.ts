import { useState } from 'react';
import { toastFunc } from '@/lib/utils/toasts';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
  type FormErrors,
} from '@/lib/validations/auth';
import { createFormHandler, createValidationHandler } from '@/lib/utils/form-handlers';
import { authService } from '@/lib/services/api/auth';
import { UNEXPECTED_ERROR } from '@/lib/constants/messages';
import axios from 'axios';

export function useForgetPasswordForm(onSuccess: (email: string) => void) {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({ email: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = createFormHandler(setFormData, setErrors);
  const validateForm = createValidationHandler(forgotPasswordSchema, formData, setErrors);

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await authService.forgotPassword(formData.email);
      toastFunc(response.message, true);
      onSuccess(formData.email);
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
    formData,
    errors,
    isLoading,
    handleInputChange,
    handleSubmit,
  };
}
