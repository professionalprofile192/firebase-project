'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, FileQuestion } from 'lucide-react';
import { Transaction } from './dashboard';
import { useMemo, useState } from 'react';
import { format, getDay } from 'date-fns';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartCardProps {
    transactions: Transaction[];
    accounts: { ACCT_NO: string; ACCT_TITLE: string }[];
}
  
export function ChartCard({ transactions, accounts }: ChartCardProps) {
    const [selectedAccount, setSelectedAccount] = useState(accounts.length > 0 ? accounts[0] : null);

    const chartData = useMemo(() => {
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const weeklyData: { [key: string]: { credit: number; debit: number } } = {};

        daysOfWeek.forEach(day => {
            weeklyData[day] = { credit: 0, debit: 0 };
        });

        transactions.forEach(tx => {
            const date = new Date(tx.tranDate);
            const dayName = daysOfWeek[getDay(date)];
            
            if (weeklyData[dayName]) {
                if (tx.CRDR === 'C') {
                    weeklyData[dayName].credit += parseFloat(tx.tranAmt);
                } else {
                    weeklyData[dayName].debit += parseFloat(tx.tranAmt);
                }
            }
        });
        
        const sortedDays = daysOfWeek.slice(1).concat(daysOfWeek[0]); // Mon -> Sun
        
        return sortedDays.map(day => ({
            name: day,
            credit: weeklyData[day].credit,
            debit: weeklyData[day].debit
        }));
        
    }, [transactions]);
    
    const hasData = chartData.some(d => d.credit > 0 || d.debit > 0);

    return (
      <Card className="h-[250px] flex flex-col">
        <CardHeader>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <span className="text-sm">Credit</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-sm">Debit</span>
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                           {selectedAccount ? selectedAccount.ACCT_TITLE.split(' ')[0] + '...' : 'Select Account'} <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                         {accounts.map(account => (
                            <DropdownMenuItem key={account.ACCT_NO} onSelect={() => setSelectedAccount(account)}>
                                {account.ACCT_TITLE}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </CardHeader>
        <CardContent className="flex-1">
          {hasData ? (
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                        dataKey="name" 
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis 
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value / 1000}k`}
                    />
                    <Tooltip 
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            border: '1px solid #ccc',
                            borderRadius: '0.5rem',
                        }}
                    />
                    <Bar dataKey="credit" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={20}/>
                    <Bar dataKey="debit" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <FileQuestion className="h-12 w-12" />
                <p className="mt-2 text-sm">No Records Found</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
