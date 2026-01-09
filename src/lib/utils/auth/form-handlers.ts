import { Dispatch, SetStateAction } from 'react';
import { z } from 'zod';
import { authService } from '../../services/auth';
import { AuthFormData } from '../../../../interfaces/auth';
import { toastFunc } from '../toasts';
import { toastErrorHandler } from '../error-handler';

export const createFormHandler = <T extends object>(
  setFormData: Dispatch<SetStateAction<T>>,
  setErrors: Dispatch<SetStateAction<Record<string, string>>>
) => {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }) as T);
    setErrors(prev => ({ ...prev, [id]: '' }));
  };
};

export const createValidationHandler = <T extends object>(
  schema: z.ZodType<T>,
  formData: T,
  setErrors: Dispatch<SetStateAction<Record<string, string>>>
) => {
  return () => {
    try {
      schema.parse(formData);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };
};

export const submitLoginOrSignupFormData = async (authParam: string, formData: AuthFormData) => {
  try {
    const response = await authService.loginOrSignup(
      formData.email,
      formData.name,
      formData.password,
      authParam
    );
    toastFunc(response.data.message, true);
    return response.data.user;
  } catch (error: unknown) {
    toastErrorHandler(error);
  }
};

export const submitForgetPasswordFormData = async (email: string) => {
  try {
    const response = await authService.forgotPassword(email);
    toastFunc(response.message, true);
    return email;
  } catch (error: unknown) {
    toastErrorHandler(error);
  }
};

export const submitResetPasswordFormData = async (
  email: string,
  token: string,
  password: string
) => {
  try {
    const response = await authService.resetPassword(email, token, password);
    toastFunc(response.message, true);
    return true;
  } catch (error: unknown) {
    toastErrorHandler(error);
  }
};

export const submitVerifyOtpFormData = async (email: string, otp: string) => {
  try {
    const res = await authService.verifyOtp(email, otp);
    toastFunc(res.message, true);
    return otp;
  } catch (error: unknown) {
    toastErrorHandler(error);
  }
};

export const logout = async () => {
  try {
    const response = await authService.logout();
    toastFunc(response.data.message, true);
    return true;
  } catch (error: unknown) {
    toastErrorHandler(error);
  }
};
