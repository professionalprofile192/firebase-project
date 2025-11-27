'use client';

import { Header } from '@/components/dashboard/header';
import { SessionTimeoutDialog } from '@/components/dashboard/session-timeout-dialog';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef, useCallback, ReactNode } from 'react';

const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export function DashboardLayout({ children }: { children: ReactNode }) {
    const [userProfile, setUserProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showTimeoutDialog, setShowTimeoutDialog] = useState(false);
    const router = useRouter();
    const timeoutId = useRef<NodeJS.Timeout | null>(null);

    const handleLogout = useCallback(() => {
        sessionStorage.clear();
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
        const profile = sessionStorage.getItem('userProfile');
        if (profile) {
            setUserProfile(JSON.parse(profile));
            setLoading(false);
        } else {
            router.push('/');
        }
    
        const handleBeforeUnload = () => {
            sessionStorage.clear();
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
        const eventListener = () => resetTimeout();
    
        events.forEach(event => window.addEventListener(event, eventListener));
        resetTimeout();
    
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            if (timeoutId.current) {
                clearTimeout(timeoutId.current);
            }
            events.forEach(event => window.removeEventListener(event, eventListener));
        };
    
    }, [router, resetTimeout]);
    
    if (loading || !userProfile) {
        return (
            <div className="flex h-screen w-full flex-col bg-muted/40">
                <Header />
                <main className="flex-1 p-4 sm:px-6 sm:py-4 flex items-center justify-center">
                    <div>Loading...</div>
                </main>
            </div>
        )
    }

    return (
        <>
            <div className="flex min-h-screen w-full flex-col bg-muted/40 overflow-y-auto no-print">
                <Header />
                {children}
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
