import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { routes } from '@/lib/constants/page-routes';
import { loginSchema, signupSchema, type FormErrors } from '@/lib/utils/auth/validations';
import {
  createFormHandler,
  createValidationHandler,
  submitLoginOrSignupFormData,
} from '@/lib/utils/auth/form-handlers';
import { AuthFormData } from '../../../../interfaces/auth';
import { toastFunc } from '@/lib/utils/toasts';
import { AUTH_FAILED } from '@/lib/constants/messages';
import { userStore } from '@/store/user';

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
  useEffect(() => {
    if (errorParam) {
      setTimeout(() => {
        toastFunc(`${AUTH_FAILED}`, false);
        router.replace(`?${routes.account.keys.auth}=${routes.account.query.login}`);
      }, 200);
    }
  }, [errorParam, router]);

  const handleInputChange = createFormHandler<AuthFormData>(setFormData, setErrors);
  const validateForm = createValidationHandler(
    authParam === routes.account.query.signup ? signupSchema : loginSchema,
    formData,
    setErrors
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }
    const user = await submitLoginOrSignupFormData(authParam, formData);
    if (user) {
      setUser(user);
      router.replace(routes.dashboard.path);
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
