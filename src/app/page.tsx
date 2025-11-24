'use client';

import Image from 'next/image';
import { LoginForm } from '@/components/auth/login-form';
import { Button } from '@/components/ui/button';
import { Landmark, Send } from 'lucide-react';

export default function LoginPage() {
  const ublLogo = '/ubl-digital-logo.png';
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-6 bg-gradient-to-br from-purple-300 via-purple-400 to-pink-300">
      <div className="w-full">
        <Image
          src={ublLogo}
          alt="UBL Digital Logo"
          width={80}
          height={80}
          data-ai-hint="logo banking"
          className="rounded-lg shadow-md"
          priority
        />
      </div>

      <div className="w-full flex-1 flex items-center justify-center">
        <LoginForm />
      </div>
      
      <div className="flex items-center justify-center gap-4 w-full">
        <Button variant="outline" className="bg-white/90 text-foreground hover:bg-white flex-col h-auto py-2 px-6 gap-1 rounded-xl border-gray-200">
          <Send className="h-5 w-5" />
          <span>Locate Us</span>
        </Button>
        <Button variant="outline" className="bg-white/90 text-foreground hover:bg-white flex-col h-auto py-2 px-6 gap-1 rounded-xl border-gray-200">
          <Landmark className="h-5 w-5" />
          <span>Contact Us</span>
        </Button>
      </div>
    </div>
  );
}
