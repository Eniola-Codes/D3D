'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/class-merge';
import { routes } from '@/lib/constants/page-routes';
import { useForgetPasswordForm } from './hooks/forget-password';

export function ForgetPassword({ className, ...props }: React.ComponentPropsWithoutRef<'form'>) {
  const router = useRouter();
  const { formData, errors, isLoading, handleInputChange, handleSubmit } = useForgetPasswordForm();

  return (
    <form
      className={cn('flex flex-col items-center gap-6 md:items-start', className)}
      {...props}
      onSubmit={e => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <div className="grid w-full gap-6">
        <div className="mt-6 grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="text"
            placeholder="nathansmt@example.com"
            value={formData.email}
            onChange={handleInputChange}
            className={cn(errors.email && 'border-red-500')}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        <Button type="submit" className="w-full capitalize" size={'md'} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Submit email
        </Button>
      </div>
      <div className="text-center text-sm">
        Remember your password now?{' '}
        <button
          type="button"
          onClick={() => router.push(`?${routes.account.keys.auth}=${routes.account.query.login}`)}
          className="cursor-pointer underline underline-offset-4"
        >
          Log in
        </button>
      </div>
    </form>
  );
}
