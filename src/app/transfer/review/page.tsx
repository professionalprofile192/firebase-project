
'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { TransferReviewDetails } from '@/components/transfer/transfer-review-details';
import { Button } from '@/components/ui/button';

function TransferReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activityString = searchParams.get('activity');
  const activity = activityString ? JSON.parse(activityString) : null;

  if (!activity) {
    return (
        <main className="flex-1 p-4 sm:px-6 sm:py-4 flex items-center justify-center">
          <p>Transaction details not found.</p>
        </main>
    );
  }

  const handlePrint = () => {
    window.print();
  };
  
  return (
    <div className="min-h-screen w-full bg-muted/40 flex flex-col printable-container no-print">
        <main className="flex-1 flex flex-col items-center justify-center p-4 sm:px-6 sm:py-4 gap-6 ">
            <div className="w-full max-w-4xl">
                 <h1 className="text-2xl font-semibold mb-6">
                    Please review the following transaction details.
                </h1>
                <div className="printable">
                    <TransferReviewDetails activity={activity} />
                </div>
            </div>
        </main>
        <footer className="sticky bottom-0 bg-background/95 py-4 px-4 sm:px-6 border-t no-print">
            <div className="max-w-4xl mx-auto flex justify-end gap-2">
                <Button variant="outline" onClick={() => router.push('/transfer?tab=activity')}>Cancel</Button>
                <Button variant="outline" onClick={handlePrint}>Print</Button>
                <Button>Download</Button>
            </div>
        </footer>
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
