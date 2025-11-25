'use client';

import Image from 'next/image';
import { LoginForm } from '@/components/auth/login-form';
import { Button } from '@/components/ui/button';
import { Landmark, Send } from 'lucide-react';
import { StripeGradient } from '@/components/auth/stripe-gradient';

export default function LoginPage() {
  const ublLogo = '/ubl_logo.png';
  return (
    <>
      <StripeGradient />
      <div className="h-full w-full lg:grid lg:grid-cols-2 relative z-10">
        {/* Left side - visible on desktop */}
        <div className="hidden lg:flex flex-col items-start justify-between p-12 ">
          <Image
            src={ublLogo}
            alt="UBL Digital Logo"
            width={100}
            height={100}
            data-ai-hint="logo banking"
            className="rounded-lg shadow-md"
            priority
          />
          <div className="pt-24  mb-auto text-black">
            <h1 className="text-5xl font-bold mb-4">
              Welcome to UBL Digital Business Banking
            </h1>
            <p className="text-lg max-w-lg pt-4">
              UBL Digital Business Banking offers a comprehensive suite of
              flexible online financial solutions to cater to all your business
              banking needs.
            </p>
          </div>
        </div>

        {/* Right side - Login form container */}
        <div className="flex flex-col h-full justify-between lg:items-start lg:p-20 lg:pt-25">
          {/* Mobile View */}
          <div className="lg:hidden flex flex-col h-full min-h-screen">
            <div className="flex-shrink-0 p-4">
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
            <main className="flex flex-col p-4">
              <div className=" flex flex-col">
                <LoginForm />
              </div>
            </main>
            <footer className="w-full flex justify-center bg-transparent mt-auto pb-6">
  <div className="flex gap-2 w-[50%] justify-center">
    <Button
      variant="outline"
      className="w-full bg-white text-primary border-gray-300"
    >
      <Landmark className="mr-2 h-4 w-4" /> Locate Us
    </Button>
    <Button
      variant="outline"
      className="w-full bg-white text-primary border-gray-300"
    >
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
    </>
  );
}
