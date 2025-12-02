
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
import { Checkbox } from '@/components/ui/checkbox';
import type { Approval } from '@/app/pending-approvals/page';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';

interface ApprovalsTableProps {
  data: Approval[];
}

function ApprovalRow({ approval }: { approval: Approval }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const notes = approval.notes2 ? JSON.parse(approval.notes2) : null;
  const innerNotes = notes?.notes ? JSON.parse(notes.notes) : null;

  const isBillPayment = approval.featureActionId === 'BILL_PAY_CREATE_PAYEES';

  const toggleRow = () => setIsOpen(!isOpen);

  return (
    <>
      <TableRow onClick={toggleRow} className="cursor-pointer">
        <TableCell className="w-12 text-center">
            {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </TableCell>
        <TableCell className="w-32">{approval.referenceNo}</TableCell>
        <TableCell className="w-56 whitespace-normal break-words">{approval.transactionType2}</TableCell>
        <TableCell className="max-w-xs whitespace-normal break-words">{approval.featureActionId}</TableCell>
        <TableCell className="w-48">{approval.requesterName}</TableCell>
        <TableCell className="w-20 text-center">
            <Checkbox />
        </TableCell>
      </TableRow>
      {isOpen && (
        <TableRow>
          <TableCell colSpan={6} className="p-0">
            <div className="bg-muted/50 p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                    {isBillPayment && innerNotes ? (
                        <>
                            <div className="col-span-1 space-y-2">
                                <div>
                                    <p className="text-sm font-semibold">Consumer Number</p>
                                    <p className="text-muted-foreground">{innerNotes.consumerNo}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">Consumer Name</p>
                                    <p className="text-muted-foreground">{notes.nickName}</p>
                                </div>
                            </div>
                            <div className="col-span-1 space-y-2">
                                <div>
                                    <p className="text-sm font-semibold">Biller Institution</p>
                                    <p className="text-muted-foreground">{innerNotes.instVal}</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="col-span-1">
                            <p className="text-sm font-semibold">Amount</p>
                            <p className="text-muted-foreground">PKR {approval.amount || 'N/A'}</p>
                        </div>
                    )}
                     <div className="col-span-1 space-y-2">
                        <div>
                            <p className="text-sm font-semibold">Date Submitted</p>
                            <p className="text-muted-foreground">{format(new Date(approval.assignedDate), 'dd/MM/yyyy h:mm a')}</p>
                        </div>
                    </div>
                    <div className="col-span-1 md:col-span-2 flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline" className="bg-green-100 text-green-800 border-green-300 hover:bg-green-200">
                            Approve
                        </Button>
                        <Button size="sm" variant="outline" className="bg-red-100 text-red-800 border-red-300 hover:bg-red-200">
                           Reject
                        </Button>
                        <Button size="sm" variant="outline">View</Button>
                    </div>
                </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}


export function ApprovalsTable({ data }: ApprovalsTableProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead className="w-32">Transaction Number</TableHead>
            <TableHead className="w-56">Transaction Type</TableHead>
            <TableHead>Request Type</TableHead>
            <TableHead className="w-48">Originator</TableHead>
            <TableHead className="w-20 text-center">
                <Checkbox />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((approval) => (
              <ApprovalRow key={approval.referenceNo} approval={approval} />
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
