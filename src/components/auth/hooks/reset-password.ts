import { useState } from 'react';
import { FormErrors, ResetPasswordFormData, resetPasswordSchema } from '@/lib/validations/auth';
import { toastFunc } from '@/lib/utils/toasts';
import { createFormHandler, createValidationHandler } from '@/lib/utils/form-handlers';
import { authService } from '@/lib/services/api/auth';
import { UNEXPECTED_ERROR } from '@/lib/constants/messages';
import axios from 'axios';

export function useResetPasswordForm(email: string, token: string, onSuccess: () => void) {
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = createFormHandler(setFormData, setErrors);
  const validateForm = createValidationHandler(resetPasswordSchema, formData, setErrors);

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await authService.resetPassword(email, token, formData.password);
      toastFunc(response.message, true);
      onSuccess();
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
