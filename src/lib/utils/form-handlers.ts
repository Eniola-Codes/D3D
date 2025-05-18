import { type FormErrors } from '@/lib/validations/auth';
import { z } from 'zod';

type FormData = {
  email: string;
  password: string;
  confirmPassword?: string;
  [key: string]: any;
};

export const createFormHandler = (
  setFormData: React.Dispatch<React.SetStateAction<FormData>>,
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>
) => {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));

    if (setErrors) {
      setErrors(prev => ({
        ...prev,
        [id]: undefined,
      }));
    }
  };
};

// Generic form validation handler
export const createValidationHandler = (
  schema: z.ZodType<any>,
  formData: FormData,
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>
) => {
  return () => {
    try {
      schema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof FormErrors] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };
};
