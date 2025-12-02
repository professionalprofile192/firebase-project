
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import type { Approval } from '@/app/pending-approvals/page';
import { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

interface ApprovalsHistoryTableProps {
  data: Approval[];
}

const ITEMS_PER_PAGE = 8;

function HistoryRow({ approval, isOpen, onToggle }: { approval: Approval, isOpen: boolean, onToggle: () => void }) {
  
  const notes = approval.notes2 ? JSON.parse(approval.notes2) : (approval.notes ? JSON.parse(approval.notes) : null);
  const innerNotes = notes?.notes ? JSON.parse(notes.notes) : null;
  const reviewContext = notes?.reviewContext;
  
  const isBillPayment = approval.featureActionId === 'BILL_PAY_CREATE_PAYEES';
  const isFundTransfer = approval.featureActionId.includes('FUND_TRANSFER');
  
  const fromAccount = isFundTransfer ? approval.fromAccountNumber : (innerNotes?.fromAccount || 'N/A');
  const toAccount = isFundTransfer ? approval.toAccountNumber : (innerNotes?.toAccount || 'N/A');

  const getStatusVariant = (status?: string) => {
    switch(status) {
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'destructive';
      default: return 'secondary';
    }
  }

  return (
    <>
      <TableRow onClick={onToggle} className="cursor-pointer">
        <TableCell className="w-12 text-center">
            {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </TableCell>
        <TableCell className="font-medium whitespace-nowrap">{approval.referenceNo}</TableCell>
        <TableCell className="w-[25%] break-words">{approval.transactionType2}</TableCell>
        <TableCell className="w-[25%] break-words">{approval.featureActionId}</TableCell>
        <TableCell className="w-[15%]">{approval.requesterName}</TableCell>
        <TableCell>
            <Badge variant={getStatusVariant(approval.status) as any} className={cn({
                'bg-green-100 text-green-800': approval.status === 'APPROVED',
                'bg-red-100 text-red-800': approval.status === 'REJECTED',
            })}>
                {approval.status}
            </Badge>
        </TableCell>
        <TableCell className="text-right">
            <Button size="sm" variant="outline" className="bg-gray-100 hover:bg-gray-200" onClick={(e) => { e.stopPropagation(); /* view logic */ }}>View</Button>
        </TableCell>
      </TableRow>
      {isOpen && (
        <TableRow>
          <TableCell colSpan={7} className="p-0">
            <div className="bg-muted/50 p-4">
                <div className="flex w-full">
                    {/* Empty cell for chevron */}
                    <div className="w-12 flex-shrink-0"></div>
                    <div className="w-[15%] pr-4">
                        {isBillPayment && innerNotes && (
                            <>
                                <p className="text-sm font-semibold">Consumer Number</p>
                                <p className="text-muted-foreground text-sm">{innerNotes.consumerNo}</p>
                            </>
                        )}
                         {isFundTransfer && (
                            <>
                                <p className="text-sm font-semibold">Amount</p>
                                <p className="text-muted-foreground text-sm">PKR {approval.amount || 'N/A'}</p>
                            </>
                        )}
                    </div>
                     <div className="w-[25%] pr-4">
                        {isBillPayment && innerNotes && (
                            <>
                                <p className="text-sm font-semibold">Biller Institution</p>
                                <p className="text-muted-foreground text-sm">{innerNotes.instVal}</p>
                            </>
                        )}
                        {isFundTransfer && (
                            <>
                                <p className="text-sm font-semibold">Debit Account</p>
                                <p className="text-muted-foreground text-sm">{fromAccount}</p>
                            </>
                        )}
                     </div>
                     <div className="w-[25%] pr-4">
                        {isBillPayment && notes && (
                           <>
                                <p className="text-sm font-semibold">Consumer Name</p>
                                <p className="text-muted-foreground text-sm">{notes.nickName}</p>
                           </>
                        )}
                         {isFundTransfer && reviewContext && (
                            <>
                                <p className="text-sm font-semibold">Credit Account</p>
                                <p className="text-muted-foreground text-sm">{toAccount}</p>
                            </>
                        )}
                     </div>
                     <div className="w-[15%] pr-4">
                        <p className="text-sm font-semibold">Date Submitted</p>
                        <p className="text-muted-foreground text-sm">{format(new Date(approval.assignedDate), 'dd/MM/yyyy h:mm a')}</p>
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

export function ApprovalsHistoryTable({ data }: ApprovalsHistoryTableProps) {
  const [openApprovalId, setOpenApprovalId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = data.slice(startIndex, endIndex);

  const handleRowToggle = (referenceNo: string) => {
    setOpenApprovalId(prevId => (prevId === referenceNo ? null : referenceNo));
  };
  
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }

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
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.length > 0 ? (
            currentData.map((approval) => (
              <HistoryRow 
                key={approval.referenceNo} 
                approval={approval}
                isOpen={openApprovalId === approval.referenceNo}
                onToggle={() => handleRowToggle(approval.referenceNo)}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No Record Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        {data.length > 0 && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={7}>
                <div className="flex items-center justify-center p-2">
                   <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                     <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground mx-4">
                    {startIndex + 1} - {Math.min(endIndex, data.length)} of {data.length} Transactions
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  );
}

    