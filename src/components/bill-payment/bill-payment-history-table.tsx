
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';

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

export function BillPaymentHistoryTable({ data }: BillPaymentHistoryTableProps) {

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
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
          {data.length > 0 ? (
            data.map((item) => (
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
              <TableCell colSpan={7} className="h-64 text-center">
                <div className="flex flex-col items-center justify-center gap-4">
                    <AlertTriangle className="h-10 w-10 text-red-500" />
                    <p className="font-semibold text-lg text-muted-foreground">No Record Found</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
            <TableRow>
              <TableCell colSpan={7}>
                <div className="flex items-center justify-between p-2 text-sm text-muted-foreground">
                  <span>1-20 Transactions</span>
                  <div className="flex items-center">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        disabled={true}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="icon"
                        disabled={true}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TableCell>
            </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
