import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useResetPasswordForm } from '../hooks/reset-password';
import { ResetPassword } from '../reset-password';
import { toastFunc } from '@/lib/utils/toasts';
import {
  createFormHandler,
  createValidationHandler,
  submitResetPasswordFormData,
} from '@/lib/utils/auth/form-handlers';
import { toastErrorHandler } from '@/lib/utils/error-handler';
import { resetPasswordSchema } from '@/lib/utils/auth/validations';

describe('submitResetPasswordFormData()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  vi.mock('@/lib/services/auth', () => ({
    authService: {
      resetPassword: vi.fn((email, token, password) => {
        return new Promise((resolve, reject) => {
          if (!password || !token || !email) {
            return reject('Password reset failed');
          }
          return resolve({
            message: 'Password changed successfully',
          });
        });
      }),
    },
  }));

  vi.mock('@/lib/utils/error-handler', () => ({
    toastErrorHandler: vi.fn(),
  }));

  vi.mock('@/lib/utils/toasts', () => ({
    toastFunc: vi.fn(),
  }));

  describe('Reset Password flow', () => {
    it('should handle successful reset password', async () => {
      const formData = {
        email: 'test@example.com',
        token: '1234567890',
        password: 'test@example.com',
      };

      const result = await submitResetPasswordFormData(
        formData.email,
        formData.token,
        formData.password
      );

      expect(result).toBe(true);
      expect(toastFunc).toHaveBeenCalledWith('Password changed successfully', true);
    });

    it('should throw error if data is incomplete', async () => {
      const formData = {
        email: '',
        token: '1234567890',
        password: '',
      };

      const result = await submitResetPasswordFormData(
        formData.email,
        formData.token,
        formData.password
      );

      expect(result).toBeUndefined();
      expect(toastErrorHandler).toHaveBeenCalledWith('Password reset failed');
    });
  });
});

describe('validateForm()', () => {
  let setErrors = vi.fn();

  beforeEach(() => {
    setErrors = vi.fn();
  });

  describe('Reset password validation', () => {
    it('should handle reset password validation success', () => {
      const formData = {
        password: 'test@example.com',
        confirmPassword: 'test@example.com',
      };
      const validateForm = createValidationHandler(resetPasswordSchema, formData, setErrors);
      const isValid = validateForm();

      expect(isValid).toBe(true);
      expect(setErrors).not.toHaveBeenCalled();
    });

    it('should handle reset password validation format errors', async () => {
      const formData = {
        password: '123',
        confirmPassword: '12345678',
      };
      const validateForm = createValidationHandler(resetPasswordSchema, formData, setErrors);
      const isValid = validateForm();
      expect(isValid).toBe(false);
      expect(setErrors).toHaveBeenCalledTimes(1);
      expect(setErrors).toHaveBeenCalledWith(
        expect.objectContaining({
          password: expect.any(String),
        })
      );
    });

    it('should handle reset password validation confirm password not the same as password errors', async () => {
      const formData = {
        password: '1234567891',
        confirmPassword: '12345678',
      };
      const validateForm = createValidationHandler(resetPasswordSchema, formData, setErrors);
      const isValid = validateForm();
      expect(isValid).toBe(false);
      expect(setErrors).toHaveBeenCalledTimes(1);
      expect(setErrors).toHaveBeenCalledWith(
        expect.objectContaining({
          confirmPassword: expect.any(String),
        })
      );
    });
  });

  describe('handleInputChange()', () => {
    let setFormData = vi.fn();
    let setErrors = vi.fn();

    const previousFormData = {
      password: '12345678',
      confirmPassword: '12345678',
    };

    beforeEach(() => {
      setFormData = vi.fn();
      setErrors = vi.fn();
    });

    it('should verify set form data was called and updater works correctly for otp', () => {
      const handleInputChange = createFormHandler(setFormData, setErrors);
      const mockEvent = {
        target: {
          id: 'password',
          value: '12345678',
        },
      } as React.ChangeEvent<HTMLInputElement>;

      handleInputChange(mockEvent);

      const formDataUpdater = setFormData.mock.calls[0][0];
      const updatedFormData = formDataUpdater(previousFormData);

      expect(setFormData).toHaveBeenCalledTimes(1);
      expect(updatedFormData).toEqual({
        ...previousFormData,
        password: '12345678',
      });
    });

    it('should clear error when field is changed', () => {
      const handleInputChange = createFormHandler(setFormData, setErrors);

      const mockEvent = {
        target: {
          id: 'password',
          value: '12345678',
        },
      } as React.ChangeEvent<HTMLInputElement>;

      handleInputChange(mockEvent);

      expect(setErrors).toHaveBeenCalledTimes(1);
      const errorsUpdater = setErrors.mock.calls[0][0];
      const previousErrors = { passowrd: 'Password is required' };
      const updatedErrors = errorsUpdater(previousErrors);

      expect(updatedErrors.password).toBe('');
    });
  });
});

vi.mock('../hooks/reset-password', () => ({
  useResetPasswordForm: vi.fn(),
}));

const mockRouterPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockRouterPush,
    replace: vi.fn(),
  }),
}));

