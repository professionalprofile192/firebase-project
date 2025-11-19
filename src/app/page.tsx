import Image from 'next/image';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#E0D7FF] to-[#D7E5FF] lg:grid lg:grid-cols-2">
      <div className="relative hidden items-center justify-center lg:flex">
        <div className="relative z-10 mx-auto max-w-md space-y-8 text-slate-800">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-blue-600 p-2 shadow-md">
              <svg
                className="h-10 w-10 text-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12.25A2.25 2.25 0 0 1 6.25 10h11.5A2.25 2.25 0 0 1 20 12.25v6.5A2.25 2.25 0 0 1 17.75 21h-11.5A2.25 2.25 0 0 1 4 18.75v-6.5Z" />
                <path d="M4 10V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" />
                <path d="M10 16h4" />
              </svg>
            </div>
            <span className="text-2xl font-bold">UBL Digital</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight">
              Welcome to UBL Digital Business Banking
            </h1>
            <p className="text-lg text-slate-600">
              UBL Digital Business Banking offers a comprehensive suite of flexible
              online financial solutions to cater to all your business banking
              needs.
            </p>
          </div>
        </div>
      </div>
      <div className="flex min-h-screen items-center justify-center p-6 sm:p-8 lg:min-h-0">
        <LoginForm />
      </div>
    </div>
  );
}
