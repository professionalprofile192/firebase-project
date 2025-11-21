'use client';

import { Header } from '@/components/dashboard/header';
import { NetWorth } from '@/components/dashboard/net-worth';
import { MyAccounts } from '@/components/dashboard/my-accounts';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { Notifications } from '@/components/dashboard/notifications';
import { ChartCard } from '@/components/dashboard/chart-card';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getAccounts, getRecentTransactions } from '../actions';
import { Skeleton } from '@/components/ui/skeleton';
import { SessionTimeoutDialog } from '@/components/dashboard/session-timeout-dialog';

type Account = {
    responseCode: string;
    ACCT_STATUS: string;
    ACCT_TITLE: string;
    ACCT_NO: string;
    IBAN_CODE: string;
    DEPOSIT_TYPE: string;
    ACCT_TYPE: string;
    LEDGER_BAL: string;
    AVAIL_BAL: string;
}

export type Transaction = {
    CRDR: 'C' | 'D';
    seqno: string;
    instNo: string;
    tranAmt: string;
    tranDate: string;
    particulars: string;
    runBal: string;
};

const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export default function DashboardPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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

  const fetchTransactionsForAccount = async (acctNo: string) => {
    try {
        const recentTransactionsData = await getRecentTransactions(acctNo);
        if (recentTransactionsData.opstatus === 0) {
            // Take only the 3 most recent transactions for the dashboard
            setTransactions(recentTransactionsData.payments.slice(0, 3));
        } else {
            setTransactions([]);
        }
    } catch (error) {
        console.error("Failed to fetch transactions for account", error);
        setTransactions([]);
    }
  }

  useEffect(() => {
    const profile = sessionStorage.getItem('userProfile');
    if (profile) {
      const parsedProfile = JSON.parse(profile);
      setUserProfile(parsedProfile);

      const fetchData = async () => {
        try {
            const accountsData = await getAccounts(parsedProfile.userid, parsedProfile.CIF_NO);
            if (accountsData.opstatus === 0 && accountsData.payments.length > 0) {
                setAccounts(accountsData.payments);
                await fetchTransactionsForAccount(accountsData.payments[0].ACCT_NO);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
      };
      fetchData();
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
            <main className="flex-1 flex flex-col p-4 sm:px-6 sm:py-4 gap-4 overflow-auto">
                <div className="grid gap-4 lg:grid-cols-4">
                    <div className="lg:col-span-1 flex flex-col gap-4">
                        <Skeleton className="h-[350px]" />
                        <Skeleton className="h-[280px]" />
                    </div>
                    <div className="lg:col-span-3 flex flex-col gap-4">
                        <div className="grid md:grid-cols-2 gap-4 h-[350px]">
                            <Skeleton className="h-full" />
                            <Skeleton className="h-full" />
                        </div>
                        <div className="grid grid-cols-1">
                            <Skeleton className="h-[250px]" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
  }

  return (
    <>
        <div className="flex h-screen w-full flex-col bg-muted/40">
          <Header />
          <main className="flex-1 flex flex-col p-4 sm:px-6 sm:py-4 gap-4 overflow-auto">
            <div className="grid gap-4 lg:grid-cols-4">
              <div className="lg:col-span-1 flex flex-col gap-4">
                 <NetWorth accounts={accounts} userProfile={userProfile} />
                 <Notifications />
              </div>
              <div className="lg:col-span-3 flex flex-col gap-4">
                <div className="grid md:grid-cols-2 gap-4 h-[350px]">
                    <MyAccounts accounts={accounts} />
                    <RecentTransactions 
                        transactions={transactions} 
                        accounts={accounts}
                        onAccountChange={fetchTransactionsForAccount}
                    />
                </div>
                 <div className="grid grid-cols-1">
                    <ChartCard />
                </div>
              </div>
            </div>
          </main>
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
