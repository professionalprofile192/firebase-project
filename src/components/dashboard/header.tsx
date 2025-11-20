'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, User, LogOut, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LogoutDialog } from '../auth/logout-dialog';
import { Avatar, AvatarFallback } from '../ui/avatar';

type UserProfile = {
    firstname: string;
    lastname: string;
    email: string;
}

export function Header() {
  const router = useRouter();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const profile = sessionStorage.getItem('userProfile');
    if (profile) {
      setUserProfile(JSON.parse(profile));
    }
  }, []);

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    setShowLogoutDialog(false);
    sessionStorage.clear();
    router.push('/');
  };

  return (
    <>
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
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <User className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end">
                 <DropdownMenuGroup>
                    <div className="flex items-center gap-3 p-2">
                        <Avatar>
                            <AvatarFallback>
                                <User className="h-6 w-6" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-semibold capitalize">{userProfile?.firstname} {userProfile?.lastname}</span>
                            <span className="text-xs text-muted-foreground">{userProfile?.email}</span>
                        </div>
                    </div>
                 </DropdownMenuGroup>
                 <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Alerts Settings</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

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
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="justify-start text-muted-foreground">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end">
                    <DropdownMenuGroup>
                        <div className="flex items-center gap-3 p-2">
                            <Avatar>
                                <AvatarFallback>
                                    <User className="h-6 w-6" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="font-semibold capitalize">{userProfile?.firstname} {userProfile?.lastname}</span>
                                <span className="text-xs text-muted-foreground">{userProfile?.email}</span>
                            </div>
                        </div>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Profile Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Alerts Settings</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                onClick={handleLogout}
                className="justify-start text-muted-foreground"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </header>
      <LogoutDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={confirmLogout}
      />
    </>
  );
}