describe('ResetPassword Component', () => {
  const email = 'test@example.com';
  const token = '123456';
  const defaultMockReturn = {
    formData: {
      password: '',
      confirmPassword: '',
    },
    errors: {},
    isLoading: false,
    handleInputChange: vi.fn(),
    handleSubmit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useResetPasswordForm).mockReturnValue(defaultMockReturn);
  });

  describe('Rendering', () => {
    it('should render password and confirm password inputs', () => {
      render(<ResetPassword email={email} token={token} />);
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /reset password/i })).toBeInTheDocument();
    });
  });

  describe('Error Display', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      vi.mocked(useResetPasswordForm).mockReturnValue(defaultMockReturn);
    });

    it('should display password error', () => {
      vi.mocked(useResetPasswordForm).mockReturnValue({
        ...defaultMockReturn,
        errors: { password: 'Password is required' },
      });
      render(<ResetPassword email={email} token={token} />);
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });

    it('should display confirm password error', () => {
      vi.mocked(useResetPasswordForm).mockReturnValue({
        ...defaultMockReturn,
        errors: { confirmPassword: 'Passwords do not match' },
      });
      render(<ResetPassword email={email} token={token} />);
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });

    it('should apply error styling to password input when error exists', () => {
      vi.mocked(useResetPasswordForm).mockReturnValue({
        ...defaultMockReturn,
        errors: { password: 'Invalid password' },
      });
      render(<ResetPassword email={email} token={token} />);
      const passwordInput = screen.getByLabelText(/^password$/i);
      expect(passwordInput).toHaveClass('border-red-500');
    });

    it('should apply error styling to confirm password input when error exists', () => {
      vi.mocked(useResetPasswordForm).mockReturnValue({
        ...defaultMockReturn,
        errors: { confirmPassword: 'Passwords do not match' },
      });
      render(<ResetPassword email={email} token={token} />);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      expect(confirmPasswordInput).toHaveClass('border-red-500');
    });

    it('should not apply error styling when no error', () => {
      render(<ResetPassword email={email} token={token} />);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      expect(passwordInput).not.toHaveClass('border-red-500');
      expect(confirmPasswordInput).not.toHaveClass('border-red-500');
    });
  });

  describe('Loading State', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      vi.mocked(useResetPasswordForm).mockReturnValue(defaultMockReturn);
    });

    it('should disable submit button when loading', () => {
      vi.mocked(useResetPasswordForm).mockReturnValue({
        ...defaultMockReturn,
        isLoading: true,
      });
      render(<ResetPassword email={email} token={token} />);
      const submitButton = screen.getByRole('button', { name: /reset password/i });
      expect(submitButton).toBeDisabled();
    });

    it('should show loading spinner when loading', () => {
      vi.mocked(useResetPasswordForm).mockReturnValue({
        ...defaultMockReturn,
        isLoading: true,
      });
      render(<ResetPassword email={email} token={token} />);
      const submitButton = screen.getByRole('button', { name: /reset password/i });
      const spinner = submitButton.querySelector('svg');
      expect(spinner).toBeInTheDocument();
    });

    it('should enable submit button when not loading', () => {
      render(<ResetPassword email={email} token={token} />);
      const submitButton = screen.getByRole('button', { name: /reset password/i });
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Form Submission', () => {
    const mockHandleSubmit = vi.fn();
    const defaultMockReturn = {
      formData: {
        password: '',
        confirmPassword: '',
      },
      errors: {},
      isLoading: false,
      handleInputChange: vi.fn(),
      handleSubmit: mockHandleSubmit,
    };

    beforeEach(() => {
      vi.clearAllMocks();
      vi.mocked(useResetPasswordForm).mockReturnValue(defaultMockReturn);
    });

    it('should call handleSubmit on form submit', () => {
      render(<ResetPassword email={email} token={token} />);
      const form = screen.getByRole('button', { name: /reset password/i }).closest('form');
      fireEvent.submit(form!);
      expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe('Input Interactions', () => {
    let mockHandleInputChange = vi.fn();
    let mockHandleSubmit = vi.fn();
    let defaultMockReturn = {
      formData: {
        password: '',
        confirmPassword: '',
      },
      errors: {},
      isLoading: false,
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockHandleSubmit,
    };

    beforeEach(() => {
      mockHandleInputChange = vi.fn();
      mockHandleSubmit = vi.fn();
      defaultMockReturn = {
        formData: {
          password: '',
          confirmPassword: '',
        },
        errors: {},
        isLoading: false,
        handleInputChange: mockHandleInputChange,
        handleSubmit: mockHandleSubmit,
      };
      vi.clearAllMocks();
      vi.mocked(useResetPasswordForm).mockReturnValue(defaultMockReturn);
    });

    it('should call handleInputChange on password change', () => {
      render(<ResetPassword email={email} token={token} />);
      const passwordInput = screen.getByLabelText(/^password$/i);
      fireEvent.change(passwordInput, { target: { value: 'newpassword123' } });
      expect(mockHandleInputChange).toHaveBeenCalledTimes(1);
    });

    it('should call handleInputChange on confirm password change', () => {
      render(<ResetPassword email={email} token={token} />);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      fireEvent.change(confirmPasswordInput, { target: { value: 'newpassword123' } });
      expect(mockHandleInputChange).toHaveBeenCalledTimes(1);
    });

    it('should display form data values', () => {
      vi.mocked(useResetPasswordForm).mockReturnValue({
        ...defaultMockReturn,
        formData: {
          password: 'newpassword123',
          confirmPassword: 'newpassword123',
        },
      });
      render(<ResetPassword email={email} token={token} />);
      const passwordInputs = screen.getAllByDisplayValue('newpassword123');
      expect(passwordInputs).toHaveLength(2);
    });
  });
});
