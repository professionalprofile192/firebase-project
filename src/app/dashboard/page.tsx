'use client';

import { Header } from '@/components/dashboard/header';
import { NetWorth } from '@/components/dashboard/net-worth';
import { MyAccounts } from '@/components/dashboard/my-accounts';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { Notifications } from '@/components/dashboard/notifications';
import { ChartCard } from '@/components/dashboard/chart-card';
import { useEffect, useState } from 'react';
import { getAccounts } from '../actions';
import { Skeleton } from '@/components/ui/skeleton';

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

export default function DashboardPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const profile = sessionStorage.getItem('userProfile');
    if (profile) {
      const parsedProfile = JSON.parse(profile);
      setUserProfile(parsedProfile);

      const fetchAccounts = async () => {
        try {
            const accountsData = await getAccounts(parsedProfile.userid, parsedProfile.CIF_NO);
            if (accountsData.opstatus === 0) {
                setAccounts(accountsData.payments);
            }
        } catch (error) {
            console.error("Failed to fetch accounts", error);
        } finally {
            setLoading(false);
        }
      };
      fetchAccounts();
    } else {
        setLoading(false);
    }
  }, []);

  if (loading) {
    return (
        <div className="flex h-screen w-full flex-col bg-muted/40 overflow-hidden">
            <Header />
            <main className="flex-1 flex flex-col p-4 sm:px-6 sm:py-4 gap-4">
                <div className="flex-1 grid gap-4 lg:grid-cols-4">
                    <div className="lg:col-span-1 flex flex-col gap-4">
                        <Skeleton className="h-[350px]" />
                        <Skeleton className="flex-1" />
                    </div>
                    <div className="lg:col-span-3 flex flex-col gap-4">
                        <div className="flex-1 grid md:grid-cols-2 gap-4">
                            <Skeleton className="h-[300px]" />
                            <Skeleton className="h-[300px]" />
                        </div>
                        <div className="flex-1 grid grid-cols-1">
                            <Skeleton className="flex-1" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
  }

  return (
    <div className="flex h-screen w-full flex-col bg-muted/40 overflow-hidden">
      <Header />
      <main className="flex-1 flex flex-col p-4 sm:px-6 sm:py-4 gap-4">
        <div className="flex-1 grid gap-4 lg:grid-cols-4">
          <div className="lg:col-span-1 flex flex-col gap-4">
            <NetWorth accounts={accounts} userProfile={userProfile} />
            <Notifications />
          </div>
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="flex-1 grid md:grid-cols-2 gap-4">
                <MyAccounts accounts={accounts} />
                <RecentTransactions />
            </div>
             <div className="flex-1 grid grid-cols-1">
                <ChartCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
