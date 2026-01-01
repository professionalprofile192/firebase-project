
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, User, LogOut, Settings, X, Landmark, CheckSquare, CreditCard, ArrowRightLeft, Clock, Briefcase, BarChart, Upload, ChevronDown, ChevronUp, LayoutDashboard, FileClock } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
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
import { Sheet, SheetContent, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { LogoutDialog } from '../auth/logout-dialog';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { cn } from '@/lib/utils';
import { logout } from '@/lib/logout';


type UserProfile = {
    firstname: string;
    lastname: string;
    email: string;
}

const ublLogo = '/ubl_logo.png';

const SidebarNav = ({ onLinkClick }: { onLinkClick?: () => void }) => {
    const [openSections, setOpenSections] = useState<string[]>([]);
    const pathname = usePathname();

    const toggleSection = (section: string) => {
        setOpenSections(prev => 
            prev.includes(section) 
                ? prev.filter(s => s !== section) 
                : [...prev, section]
        );
    }

    const handleDashboardClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (pathname === '/dashboard') {
            e.preventDefault();
            onLinkClick?.();
        } else {
            onLinkClick?.();
        }
    }

    const navItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
            href: '/dashboard',
            onClick: handleDashboardClick
        },
        { 
            id: 'accounts', 
            label: 'Accounts', 
            icon: Landmark, 
            subItems: [
                { label: 'Account Statements', href: '/account-statement' }
            ] 
        },
        { 
            id: 'approvals', 
            label: 'Approvals & Requests', 
            icon: CheckSquare, 
            subItems: [
                { label: 'Pending Approvals', href: '/pending-approvals' },
                { label: 'Approvals History', href: '/pending-approvals?tab=history' },
                { label: 'Pending Requests', href: '/requests?tab=pending' },
                { label: 'Requests History', href: '/requests?tab=history' }
            ] 
        },
        { 
            id: 'payments', 
            label: 'Payments', 
            icon: CreditCard, 
            subItems: [
                { label: 'Bill Payment', href: '/bill-payment?tab=bill-payment' },
                { label: 'Bulk Bill Payments', href: '/bill-payment?tab=bulk-bill-payment' },
                { label: 'Bill Payment History', href: '/bill-payment?tab=bill-payment-history' }
            ] 
        },
        { 
            id: 'transfers', 
            label: 'Transfers', 
            icon: ArrowRightLeft, 
            subItems: [
                { label: 'Initiate Transfer', href: '/transfer?tab=transfer' },
                { label: 'Bulk Transfers', href: '/transfer?tab=bulk' },
                { label: 'Transfer History', href: '/transfer?tab=activity' }
            ] 
        },
        { 
            id: 'rtgs', 
            label: 'RTGS', 
            icon: Clock, 
            subItems: [
                { label: 'RTGS Transfers', href: '#' }
            ] 
        },
        { 
            id: 'trade', 
            label: 'Trade Request', 
            icon: Briefcase, 
            subItems: [
                { label: 'Trade Request', href: '/trade-request' },
                { label: 'Trade Request History', href: '/trade-request-history' }
            ] 
        },
        { 
            id: 'reports', 
            label: 'Report - MIS', 
            icon: BarChart,
            href: '#'
        },
        { 
            id: 'bulk', 
            label: 'Bulk Import', 
            icon: Upload, 
            subItems: [
                { label: 'Single Bulk Import', href: '/bulk-import' },
                { label: 'Bulk Import History', href: '/bulk-import?tab=history' }
            ] 
        },
    ];

    return (
        <nav className="flex flex-col h-full text-sm font-medium">
            <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                    <Image
                        src={ublLogo}
                        alt="UBL Digital Logo"
                        width={32}
                        height={32}
                        data-ai-hint="logo banking"
                        className="rounded-md"
                        priority
                    />
                    <span>Business Banking</span>
                </div>
            </div>
            <div className='flex-1 overflow-y-auto'>
                {navItems.map(item => (
                    <Collapsible key={item.id} open={openSections.includes(item.id)} onOpenChange={() => item.subItems && toggleSection(item.id)} className="border-b">
                        <CollapsibleTrigger asChild>
                            <Link href={item.href || '#'} onClick={item.onClick} className={cn("flex items-center justify-between w-full p-4 text-primary", {
                                'hover:bg-muted/50': item.subItems || item.href,
                                'cursor-pointer': item.subItems || item.href,
                            }, !item.subItems && !item.href ? "opacity-50 cursor-not-allowed hover:bg-transparent" : "")}>
                                <div className="flex items-center gap-3">
                                    <item.icon className="h-5 w-5" />
                                    <span>{item.label}</span>
                                </div>
                                {item.subItems ? (
                                    openSections.includes(item.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                                ) : <div className="w-4 h-4" /> }
                            </Link>
                        </CollapsibleTrigger>
                        {item.subItems && (
                            <CollapsibleContent>
                                {item.subItems.map(subItem => (
                                     <SheetClose asChild key={subItem.label}>
                                        <Link href={subItem.href} className="block py-3 px-12 bg-muted/20 hover:bg-muted/50 text-primary">
                                            {subItem.label}
                                        </Link>
                                    </SheetClose>
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
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const profile = sessionStorage.getItem('userProfile');
    if (profile) {
      setUserProfile(JSON.parse(profile));
    }
  }, []);

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = async () => {
    setShowLogoutDialog(false);
    logout();
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex flex-col border-b bg-white text-primary">
        {/* Top Row */}
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-2">
                <Image
                src={ublLogo}
                alt="UBL Digital Logo"
                width={32}
                height={32}
                data-ai-hint="logo banking"
                className="rounded-md"
                priority
                />
                <span className="font-semibold">Business Banking</span>
            </div>

            <div className="flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
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
                                    <span className="font-semibold capitalize text-foreground">{userProfile?.firstname} {userProfile?.lastname}</span>
                                    <span className="text-xs text-muted-foreground">{userProfile?.email}</span>
                                </div>
                            </div>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-foreground">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Profile Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-foreground " asChild>
                        <Link href="/Alerts-settings" className="flex w-full items-center">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Alerts Settings</span>
                        </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    aria-label="Logout"
                >
                    <LogOut className="h-5 w-5" />
                </Button>
            </div>
        </div>

        {/* Bottom Row */}
        <div className="flex h-16 items-center border-t px-4 sm:px-6">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                    <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 mr-4"
                    >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-80">
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    <SidebarNav onLinkClick={() => setIsSheetOpen(false)}/>
                </SheetContent>
            </Sheet>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                <Link
                    href="/dashboard"
                    className="transition-colors hover:text-primary/80"
                >
                    Home
                </Link>
                <Link
                    href="/bill-payment"
                    className="transition-colors hover:text-primary/80"
                >
                    Payments
                </Link>
                <Link
                    href="/transfer"
                    className="transition-colors hover:text-primary/80"
                >
                    Transfer
                </Link>
            </nav>
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
