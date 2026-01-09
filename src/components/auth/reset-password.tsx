'use client';

import { cn } from '@/lib/utils/class-merge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ResetPasswordProps } from '../../../interfaces/auth';
import { Loader2 } from 'lucide-react';
import { useResetPasswordForm } from './hooks/reset-password';

export function ResetPassword({ className, email, token, ...props }: ResetPasswordProps) {
  const { formData, errors, isLoading, handleInputChange, handleSubmit } = useResetPasswordForm(
    email,
    token
  );

  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      {...props}
      onSubmit={e => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <div className="grid gap-6">
        <div className="mt-6 grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            className={cn(errors.password && 'border-red-500')}
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={cn(errors.confirmPassword && 'border-red-500')}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword}</p>
          )}
        </div>

        <Button type="submit" className="w-full capitalize" size={'md'} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Reset password
        </Button>
      </div>
    </form>
  );
}
