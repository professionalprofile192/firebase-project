import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});


export const metadata: Metadata = {
  title: 'UBL Digital Banking Login',
  description: 'Securely login to your UBL Digital Banking account.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", inter.variable)}>
      <body className={cn("font-body antialiased min-h-screen overflow-y-auto")}>

        {children}
        <Toaster />
      </body>
    </html>
  );
}
