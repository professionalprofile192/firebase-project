'use client';

import { Header } from '@/components/dashboard/header';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { Transaction } from '../page';
import { TransactionDetailsCard } from '@/components/account-statement/transaction-details-card';
import { Suspense } from 'react';

function TransactionDetailPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const txString = searchParams.get('tx');

    if (!txString) {
        return (
            <div className="flex h-screen w-full flex-col bg-muted/40">
                <Header />
                <main className="flex-1 p-4 sm:px-6 sm:py-4 flex items-center justify-center">
                    <p>Transaction not found.</p>
                </main>
            </div>
        );
    }
    
    const transaction = JSON.parse(txString);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex h-screen w-full flex-col bg-muted/40">
            <Header />
            <main className="flex-1 p-4 sm:px-6 sm:py-4 gap-4 overflow-auto">
                <h1 className="text-xl font-semibold mb-4">Print Transaction</h1>
                <div className="max-w-4xl mx-auto">
                    <TransactionDetailsCard transaction={transaction} />
                    <div className="flex justify-end gap-2 mt-6">
                        <Button variant="outline" onClick={() => router.back()}>Back</Button>
                        <Button onClick={handlePrint}>Print</Button>
                    </div>
                </div>
            </main>
        </div>
    );
}


export default function TransactionDetailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TransactionDetailPageContent />
        </Suspense>
    )
}
