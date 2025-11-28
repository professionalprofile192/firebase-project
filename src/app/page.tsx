'use client';

import Image from 'next/image';
import { LoginForm } from '@/components/auth/login-form';
import { Button } from '@/components/ui/button';
import { Landmark, Send } from 'lucide-react';
import { StripeGradient } from '@/components/auth/stripe-gradient';
import { cn } from '@/lib/utils';
import { useState, useCallback } from 'react';
import { ContactInfoCard } from '@/components/auth/contact-info-card';
import Link from 'next/link';

export default function LoginPage() {
  const ublLogo = '/ubl_logo.png';
  const [showContactInfo, setShowContactInfo] = useState(false);

  const handleCloseContactInfo = useCallback(() => {
    setShowContactInfo(false);
  }, []);

  return (
    <>
    {/* Background har screen par show hoga */}
    <StripeGradient />

    <div
      className={cn(
        "h-full w-full relative z-10",
        // Desktop + Tablet layout
        "hidden sm:grid sm:grid-cols-2"
      )}
    >
        {/* LEFT SIDE – visible on tablet + desktop */}
        <div className="hidden sm:flex flex-col items-start justify-between p-12">
          <Image
            src={ublLogo}
            alt="UBL Digital Logo"
            width={100}
            height={100}
            priority
            className="
              rounded-lg shadow-md
              sm:w-16 sm:h-16
              md:w-20 md:h-20
              lg:w-24 lg:h-24
            "
          />

          <div
            className="
              pt-24 mb-auto text-black
              sm:pt-10
              md:pt-12
            "
          >
            <h1
              className="
                font-bold mb-4
                text-3xl
                sm:text-4xl
                md:text-5xl
                lg:text-6xl
              "
            >
              Welcome to UBL Digital Business Banking
            </h1>

            <p
              className="
                pt-4 max-w-lg
                text-base
                sm:text-lg
                md:text-xl
              "
            >
              UBL Digital Business Banking offers a comprehensive suite of
              flexible online financial solutions to cater to all your business
              banking needs.
            </p>
          </div>
          <footer className="w-full flex bg-transparent mt-auto ">
          <div className="flex gap-2 w-[50%] justify-center ">
            <Button className="w-full bg-transparent text-black sm:text-1xl
                md:text-1xl  hover:bg-transparent
    hover:text-white"asChild>
              <Link href="/locator">
                <Landmark className="mr-2 h-4 w-4" /> Locate Us
              </Link>
            </Button>
            <Button className="w-full bg-transparent text-black sm:text-1xl
                md:text-1xl  hover:bg-transparent
    hover:text-white" onClick={() => setShowContactInfo(true)}>
              <Send className="mr-2 h-4 w-4" /> Contact Us
            </Button>
          </div>
        </footer>
        </div>
        {showContactInfo && (
        <ContactInfoCard onClose={() => setShowContactInfo(false)} />
      )}
        {/* RIGHT SIDE – Desktop & Tablet login form */}
        <div
          className="
            hidden sm:flex flex-col h-full justify-between
            items-start
            p-20 pt-25
          "
        >
          <div className=" hidden sm:flex flex-col items-center justify-center w-full">
            <div className="w-full max-w-sm">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE VIEW ONLY */}
      <div className="sm:hidden flex flex-col h-full min-h-screen relative z-10">
        <div className="flex-shrink-0 p-4">
          <Image
            src={ublLogo}
            alt="UBL Digital Logo"
            width={60}
            height={60}
            className="rounded-lg shadow-md"
            priority
          />
        </div>

        <main className="flex flex-col p-4">
          <LoginForm />
        </main>

        <footer className="w-full flex justify-center bg-transparent mt-auto pb-6">
          <div className="flex gap-2 w-[50%] justify-center">
            <Button variant="outline" className="w-full bg-white text-primary border-gray-300"asChild>
              <Link href="/locator">
                <Landmark className="mr-2 h-4 w-4" /> Locate Us
              </Link>
            </Button>
            <Button variant="outline" className="w-full bg-white text-primary border-gray-300" onClick={() => setShowContactInfo(true)}>
              <Send className="mr-2 h-4 w-4" /> Contact Us
            </Button>
          </div>
        </footer>
      </div>

      {showContactInfo && (
        <ContactInfoCard onClose={() => setShowContactInfo(false)} />
      )}
    </>
  );
}
