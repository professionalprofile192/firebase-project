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
      <div className="hidden lg:flex flex-col items-start justify-center p-12 bg-gradient-to-br from-purple-300 via-purple-400 to-pink-300">
        <Image
          src={ublLogo}
          alt="UBL Digital Logo"
          width={100}
          height={100}
          data-ai-hint="logo banking"
          className="rounded-lg shadow-md mb-8 pt-[10%]"
          priority
        />
        <h1 className="text-5xl font-bold mb-4 pt-12">
          Welcome to UBL Digital Business Banking
        </h1>
        <p className="text-lg max-w-lg">
          UBL Digital Business Banking offers a comprehensive suite of flexible
          online financial solutions to cater to all your business banking
          needs.
        </p>
      </div>

      {/* Right side - Login form container */}
      <div className="flex flex-col h-full lg:bg-gradient-to-br from-purple-300 via-purple-400 to-pink-300 lg:items-center lg:justify-center">
        {/* Mobile: Two-part background */}
        <div className="lg:hidden h-full flex flex-col">
          <div className="h-1/3 bg-gradient-to-br from-purple-300 via-purple-400 to-pink-300 flex items-center justify-start p-4">
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
          <div className="h-2/3 bg-white pt-8 px-4 flex flex-col">
            <div className="w-full max-w-sm mx-auto">
              <LoginForm />
            </div>
            <div className="mt-auto py-4 w-full max-w-sm mx-auto space-y-2">
               <div className="flex gap-2">
                <Button variant="outline" className="w-full">
                    <Landmark className="mr-2 h-4 w-4" /> Locate Us
                </Button>
                <Button variant="outline" className="w-full">
                    <Send className="mr-2 h-4 w-4" /> Contact Us
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop: Centered form */}
        <div className="hidden lg:flex flex-col items-center justify-center w-full h-full pb-[10%]">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
