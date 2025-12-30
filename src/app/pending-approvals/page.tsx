'use client';

import { Suspense, useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { ApprovalsTable } from '@/components/pending-approvals/approvals-table';
import { ApprovalsHistoryTable } from '@/components/pending-approvals/approvals-history-table';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'next/navigation';

// --- //********** pending approval */ ---
async function getPendingApprovals(userId: string, token: string, kuid: string) {
  const res = await fetch('/api/fetch-pending-approvals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, token, kuid }),
  });
  return res.json();
}

//********** get approval history */
async function getApprovalsHistory(userId: string, token: string , kuid: string) {
  const res = await fetch('/api/fetch-all-pending-users', { // Aapki History API
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, token, kuid}),
  });
  return res.json();
}

//**********reject service */
async function rejectRequestService(payload: any) {
  const res = await fetch('/api/reject-approval', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

//integration service
const fetchMetadata = async () => {
  // 1. Storage se data nikalna
  const token = sessionStorage.getItem('claimsToken');
  const userProfileString = sessionStorage.getItem('userProfile');

  if (!token || !userProfileString) return null;

  const profile = JSON.parse(userProfileString);
  const kuid = profile?.user_attributes?.UserName;

  try {
    // 2. Backend API ko call karna (Token/KUID Headers mein bhej rahe hain)
    const res = await fetch('/api/UBL-DCP-Objectserviceapproval', {
      method: 'GET',
      headers: {
        'x-kony-token': token,
        'x-kony-kuid': kuid || ""
      },
    });

    const result = await res.json();

    if (res.ok && result?.Metadata?.opstatus === 0) {
      console.log("Metadata Received:", result);
      return result;
    } else {
      console.error("Metadata fetch failed", result);
      return null;
    }
  } catch (error) {
    console.error("Error in fetchMetadata:", error);
    return null;
  }
};

//transaction status update // **abhi ye service lagai nhi hai 
const handleUpdateTransactionStatus = async (approval: any, status: "REJECTED" | "APPROVED") => {
  // 1. Session storage se token aur profile nikalna
  const token = sessionStorage.getItem('claimsToken');
  const userProfileString = sessionStorage.getItem('userProfile');

  if (!token || !userProfileString) {
    console.error("Session data missing");
    return false;
  }
  const profile = JSON.parse(userProfileString);
  const kuid = profile?.user_attributes?.UserName;
  try {
    // 2. Backend Route ko call karna
    // Aapke log ke mutabiq referenceNo hi transactionId hai
    const res = await fetch('/api/update-transaction-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        transactionId: approval.referenceNo, // Jo payload mein 47679 ja raha tha
        status: status,
        kuid 
      }),
    });

    const result = await res.json();

    // 3. Response check karna (opstatus 0 means success)
    if (res.ok && result?.opstatus === 0) {
      console.log("Status Updated Successfully:", result);
      // Yahan aap success toast ya UI update dikha sakti hain
      return true;
    } else {
      console.error("Failed to update status:", result);
      return false;
    }
  } catch (error) {
    console.error("Error updating transaction status:", error);
    return false;
  }
};

function PendingApprovalsContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'pending');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [approvalHistory, setApprovalHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // 1. Load Profile on Mount
  useEffect(() => {
    const profile = sessionStorage.getItem('userProfile');
    if (profile) setUserProfile(JSON.parse(profile));
  }, []);

  // 2. Tab Change par API Hit karna
  useEffect(() => {
    async function fetchData() {
      if (!userProfile) return;
      const token = sessionStorage.getItem('claimsToken');
      const userId = userProfile?.userid;
      const kuid = userProfile?.user_attributes?.UserName;

      if (!userId || !token) return;

      setLoading(true);
      try {
        if (activeTab === 'pending') {
          const data = await getPendingApprovals(userId, token, kuid);
          // Local rejected logic apply karein agar zaroorat ho
          setPendingApprovals(data?.ApprovalMatrix || []);
        } else if (activeTab === 'history') {
          const data = await getApprovalsHistory(userId, token, kuid);
          setApprovalHistory(data?.ApprovalMatrix || []);
        }
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch data' });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [activeTab, userProfile]); // activeTab change hone par hi call jayegi

  const handleReject = async (approval: Approval, remarks: string) => {
    const token = sessionStorage.getItem('claimsToken');
    const userProfileString = sessionStorage.getItem('userProfile');
    
    if (!token || !userProfileString) return false;
    const profile = JSON.parse(userProfileString);
  
    const kuid = profile?.user_attributes?.UserName;
    try {
      const res = await fetch('/api/reject-approval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          
          accountNo: approval.fromAccountNumber || "",
          approverId: profile.userid,
          contractId: approval.contractId,
          referenceNo: approval.referenceNo,
          rejectorId: profile.userid,
          remarks: remarks, // User ka likha hua comment
          token,
          kuid,
        }),
      });
  
      const result = await res.json();
  
      // Sirf service hit hone ka check
      if (result?.opstatus === 0 && result?.ApprovalMatrix?.[0]?.opstatus === 0) {
        toast({ title: "Success", description: "Service Hit Successfully" });
        // await fetchMetadata(); ye integartion service hai 
        //yahn p update transaction bhi call hogi upr function define hia bs call karna hai 
        return true;
      } else {
        toast({ variant: "destructive", title: "Error", description: "Service failed" });
        return false;
      }
    } catch (error) {
      console.error("Error hitting reject service:", error);
      return false;
    }
  };

  return (
    <DashboardLayout>
      <main className="flex-1 p-4 flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Approvals & Requests</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
            <TabsTrigger value="history">Approvals History</TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="p-10 text-center">Loading {activeTab}...</div>
          ) : (
            <>
              <TabsContent value="pending">
              <ApprovalsTable 
              data={pendingApprovals} 
              userProfile={userProfile} 
              onReject={handleReject} // rejection prop
            />
              </TabsContent>
              <TabsContent value="history">
                <ApprovalsHistoryTable data={approvalHistory} />
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>
    </DashboardLayout>
  );
}

export default function PendingApprovalsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PendingApprovalsContent />
    </Suspense>
  );
}