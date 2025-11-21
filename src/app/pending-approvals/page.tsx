'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { ApprovalsTable } from '@/components/pending-approvals/approvals-table';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';

export type Approval = {
  id: string;
  requestFrom: string;
  requestType: string;
  transactionDate: string;
  amount: number;
};

const approvalsData: Approval[] = [
    {
        id: 'REQ001',
        requestFrom: 'John Doe',
        requestType: 'Interbank Fund Transfer',
        transactionDate: '11/10/2020 03:00:22 AM',
        amount: 250000.00,
    },
    {
        id: 'REQ002',
        requestFrom: 'Jane Smith',
        requestType: 'Bill Payment',
        transactionDate: '10/10/2020 05:45:10 PM',
        amount: 15000.00,
    },
    {
        id: 'REQ003',
        requestFrom: 'Nawaz Ali',
        requestType: 'Interbank Fund Transfer',
        transactionDate: '09/10/2020 11:12:01 AM',
        amount: 50000.00,
    },
];

export default function PendingApprovalsPage() {
  const router = useRouter();

  return (
    <DashboardLayout>
      <main className="flex-1 p-4 sm:px-6 sm:py-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft />
            </Button>
            <h1 className="text-xl font-semibold">Pending for Approvals</h1>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Transaction Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Transaction Types</SelectItem>
              <SelectItem value="ift">Interbank Fund Transfer</SelectItem>
              <SelectItem value="bill">Bill Payment</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all-requests">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-requests">View: All</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ApprovalsTable data={approvalsData} />
      </main>
    </DashboardLayout>
  );
}
