
'use client';

import { Suspense, useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { PendingRequestsTable } from '@/components/requests/pending-requests-table';
import { RequestHistoryTable } from '@/components/requests/request-history-table';

export type Request = {
  transactionNumber: string;
  transactionType: string;
  requestType: string;
  originator: string;
  dateSubmitted: string;
  status: string;
};

const pendingRequestsData: Request[] = [];
const requestHistoryData: Request[] = [];

function RequestsContent() {
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
            <TabsTrigger value="pending">Pending Requests</TabsTrigger>
            <TabsTrigger value="history">Request History</TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            <PendingRequestsTable data={pendingRequestsData} />
          </TabsContent>
          <TabsContent value="history">
            <RequestHistoryTable data={requestHistoryData} />
          </TabsContent>
        </Tabs>
      </main>
    </DashboardLayout>
  );
}

export default function RequestsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RequestsContent />
    </Suspense>
  )
}
