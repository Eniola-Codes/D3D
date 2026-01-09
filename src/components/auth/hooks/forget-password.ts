import { useState } from 'react';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
  type FormErrors,
} from '@/lib/utils/auth/validations';
import {
  createFormHandler,
  createValidationHandler,
  submitForgetPasswordFormData,
} from '@/lib/utils/auth/form-handlers';
import { useRouter } from 'next/navigation';
import { routes } from '@/lib/constants/page-routes';

export function useForgetPasswordForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<ForgotPasswordFormData>({ email: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = createFormHandler(setFormData, setErrors);
  const validateForm = createValidationHandler(forgotPasswordSchema, formData, setErrors);

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    const email = await submitForgetPasswordFormData(formData.email);
    if (email) {
      router.push(`?${routes.account.keys.auth}=${routes.account.query.inputOTP}&email=${email}`);
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
