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
        <main className="flex flex-1 flex-col p-4 sm:px-6 sm:py-4 gap-4">
            <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col gap-4">
                <h1 className="text-xl font-semibold text-center">Print Transaction</h1>
                <TransactionDetailsCard transaction={transaction} />
                <div className="flex justify-end gap-2 mt-6">
                    <Button variant="outline" onClick={() => router.back()}>Back</Button>
                    <Button onClick={handlePrint}>Print</Button>
                </div>
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
