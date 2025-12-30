'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { ReviewDetails } from '@/components/pending-approvals/review-details';
import type { Approval } from '../page';
import { ApproversTable } from '@/components/pending-approvals/approvers-table';
import { RejectDialog } from '@/components/pending-approvals/reject-dialog';
import { useToast } from '@/hooks/use-toast';
import { CustomAlertDialog } from '@/components/common/custom-alert-dialog';
import { cn } from '@/lib/utils';

function ApprovalReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const approvalParam = searchParams.get('approval');

  const [approval] = useState<Approval | null>(
    approvalParam ? JSON.parse(approvalParam) : null
  );
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertMessage, setSuccessAlertMessage] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const profileStr = sessionStorage.getItem('userProfile');
    if (profileStr) setUserProfile(JSON.parse(profileStr));
  }, []);

  if (!approval) {
    return <main className="p-4 text-center">Approval details not found.</main>;
  }

  const confirmReject = async (remarks: string) => {
    if (!userProfile) return;

    try {
      const response = await rejectRequest({
        accountNo: 0,
        approverId: approval.approverId,
        contractId: approval.contractId,
        referenceNo: approval.referenceNo,
        rejectorId: userProfile.userid,
        remarks,
      });

      setShowRejectDialog(false);

      if (response.opstatus === 0 && response.ApprovalMatrix[0].opstatus === 0) {
        setSuccessAlertMessage(response.ApprovalMatrix[0].reqResponse);
        setShowSuccessAlert(true);
      } else {
        toast({
          variant: 'destructive',
          title: 'Rejection Failed',
          description: response.message,
        });
      }
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Unexpected error during rejection.',
      });
    }
  };

  const isActionable = !approval.status || approval.status === 'IN PROGRESS';

  return (
    <>
      <DashboardLayout>
        <main className="flex-1 p-4 sm:px-6 sm:py-4 flex flex-col gap-6 bg-white">
          <ReviewDetails approval={approval} />
          <ApproversTable approval={approval} userProfile={userProfile} />
        </main>

        <footer className="sticky bottom-0 bg-white p-4 border-t">
          <div
            className={cn(
              'max-w-7xl mx-auto flex items-center',
              isActionable ? 'justify-between' : 'justify-end'
            )}
          >
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>

            {isActionable && (
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  className="bg-red-500 hover:bg-red-600"
                  onClick={() => setShowRejectDialog(true)}
                >
                  <XCircle className="mr-2 h-4 w-4" /> Reject
                </Button>
                <Button className="bg-green-500 hover:bg-green-600">
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
                </Button>
              </div>
            )}
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
        onConfirm={() => router.push('/pending-approvals')}
      />
    </>
  );
}

export default function ApprovalReviewPage() {
  return (
    <Suspense>
      <ApprovalReviewContent />
    </Suspense>
  );
}
