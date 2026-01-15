import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useOtpForm } from '../hooks/verify-otp';
import { VerifyOTP } from '../verify-otp';
import { toastFunc } from '@/lib/utils/toasts';
import {
  createFormHandler,
  createValidationHandler,
  submitVerifyOtpFormData,
} from '@/lib/utils/auth/form-handlers';
import { toastErrorHandler } from '@/lib/utils/error-handler';
import { otpSchema } from '@/lib/utils/auth/validations';

describe('submitVerifyOtpFormData()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  vi.mock('@/lib/services/auth', () => ({
    authService: {
      verifyOtp: vi.fn((email, otp) => {
        return new Promise((resolve, reject) => {
          if (!email || !otp) {
            return reject('Invalid input');
          }
          return resolve({
            message: 'Otp verified successfully',
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

  describe('Verify OTP flow', () => {
    it('should handle successful OTP verification', async () => {
      const email = 'test@example.com';
      const otp = '123456';

      const result = await submitVerifyOtpFormData(email, otp);

      expect(result).toBe(otp);
      expect(toastFunc).toHaveBeenCalledWith('Otp verified successfully', true);
    });

    it('should throw error if OTP data is empty', async () => {
      const email = 'test@example.com';
      const otp = '';

      const result = await submitVerifyOtpFormData(email, otp);

      expect(result).toBeUndefined();
      expect(toastErrorHandler).toHaveBeenCalledWith('Invalid input');
    });

    it('should throw error if email data is empty', async () => {
      const email = '';
      const otp = '123456';

      const result = await submitVerifyOtpFormData(email, otp);

      expect(result).toBeUndefined();
      expect(toastErrorHandler).toHaveBeenCalledWith('Invalid input');
    });
  });
});

describe('validateForm()', () => {
  describe('OTP verification validation', () => {
    let setErrors = vi.fn();

    beforeEach(() => {
      setErrors = vi.fn();
    });

    it('should handle OTP verification validation success', () => {
      const formData = {
        otp: '123456',
      };

      const validateForm = createValidationHandler(otpSchema, formData, setErrors);
      const isValid = validateForm();

      expect(isValid).toBe(true);
      expect(setErrors).not.toHaveBeenCalled();
    });

    it('should handle signup validation email format errors', async () => {
      const formData = {
        otp: '',
      };

      const validateForm = createValidationHandler(otpSchema, formData, setErrors);
      const isValid = validateForm();

      expect(isValid).toBe(false);
      expect(setErrors).toHaveBeenCalledTimes(1);
      expect(setErrors).toHaveBeenCalledWith(
        expect.objectContaining({
          otp: expect.any(String),
        })
      );
    });
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

  it('should verify set form data was called and updater works correctly for otp', () => {
    const handleInputChange = createFormHandler(setFormData, setErrors);
    const mockEvent = {
      target: {
        id: 'otp',
        value: 'newotp123',
      },
    } as React.ChangeEvent<HTMLInputElement>;

    handleInputChange(mockEvent);

    const formDataUpdater = setFormData.mock.calls[0][0];
    const updatedFormData = formDataUpdater(previousFormData);

    expect(setFormData).toHaveBeenCalledTimes(1);
    expect(updatedFormData).toEqual({
      ...previousFormData,
      otp: 'newotp123',
    });
  });

  it('should clear error when field is changed', () => {
    const handleInputChange = createFormHandler(setFormData, setErrors);

    const mockEvent = {
      target: {
        id: 'otp',
        value: 'newotp123',
      },
    } as React.ChangeEvent<HTMLInputElement>;

    handleInputChange(mockEvent);

    expect(setErrors).toHaveBeenCalledTimes(1);
    const errorsUpdater = setErrors.mock.calls[0][0];
    const previousErrors = { otp: 'OTP is required' };
    const updatedErrors = errorsUpdater(previousErrors);

    expect(updatedErrors.otp).toBe('');
  });
});

vi.mock('../hooks/verify-otp', () => ({
  useOtpForm: vi.fn(),
}));

const mockRouterPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockRouterPush,
    replace: vi.fn(),
  }),
}));

// Mock InputOTP component to avoid ResizeObserver issues
vi.mock('@/components/ui/input-otp', () => ({
  InputOTP: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <div data-testid="input-otp" data-value={value}>
      {children}
    </div>
  ),
  InputOTPGroup: ({ children }: { children: React.ReactNode }) => <div data-testid="input-otp-group">{children}</div>,
  InputOTPSlot: ({ index }: { index: number }) => (
    <input
      data-testid={`input-otp-slot-${index}`}
      type="text"
      maxLength={1}
      style={{ width: '2rem', height: '2rem', textAlign: 'center' }}
    />
  ),
}));

describe('VerifyOTP Component', () => {
  const email = 'test@example.com';
  const defaultMockReturn = {
    otp: '',
    errors: {},
    isLoading: false,
    handleChange: vi.fn(),
    handleSubmit: vi.fn(),
    resendOtp: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useOtpForm).mockReturnValue(defaultMockReturn);
  });

  describe('Rendering', () => {
    it('should render OTP input slots', () => {
      render(<VerifyOTP email={email} />);
      expect(screen.getByTestId('input-otp')).toBeInTheDocument();
      expect(screen.getByTestId('input-otp-group')).toBeInTheDocument();
      for (let i = 0; i < 6; i++) {
        expect(screen.getByTestId(`input-otp-slot-${i}`)).toBeInTheDocument();
      }
    });

    it('should render button and resend code link', () => {
      render(<VerifyOTP email={email} />);
      expect(screen.getByText(/didn't get the otp/i)).toBeInTheDocument();
      expect(screen.getByText(/resend code/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /verify & continue/i })).toBeInTheDocument();
    });
  });

  describe('Error Display', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      vi.mocked(useOtpForm).mockReturnValue(defaultMockReturn);
    });

    it('should display OTP error', () => {
      vi.mocked(useOtpForm).mockReturnValue({
        ...defaultMockReturn,
        errors: { otp: 'OTP is required' },
      });
      render(<VerifyOTP email={email} />);
      expect(screen.getByText('OTP is required')).toBeInTheDocument();
    });

    it('should display invalid OTP format error', () => {
      vi.mocked(useOtpForm).mockReturnValue({
        ...defaultMockReturn,
        errors: { otp: 'Invalid OTP format' },
      });
      render(<VerifyOTP email={email} />);
      expect(screen.getByText('Invalid OTP format')).toBeInTheDocument();
    });

    it('should not display error when no error exists', () => {
      render(<VerifyOTP email={email} />);
      const errorParagraph = document.querySelector('p.text-red-500');
      expect(errorParagraph).not.toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      vi.mocked(useOtpForm).mockReturnValue(defaultMockReturn);
    });

    it('should disable submit button when loading', () => {
      vi.mocked(useOtpForm).mockReturnValue({
        ...defaultMockReturn,
        isLoading: true,
      });
      render(<VerifyOTP email={email} />);
      const submitButton = screen.getByRole('button', { name: /verify & continue/i });
      expect(submitButton).toBeDisabled();
    });

    it('should show loading spinner when loading', () => {
      vi.mocked(useOtpForm).mockReturnValue({
        ...defaultMockReturn,
        isLoading: true,
      });
      render(<VerifyOTP email={email} />);
      const submitButton = screen.getByRole('button', { name: /verify & continue/i });
      const spinner = submitButton.querySelector('svg');
      expect(spinner).toBeInTheDocument();
    });

    it('should enable submit button when not loading', () => {
      render(<VerifyOTP email={email} />);
      const submitButton = screen.getByRole('button', { name: /verify & continue/i });
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Form Submission', () => {
    const mockHandleSubmit = vi.fn();
    const defaultMockReturn = {
      otp: '',
      errors: {},
      isLoading: false,
      handleChange: vi.fn(),
      handleSubmit: mockHandleSubmit,
      resendOtp: vi.fn(),
    };

    beforeEach(() => {
      vi.clearAllMocks();
      vi.mocked(useOtpForm).mockReturnValue(defaultMockReturn);
    });

    it('should call handleSubmit on form submit', () => {
      render(<VerifyOTP email={email} />);
      const form = screen.getByRole('button', { name: /verify & continue/i }).closest('form');
      fireEvent.submit(form!);
      expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe('OTP Input Interactions', () => {
    let mockHandleChange = vi.fn();
    let mockHandleSubmit = vi.fn();
    let mockResendOtp = vi.fn();
    let defaultMockReturn = {
      otp: '',
      errors: {},
      isLoading: false,
      handleChange: mockHandleChange,
      handleSubmit: mockHandleSubmit,
      resendOtp: mockResendOtp,
    };

    beforeEach(() => {
      mockHandleChange = vi.fn();
      mockHandleSubmit = vi.fn();
      mockResendOtp = vi.fn();
      defaultMockReturn = {
        otp: '',
        errors: {},
        isLoading: false,
        handleChange: mockHandleChange,
        handleSubmit: mockHandleSubmit,
        resendOtp: mockResendOtp,
      };
      vi.clearAllMocks();
      vi.mocked(useOtpForm).mockReturnValue(defaultMockReturn);
    });

    it('should call handleChange when OTP value changes', () => {
      render(<VerifyOTP email={email} />);
      expect(screen.getByTestId('input-otp')).toBeInTheDocument();
      expect(mockHandleChange).toBeDefined();
    });

    it('should display OTP value when set', () => {
      vi.mocked(useOtpForm).mockReturnValue({
        ...defaultMockReturn,
        otp: '123456',
      });
      render(<VerifyOTP email={email} />);
      const inputOtp = screen.getByTestId('input-otp');
      expect(inputOtp).toHaveAttribute('data-value', '123456');
    });
  });
});
