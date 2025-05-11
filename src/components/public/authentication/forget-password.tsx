'use client';

import { cn } from '@/lib/utils/class-merge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { routes } from '@/lib/routes';
import { useRouter, useSearchParams } from 'next/navigation';

export function ForgetPassword({ className, ...props }: React.ComponentPropsWithoutRef<'form'>) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const submitEmail = (event: React.FormEvent, key: string, value: string) => {
    event?.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`?${params.toString()}`);
  };

  const onRouteToLogin = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`?${params.toString()}`);
  };

  return (
    <form
      className={cn('flex flex-col items-center gap-6 md:items-start', className)}
      {...props}
      onSubmit={event =>
        submitEmail(event, routes.account.authQueryKey, routes.account.inputOTP.query.value)
      }
    >
      <div className="grid w-full gap-6">
        <span></span>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="nathansmt@example.com" />
        </div>

        <Button type="submit" className="w-full capitalize" size={'md'}>
          Submit email
        </Button>
      </div>
      <div className="text-center text-sm">
        Remember your password now?{' '}
        <button
          type="button"
          onClick={() =>
            onRouteToLogin(routes.account.authQueryKey, routes.account.login.query.value)
          }
          className="cursor-pointer underline underline-offset-4"
        >
          Log in
        </button>
      </div>
    </form>
  );
}
