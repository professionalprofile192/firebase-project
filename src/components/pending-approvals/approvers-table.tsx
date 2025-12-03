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
  userProfile: any;
}

export function ApproversTable({ approval, userProfile }: ApproversTableProps) {
  // Base entry for the creator of the request
  const creatorEntry = {
    username: approval.requesterName,
    role: 'Maker',
    status: 'CREATED',
    dateTime: approval.assignedDate,
    comments: `Request created by ${approval.requesterName}`
  };

  const approvers = [creatorEntry];

  // If the request has been rejected, add an entry for the rejecter.
  if (approval.status === 'REJECTED') {
    approvers.push({
      username: userProfile?.firstname + ' ' + userProfile?.lastname, // Placeholder for rejecter's name
      role: 'Approver',
      status: 'REJECTED',
      dateTime: approval.assignedDate, // Should ideally be a different timestamp
      comments: approval.remarks || 'Rejected'
    });
  }
  
  if (approval.status === 'APPROVED') {
    approvers.push({
      username: 'System', // Placeholder
      role: 'Approver',
      status: 'APPROVED',
      dateTime: approval.assignedDate, // SHould be a different timestamp
      comments: approval.remarks || 'Approved'
    });
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle className="text-lg font-semibold">Approvers</CardTitle>
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
