
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Approval } from "@/app/pending-approvals/page";
import { format } from "date-fns";

interface ApproversTableProps {
  approval: Approval;
}

export function ApproversTable({ approval }: ApproversTableProps) {
  // Mocking data for the approvers table as it's not in the main approval object
  const approvers = [
    {
      username: 'Humnamaker12',
      role: 'Maker',
      status: 'Bulk file Self Initiated Approval FT/IBFT/UBP CREATED',
      dateTime: approval.assignedDate,
      comments: `ADD BILL REQUEST FROM ${approval.sentBy}`
    }
  ];

  return (
    <Card>
        <CardHeader>
            <CardTitle className="text-lg font-semibold">Pending Approvers</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Comments</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {approvers.length > 0 ? (
                        approvers.map((approver, index) => (
                        <TableRow key={index}>
                            <TableCell>{approver.username}</TableCell>
                            <TableCell>{approver.role}</TableCell>
                            <TableCell>{approver.status}</TableCell>
                            <TableCell>{format(new Date(approver.dateTime), 'dd/MM/yyyy h:mm a')}</TableCell>
                            <TableCell>{approver.comments}</TableCell>
                        </TableRow>
                        ))
                    ) : (
                        <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                            No approvers found.
                        </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
            </div>
      </CardContent>
    </Card>
  );
}
