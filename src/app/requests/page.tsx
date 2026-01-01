
'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
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
  
  // States for Data and Loading
  const [pendingData, setPendingData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [historyData, setHistoryData] = useState([]);
const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  // 1. Fetching Function
  const fetchRequests = useCallback(async () => {
    const token = sessionStorage.getItem('claimsToken');
    const userProfileString = sessionStorage.getItem('userProfile');
    
    if (!token || !userProfileString) return;
    
    const profile = JSON.parse(userProfileString);
    
    try {
      setLoading(true);
      const res = await fetch('/api/fetch-all-pending-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          kuid: profile?.user_attributes?.UserName,
          userId: profile?.userid
        }),
      });

      const result = await res.json();
      if (result?.opstatus === 0) {
        setPendingData(result.ApprovalMatrix || []);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  // History Fetch Function
const fetchRequestHistory = useCallback(async () => {
  const token = sessionStorage.getItem('claimsToken');
  const userProfileString = sessionStorage.getItem('userProfile');
  if (!token || !userProfileString) return;
  
  const profile = JSON.parse(userProfileString);

  try {
      setIsHistoryLoading(true);
      const res = await fetch('/api/fetch-user-request-history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              token,
              kuid: profile?.user_attributes?.UserName,
              userId: profile?.userid
          }),
      });

      const result = await res.json();
      if (result?.opstatus === 0) {
          setHistoryData(result.ApprovalMatrix || []);
      }
  } catch (error) {
      console.error("History Fetch Error:", error);
  } finally {
      setIsHistoryLoading(false);
  }
}, []);

// Effect jo tab change hone par check karega
useEffect(() => {
  if (activeTab === 'pending') {
      fetchRequests(); // Jo pehle banaya tha
  } else if (activeTab === 'history') {
      fetchRequestHistory(); // Naya function
  }
}, [activeTab, fetchRequests, fetchRequestHistory]);

  // Tab change handler
  const handleTabChange = (val: string) => {
    setActiveTab(val);
  };

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

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="pending">Pending Requests</TabsTrigger>
            <TabsTrigger value="history">Request History</TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
          {loading ? (
              <div className="flex justify-center p-8">Loading Pending Requests...</div>
          ) : (
              <PendingRequestsTable data={pendingData} />
          )}
      </TabsContent>
          <TabsContent value="history">
            {isHistoryLoading ? (
                <div className="flex justify-center p-8">Loading History...</div>
            ) : (
                <RequestHistoryTable data={historyData} />
            )}
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
