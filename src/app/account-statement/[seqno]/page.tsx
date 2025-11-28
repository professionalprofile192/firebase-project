'use client';

import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { TransactionDetailsCard } from '@/components/account-statement/transaction-details-card';
import { Suspense } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import Image from 'next/image';

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
            <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col gap-4 printable-container">
                <div className='printable'>
                    <div className="flex items-center justify-between mb-8">
                        <Image src="/ubl_logo.png" alt="UBL Logo" width={80} height={80} />
                        <h1 className="text-2xl font-bold text-primary">Transaction Receipt</h1>
                    </div>
                    <TransactionDetailsCard transaction={transaction} />
                </div>
                <div className="flex justify-end gap-2 mt-6 no-print">
                    <Button variant="outline" onClick={() => router.back()}>Back</Button>
                    <Button onClick={handlePrint}>Print Receipt</Button>
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
