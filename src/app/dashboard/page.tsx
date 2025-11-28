'use client';

import { NetWorth } from '@/components/dashboard/net-worth';
import { MyAccounts } from '@/components/dashboard/my-accounts';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { Notifications } from '@/components/dashboard/notifications';
import { ChartCard } from '@/components/dashboard/chart-card';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAccounts, getRecentTransactions } from '../actions';
import { Skeleton } from '@/components/ui/skeleton';
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
    instNo: string;
    tranAmt: string;
    tranDate: string;
    particulars: string;
    runBal: string;
};

export default function DashboardPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
                sessionStorage.setItem('accounts', JSON.stringify(accountsData.payments));
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
  }, [router]);

  if (loading || !userProfile) {
    return (
        <DashboardLayout>
            <main className="flex-1 flex flex-col p-4 sm:px-6 sm:py-4 gap-4 overflow-auto">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {/* Skeleton for Net Worth and Notifications */}
                    <div className="lg:col-span-1 flex flex-col gap-4">
                        <Skeleton className="h-[350px]" />
                        <Skeleton className="h-[280px]" />
                    </div>
                    {/* Skeleton for My Accounts, Recent Transactions and Chart */}
                    <div className="lg:col-span-3 flex flex-col gap-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <Skeleton className="h-[350px]" />
                            <Skeleton className="h-[350px]" />
                        </div>
                        <Skeleton className="h-[250px]" />
                    </div>
                </div>
            </main>
        </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
        <main className="flex-1 flex flex-col p-4 sm:px-6 sm:py-4 gap-4 overflow-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left column for desktop, full width for mobile */}
                <div className="col-span-1 lg:col-span-1 flex flex-col gap-4">
                    <NetWorth accounts={accounts} userProfile={userProfile} />
                    <Notifications />
                </div>
                
                {/* Right column for desktop, full width for mobile */}
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
