
'use client';

import { Suspense, useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { ApprovalsTable } from '@/components/pending-approvals/approvals-table';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import { ApprovalsHistoryTable } from '@/components/pending-approvals/approvals-history-table';
import { getPendingApprovals, getApprovalHistory, rejectRequest } from '../actions';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'next/navigation';

export type Approval = {
    approverId: string;
    contractId: string;
    referenceNo: string;
    featureActionId: string;
    assignedDate: string;
    sentBy: string;
    requesterName: string;
    transactionType2: string;
    notes2?: string;
    notes?: string;
    typeId: string;
    amount?: string;
    transactionType?: string;
    fromAccountNumber?: string;
    toAccountNumber?: string;
    status?: string;
    remarks?: string; // Added for rejection comments
};

function PendingApprovalsContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'pending');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [pendingApprovals, setPendingApprovals] = useState<Approval[]>([]);
  const [approvalHistory, setApprovalHistory] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
        setLoading(true);
        const userProfileString = sessionStorage.getItem('userProfile');

        if (userProfileString) {
            const profile = JSON.parse(userProfileString);
            setUserProfile(profile);

            try {
                const [pendingData, historyData] = await Promise.all([
                    getPendingApprovals('5939522605'),
                    getApprovalHistory('5939522605')
                ]);

                if (pendingData.opstatus === 0) {
                    setPendingApprovals(pendingData.ApprovalMatrix);
                }

                if (historyData.opstatus === 0) {
                    setApprovalHistory(historyData.ApprovalMatrix);
                }
            } catch (error) {
                console.error("Failed to fetch approvals data", error);
                toast({ variant: 'destructive', title: 'Error', description: 'Could not load approvals data.' });
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }
    fetchData();
  }, [toast]);
  

  const handleReject = async (approval: Approval, remarks: string): Promise<boolean> => {
    if (!userProfile) {
        toast({ variant: 'destructive', title: 'Error', description: 'User profile not found.' });
        return false;
    }

    const payload = {
        accountNo: 0, 
        approverId: approval.approverId,
        contractId: approval.contractId,
        referenceNo: approval.referenceNo,
        rejectorId: userProfile.userid,
        remarks: remarks
    };
    
    try {
        const response = await rejectRequest(payload);
        if (response.opstatus === 0 && response.ApprovalMatrix[0].opstatus === 0) {
            const rejectedApproval = { ...approval, status: 'REJECTED', remarks: remarks };
            setPendingApprovals(prev => prev.filter(appr => appr.referenceNo !== approval.referenceNo));
            setApprovalHistory(prev => [rejectedApproval, ...prev]);

            toast({ title: 'Success', description: response.ApprovalMatrix[0].reqResponse });
            return true;
        } else {
            toast({ variant: 'destructive', title: 'Rejection Failed', description: response.message || "An unknown error occurred." });
            return false;
        }
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'An unexpected error occurred during rejection.' });
        return false;
    }
  }

  if (loading) {
    return (
        <DashboardLayout>
            <main className="flex-1 p-4 sm:px-6 sm:py-4">
                <p>Loading data...</p>
            </main>
        </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <main className="flex-1 p-4 sm:px-6 sm:py-4 flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Approvals & Requests</h1>
        
        <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
                placeholder="Search"
                className="pl-10 bg-muted border-none"
            />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
            <TabsTrigger value="history">Approvals History</TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
             <ApprovalsTable 
                data={pendingApprovals} 
                userProfile={userProfile} 
                onReject={handleReject} 
              />
          </TabsContent>
          <TabsContent value="history">
             <ApprovalsHistoryTable data={approvalHistory} />
          </TabsContent>
        </Tabs>
      </main>
    </DashboardLayout>
  );
}

export default function PendingApprovalsPage() {
  return (
    <Suspense>
      <PendingApprovalsContent />
    </Suspense>
  )
}
