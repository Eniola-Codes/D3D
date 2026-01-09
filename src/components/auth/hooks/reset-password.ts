import { useState } from 'react';
import {
  FormErrors,
  ResetPasswordFormData,
  resetPasswordSchema,
} from '@/lib/utils/auth/validations';
import {
  createFormHandler,
  createValidationHandler,
  submitResetPasswordFormData,
} from '@/lib/utils/auth/form-handlers';
import { routes } from '@/lib/constants/page-routes';
import { useRouter } from 'next/navigation';

export function useResetPasswordForm(email: string, token: string) {
  const router = useRouter();
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
    const result = await submitResetPasswordFormData(email, token, formData.password);
    if (result) {
      router.push(`?${routes.account.keys.auth}=${routes.account.query.login}`);
    }
    setIsLoading(false);
  };

  return {
    formData,
    errors,
    isLoading,
    handleInputChange,
    handleSubmit,
  };
}
