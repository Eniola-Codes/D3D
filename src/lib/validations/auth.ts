import { z } from 'zod';

// Base schema for common fields
const baseAuthSchema = {
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
};

// Login validation schema
export const loginSchema = z.object({
  ...baseAuthSchema,
});

// Signup validation schema
export const signupSchema = z
  .object({
    ...baseAuthSchema,
    name: z.string().trim().min(3, 'Name must be at least 3 characters'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
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
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// OTP validation schema
export const otpSchema = z.object({
  otp: z
    .string()
    .min(6, 'OTP must be 6 digits')
    .max(6, 'OTP must be 6 digits')
    .regex(/^\d+$/, 'OTP must contain only numbers'),
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
