import { AuthForms } from '@/components/public/authentication/auth-forms';
import { SiDatabricks } from 'react-icons/si';
import Image from 'next/image';
import { authBg } from '../../../public/assets/bg-images';
import Link from 'next/link';
import { routes } from '@/lib/routes';
import { Suspense } from 'react';

const Login: React.FC = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10 md:px-16">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href={routes.home} className="flex items-center gap-2.5 font-medium">
            <div className="bg-primary text-primary-foreground flex h-9 w-9 items-center justify-center rounded-md">
              <SiDatabricks className="size-6" />
            </div>
            Data3D
          </Link>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthForms />
        </Suspense>
      </div>
      <div className="relative hidden p-4 lg:block">
        <Image
          src={authBg}
          alt="auth-bg"
          className="inset-0 h-full w-full rounded-2xl object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
