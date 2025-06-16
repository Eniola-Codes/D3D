import { AuthForms } from '@/components/auth';
import { SiDatabricks } from 'react-icons/si';
import Image from 'next/image';
import { authBg } from '../../../public/assets/bg-images';
import Link from 'next/link';
import { routes } from '@/lib/constants/page-routes';
import { redirect } from 'next/navigation';

const Account = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const params = await searchParams;
  const authParam = params.auth as string | undefined;
  const mailParam = params.email as string | undefined;
  const errorParam = params.error as string | undefined;
  const otpParam = params.otp as string | undefined;

  if (!authParam) {
    redirect(`?${routes.account.keys.auth}=${routes.account.query.login}`);
  }

  if (authParam === routes.account.query.inputOTP && !mailParam) {
    redirect(`?${routes.account.keys.auth}=${routes.account.query.login}`);
  }

  if (authParam === routes.account.query.resetPassword && (!mailParam || !otpParam)) {
    redirect(`?${routes.account.keys.auth}=${routes.account.query.login}`);
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10 md:px-16">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href={routes.home} className="flex items-center gap-2.5 font-medium">
            <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-md">
              <SiDatabricks className="size-5" />
            </div>
            d3d
          </Link>
        </div>
        <AuthForms
          params={{ auth: authParam, mail: mailParam, otp: otpParam, error: errorParam }}
        />
      </div>
      <div className="fixed right-0 hidden h-screen w-1/2 py-4 pr-4 lg:block">
        <Image src={authBg} alt="auth-bg" className="inset-0 h-full rounded-2xl" />
      </div>
    </div>
  );
};

export default Account;
