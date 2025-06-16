import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { routes } from '@/lib/constants/page-routes';
import { loginSchema, signupSchema, type FormErrors } from '@/lib/validations/auth';
import { createFormHandler, createValidationHandler } from '@/lib/utils/form-handlers';
import { AuthFormData } from '../../../../interfaces/auth';
import { toastFunc } from '@/lib/utils/toasts';
import { AUTH_FAILED, UNEXPECTED_ERROR } from '@/lib/constants/messages';
import { authService } from '@/lib/services/api/auth';
import { userStore } from '@/store/user';
import axios from 'axios';

export function useAuthForm(authParam: string, errorParam?: string) {
  const router = useRouter();
  const setUser = userStore(state => state.setUser);
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = createFormHandler<AuthFormData>(setFormData, setErrors);
  const validateForm = createValidationHandler(
    authParam === routes.account.query.signup ? signupSchema : loginSchema,
    formData,
    setErrors
  );

  useEffect(() => {
    if (errorParam) {
      setTimeout(() => {
        toastFunc(AUTH_FAILED, false);
        router.replace(`?${routes.account.keys.auth}=${routes.account.query.login}`);
      }, 200);
    }
  }, [errorParam, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.loginOrSignup(
        formData.email,
        formData.name,
        formData.password,
        authParam
      );
      toastFunc(response.data.message, true);
      setUser(response.data.user);
      router.replace(routes.dashboard.path);
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
