'use client';

import { cn } from '@/lib/utils/class-merge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FcGoogle } from 'react-icons/fc';
import { Loader2 } from 'lucide-react';
import { routes } from '@/lib/constants/page-routes';
import { LoginSignupProps } from '../../../interfaces/auth';
import { useAuthForm } from './hooks/login-signup';
import { useRouter } from 'next/navigation';

export function LoginSignup({ className, authParam, errorParam, ...props }: LoginSignupProps) {
  const router = useRouter();
  const { formData, errors, isLoading, handleInputChange, handleSubmit } = useAuthForm(
    authParam,
    errorParam
  );

  return (
    <form className={cn('flex flex-col gap-6', className)} {...props} onSubmit={handleSubmit}>
      <div className="grid gap-6">
        <a href={process.env.NEXT_PUBLIC_GOOGLE_CALLBACK_URL} className="mt-8 w-full">
          <Button type="button" variant="outline" className="w-full sm:flex-1/2">
            <FcGoogle className="size-5" /> Continue with Google
          </Button>
        </a>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or {authParam} with
          </span>
        </div>
        {authParam === routes.account.query.signup && (
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Nathan smt"
              value={formData.name}
              onChange={handleInputChange}
              className={cn(errors.name && 'border-red-500')}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>
        )}
        <div className="grid gap-2">
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
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            className={cn(errors.password && 'border-red-500')}
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          {authParam === routes.account.query.login && (
            <button
              type="button"
              onClick={() =>
                router.push(`?${routes.account.keys.auth}=${routes.account.query.forgetPassword}`)
              }
              className="mt-0.5 ml-auto cursor-pointer text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </button>
          )}
        </div>
        {authParam === routes.account.query.signup && (
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
        )}
        <Button type="submit" className="w-full capitalize" size="md" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {authParam}
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={() =>
            router.push(
              `?${routes.account.keys.auth}=${
                authParam === routes.account.query.login
                  ? routes.account.query.signup
                  : routes.account.query.login
              }`
            )
          }
          className="cursor-pointer capitalize underline underline-offset-4"
        >
          {authParam === routes.account.query.login
            ? routes.account.query.signup
            : routes.account.query.login}
        </button>
      </div>
    </form>
  );
}
