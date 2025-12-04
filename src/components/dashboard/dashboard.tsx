
'use client';

import { NetWorth } from '@/components/dashboard/net-worth';
import { MyAccounts } from '@/components/dashboard/my-accounts';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { Notifications } from '@/components/dashboard/notifications';
import { ChartCard } from '@/components/dashboard/chart-card';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getRecentTransactions, getAccounts, getApprovalHistory, getPendingApprovals } from '@/app/actions';
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
    lastModifiedAt?: string;
    assignedDate?: string;
    status: string;
    featureActionId: string;
    referenceNo: string;
}

export function Dashboard() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const profileString = sessionStorage.getItem('userProfile');
    if (!profileString) {
      router.push('/');
    } else {
        const profile = JSON.parse(profileString);
        setUserProfile(profile);
        
        async function fetchData() {
            try {
                const accountsData = await getAccounts(profile.userid, profile.CIF_NO);
                const fetchedAccounts = accountsData.opstatus === 0 ? accountsData.payments : [];
                setAccounts(fetchedAccounts);
                sessionStorage.setItem('accounts', JSON.stringify(fetchedAccounts));

                if (fetchedAccounts.length > 0) {
                    const recentTxData = await getRecentTransactions(fetchedAccounts[0].ACCT_NO);
                    if (recentTxData.opstatus === 0) {
                        setRecentTransactions(recentTxData.payments.slice(0, 3));
                        setAllTransactions(recentTxData.payments);
                    }
                }

                const [historyData, pendingData] = await Promise.all([
                    getApprovalHistory(profile.userid),
                    getPendingApprovals(profile.userid)
                ]);

                const historyNotifications = historyData.opstatus === 0 ? historyData.ApprovalMatrix : [];
                const pendingNotifications = pendingData.opstatus === 0 ? pendingData.ApprovalMatrix : [];

                const combinedNotifications = [...historyNotifications, ...pendingNotifications]
                    .sort((a, b) => new Date(b.assignedDate || b.lastModifiedAt!).getTime() - new Date(a.assignedDate || a.lastModifiedAt!).getTime());
                setNotifications(combinedNotifications);

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }
  }, [router]);

  const fetchTransactionsForAccount = useCallback(async (acctNo: string) => {
    try {
        const recentTransactionsData = await getRecentTransactions(acctNo);
        if (recentTransactionsData.opstatus === 0) {
            setRecentTransactions(recentTransactionsData.payments.slice(0, 3));
            setAllTransactions(recentTransactionsData.payments);
        } else {
            setRecentTransactions([]);
            setAllTransactions([]);
        }
    } catch (error) {
        console.error("Failed to fetch transactions for account", error);
        setRecentTransactions([]);
        setAllTransactions([]);
    }
  }, []);

  if (loading || !userProfile) {
    return (
        <DashboardLayout>
            <main className="flex-1 p-4 sm:px-6 sm:py-4 flex items-center justify-center">
                <div>Loading Dashboard...</div>
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
                    <Notifications initialNotifications={notifications} />
                </div>
                
                <div className="col-span-1 lg:col-span-2 flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <MyAccounts accounts={accounts} />
                        <RecentTransactions 
                            transactions={recentTransactions} 
                            accounts={accounts}
                            onAccountChange={fetchTransactionsForAccount}
                        />
                    </div>
                    <ChartCard transactions={allTransactions} accounts={accounts}/>
                </div>
            </div>
        </main>
    </DashboardLayout>
  );
}
