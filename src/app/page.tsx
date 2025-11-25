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
      <div className="h-full w-full md:grid md:grid-cols-2">
        {/* Left side - visible on desktop */}
        <div className="hidden md:flex flex-col items-start justify-between p-12 relative">
          <StripeGradient />
          <div className='relative z-10'>
            <Image
              src={ublLogo}
              alt="UBL Digital Logo"
              width={100}
              height={100}
              data-ai-hint="logo banking"
              className="rounded-lg shadow-md"
              priority
            />
            <div className="pt-24 lg:pt-32 mb-auto text-black">
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
        </div>

        {/* Right side - Login form container */}
        <div className="flex flex-col h-full justify-between items-start p-4 md:p-20 md:pt-25 bg-white">
          {/* Mobile View */}
          <div className="md:hidden flex flex-col h-full w-full">
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
            <main className="flex flex-col p-4 flex-1 justify-center">
              <div className=" flex flex-col">
                <LoginForm />
              </div>
            </main>
            <footer className="w-full flex justify-center bg-transparent mt-auto pb-6">
              <div className="flex gap-2 w-full max-w-sm justify-center">
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
          <div className="hidden md:flex flex-col items-center justify-center w-full h-full">
             <div className="w-full max-w-sm">
                <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
