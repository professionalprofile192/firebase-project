'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, User, LogOut, Settings, X, Landmark, CheckSquare, CreditCard, ArrowRightLeft, Clock, Briefcase, BarChart, Upload, ChevronDown, ChevronUp } from 'lucide-react';
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { cn } from '@/lib/utils';

type UserProfile = {
    firstname: string;
    lastname: string;
    email: string;
}

const SidebarNav = () => {
    const [openSections, setOpenSections] = useState<string[]>(['accounts']);

    const toggleSection = (section: string) => {
        setOpenSections(prev => 
            prev.includes(section) 
                ? prev.filter(s => s !== section) 
                : [...prev, section]
        );
    }

    const navItems = [
        { id: 'accounts', label: 'Accounts', icon: Landmark, subItems: ['My Accounts', 'Account Statements'] },
        { id: 'approvals', label: 'Approvals & Requests', icon: CheckSquare },
        { id: 'payments', label: 'Payments', icon: CreditCard },
        { id: 'transfers', label: 'Transfers', icon: ArrowRightLeft },
        { id: 'rtgs', label: 'RTGS', icon: Clock },
        { id: 'trade', label: 'Trade Request', icon: Briefcase },
        { id: 'reports', label: 'Report - MIS', icon: BarChart },
        { id: 'bulk', label: 'Bulk Import', icon: Upload },
    ];

    return (
        <nav className="flex flex-col h-full text-sm font-medium">
             <div className="p-4 border-b">
                <div className="flex items-center gap-2 text-lg font-semibold">
                    <Image
                        src="https://picsum.photos/seed/ubl-logo/32/32"
                        alt="UBL Digital Logo"
                        width={32}
                        height={32}
                        data-ai-hint="logo banking"
                        className="rounded-md"
                    />
                    <span>Business Banking</span>
                </div>
            </div>
            <div className='flex-1 overflow-y-auto'>
                {navItems.map(item => (
                    <Collapsible key={item.id} open={openSections.includes(item.id)} onOpenChange={() => toggleSection(item.id)} className="border-b">
                        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50">
                            <div className="flex items-center gap-3">
                                <item.icon className="h-5 w-5" />
                                <span>{item.label}</span>
                            </div>
                            {item.subItems ? (
                                openSections.includes(item.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </CollapsibleTrigger>
                        {item.subItems && (
                            <CollapsibleContent className={cn("bg-muted/20", {
                                "bg-primary/10": item.id === 'accounts'
                            })}>
                                {item.subItems.map(subItem => (
                                    <Link href="#" key={subItem} className={cn("block py-3 px-12", {
                                        "bg-primary/20 text-primary font-semibold": subItem === "My Accounts"
                                    })}>
                                        {subItem}
                                    </Link>
                                ))}
                            </CollapsibleContent>
                        )}
                    </Collapsible>
                ))}
            </div>
        </nav>
    );
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
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80">
            <SidebarNav />
          </SheetContent>
        </Sheet>
        
        <div className="hidden items-center gap-4 md:flex">
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

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex ml-6">
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

        <div className="flex items-center gap-4">
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
                                    {userProfile?.firstname?.[0]?.toUpperCase()}{userProfile?.lastname?.[0]?.toUpperCase()}
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
      </header>
      <LogoutDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={confirmLogout}
      />
    </>
  );
}
