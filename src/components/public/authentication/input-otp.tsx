'use client';

import { cn } from '@/lib/utils/class-merge';
import { useSearchParams, useRouter } from 'next/navigation';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { routes } from '@/lib/routes';

export function InputOneTimePassword({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'form'>) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const submitEmail = (event: React.FormEvent, key: string, value: string) => {
    event?.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`?${params.toString()}`);
  };

  return (
    <form
      className={cn('flex flex-col items-center gap-6 md:items-start', className)}
      {...props}
      onSubmit={event =>
        submitEmail(event, routes.account.authQueryKey, routes.account.resetPassword.query.value)
      }
    >
      <span></span>
      <InputOTP maxLength={6}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <Button type="submit" className="w-full capitalize" size={'md'}>
        Verify & Continue
      </Button>
      <div className="text-center text-sm">
        Didn&apos;t get the OTP?{' '}
        <button type="button" className="cursor-pointer underline underline-offset-4">
          Resend code
        </button>
      </div>
    </form>
  );
}
