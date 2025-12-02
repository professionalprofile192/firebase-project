
import { cookies } from 'next/headers';
import { Suspense } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { ApprovalsTable } from '@/components/pending-approvals/approvals-table';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import { ApprovalsHistoryTable } from '@/components/pending-approvals/approvals-history-table';
import { getPendingApprovals } from '../actions';

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
};

// No data as per the screenshot
const approvalsHistoryData: Approval[] = [];

async function PendingApprovalsData() {
    const cookieStore = cookies();
    const userProfileCookie = cookieStore.get('userProfile');
    let approvalsData: Approval[] = [];

    if (userProfileCookie?.value) {
        // Using a hardcoded ID for now as per the service details provided
        const data = await getPendingApprovals('5939522605');
        if (data.opstatus === 0) {
            approvalsData = data.ApprovalMatrix;
        }
    }
    
    return <ApprovalsTable data={approvalsData} />;
}

function PendingApprovalsContent({
    searchParams,
  }: {
    searchParams: { tab?: string };
  }) {
  const activeTab = searchParams.tab || 'pending';

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

        <Tabs defaultValue={activeTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
            <TabsTrigger value="history">Approvals History</TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            <Suspense fallback={<p>Loading approvals...</p>}>
                <PendingApprovalsData />
            </Suspense>
          </TabsContent>
          <TabsContent value="history">
            <ApprovalsHistoryTable data={approvalsHistoryData} />
          </TabsContent>
        </Tabs>
      </main>
    </DashboardLayout>
  );
}

export default function PendingApprovalsPage({
    searchParams,
  }: {
    searchParams: { tab?: string };
  }) {
  return (
    <Suspense>
      <PendingApprovalsContent searchParams={searchParams} />
    </Suspense>
  )
}
