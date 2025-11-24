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
import { ScrollArea } from '../ui/scroll-area';
import { useState } from 'react';
import { cn } from '@/lib/utils';
  
type Account = {
    ACCT_NO: string;
    ACCT_TITLE: string;
    AVAIL_BAL: string;
    DEPOSIT_TYPE: string;
};

interface MyAccountsProps {
  accounts: Account[];
}

export function MyAccounts({ accounts }: MyAccountsProps) {
    const [accountType, setAccountType] = useState('saving');

    const filteredAccounts = accounts.filter(account => {
        if (accountType === 'saving') {
            return account.DEPOSIT_TYPE === 'S';
        }
        if (accountType === 'current') {
            // As there is no current account in the provided data, this will be empty
            return account.DEPOSIT_TYPE !== 'S';
        }
        return true;
    });

    const totalBalance = filteredAccounts.reduce((sum, account) => sum + parseFloat(account.AVAIL_BAL), 0);
    const formattedTotalBalance = new Intl.NumberFormat('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalBalance);

    return (
      <Card className={cn("h-[350px] flex flex-col bg-primary/90 text-primary-foreground")}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">My Accounts</CardTitle>
            <Select value={accountType} onValueChange={setAccountType}>
              <SelectTrigger className="w-[150px] bg-primary/80 text-white border-white/50">
                <SelectValue placeholder="Select Account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="saving">Saving Accounts</SelectItem>
                <SelectItem value="current">Current Accounts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <ScrollArea className="flex-1">
          <CardContent className='pt-6'>
            {filteredAccounts.length > 0 ? (
                filteredAccounts.map((account) => (
                    <div key={account.ACCT_NO} className="flex justify-between items-center py-3 border-b border-white/20 last:border-b-0">
                        <div>
                            <p className="font-semibold">{account.ACCT_NO}</p>
                            <p className="text-sm text-white/80">{account.ACCT_TITLE}</p>
                        </div>
                        <p className="font-semibold text-white">
                            Rs. {new Intl.NumberFormat('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(parseFloat(account.AVAIL_BAL))}
                        </p>
                    </div>
                ))
            ) : (
                <p className='text-center text-white/80'>No accounts of this type found.</p>
            )}
          </CardContent>
        </ScrollArea>
        <CardFooter className="bg-primary text-white">
            <div className="flex justify-between items-center w-full">
                <p className="font-semibold">Total</p>
                <p className="font-semibold">Rs. {formattedTotalBalance}</p>
            </div>
        </CardFooter>
      </Card>
    );
  }
