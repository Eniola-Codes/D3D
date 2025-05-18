'use client';

import { cn } from '@/lib/utils/class-merge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { useRouter, useSearchParams } from 'next/navigation';
import { routes } from '@/lib/routes';
import { useState, FormEvent } from 'react';
import { loginSchema, signupSchema, type FormErrors } from '@/lib/validations/auth';
import { createFormHandler, createValidationHandler } from '@/lib/utils/form-handlers';
import { apiService } from '@/lib/services/api';
import { AuthResponse, FormData } from '../../../../types/user';
import { toastFunc } from '@/lib/utils/toasts';
import { Loader2 } from 'lucide-react';

export function LoginSignup({ className, ...props }: React.ComponentPropsWithoutRef<'form'>) {
  const searchParams = useSearchParams();
  const auth = searchParams.get(routes.account.authQueryKey);
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const onRouteToQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`?${params.toString()}`);
  };

  const handleInputChange = createFormHandler(setFormData, setErrors);
  const validateForm = createValidationHandler(
    auth === routes.account.signup.query.value ? signupSchema : loginSchema,
    formData,
    setErrors
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!validateForm()) {
        return;
      }

      const response = await apiService.post<AuthResponse>(`/users/${auth}`, {
        email: formData.email,
        password: formData.password,
      });

      toastFunc(response.message, '#DCFCE7', '#22C55E', '#22C55E');
    } catch (error: any) {
      toastFunc(error.response.data.message, '#FDECEA', '#EF4444', '#EF4444');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={cn('flex flex-col gap-6', className)} {...props} onSubmit={handleSubmit}>
      <div className="grid gap-6">
        <div className="mt-4 items-center justify-center sm:flex sm:space-x-5">
          <Button variant="outline" className="mt-4 w-full sm:flex-1/2">
            <FcGoogle className="size-5" />
            Continue with Google
          </Button>
          <Button variant="outline" className="mt-4 w-full sm:flex-1/2">
            <FaGithub className="size-5" />
            Continue with GitHub
          </Button>
        </div>

        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or {auth} with
          </span>
        </div>

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
          {auth === routes.account.login.query.value && (
            <button
              type="button"
              onClick={() => onRouteToQuery('auth', 'forget-password')}
              className="mt-0.5 ml-auto cursor-pointer text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </button>
          )}
        </div>

        {auth === routes.account.signup.query.value && (
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
        <Button type="submit" className="w-full capitalize" size={'md'} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {auth}
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={() =>
            onRouteToQuery(
              routes.account.authQueryKey,
              auth === routes.account.login.query.value
                ? routes.account.signup.query.value
                : routes.account.login.query.value
            )
          }
          className="cursor-pointer capitalize underline underline-offset-4"
        >
          {auth === routes.account.login.query.value
            ? routes.account.signup.query.value
            : routes.account.login.query.value}
        </button>
      </div>
    </form>
  );
}
