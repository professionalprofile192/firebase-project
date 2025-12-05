
'use client';

import { Header } from '@/components/dashboard/header';
import { SessionTimeoutDialog } from '@/components/dashboard/session-timeout-dialog';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef, useCallback, ReactNode } from 'react';
import { logout } from '@/lib/logout';

const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export function DashboardLayout({ children }: { children: ReactNode }) {
    const [showTimeoutDialog, setShowTimeoutDialog] = useState(false);
    const router = useRouter();
    const timeoutId = useRef<NodeJS.Timeout | null>(null);

    const handleLogout = useCallback(async () => {
        await logout();
        if (timeoutId.current) {
            clearTimeout(timeoutId.current);
        }
        router.push('/');
    }, [router]);

    const resetTimeout = useCallback(() => {
        if (timeoutId.current) {
            clearTimeout(timeoutId.current);
        }
        timeoutId.current = setTimeout(() => {
            setShowTimeoutDialog(true);
        }, SESSION_TIMEOUT);
    }, []);

    const handleExtendSession = () => {
        setShowTimeoutDialog(false);
        resetTimeout();
    };

    useEffect(() => {
        const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
        const eventListener = () => resetTimeout();
    
        events.forEach(event => window.addEventListener(event, eventListener));
        resetTimeout();
    
        return () => {
            if (timeoutId.current) {
                clearTimeout(timeoutId.current);
            }
            events.forEach(event => window.removeEventListener(event, eventListener));
        };
    
    }, [resetTimeout]);
    

    return (
        <>
            <div className="no-print">
                <div className="flex min-h-screen w-full flex-col bg-muted/40 overflow-y-auto">
                    <Header />
                    {children}
                </div>
            </div>
            <div className="hidden print:block">
                {children}
            </div>
            <SessionTimeoutDialog
                open={showTimeoutDialog}
                onOpenChange={setShowTimeoutDialog}
                onExtend={handleExtendSession}
                onLogout={handleLogout}
            />
        </>
    );
}
