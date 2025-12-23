'use client';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
  import { Button } from '../ui/button';
  import { ChevronRight } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Transaction } from '@/app/dashboard/page';
import { format } from 'date-fns';
import { FileQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
  
type Account = {
    ACCT_NO: string;
    ACCT_TITLE: string;
};

interface RecentTransactionsProps {
    transactions: Transaction[];
    accounts: Account[];
    onAccountChange: (acctNo: string) => void;
}
  
export function RecentTransactions({ transactions, accounts, onAccountChange }: RecentTransactionsProps) {

    return (
      <Card className={cn("h-[350px] flex flex-col")}>
        <CardHeader className="bg-primary/90 text-primary-foreground rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Recent Transactions</CardTitle>
            <Select 
                defaultValue={accounts.length > 0 ? accounts[0].ACCT_NO : undefined}
                onValueChange={onAccountChange}
            >
              <SelectTrigger className="w-[150px] bg-primary/80 text-white border-white/50">
                <SelectValue placeholder="Select Account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map(account => (
                    <SelectItem key={account.ACCT_NO} value={account.ACCT_NO}>{account.ACCT_NO}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <ScrollArea className="flex-1">
            <CardContent className="space-y-4 pt-6">
            {Array.isArray(transactions) && transactions.length > 0 ? (
                transactions.map((tx) => {
                    const date = new Date(tx.tranDate);
                    return (
                        <div key={tx.seqno} className="flex items-center gap-4">
                            <div className="flex flex-col items-center">
                                <div className="text-sm text-muted-foreground">{format(date, 'MMM')}</div>
                                <div className="text-lg font-bold">{format(date, 'dd')}</div>
                            </div>
                            <div className={`flex-1 border-l-2 ${tx.CRDR === 'D' ? 'border-destructive' : 'border-primary'} pl-4`}>
                                <p className="font-semibold text-sm">{tx.particulars}</p>
                                <p className="text-xs text-muted-foreground">
                                    {tx.seqno}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {tx.CRDR === 'D' ? 'Debit' : 'Credit'}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <p className={`font-semibold text-sm ${tx.CRDR === 'D' ? 'text-destructive' : 'text-primary'}`}>
                                    Rs. {new Intl.NumberFormat('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(parseFloat(tx.tranAmt))}
                                </p>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>
                    )
                })
            ) : (
                <div className="flex flex-col items-center justify-center pt-10 text-muted-foreground">
                    <FileQuestion className="h-12 w-12" />
                    <p className="mt-2 text-sm">No Recent Transactions</p>
                </div>
            )}
            </CardContent>
        </ScrollArea>
        <CardFooter className="justify-center">
          <Link href="/account-statement">
            <Button variant="link">See all</Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }
  