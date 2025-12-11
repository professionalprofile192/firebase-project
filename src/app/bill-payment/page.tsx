'use client';

import { Suspense, useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PayeeTable, type Payee } from '@/components/bill-payment/payee-table';
import { BillPaymentHistoryTable } from '@/components/bill-payment/bill-payment-history-table';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

// This will be replaced with your actual API data
const payees: Payee[] = [
  {
    consumerName: 'ASHAQ SO SHEAKH AHMED',
    billerType: 'Electricity HAZECO Bill Payment',
    consumerNumber: '01271111630306',
    status: 'Not Payable' as const,
    amountDue: '481.00',
    dueDate: '24/11/2025',
    amountAfterDueDate: '484.00'
  },
  {
    consumerName: 'humn humn',
    billerType: '1 Bill Invoice/Voucher',
    consumerNumber: '11144401142440133703',
    status: 'Unpaid' as const,
    amountDue: '653.00',
    dueDate: '22/12/2025',
    amountAfterDueDate: '685.00'
  },
  {
    consumerName: 'Humna Humna',
    billerType: '1 Bill Invoice/Voucher',
    consumerNumber: '10011450865000054126',
    status: 'Not Payable' as const,
  },
];

type Account = {
  acctNo: string;
  acctName: string;
}

const accounts: Account[] = [
    { acctNo: '060510224211', acctName: 'NAWAZ ALI' },
    { acctNo: '060510224212', acctName: 'IDREES APPROVER' },
];


function BillPaymentContent() {
  const [activeTab, setActiveTab] = useState('bill-payment');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [multiPayMode, setMultiPayMode] = useState(false);

  const handleAccountChange = (acctNo: string) => {
    const account = accounts.find(a => a.acctNo === acctNo);
    setSelectedAccount(account || null);
  };
  
  const getHeading = () => {
    if (multiPayMode) {
      return 'Multiple Bill Payment';
    }
    switch (activeTab) {
      case 'bill-payment':
        return 'Bill Payment';
      case 'bill-payment-history':
        return 'Bill Payment History';
      case 'bulk-bill-payment':
        return 'Bulk Utility Bill Payments';
      default:
        return 'Bill Payment';
    }
  }

  return (
    <DashboardLayout>
      <main className="flex-1 p-4 sm:px-6 sm:py-4 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold">
                {getHeading()}
            </h1>
            {activeTab === 'bill-payment' && (
                <div className='flex items-center gap-2'>
                    {multiPayMode ? (
                        <Button variant="outline" onClick={() => setMultiPayMode(false)}>Pay Single Bills</Button>
                    ) : (
                        <Button variant="outline" onClick={() => setMultiPayMode(true)}>Pay Multiple Bills</Button>
                    )}
                     <Button asChild>
                        <Link href="/bill-payment/add">Add Utility Bill +</Link>
                    </Button>
                </div>
            )}
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="bill-payment">Bill Payment</TabsTrigger>
            <TabsTrigger value="bill-payment-history">Bill Payment History</TabsTrigger>
            <TabsTrigger value="bulk-bill-payment">Bulk Bill Payment</TabsTrigger>
          </TabsList>

          <TabsContent value="bill-payment">
            <div className="mt-6 flex items-center gap-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        placeholder="Search"
                        className="pl-10 bg-muted border-none"
                    />
                </div>
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="utility">Utility</SelectItem>
                        <SelectItem value="telecom">Telecom</SelectItem>
                        <SelectItem value="isp">Internet</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <PayeeTable data={payees} multiPayMode={multiPayMode} />
          </TabsContent>

          <TabsContent value="bill-payment-history">
             <div className="mt-6 space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input 
                            placeholder="Search"
                            className="pl-10 bg-muted border-none"
                        />
                    </div>
                    <Select>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Select Account" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="acc1">Account 1</SelectItem>
                            <SelectItem value="acc2">Account 2</SelectItem>
                        </SelectContent>
                    </Select>
                     <Select>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="View" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="last7">Last 7 days</SelectItem>
                            <SelectItem value="last30">Last 30 days</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <BillPaymentHistoryTable data={[]} />
             </div>
          </TabsContent>
          <TabsContent value="bulk-bill-payment">
            <Card className="mt-6">
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl">
                        <div className="space-y-2">
                            <Label htmlFor="account-number">Account Number</Label>
                             <Select onValueChange={handleAccountChange} value={selectedAccount?.acctNo}>
                                <SelectTrigger id="account-number">
                                    <SelectValue placeholder="Select Account" />
                                </SelectTrigger>
                                <SelectContent>
                                     {accounts.map((account) => (
                                        <SelectItem key={account.acctNo} value={account.acctNo}>
                                            {account.acctNo}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="account-name">Account Name</Label>
                            <Input 
                                id="account-name" 
                                value={selectedAccount?.acctName || ''} 
                                disabled 
                                className="bg-gray-100"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </DashboardLayout>
  );
}

export default function BillPaymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BillPaymentContent />
    </Suspense>
  )
}
