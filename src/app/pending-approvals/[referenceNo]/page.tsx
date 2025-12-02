
'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { ReviewDetails } from '@/components/pending-approvals/review-details';
import type { Approval } from '../page';
import { ApproversTable } from '@/components/pending-approvals/approvers-table';

function ApprovalReviewContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const approvalString = searchParams.get('approval');

    if (!approvalString) {
        return (
             <main className="flex-1 p-4 sm:px-6 sm:py-4 flex items-center justify-center">
                <p>Approval details not found.</p>
            </main>
        )
    }

    const approval: Approval = JSON.parse(approvalString);

    return (
        <DashboardLayout>
            <main className="flex-1 flex flex-col p-4 sm:px-6 sm:py-4 gap-4 bg-white">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Request Information</h2>
                </div>
                
                <div className="flex flex-col gap-8">
                    <ReviewDetails approval={approval} />
                    <ApproversTable approval={approval} />
                </div>
            </main>
            <footer className="sticky bottom-0 bg-white p-4 border-t z-10">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                     <Button variant="outline" onClick={() => router.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Approvals
                    </Button>
                    <div className="flex items-center gap-2">
                        <Button variant="destructive" className="bg-red-500 hover:bg-red-600">
                            <XCircle className="mr-2 h-4 w-4" /> Reject
                        </Button>
                        <Button className="bg-green-500 hover:bg-green-600">
                            <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
                        </Button>
                    </div>
                </div>
            </footer>
        </DashboardLayout>
    );
}


export default function ApprovalReviewPage() {
    return (
        <Suspense fallback={<div>Loading approval details...</div>}>
            <ApprovalReviewContent />
        </Suspense>
    );
}

