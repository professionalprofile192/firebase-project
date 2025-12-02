

'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { getRecentTransactions } from '../actions';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { AccountDetails } from '@/components/account-statement/account-details';
import { TransactionsList } from '@/components/account-statement/transactions-list';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { subDays, isAfter } from 'date-fns';

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

function AccountStatementContent() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [displayedTransactions, setDisplayedTransactions] = useState<Transaction[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const router = useRouter();

  const fetchTransactionsForAccount = useCallback(async (acctNo: string) => {
    setTransactionsLoading(true);
    try {
        const statementsData = await getRecentTransactions(acctNo); 
        if (statementsData.opstatus === 0) {
            setAllTransactions(statementsData.payments);
            setDisplayedTransactions(statementsData.payments); // Initially display all
        } else {
            setAllTransactions([]);
            setDisplayedTransactions([]);
        }
    } catch (error) {
        console.error("Failed to fetch transactions for account", error);
        setAllTransactions([]);
        setDisplayedTransactions([]);
    } finally {
        setTransactionsLoading(false);
    }
  }, []);

  useEffect(() => {
    // We get the user profile and accounts from session storage which is set on dashboard load.
    // This avoids fetching it again. A more robust solution might involve a global state manager (like Context or Redux).
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
      } else {
        setLoading(false);
      }
    } else {
        // If session storage is empty (e.g., direct navigation/reload), redirect to dashboard
        // The dashboard will fetch fresh data and set session storage.
        router.push('/dashboard');
    }
  }, [router, fetchTransactionsForAccount]);
  
  useEffect(() => {
    // This effect is to stop the main loading spinner once transactions have been loaded (or failed)
    if (!transactionsLoading) {
      setLoading(false);
    }
  }, [transactionsLoading]);
  
  const handleAccountChange = (acctNo: string) => {
    const account = accounts.find(a => a.ACCT_NO === acctNo);
    if (account) {
        setSelectedAccount(account);
        fetchTransactionsForAccount(acctNo);
    }
  };

  const handleViewFilterChange = (filter: string) => {
    if (filter === 'last10transactions') {
      const last10 = allTransactions.slice(0, 10);
      setDisplayedTransactions(last10);
    } else if (filter === 'last10days') {
      const tenDaysAgo = subDays(new Date(), 10);
      const last10Days = allTransactions.filter(tx => isAfter(new Date(tx.tranDate), tenDaysAgo));
      setDisplayedTransactions(last10Days);
    } else if (filter === 'all') { // To reset filter
      setDisplayedTransactions(allTransactions);
    }
  };


  const formatCurrency = (amount: string) => {
    return `PKR ${new Intl.NumberFormat('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(parseFloat(amount))}`;
  }


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
                    <CardHeader className="bg-[#f2f2f2] p-4 rounded-t-lg">
                      <h3 className="text-sm font-semibold text-gray-700">Today's Snapshot</h3>
                    </CardHeader>
                    <CardContent className='p-4'>
                      <Select
                          value={selectedAccount?.ACCT_NO}
                          onValueChange={handleAccountChange}
                      >
                          <SelectTrigger>
                            <SelectValue>
                                {selectedAccount ? `${selectedAccount.DEPOSIT_TYPE === 'S' ? 'Saving' : 'Current'} - ${selectedAccount.ACCT_NO}` : "Select Account Type"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                              {accounts.map((account) => (
                                  <SelectItem key={account.ACCT_NO} value={account.ACCT_NO}>
                                      <div className="bg-primary text-primary-foreground p-3 rounded-md my-1">
                                        <p className="font-semibold">{account.ACCT_TITLE}</p>
                                        <p className="text-sm">{account.ACCT_NO}</p>
                                        <p className="text-lg font-bold mt-2">{formatCurrency(account.AVAIL_BAL)}</p>
                                      </div>
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
            <TransactionsList 
                transactions={displayedTransactions} 
                loading={transactionsLoading}
                onViewChange={handleViewFilterChange} 
                accountNumber={selectedAccount?.ACCT_NO}
            />
        </div>
      </main>
    </DashboardLayout>
  );
}

export default function AccountStatementPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AccountStatementContent />
        </Suspense>
    );
}