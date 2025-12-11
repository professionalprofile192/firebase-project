'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { type Payee } from '@/components/bill-payment/payee-table';

function PayBillContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const payeeString = searchParams.get('payee');
  const payee: Payee | null = payeeString ? JSON.parse(payeeString) : null;

  const formatCurrency = (amount: string | undefined) => {
    if (!amount) return 'PKR 0.00';
    return `PKR ${new Intl.NumberFormat('en-PK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(amount))}`;
  };

  return (
    <DashboardLayout>
      <main className="flex-1 flex flex-col p-4 sm:px-6 sm:py-4 gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Pay Bill</h1>
          <div className="flex items-center gap-6 text-right">
            <div>
              <p className="text-sm text-muted-foreground">Total Payment</p>
              <p className="font-semibold text-primary">{formatCurrency(payee?.amountDue)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="font-semibold text-green-600">PKR x,xxx,xxx</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Remaining Balance</p>
              <p className="font-semibold text-red-600">PKR x,xxx,xxx</p>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="max-w-xs space-y-2">
              <h2 className="font-semibold">Select an account for Bill Payment</h2>
              <Label htmlFor="from-account">From Account</Label>
              <Select>
                <SelectTrigger id="from-account">
                  <SelectValue placeholder="Select Account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="acc1">060510224211 - NAWAZ ALI</SelectItem>
                  <SelectItem value="acc2">060510224212 - IDREES APPROVER</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </main>
      <footer className="sticky bottom-0 bg-background/95 p-4 border-t z-10">
        <div className="max-w-7xl mx-auto flex justify-end items-center gap-4">
            <Button variant="outline" onClick={() => router.back()}>Back</Button>
            <Button variant="outline" onClick={() => router.push('/bill-payment')}>Cancel</Button>
            <Button>Continue</Button>
        </div>
      </footer>
    </DashboardLayout>
  );
}

export default function PayBillPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PayBillContent />
        </Suspense>
    )
}
