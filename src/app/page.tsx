'use client';

import Image from 'next/image';
import { LoginForm } from '@/components/auth/login-form';
import { Button } from '@/components/ui/button';
import { Landmark, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

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
          className="rounded-lg shadow-md mb-8"
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
      <div className="flex flex-col h-full bg-gradient-to-br from-purple-300 via-purple-400 to-pink-300 lg:items-center lg:justify-center">
         {/* Mobile header */}
        <header className="w-full flex justify-start p-4 lg:hidden">
          <Image
            src={ublLogo}
            alt="UBL Digital Logo"
            width={60}
            height={60}
            data-ai-hint="logo banking"
            className="rounded-lg shadow-md"
            priority
          />
        </header>

        <main className="flex-1 flex flex-col justify-end w-full lg:justify-center lg:items-center lg:flex-none">
            <div className="bg-white/80 backdrop-blur-sm rounded-t-3xl lg:bg-transparent lg:backdrop-blur-none lg:rounded-none">
                {/* Footer with buttons - Mobile Only */}
                <footer className="w-full flex items-center justify-center gap-4 p-4 lg:hidden">
                    <Button variant="outline" className="bg-white/90 text-foreground hover:bg-white flex-col h-auto py-2 px-6 gap-1 rounded-xl border-gray-200 shadow-md">
                        <Send className="h-5 w-5" />
                        <span>Locate Us</span>
                    </Button>
                    <Button variant="outline" className="bg-white/90 text-foreground hover:bg-white flex-col h-auto py-2 px-6 gap-1 rounded-xl border-gray-200 shadow-md">
                        <Landmark className="h-5 w-5" />
                        <span>Contact Us</span>
                    </Button>
                </footer>
                <LoginForm />
            </div>
        </main>
      </div>
    </div>
  );
}
