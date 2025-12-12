'use client';

import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { TransactionDetailsCard } from '@/components/account-statement/transaction-details-card';
import { Suspense } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

function TransactionDetailPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const txString = searchParams.get('tx');

    if (!txString) {
        return (
            <main className="flex-1 p-4 sm:px-6 sm:py-4 flex items-center justify-center">
                <p>Transaction not found.</p>
            </main>
        );
    }
    
    const transaction = JSON.parse(txString);

    const handlePrint = () => {
        window.print();
    };

    return (
        <main className="flex-1 p-4 sm:px-6 sm:py-4">
            <div className="max-w-2xl mx-auto w-full">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-semibold text-primary">Transaction Receipt</h1>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => router.back()}>Back</Button>
                        <Button onClick={handlePrint}>Print Receipt</Button>
                    </div>
                </div>
                <TransactionDetailsCard transaction={transaction} />
            </div>
        </main>
    );
}


export default function TransactionDetailPage() {
    return (
        <DashboardLayout>
            <Suspense fallback={<div>Loading...</div>}>
                <TransactionDetailPageContent />
            </Suspense>
        </DashboardLayout>
    )
}
