'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getRecentTransactions } from '../actions';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
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
        const statementsData = await getRecentTransactions(acctNo, 30); // Fetch more for statement
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
    const profileString = sessionStorage.getItem('userProfile');
    const accountsString = sessionStorage.getItem('accounts');

    if (profileString && accountsString) {
      const parsedProfile = JSON.parse(profileString);
      const parsedAccounts = JSON.parse(accountsString);

      setUserProfile(parsedProfile);
      setAccounts(parsedAccounts);
      
      if (parsedAccounts.length > 0) {
        const initialAccount = parsedAccounts[0];
        setSelectedAccount(initialAccount);
        fetchTransactionsForAccount(initialAccount.ACCT_NO);
      }
      setLoading(false);
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
      <main className="flex flex-1 flex-col p-4 sm:px-6 sm:py-4 gap-6 h-screen">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3">
                <Card>
                    <CardHeader className="bg-muted/50 p-4">
                      <h3 className="text-sm font-semibold text-muted-foreground">Today's Snapshot</h3>
                    </CardHeader>
                    <CardContent className='p-4'>
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
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-9">
                {selectedAccount && <AccountDetails account={selectedAccount} />}
            </div>
        </div>
        <div className="flex-1 flex flex-col w-full min-w-[360px] px-2 sm:px-0">
            <TransactionsList transactions={transactions} loading={transactionsLoading} />
        </div>
      </main>
    </DashboardLayout>
  );
}
