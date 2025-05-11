'use client';

import { cn } from '@/lib/utils/class-merge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter, useSearchParams } from 'next/navigation';
import { routes } from '@/lib/routes';

export function ResetPassword({ className, ...props }: React.ComponentPropsWithoutRef<'form'>) {
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
      className={cn('flex flex-col gap-6', className)}
      {...props}
      onSubmit={event =>
        submitEmail(event, routes.account.authQueryKey, routes.account.login.query.value)
      }
    >
      <div className="grid gap-6">
        <span></span>

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="confirm-password">Confirm password</Label>
          <Input id="confirm-password" type="password" />
        </div>

        <Button type="submit" className="w-full capitalize" size={'md'}>
          Reset password
        </Button>
      </div>
    </form>
  );
}
