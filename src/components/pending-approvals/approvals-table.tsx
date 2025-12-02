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
  
  const notes = approval.notes2 ? JSON.parse(approval.notes2) : (approval.notes ? JSON.parse(approval.notes) : null);
  const innerNotes = notes?.notes ? JSON.parse(notes.notes) : null;
  const reviewContext = notes?.reviewContext;
  
  const isBillPayment = approval.featureActionId === 'BILL_PAY_CREATE_PAYEES';
  const isFundTransfer = approval.featureActionId.includes('FUND_TRANSFER');

  const toggleRow = () => setIsOpen(!isOpen);
  
  const fromAccount = isFundTransfer ? approval.fromAccountNumber : (innerNotes?.fromAccount || 'N/A');
  const toAccount = isFundTransfer ? approval.toAccountNumber : (innerNotes?.toAccount || 'N/A');

  return (
    <>
      <TableRow onClick={toggleRow} className="cursor-pointer">
        <TableCell className="w-12 text-center">
            {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </TableCell>
        <TableCell className="font-medium w-[15%] whitespace-nowrap">{approval.referenceNo}</TableCell>
        <TableCell className="w-[25%] break-words">{approval.transactionType2}</TableCell>
        <TableCell className="w-[25%] break-words">{approval.featureActionId}</TableCell>
        <TableCell className="w-[15%]">{approval.requesterName}</TableCell>
        <TableCell className="text-right">
            <div className="flex items-center justify-end gap-2">
                <Button size="sm" variant="outline" className="bg-gray-100 hover:bg-gray-200" onClick={(e) => { e.stopPropagation(); /* approve logic */ }}>
                    Approve <CheckCircle2 className="h-4 w-4 ml-2 text-green-500" />
                </Button>
                <Button size="sm" variant="outline" className="bg-gray-100 hover:bg-gray-200" onClick={(e) => { e.stopPropagation(); /* reject logic */ }}>
                   Reject <XCircle className="h-4 w-4 ml-2 text-red-500" />
                </Button>
                <Button size="sm" variant="outline" className="bg-gray-100 hover:bg-gray-200" onClick={(e) => { e.stopPropagation(); /* view logic */ }}>View</Button>
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
                    
                    <div className="w-[15%] space-y-4 pr-4">
                        {isBillPayment && innerNotes ? (
                             <div>
                                <p className="text-sm font-semibold">Consumer Number</p>
                                <p className="text-muted-foreground text-sm">{innerNotes.consumerNo}</p>
                            </div>
                        ) : (
                             <div>
                                <p className="text-sm font-semibold">Amount</p>
                                <p className="text-muted-foreground text-sm">PKR {approval.amount || 'N/A'}</p>
                            </div>
                        )}
                         {isFundTransfer && reviewContext && (
                            <div>
                               <p className="text-sm font-semibold">From Account</p>
                               <p className="text-muted-foreground text-sm">{fromAccount}</p>
                           </div>
                        )}
                    </div>

                    <div className="w-[25%] space-y-4 pr-4">
                       {isBillPayment && innerNotes && (
                           <div className="flex gap-8">
                               <div>
                                   <p className="text-sm font-semibold">Biller Institution</p>
                                   <p className="text-muted-foreground text-sm">{innerNotes.instVal}</p>
                               </div>
                                <div>
                                    <p className="text-sm font-semibold">Consumer Name</p>
                                    <p className="text-muted-foreground text-sm">{notes.nickName}</p>
                                </div>
                           </div>
                       )}
                       {isFundTransfer && reviewContext && (
                             <div>
                                <p className="text-sm font-semibold">To Account</p>
                                <p className="text-muted-foreground text-sm">{toAccount}</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="w-[25%] space-y-4 pr-4">
                         {isFundTransfer && reviewContext && (
                             <div>
                                <p className="text-sm font-semibold">Beneficiary Name</p>
                                <p className="text-muted-foreground text-sm">{reviewContext.payeeName}</p>
                            </div>
                        )}
                    </div>

                    <div className="w-[15%] space-y-4 pr-4">
                         <div>
                            <p className="text-sm font-semibold">Date Submitted</p>
                            <p className="text-muted-foreground text-sm">{format(new Date(approval.assignedDate), 'dd/MM/yyyy h:mm a')}</p>
                        </div>
                    </div>

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
            <TableHead className="w-[15%] whitespace-nowrap">Transaction Number</TableHead>
            <TableHead className="w-[25%]">Transaction Type</TableHead>
            <TableHead className="w-[25%]">Request Type</TableHead>
            <TableHead className="w-[15%]">Originator</TableHead>
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
