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
import type { Approval } from '@/app/pending-approvals/page';
import { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, XCircle } from 'lucide-react';
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
      <TableRow>
        <TableCell className="w-12 text-center" onClick={toggleRow} style={{ cursor: 'pointer' }}>
            {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </TableCell>
        <TableCell className="w-1/6 whitespace-nowrap">{approval.referenceNo}</TableCell>
        <TableCell className="w-2/6">{approval.transactionType2}</TableCell>
        <TableCell className="w-2/6">{approval.featureActionId}</TableCell>
        <TableCell className="w-1/6">{approval.requesterName}</TableCell>
        <TableCell className="text-right">
            <div className="flex items-center justify-end gap-2">
                <Button size="sm" variant="outline" className="bg-gray-100 hover:bg-gray-200">
                    Approve <CheckCircle2 className="h-4 w-4 ml-2 text-green-500" />
                </Button>
                <Button size="sm" variant="outline" className="bg-gray-100 hover:bg-gray-200">
                   Reject <XCircle className="h-4 w-4 ml-2 text-red-500" />
                </Button>
                <Button size="sm" variant="outline" className="bg-gray-100 hover:bg-gray-200">View</Button>
            </div>
        </TableCell>
      </TableRow>
      {isOpen && (
        <TableRow>
          <TableCell colSpan={6} className="p-0">
            <div className="bg-muted/50 p-4">
                <div className="flex w-full">
                    {/* Empty cell for chevron */}
                    <div className="w-12"></div>
                    
                    {/* Aligns with Transaction Number */}
                    <div className="w-1/6 space-y-2 pr-4">
                        {isBillPayment && innerNotes ? (
                             <>
                                <div>
                                    <p className="text-sm font-semibold">Consumer Number</p>
                                    <p className="text-muted-foreground text-sm">{innerNotes.consumerNo}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">Consumer Name</p>
                                    <p className="text-muted-foreground text-sm">{notes.nickName}</p>
                                </div>
                            </>
                        ) : (
                             <div>
                                <p className="text-sm font-semibold">Amount</p>
                                <p className="text-muted-foreground text-sm">PKR {approval.amount || 'N/A'}</p>
                            </div>
                        )}
                    </div>

                    {/* Aligns with Transaction Type */}
                    <div className="w-2/6 space-y-2 pr-4">
                       {isBillPayment && innerNotes && (
                           <div>
                               <p className="text-sm font-semibold">Biller Institution</p>
                               <p className="text-muted-foreground text-sm">{innerNotes.instVal}</p>
                           </div>
                       )}
                    </div>
                    
                    {/* Aligns with Request Type */}
                    <div className="w-2/6 space-y-2 pr-4">
                        {/* Placeholder for future details under this column */}
                    </div>

                    {/* Aligns with Originator */}
                    <div className="w-1/6 space-y-2 pr-4">
                         <div>
                            <p className="text-sm font-semibold">Date Submitted</p>
                            <p className="text-muted-foreground text-sm">{format(new Date(approval.assignedDate), 'dd/MM/yyyy h:mm a')}</p>
                        </div>
                    </div>

                    {/* Aligns with Actions - empty */}
                    <div className="flex-1"></div>
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
            <TableHead className="w-1/6 whitespace-nowrap">Transaction Number</TableHead>
            <TableHead className="w-2/6">Transaction Type</TableHead>
            <TableHead className="w-2/6">Request Type</TableHead>
            <TableHead className="w-1/6">Originator</TableHead>
            <TableHead className="text-right">Actions</TableHead>
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
