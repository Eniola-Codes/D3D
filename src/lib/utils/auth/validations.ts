import { z } from 'zod';
import {
  CONFIRM_PASSWORD_FIELD,
  PASSWORD_DOES_NOT_MATCH,
  VALID_EMAIL_ADDRESS,
  VALID_NAME_LENGTH,
  VALID_OTP_FORMAT,
  VALID_OTP_LENGTH,
  VALID_PASSWORD_LENGTH,
} from '../../constants/messages';

// Base schema for common fields
const baseAuthSchema = {
  email: z.string().email(VALID_EMAIL_ADDRESS),
  password: z.string().min(8, VALID_PASSWORD_LENGTH),
};

// Reusable password matching validation
const passwordMatchRefine = (data: { password: string; confirmPassword: string }) =>
  data.password === data.confirmPassword;

// Login validation schema
export const loginSchema = z.object({
  ...baseAuthSchema,
});

// Signup validation schema
export const signupSchema = z
  .object({
    ...baseAuthSchema,
    name: z.string().trim().min(2, VALID_NAME_LENGTH),
    confirmPassword: z.string(),
  })
  .refine(passwordMatchRefine, {
    message: PASSWORD_DOES_NOT_MATCH,
    path: [CONFIRM_PASSWORD_FIELD],
  });

// Forgot password validation schema
export const forgotPasswordSchema = z.object({
  email: baseAuthSchema.email,
});

// Reset password validation schema
export const resetPasswordSchema = z
  .object({
    password: baseAuthSchema.password,
    confirmPassword: z.string(),
  })
  .refine(passwordMatchRefine, {
    message: PASSWORD_DOES_NOT_MATCH,
    path: [CONFIRM_PASSWORD_FIELD],
  });

// OTP validation schema
export const otpSchema = z.object({
  otp: z.string().length(6, VALID_OTP_LENGTH).regex(/^\d+$/, VALID_OTP_FORMAT),
});

// Types for form data
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;
export type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  otp?: string;
};
