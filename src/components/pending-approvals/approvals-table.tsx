'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import type { Approval } from '@/app/pending-approvals/page';

interface ApprovalsTableProps {
  data: Approval[];
}

export function ApprovalsTable({ data }: ApprovalsTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
    }).format(amount);
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox />
            </TableHead>
            <TableHead>Request From</TableHead>
            <TableHead>Request Type</TableHead>
            <TableHead>Transaction Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((approval) => (
            <TableRow key={approval.id}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>{approval.requestFrom}</TableCell>
              <TableCell>{approval.requestType}</TableCell>
              <TableCell>{approval.transactionDate}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(approval.amount)}
              </TableCell>
              <TableCell className="text-center">
                <Button variant="outline" size="sm">
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
