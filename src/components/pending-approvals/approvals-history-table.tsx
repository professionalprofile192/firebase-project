'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Approval } from '@/app/pending-approvals/page';

interface ApprovalsHistoryTableProps {
  data: Approval[];
}

export function ApprovalsHistoryTable({ data }: ApprovalsHistoryTableProps) {

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction Number</TableHead>
            <TableHead>Transaction Type</TableHead>
            <TableHead>Request Type</TableHead>
            <TableHead>Originator</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((approval) => (
              <TableRow key={approval.transactionNumber}>
                <TableCell>{approval.transactionNumber}</TableCell>
                <TableCell>{approval.transactionType}</TableCell>
                <TableCell>{approval.requestType}</TableCell>
                <TableCell>{approval.originator}</TableCell>
                <TableCell>{/* Status would go here */}</TableCell>
                <TableCell className="text-center">
                  {/* Actions buttons would go here */}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No Record Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
