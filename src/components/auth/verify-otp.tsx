'use client';

import { cn } from '@/lib/utils/class-merge';
import { useRouter } from 'next/navigation';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { routes } from '@/lib/constants/page-routes';
import { inputOTPProps } from '../../../interfaces/auth';
import { useOtpForm } from './hooks/verify-otp';
import { Loader2 } from 'lucide-react';

export function VerifyOTP({ className, email, ...props }: inputOTPProps) {
  const router = useRouter();

  const { otp, errors, isLoading, handleChange, handleSubmit, resendOtp } = useOtpForm(
    email,
    otp => {
      router.push(
        `?${routes.account.keys.auth}=${routes.account.query.resetPassword}&email=${email}&otp=${otp}`
      );
    }
  );

  return (
    <form
      className={cn('flex flex-col items-center gap-6 md:items-start', className)}
      {...props}
      onSubmit={e => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <span></span>
      <div className="grid w-full gap-2">
        <InputOTP maxLength={6} value={otp} onChange={handleChange}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        {errors.otp && <p className="text-sm text-red-500">{errors.otp}</p>}
      </div>

      <Button type="submit" className="w-full capitalize" size="md" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Verify & Continue
      </Button>

      <div className="text-center text-sm">
        Didn&apos;t get the OTP?{' '}
        <button
          type="button"
          onClick={resendOtp}
          className="cursor-pointer underline underline-offset-4"
        >
          Resend code
        </button>
      </div>
    </form>
  );
}
