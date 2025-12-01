'use client';

import { Suspense, useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { ApprovalsTable } from '@/components/pending-approvals/approvals-table';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { ApprovalsHistoryTable } from '@/components/pending-approvals/approvals-history-table';

export type Approval = {
  transactionNumber: string;
  transactionType: string;
  requestType: string;
  originator: string;
};

// No data as per the screenshot
const approvalsData: Approval[] = [];
const approvalsHistoryData: Approval[] = [];

function PendingApprovalsContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tab || 'pending');

  useEffect(() => {
    setActiveTab(tab || 'pending');
  }, [tab]);

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
            <ApprovalsTable data={approvalsData} />
          </TabsContent>
          <TabsContent value="history">
            <ApprovalsHistoryTable data={approvalsHistoryData} />
          </TabsContent>
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
  )
}
