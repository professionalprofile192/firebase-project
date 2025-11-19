'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, User, LogOut, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function Header() {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Image
            src="https://picsum.photos/seed/ubl-logo/32/32"
            alt="UBL Digital Logo"
            width={32}
            height={32}
            data-ai-hint="logo banking"
            className="rounded-md"
          />
          <span className="font-semibold">Business Banking</span>
        </div>
      </div>

      <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
        <Link
          href="#"
          className="text-foreground transition-colors hover:text-foreground/80"
        >
          Home
        </Link>
        <Link
          href="#"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Payments
        </Link>
        <Link
          href="#"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Transfer
        </Link>
      </nav>

      <div className="flex-1" />

      <div className="hidden items-center gap-4 md:flex">
        <User className="h-5 w-5 text-muted-foreground" />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="text-muted-foreground"
          aria-label="Logout"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="#"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Image
                src="https://picsum.photos/seed/ubl-logo/32/32"
                alt="UBL Digital Logo"
                width={32}
                height={32}
                data-ai-hint="logo banking"
                className="rounded-md"
              />
              <span>Business Banking</span>
            </Link>
            <Link href="#" className="text-foreground">
              Home
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
            >
              Payments
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
            >
              Transfer
            </Link>
             <DropdownMenuItem onSelect={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
            </DropdownMenuItem>
          </nav>
        </SheetContent>
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="hidden md:flex">
            Nawaz AL... <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
