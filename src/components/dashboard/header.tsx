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

const ublLogo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAbFBMVEX///8zN0b6+vrg4ODx8fEuMkJxdIEvM0LU1NX19fXAwMLn5+f7+/stMEFha36np6g3OUZPVWVJTl7R0dJLT147PUhSVmNBTlvo6OksL0EAAADu7u5wcHCVlpqgoaN+gYRrbHhWWHBfaX2WmZy5urw8jHukAAAEsklEQVR4nO2diVbyQBBGk6sKICAKKrgqiD5Q5P3f3XDhVdPNtBfTdt5Tz8x83ZuSNK3NAoFAIBAIBAKBQCAQCAQCgUAgEAgEAsG/odm++Y8IQuj9i8h00iGk8sDItNDfX/rRerYt4ZDu4M3VlX60L8pSDmk+fKq99KPpDmm83xT2o/UjL1E6/zR/S8A/Sj8Sp/uMy40wQy2/oF//UX8F+0f6y+j6BAwz/uJ/Av+B/q1vjU3wzP/sX0P/3v68vjW3wTM/eL4c/kP9bZ42N8Az/zR/X/4T/WOeNjfDM/86f1T+C/3rnjY3wzP/Un8A/35/W+eNjfDM/03/hP6b/WOeNjfDs/0n/1P9If7LnjY3wzL9E/2L/hv48z5ob4Zl/jf7Z/q39p3na3AjP/Gv0z/Zv7T/N0+ZGeOZbov+V/b/0p3lq3AjP/G3079k/3J/neXMjPHPkR2C3gX/M96e57pZ2s4L5U9i/8z19bopj4tgu/b/s3/p+u4/N2EzbNbP/aP+gP8xT5/iN2bTNPm+f/sH+q+d/S3/32t0/4P8e/s3+v/5X9o506N6HbrvjM/xP6z/bOfGrfDMMx/7n9f/yP5Qz52T4Zkf+F/av7W/oO+ds+ZcDMx/7H9z/1L/lXNuXAzMfuB/l/8q/s7+wL41VwIzb7g/hP9S/9h+wL82l8Izb7g/uP8c/t39EfnanAjNvud/Xf4h/W+eNrfCM2+5n8z/n39p59ob4Zk/u/84/xT+m541V8Iz/wf6r+x/w7+mc/pWeOZb8n/lf239G952rwIzP/k/tf8bfb3eereCMz88P6T/UP6zzxbvggm/qD/Tf9x/j+c79g3wjP/V/bf1n/mefGScCMx+YP89/WP+3zxTzIjMPmR/bP9t/eOeFdfCM/9w/xn9o/1bntLXwjM/OD+M/pX9K55S18Izn3vI/tn+h+f0tfCM3x6n8+D7D549T18Pz/6h/mX+3/0PnuLXwvP/8P2z/W+e45fC8//I/pH+Pz3Hr4Tnv+d/UP89z+FXwtP/3f0P+0/zHL4Snn8f/eP8r/SfcYlfCU//h+y/qv/Z5/FL4flf2H/Z/+nz+CVw/N/av7f/S//bZ/HLYPmr+5/sP+M89i+D5a/qH+F/qv+947F8Gy1/T/6X/S//pZ/HLoPnt4/03+1+eoy+D5/9w/h/9C/77nsUsg+a/r/+9/S/+/x7ELAflr8z85f1n/i89il0Hyl/f/7v/T//p57E4IzH6o/4z+L/5jntnWhMy/qH+a/sX+fM9sK0JmP2z/Vv9A/xWe29aEzL+y/9H+Yf1vnsOWhMx+sv/Q/oH+Vf5/ns2WhMz+ZP+L/Wv+Z55fl4TMc/+9/Tf+z/NeXRLyr65/vH+d/xf9I/65l5eEfA3/Uft3+q/o3/S6e2/1x/k//0/5R73+XhLyr/Vf7B/lH/Gv9/L2E/n/Y//S/sH+r98fIeP+Z/0P+8f9s94+EaC//n+gf7L/m+fHh3j65/vX/W/p/9g3x0f4+s/3v9L/6fN4fCSP4L/xP+P+l87jl/z1P/rP6x/7z/zDL7kF4GBAIBAIBAIBAIBAIBAKx/AZa3oX79+I03wAAAABJRU5ErkJggg==';

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
