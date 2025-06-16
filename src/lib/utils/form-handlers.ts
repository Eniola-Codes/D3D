import { Dispatch, SetStateAction } from 'react';
import { z } from 'zod';

export const createFormHandler = <T extends Record<string, unknown>>(
  setFormData: Dispatch<SetStateAction<T>>,
  setErrors: Dispatch<SetStateAction<Record<string, string>>>
) => {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setErrors(prev => ({ ...prev, [id]: '' }));
  };
};

export const createValidationHandler = <T extends Record<string, unknown>>(
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
