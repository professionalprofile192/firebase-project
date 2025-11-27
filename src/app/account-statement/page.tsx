'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAccounts, getRecentTransactions } from '../actions';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { AccountDetails } from '@/components/account-statement/account-details';
import { TransactionsList } from '@/components/account-statement/transactions-list';
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

export default function AccountStatementPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const router = useRouter();

  const fetchTransactionsForAccount = async (acctNo: string) => {
    setTransactionsLoading(true);
    try {
        const statementsData = await getRecentTransactions(acctNo);
        if (statementsData.opstatus === 0) {
            setTransactions(statementsData.payments);
        } else {
            setTransactions([]);
        }
    } catch (error) {
        console.error("Failed to fetch transactions for account", error);
        setTransactions([]);
    } finally {
        setTransactionsLoading(false);
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
                const fetchedAccounts = accountsData.payments;
                setAccounts(fetchedAccounts);
                const initialAccount = fetchedAccounts[0];
                setSelectedAccount(initialAccount);
                await fetchTransactionsForAccount(initialAccount.ACCT_NO);
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
  
  const handleAccountChange = (acctNo: string) => {
    const account = accounts.find(a => a.ACCT_NO === acctNo);
    if (account) {
        setSelectedAccount(account);
        fetchTransactionsForAccount(acctNo);
    }
  };


  if (loading || !userProfile) {
    return (
        <DashboardLayout>
            <main className="flex-1 p-4 sm:px-6 sm:py-4">
                <div className="space-y-4">
                    <Skeleton className="h-12 w-1/4" />
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-96 w-full" />
                </div>
            </main>
        </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <main className="flex flex-1 flex-col p-4 sm:px-6 sm:py-4 gap-6 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="col-span-1 lg:col-span-3">
                <Card className="p-4 h-full">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">Today's Snapshot</h3>
                     <Select
                        value={selectedAccount?.ACCT_NO}
                        onValueChange={handleAccountChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Account Type" />
                        </SelectTrigger>
                        <SelectContent>
                             {accounts.map((account) => (
                                <SelectItem key={account.ACCT_NO} value={account.ACCT_NO}>
                                    {account.DEPOSIT_TYPE === 'S' ? 'Saving' : 'Current'} - {account.ACCT_NO}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Card>
            </div>
            <div className="col-span-1 lg:col-span-9">
                {selectedAccount && <AccountDetails account={selectedAccount} />}
            </div>
        </div>
        <div className="flex-1 overflow-hidden">
            <TransactionsList transactions={transactions} loading={transactionsLoading} />
        </div>
      </main>
    </DashboardLayout>
  );
}
