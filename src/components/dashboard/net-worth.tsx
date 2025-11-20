'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';

type Account = {
    AVAIL_BAL: string;
};

type UserProfile = {
    firstname: string;
    lastname: string;
}

interface NetWorthProps {
  accounts: Account[];
  userProfile: UserProfile | null;
}

export function NetWorth({ accounts, userProfile }: NetWorthProps) {
  const totalNetWorth = accounts.reduce((sum, account) => sum + parseFloat(account.AVAIL_BAL), 0);
  const formattedNetWorth = new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(totalNetWorth);
  
  // For now, assets are total net worth and liabilities are 0 as per the UI screenshot
  const assets = formattedNetWorth;
  const liabilities = new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(0);

  return (
    <Card className="h-full bg-gradient-to-br from-teal-400 to-green-500 text-white shadow-lg">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <p className="text-sm font-medium">Good afternoon!</p>
          <p className="text-sm capitalize">{userProfile ? `${userProfile.firstname} ${userProfile.lastname}`: 'User'}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">{formattedNetWorth.replace('PKR', 'PKR.')}</div>
        <p className="text-xs text-white/80">Total Net Worth</p>
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 rounded-full p-1">
              <ArrowDown className="h-4 w-4" />
            </div>
            <div>
              <p className="text-lg font-semibold">{assets.replace('PKR', 'PKR.')}</p>
              <p className="text-sm text-white/80">Assets</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white/20 rounded-full p-1">
              <ArrowUp className="h-4 w-4" />
            </div>
            <div>
              <p className="text-lg font-semibold">{liabilities.replace('PKR', 'PKR.')}</p>
              <p className="text-sm text-white/80">Liabilities</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
