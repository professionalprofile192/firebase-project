'use client';

import Image from 'next/image';
import { LoginForm } from '@/components/auth/login-form';
import { Button } from '@/components/ui/button';
import { Landmark, Send } from 'lucide-react';

export default function LoginPage() {
  const ublLogo = '/ubl_logo.png';
  return (
    <div className="h-full w-full lg:grid lg:grid-cols-2">
      {/* Left side - visible on desktop */}
      <div className="hidden lg:flex flex-col items-start justify-between p-12 bg-gradient-to-br from-purple-300 via-purple-400 to-pink-300">
        <Image
          src={ublLogo}
          alt="UBL Digital Logo"
          width={100}
          height={100}
          data-ai-hint="logo banking"
          className="rounded-lg shadow-md"
          priority
        />
        <div className="mb-auto pt-24">
            <h1 className="text-5xl font-bold mb-4">
            Welcome to UBL Digital Business Banking
            </h1>
            <p className="text-lg max-w-lg">
            UBL Digital Business Banking offers a comprehensive suite of flexible
            online financial solutions to cater to all your business banking
            needs.
            </p>
        </div>
      </div>

      {/* Right side - Login form container */}
      <div className="flex flex-col h-full bg-gradient-to-br  from-purple-300  via-purple-400 lg:to-pink-300  justify-between lg:items-start lg:p-20 lg:pt-20">
        
        {/* Mobile View */}
        <div className="lg:hidden flex flex-col gap-6 p-4">
            <div className="flex-shrink-0">
                 <Image
                    src={ublLogo}
                    alt="UBL Digital Logo"
                    width={60}
                    height={60}
                    data-ai-hint="logo banking"
                    className="rounded-lg shadow-md"
                    priority
                />
            </div>
            <main className="flex flex-col">
                <div className="rounded-2xl p-4">
                     <LoginForm />
                </div>
            </main>
          <footer className="bg-transparent mt-[130%]">
    <div className="flex gap-2">
      <Button variant="outline" className="w-full bg-white text-primary border-gray-300">
        <Landmark className="mr-2 h-4 w-4" /> Locate Us
      </Button>
      <Button variant="outline" className="w-full bg-white text-primary border-gray-300">
        <Send className="mr-2 h-4 w-4" /> Contact Us
      </Button>
    </div>
  </footer>
        </div>

        {/* Desktop: Centered form */}
        <div className="hidden lg:flex flex-col items-center justify-center w-full">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
