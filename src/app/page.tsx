'use client';

import Image from 'next/image';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  const ublLogo = '/ubl-digital-logo.png';
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="relative hidden items-center justify-center bg-gray-100 lg:flex">
        <div className="relative z-10 mx-auto max-w-md space-y-8 text-black">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center rounded-lg bg-white p-2 shadow-md">
              <Image
                src={ublLogo}
                alt="UBL Digital Logo"
                width={40}
                height={40}
                data-ai-hint="logo banking"
                className="rounded-md"
                priority
              />
            </div>
            <span className="text-2xl font-bold">UBL Digital</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight">
              Welcome to UBL Digital Business Banking
            </h1>
            <p className="text-lg text-gray-800">
              UBL Digital Business Banking offers a comprehensive suite of
              flexible online financial solutions to cater to all your business
              banking needs.
            </p>
          </div>
        </div>
      </div>
      <div className="flex min-h-screen items-center justify-center bg-white p-6 sm:p-8 lg:min-h-0">
        <LoginForm />
      </div>
    </div>
  );
}
