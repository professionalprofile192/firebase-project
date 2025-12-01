
'use client';

import { NetWorth } from '@/components/dashboard/net-worth';
import { MyAccounts } from '@/components/dashboard/my-accounts';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { Notifications } from '@/components/dashboard/notifications';
import { ChartCard } from '@/components/dashboard/chart-card';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getRecentTransactions } from '@/app/actions';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

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
    instNo?: string;
    tranAmt: string;
    tranDate: string;
    particulars: string;
    runBal: string;
};

type Notification = {
    lastModifiedAt: string;
    status: string;
    featureActionId: string;
    referenceNo: string;
}

interface DashboardProps {
    initialUserProfile: any;
    initialAccounts: Account[];
    initialTransactions: Transaction[];
    initialNotifications: Notification[];
}

export function Dashboard({ 
    initialUserProfile, 
    initialAccounts, 
    initialTransactions,
    initialNotifications
}: DashboardProps) {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [userProfile, setUserProfile] = useState<any>(initialUserProfile);
  const router = useRouter();

  useEffect(() => {
    if (!initialUserProfile) {
      router.push('/');
    } else {
        // Data is now primarily passed via props, but we can still store it
        // for client-side access on other pages if needed, though cookies are better.
        sessionStorage.setItem('userProfile', JSON.stringify(initialUserProfile));
        sessionStorage.setItem('accounts', JSON.stringify(initialAccounts));
    }
  }, [initialUserProfile, initialAccounts, router]);

  const fetchTransactionsForAccount = useCallback(async (acctNo: string) => {
    try {
        const recentTransactionsData = await getRecentTransactions(acctNo);
        if (recentTransactionsData.opstatus === 0) {
            setTransactions(recentTransactionsData.payments.slice(0, 3));
        } else {
            setTransactions([]);
        }
    } catch (error) {
        console.error("Failed to fetch transactions for account", error);
        setTransactions([]);
    }
  }, []);

  if (!userProfile) {
    return (
        <DashboardLayout>
            <main className="flex-1 p-4 sm:px-6 sm:py-4 flex items-center justify-center">
                <div>Redirecting to login...</div>
            </main>
        </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
        <main className="flex-1 flex flex-col p-4 sm:px-6 sm:py-4 gap-4 overflow-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="col-span-1 lg:col-span-1 flex flex-col gap-4">
                    <NetWorth accounts={accounts} userProfile={userProfile} />
                    <Notifications initialNotifications={initialNotifications} />
                </div>
                
                <div className="col-span-1 lg:col-span-2 flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <MyAccounts accounts={accounts} />
                        <RecentTransactions 
                            transactions={transactions} 
                            accounts={accounts}
                            onAccountChange={fetchTransactionsForAccount}
                        />
                    </div>
                    <ChartCard />
                </div>
            </div>
        </main>
    </DashboardLayout>
  );
}
