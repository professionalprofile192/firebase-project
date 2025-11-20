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
  
type Account = {
    ACCT_NO: string;
    ACCT_TITLE: string;
    AVAIL_BAL: string;
};

interface MyAccountsProps {
  accounts: Account[];
}

export function MyAccounts({ accounts }: MyAccountsProps) {
    const totalBalance = accounts.reduce((sum, account) => sum + parseFloat(account.AVAIL_BAL), 0);
    const formattedTotalBalance = new Intl.NumberFormat('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalBalance);

    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>My Accounts</CardTitle>
            <Select defaultValue="saving">
              <SelectTrigger className="w-[150px]">
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
          <CardContent>
            {accounts.length > 0 ? (
                accounts.map((account) => (
                    <div key={account.ACCT_NO} className="flex justify-between items-center py-3 border-b">
                        <div>
                            <p className="font-semibold">{account.ACCT_NO}</p>
                            <p className="text-sm text-muted-foreground">{account.ACCT_TITLE}</p>
                        </div>
                        <p className="font-semibold text-primary">
                            Rs. {new Intl.NumberFormat('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(parseFloat(account.AVAIL_BAL))}
                        </p>
                    </div>
                ))
            ) : (
                <p className='text-center text-muted-foreground'>No accounts found.</p>
            )}
          </CardContent>
        </ScrollArea>
        <CardFooter>
            <div className="flex justify-between items-center w-full">
                <p className="font-semibold">Total</p>
                <p className="font-semibold text-primary">Rs. {formattedTotalBalance}</p>
            </div>
        </CardFooter>
      </Card>
    );
  }
  