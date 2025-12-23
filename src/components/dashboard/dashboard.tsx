
'use client';

import { NetWorth } from '@/components/dashboard/net-worth';
import { MyAccounts } from '@/components/dashboard/my-accounts';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { Notifications } from '@/components/dashboard/notifications';
import { ChartCard } from '@/components/dashboard/chart-card';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
    const profile = sessionStorage.getItem("userProfile");
    if (!profile) {
      router.push("/");
      return;
    }
  
    setUserProfile(JSON.parse(profile));
    setAccounts(JSON.parse(sessionStorage.getItem("accounts") || "[]"));
    setRecentTransactions(JSON.parse(sessionStorage.getItem("recentTransactions") || "[]"));
    setNotifications(JSON.parse(sessionStorage.getItem("approvals") || "[]"));
    setLoading(false);
  }, []);

  const fetchTransactionsForAccount = useCallback((acctNo: string) => {
    const allTx = JSON.parse(
      sessionStorage.getItem("allTransactions") || "[]"
    );
  
    const filtered = allTx.filter(
      (tx: any) => tx.ACCT_NO === acctNo
    );
  
    setRecentTransactions(filtered.slice(0, 3));
    setAllTransactions(filtered);
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
