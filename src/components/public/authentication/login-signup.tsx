'use client';

import { cn } from '@/lib/utils/class-merge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { useRouter, useSearchParams } from 'next/navigation';
import { routes } from '@/lib/routes';

export function LoginSignup({ className, ...props }: React.ComponentPropsWithoutRef<'form'>) {
  const searchParams = useSearchParams();
  const auth = searchParams.get(routes.account.authQueryKey);
  const router = useRouter();

  const onRouteToQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`?${params.toString()}`);
  };

  return (
    <form className={cn('flex flex-col gap-6', className)} {...props}>
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
          <Input id="email" type="email" placeholder="nathansmt@example.com" required />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required />
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
            <Label htmlFor="confirm-password">Confirm password</Label>
            <Input id="confirm-password" type="password" required />
          </div>
        )}
        <Button type="submit" className="w-full capitalize" size={'md'}>
          {auth}
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
