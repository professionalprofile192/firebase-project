
'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { TransferReviewDetails } from '@/components/transfer/transfer-review-details';
import { Button } from '@/components/ui/button';

function TransferReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activityString = searchParams.get('activity');
  const activity = activityString ? JSON.parse(activityString) : null;

  if (!activity) {
    return (
      <DashboardLayout>
        <main className="flex-1 p-4 sm:px-6 sm:py-4 flex items-center justify-center">
          <p>Transaction details not found.</p>
        </main>
      </DashboardLayout>
    );
  }

  const handlePrint = () => {
    window.print();
  };
  
  return (
    <div className="bg-muted/40">
        <main className="flex flex-1 flex-col p-4 sm:px-6 sm:py-4 gap-6 max-w-4xl md:ml-[60px] printable-container">
            <h1 className="text-2xl font-semibold no-print">
                Please review the following transaction details.
            </h1>
            <div className="printable">
                <TransferReviewDetails activity={activity} />
            </div>
            <div className="flex justify-end gap-2 mt-6 no-print">
                <Button variant="outline" onClick={() => router.back()}>Back</Button>
                <Button variant="outline" onClick={handlePrint}>Print</Button>
                <Button>Download</Button>
            </div>
        </main>
    </div>
  );
}

export default function TransferReviewPage() {
  return (
    <Suspense fallback={<div>Loading review...</div>}>
      <TransferReviewContent />
    </Suspense>
  );
}
