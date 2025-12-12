
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export type HistoryItem = {
  consumerNumber: string;
  transactionId: string;
  transactionDate: string;
  consumerName: string;
  amount: string;
  status: 'Paid' | 'Failed' | 'In Progress';
};

interface BillPaymentHistoryTableProps {
  data: HistoryItem[];
}

const ITEMS_PER_PAGE = 10;

export function BillPaymentHistoryTable({ data }: BillPaymentHistoryTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, data.length);
  const currentData = data.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm mt-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Consumer Number</TableHead>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Transaction Date</TableHead>
            <TableHead>Consumer Name</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.length > 0 ? (
            currentData.map((item) => (
              <TableRow key={item.transactionId}>
                <TableCell>{item.consumerNumber}</TableCell>
                <TableCell>{item.transactionId}</TableCell>
                <TableCell>{item.transactionDate}</TableCell>
                <TableCell>{item.consumerName}</TableCell>
                <TableCell>PKR {item.amount}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell className="text-center">
                  <Button variant="outline" size="sm">View</Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-48">
                <div className="flex flex-col items-center justify-center gap-4 py-10 h-full">
                    <AlertTriangle className="h-10 w-10 text-red-500" />
                    <p className="font-semibold text-lg text-muted-foreground">No Record Found</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-center p-4 border-t">
        <Button variant="ghost" size="icon" onClick={handlePreviousPage} disabled={currentPage === 1}>
            <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-muted-foreground mx-4">
            {data.length > 0 ? `${startIndex + 1} - ${endIndex} of ${data.length} Transactions` : '0 Transactions'}
        </span>
        <Button variant="ghost" size="icon" onClick={handleNextPage} disabled={currentPage === totalPages || data.length === 0}>
            <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
