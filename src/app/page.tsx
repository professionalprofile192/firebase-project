'use client';

import Image from 'next/image';
import { LoginForm } from '@/components/auth/login-form';
import { Button } from '@/components/ui/button';
import { Landmark, Send } from 'lucide-react';
import { StripeGradient } from '@/components/auth/stripe-gradient';
import { useState } from 'react';
import { ContactUsDialog } from '@/components/auth/contact-us-dialog';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const ublLogo = '/ubl_logo.png';
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  return (
    <>
      <div className="hidden lg:block">
        <StripeGradient />
      </div>
      <div className={cn(
        "h-full w-full relative z-10",
        "lg:grid lg:grid-cols-2"
      )}>
        {/* Left side - visible on desktop */}
        <div className="hidden md:flex flex-col items-start justify-between p-12 ">
          <Image
            src={ublLogo}
            alt="UBL Digital Logo"
            width={100}
            height={100}
            data-ai-hint="logo banking"
            className="rounded-lg shadow-md
            sm:w-16 sm:h-16     /* small tablet */
            md:w-20 md:h-20     /* tablet */
            lg:w-24 lg:h-24     /* desktop */"
            priority
          />
          <div className="pt-24  mb-auto text-black sm:pt-10
            md:pt-12">

          <h1 className=" font-bold mb-4
            text-3xl         /* mobile default */
            sm:text-4xl      /* small tablet */
            md:text-5xl      /* tablet */
            lg:text-6xl      /* desktop */">

              Welcome to UBL Digital Business Banking
            </h1>
            <p className=" pt-4 max-w-lg
              text-base       /* mobile */
              sm:text-lg      /* small tablet */
              md:text-xl      /* tablet */">
                
              UBL Digital Business Banking offers a comprehensive suite of
              flexible online financial solutions to cater to all your business
              banking needs.
            </p>
          </div>
        </div>

        {/* Right side - Login form container */}
        <div className="flex flex-col h-full justify-between items-start md:p-20 lg:p-20 md:pt-25 lg:pt-25">
          {/* Mobile View */}
          <div className="lg:hidden flex flex-col h-full min-h-screen w-full bg-white">
            <header className="flex-shrink-0 p-4">
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
            <main className="flex-1 flex flex-col p-4 justify-end pb-8">
              <div className="w-full">
                <LoginForm />
              </div>
            </main>
            <footer className="w-full flex justify-center bg-transparent mt-auto pb-6 px-4">
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
                  onClick={() => setIsContactDialogOpen(true)}
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
      <ContactUsDialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen} />
    </>
  );
}