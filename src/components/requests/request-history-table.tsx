'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Request } from '@/app/requests/page';
import { Button } from '../ui/button';

interface RequestHistoryTableProps {
  data: Request[];
}

export function RequestHistoryTable({ data }: RequestHistoryTableProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction Number</TableHead>
            <TableHead>Transaction Type</TableHead>
            <TableHead>Request Type</TableHead>
            <TableHead>Originator</TableHead>
            <TableHead>Date Submitted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((request) => (
              <TableRow key={request.transactionNumber}>
                <TableCell>{request.transactionNumber}</TableCell>
                <TableCell>{request.transactionType}</TableCell>
                <TableCell>{request.requestType}</TableCell>
                <TableCell>{request.originator}</TableCell>
                <TableCell>{request.dateSubmitted}</TableCell>
                <TableCell>{request.status}</TableCell>
                <TableCell className="text-center">
                  <Button variant="outline" size="sm">View</Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No Record Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
