'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function LocatorPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-screen w-screen bg-background">
      <header className="flex items-center gap-4 p-4 border-b shrink-0">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-lg font-semibold">Branch & ATM Locator</h1>
      </header>
      <main className="flex-1 overflow-hidden">
        <iframe
          src="https://ubl-web.peekaboo.guru/?type=locator"
          className="w-full h-full border-0"
          allowFullScreen
          title="UBL Branch and ATM Locator"
        />
      </main>
    </div>
  );
}
