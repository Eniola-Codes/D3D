import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useForgetPasswordForm } from '../hooks/forget-password';
import { ForgetPassword } from '../forget-password';
import { toastFunc } from '@/lib/utils/toasts';
import { routes } from '@/lib/constants/page-routes';
import {
  createFormHandler,
  createValidationHandler,
  submitForgetPasswordFormData,
} from '@/lib/utils/auth/form-handlers';
import { toastErrorHandler } from '@/lib/utils/error-handler';
import { forgotPasswordSchema } from '@/lib/utils/auth/validations';

describe('submitForgetPasswordFormData()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  vi.mock('@/lib/services/auth', () => ({
    authService: {
      forgotPassword: vi.fn(email => {
        return new Promise((resolve, reject) => {
          if (!email) {
            return reject('Invalid email');
          }
          return resolve({
            message: 'Email sent successfully',
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

  describe('Forget Password flow', () => {
    it('should handle successful forget password', async () => {
      const formData = {
        email: 'test@example.com',
      };

      const result = await submitForgetPasswordFormData(formData.email);

      expect(result).toBe(formData.email);
      expect(toastFunc).toHaveBeenCalledWith('Email sent successfully', true);
    });

    it('should throw error if email data is empty', async () => {
      const formData = {
        email: '',
      };

      const result = await submitForgetPasswordFormData(formData.email);

      expect(result).toBeUndefined();
      expect(toastErrorHandler).toHaveBeenCalledWith('Invalid email');
    });
  });
});

describe('validateForm()', () => {
  let setErrors = vi.fn();

  beforeEach(() => {
    setErrors = vi.fn();
  });

  describe('Signup validation', () => {
    it('should handle signup validation success', () => {
      const formData = {
        email: 'test@example.com',
      };
      const validateForm = createValidationHandler(forgotPasswordSchema, formData, setErrors);
      const isValid = validateForm();

      expect(isValid).toBe(true);
      expect(setErrors).not.toHaveBeenCalled();
    });

    it('should handle signup validation email format errors', async () => {
      const formData = {
        email: 'invalid-email',
      };
      const validateForm = createValidationHandler(forgotPasswordSchema, formData, setErrors);
      const isValid = validateForm();

      expect(isValid).toBe(false);
      expect(setErrors).toHaveBeenCalledTimes(1);
      expect(setErrors).toHaveBeenCalledWith(
        expect.objectContaining({
          email: expect.any(String),
        })
      );
    });
  });

  describe('handleInputChange()', () => {
    let setFormData = vi.fn();
    let setErrors = vi.fn();

    const previousFormData = {
      email: 'test@example.com',
      name: 'Old Name',
      password: '12345678',
      confirmPassword: '12345678',
    };

    beforeEach(() => {
      setFormData = vi.fn();
      setErrors = vi.fn();
    });

    it('should verify set form data was called and updater works correctly for email', () => {
      const handleInputChange = createFormHandler(setFormData, setErrors);
      const mockEvent = {
        target: {
          id: 'email',
          value: 'new@example.com',
        },
      } as React.ChangeEvent<HTMLInputElement>;

      handleInputChange(mockEvent);

      const formDataUpdater = setFormData.mock.calls[0][0];
      const updatedFormData = formDataUpdater(previousFormData);

      expect(setFormData).toHaveBeenCalledTimes(1);
      expect(updatedFormData).toEqual({
        ...previousFormData,
        email: 'new@example.com',
      });
    });
  });
});

vi.mock('../hooks/forget-password', () => ({
  useForgetPasswordForm: vi.fn(),
}));

const mockRouterPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockRouterPush,
    replace: vi.fn(),
  }),
}));

describe('handleInputChange()', () => {
  let setFormData = vi.fn();
  let setErrors = vi.fn();

  const previousFormData = {
    email: 'test@example.com',
    name: 'Old Name',
    password: '12345678',
    confirmPassword: '12345678',
  };

  beforeEach(() => {
    setFormData = vi.fn();
    setErrors = vi.fn();
  });

  it('should verify set form data was called and updater works correctly for email', () => {
    const handleInputChange = createFormHandler(setFormData, setErrors);
    const mockEvent = {
      target: {
        id: 'email',
        value: 'new@example.com',
      },
    } as React.ChangeEvent<HTMLInputElement>;

    handleInputChange(mockEvent);

    const formDataUpdater = setFormData.mock.calls[0][0];
    const updatedFormData = formDataUpdater(previousFormData);

    expect(setFormData).toHaveBeenCalledTimes(1);
    expect(updatedFormData).toEqual({
      ...previousFormData,
      email: 'new@example.com',
    });
  });

  it('should clear error when field is changed', () => {
    const handleInputChange = createFormHandler(setFormData, setErrors);

    const mockEvent = {
      target: {
        id: 'email',
        value: 'newemail123',
      },
    } as React.ChangeEvent<HTMLInputElement>;

    handleInputChange(mockEvent);

    expect(setErrors).toHaveBeenCalledTimes(1);
    const errorsUpdater = setErrors.mock.calls[0][0];
    const previousErrors = { email: 'email is required' };
    const updatedErrors = errorsUpdater(previousErrors);

    expect(updatedErrors.email).toBe('');
  });
});

describe('ForgetPassword Component', () => {
  const defaultMockReturn = {
    formData: {
      email: '',
    },
    errors: {},
    isLoading: false,
    handleInputChange: vi.fn(),
    handleSubmit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useForgetPasswordForm).mockReturnValue(defaultMockReturn);
  });

  describe('Rendering', () => {
    it('should render forget password form', () => {
      render(<ForgetPassword />);
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit email/i })).toBeInTheDocument();
      expect(screen.getByText(/remember your password now/i)).toBeInTheDocument();
      expect(screen.getByText(/log in/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/nathansmt@example.com/i)).toBeInTheDocument();
    });
  });

  describe('Error Display', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      vi.mocked(useForgetPasswordForm).mockReturnValue(defaultMockReturn);
    });

    it('should display email error', () => {
      vi.mocked(useForgetPasswordForm).mockReturnValue({
        ...defaultMockReturn,
        errors: { email: 'Email is required' },
      });
      render(<ForgetPassword />);
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    it('should display invalid email format error', () => {
      vi.mocked(useForgetPasswordForm).mockReturnValue({
        ...defaultMockReturn,
        errors: { email: 'Invalid email format' },
      });
      render(<ForgetPassword />);
      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    });

    it('should apply error styling to email input when error exists', () => {
      vi.mocked(useForgetPasswordForm).mockReturnValue({
        ...defaultMockReturn,
        errors: { email: 'Invalid email' },
      });
      render(<ForgetPassword />);
      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toHaveClass('border-red-500');
    });

    it('should not apply error styling when no error', () => {
      render(<ForgetPassword />);
      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).not.toHaveClass('border-red-500');
    });
  });

  describe('Loading State', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      vi.mocked(useForgetPasswordForm).mockReturnValue(defaultMockReturn);
    });

    it('should disable submit button when loading', () => {
      vi.mocked(useForgetPasswordForm).mockReturnValue({
        ...defaultMockReturn,
        isLoading: true,
      });
      render(<ForgetPassword />);
      const submitButton = screen.getByRole('button', { name: /submit email/i });
      expect(submitButton).toBeDisabled();
    });

    it('should show loading spinner when loading', () => {
      vi.mocked(useForgetPasswordForm).mockReturnValue({
        ...defaultMockReturn,
        isLoading: true,
      });
      render(<ForgetPassword />);
      const submitButton = screen.getByRole('button', { name: /submit email/i });
      const spinner = submitButton.querySelector('svg');
      expect(spinner).toBeInTheDocument();
    });

    it('should enable submit button when not loading', () => {
      render(<ForgetPassword />);
      const submitButton = screen.getByRole('button', { name: /submit email/i });
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Form Submission', () => {
    const mockHandleSubmit = vi.fn();
    const defaultMockReturn = {
      formData: {
        email: '',
      },
      errors: {},
      isLoading: false,
      handleInputChange: vi.fn(),
      handleSubmit: mockHandleSubmit,
    };

    beforeEach(() => {
      vi.clearAllMocks();
      vi.mocked(useForgetPasswordForm).mockReturnValue(defaultMockReturn);
    });

    it('should call handleSubmit on form submit', () => {
      render(<ForgetPassword />);
      const form = screen.getByRole('button', { name: /submit email/i }).closest('form');
      fireEvent.submit(form!);
      expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe('Input Interactions', () => {
    let mockHandleInputChange = vi.fn();
    let mockHandleSubmit = vi.fn();
    let defaultMockReturn = {
      formData: {
        email: '',
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
          email: '',
        },
        errors: {},
        isLoading: false,
        handleInputChange: mockHandleInputChange,
        handleSubmit: mockHandleSubmit,
      };
      vi.clearAllMocks();
      vi.mocked(useForgetPasswordForm).mockReturnValue(defaultMockReturn);
    });

    it('should call handleInputChange on email change', () => {
      render(<ForgetPassword />);
      const emailInput = screen.getByLabelText(/email/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      expect(mockHandleInputChange).toHaveBeenCalledTimes(1);
    });

    it('should display form data values', () => {
      vi.mocked(useForgetPasswordForm).mockReturnValue({
        ...defaultMockReturn,
        formData: {
          email: 'test@example.com',
        },
      });
      render(<ForgetPassword />);
      expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      vi.mocked(useForgetPasswordForm).mockReturnValue(defaultMockReturn);
    });

    it('should navigate to login when clicking login link', () => {
      render(<ForgetPassword />);
      const loginLink = screen.getByText(/log in/i);
      fireEvent.click(loginLink);
      expect(mockRouterPush).toHaveBeenCalledWith(
        `?${routes.account.keys.auth}=${routes.account.query.login}`
      );
    });
  });
});
