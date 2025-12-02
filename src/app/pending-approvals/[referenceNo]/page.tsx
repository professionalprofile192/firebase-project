
'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { ReviewDetails } from '@/components/pending-approvals/review-details';
import type { Approval } from '../page';
import { ApproversTable } from '@/components/pending-approvals/approvers-table';
import { RejectDialog } from '@/components/pending-approvals/reject-dialog';
import { rejectRequest } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { CustomAlertDialog } from '@/components/common/custom-alert-dialog';


function ApprovalReviewContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const approvalString = searchParams.get('approval');
    const userProfileString = sessionStorage.getItem('userProfile');

    const [approval, setApproval] = useState<Approval | null>(approvalString ? JSON.parse(approvalString) : null);
    const [userProfile, setUserProfile] = useState<any>(userProfileString ? JSON.parse(userProfileString) : null);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [successAlertMessage, setSuccessAlertMessage] = useState('');
    const { toast } = useToast();

    if (!approval) {
        return (
             <main className="flex-1 p-4 sm:px-6 sm:py-4 flex items-center justify-center">
                <p>Approval details not found.</p>
            </main>
        )
    }

    const handleReject = () => {
        setShowRejectDialog(true);
    }
    
    const confirmReject = async (remarks: string) => {
        if (!userProfile) {
            toast({ variant: 'destructive', title: 'Error', description: 'User profile not found.' });
            return;
        }

        const payload = {
            accountNo: 0,
            approverId: userProfile.userid,
            contractId: approval.contractId,
            referenceNo: approval.referenceNo,
            rejectorId: userProfile.userid,
            remarks: remarks,
        };

        try {
            const response = await rejectRequest(payload);
            setShowRejectDialog(false);

            if (response.opstatus === 0 && response.ApprovalMatrix[0].opstatus === 0) {
                setSuccessAlertMessage(response.ApprovalMatrix[0].reqResponse);
                setShowSuccessAlert(true);
            } else {
                toast({ variant: 'destructive', title: 'Rejection Failed', description: response.message || 'An unknown error occurred.' });
            }
        } catch (error) {
            setShowRejectDialog(false);
            toast({ variant: 'destructive', title: 'Error', description: 'An unexpected error occurred during rejection.' });
        }
    };
    
    const handleSuccessAlertClose = () => {
        setShowSuccessAlert(false);
        router.push('/pending-approvals');
    }

    return (
        <>
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
                            <Button variant="destructive" className="bg-red-500 hover:bg-red-600" onClick={handleReject}>
                                <XCircle className="mr-2 h-4 w-4" /> Reject
                            </Button>
                            <Button className="bg-green-500 hover:bg-green-600">
                                <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
                            </Button>
                        </div>
                    </div>
                </footer>
            </DashboardLayout>
            <RejectDialog
                open={showRejectDialog}
                onOpenChange={setShowRejectDialog}
                onConfirm={confirmReject}
            />
            <CustomAlertDialog
                open={showSuccessAlert}
                onOpenChange={setShowSuccessAlert}
                title="Success"
                description={successAlertMessage}
                onConfirm={handleSuccessAlertClose}
            />
        </>
    );
}


export default function ApprovalReviewPage() {
    return (
        <Suspense fallback={<div>Loading approval details...</div>}>
            <ApprovalReviewContent />
        </Suspense>
    );
}

