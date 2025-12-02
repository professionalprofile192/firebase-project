

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
import { ChevronDown, ChevronUp, CheckCircle2, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { RejectDialog } from './reject-dialog';
import { useToast } from '@/hooks/use-toast';
import { rejectRequest } from '@/app/actions';
import { CustomAlertDialog } from '../common/custom-alert-dialog';


interface ApprovalsTableProps {
  data: Approval[];
  userProfile: any;
}

const ITEMS_PER_PAGE = 8;

function ApprovalRow({ approval, isOpen, onToggle, onRejectClick }: { approval: Approval, isOpen: boolean, onToggle: () => void, onRejectClick: (approval: Approval) => void }) {
  
  let notes = null;
  try {
    notes = approval.notes2 ? JSON.parse(approval.notes2) : (approval.notes ? JSON.parse(approval.notes) : null);
  } catch (e) {
    // Notes are not a valid JSON
  }

  let innerNotes = null;
  if (notes?.notes) {
    try {
      innerNotes = JSON.parse(notes.notes);
    } catch (e) {
      // notes.notes is not a valid JSON
    }
  }

  const reviewContext = notes?.reviewContext;
  
  const isBillPayment = approval.featureActionId === 'BILL_PAY_CREATE_PAYEES';
  const isFundTransfer = approval.featureActionId.includes('FUND_TRANSFER');
  const isBulkTransfer = approval.transactionType === 'BulkFT' || approval.transactionType === 'BulkIBFT' || approval.transactionType === 'BulkRaast';
  
  const fromAccount = approval.fromAccountNumber || reviewContext?.otherDetails?.fromAccount || 'N/A';
  const toAccount = approval.toAccountNumber || reviewContext?.otherDetails?.toAccountNumber || 'N/A';
  const amount = approval.amount;
  const fileId = notes?.fileid;
  const fileName = notes?.filename;
  const fromAccountName = notes?.fromAccountName;

  return (
    <>
      <TableRow>
        <TableCell onClick={onToggle} className="cursor-pointer w-12 text-center">
            {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </TableCell>
        <TableCell className="font-medium whitespace-nowrap w-[15%]">{approval.referenceNo}</TableCell>
        <TableCell className="w-[25%] break-words">{approval.transactionType2}</TableCell>
        <TableCell className="w-[25%] break-words">{approval.featureActionId}</TableCell>
        <TableCell className="w-[15%]">{approval.requesterName}</TableCell>
        <TableCell className="text-right flex-1">
            <div className="flex items-center justify-end gap-2">
                <Button size="sm" variant="outline" className="bg-green-100 hover:bg-green-200 text-green-800 border-green-200" onClick={(e) => { e.stopPropagation(); /* approve logic */ }}>
                    Approve <CheckCircle2 className="h-4 w-4 ml-2" />
                </Button>
                <Button size="sm" variant="outline" className="bg-red-100 hover:bg-red-200 text-red-800 border-red-200" onClick={(e) => { e.stopPropagation(); onRejectClick(approval); }}>
                   Reject <XCircle className="h-4 w-4 ml-2" />
                </Button>
                 <Link href={{ pathname: `/pending-approvals/${approval.referenceNo}`, query: { approval: JSON.stringify(approval) } }}>
                    <Button size="sm" variant="outline" className="bg-gray-100 hover:bg-gray-200">View</Button>
                </Link>
            </div>
        </TableCell>
      </TableRow>
      {isOpen && (
        <TableRow>
          <TableCell colSpan={6} className="p-0">
            <div className="bg-muted/50 p-4">
                <div className="flex w-full">
                    {/* Empty cell for chevron */}
                    <div className="w-12 flex-shrink-0"></div>
                    
                    <div className="w-[15%] pr-4 space-y-4">
                        {isBillPayment && innerNotes?.consumerNo && (
                             <div>
                                <p className="text-sm font-semibold">Consumer Number</p>
                                <p className="text-muted-foreground text-sm">{innerNotes.consumerNo}</p>
                            </div>
                        )}
                        {(isFundTransfer && amount) && (
                            <div>
                                <p className="text-sm font-semibold">Amount</p>
                                <p className="text-muted-foreground text-sm">PKR {amount}</p>
                            </div>
                        )}
                         {fileId && (
                            <div>
                                <p className="text-sm font-semibold">File Reference Number</p>
                                <p className="text-muted-foreground text-sm">{fileId}</p>
                            </div>
                        )}
                    </div>
                    
                     <div className="w-[25%] pr-4 space-y-4">
                       {isBillPayment && innerNotes?.instVal && (
                             <div>
                                <p className="text-sm font-semibold">Biller Institution</p>
                                <p className="text-muted-foreground text-sm">{innerNotes.instVal}</p>
                            </div>
                        )}
                        {(isFundTransfer && !isBulkTransfer) && (
                           <div>
                                <p className="text-sm font-semibold">Debit Account</p>
                                <p className="text-muted-foreground text-sm">{fromAccount}</p>
                            </div>
                        )}
                        {fileName && (
                             <div>
                                <p className="text-sm font-semibold">File Name</p>
                                <p className="text-muted-foreground text-sm">{fileName}</p>
                            </div>
                        )}
                     </div>

                    <div className="w-[25%] pr-4 space-y-4">
                        {isBillPayment && notes?.nickName && (
                           <div>
                                <p className="text-sm font-semibold">Consumer Name</p>
                                <p className="text-muted-foreground text-sm">{notes.nickName}</p>
                           </div>
                        )}
                        {(isFundTransfer && !isBulkTransfer) && (
                            <div>
                                <p className="text-sm font-semibold">Credit Account</p>
                                <p className="text-muted-foreground text-sm">{toAccount}</p>
                            </div>
                        )}
                        {fromAccountName && (
                            <div>
                                <p className="text-sm font-semibold">Account Title</p>
                                <p className="text-muted-foreground text-sm">{fromAccountName}</p>
                            </div>
                        )}
                    </div>

                     <div className="w-[15%] pr-4 space-y-4">
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


export function ApprovalsTable({ data, userProfile }: ApprovalsTableProps) {
  const [openApprovalId, setOpenApprovalId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [approvals, setApprovals] = useState(data);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successAlertMessage, setSuccessAlertMessage] = useState('');
  const { toast } = useToast();

  const totalPages = Math.ceil(approvals.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = approvals.slice(startIndex, endIndex);

  const handleRowToggle = (referenceNo: string) => {
    setOpenApprovalId(prevId => (prevId === referenceNo ? null : referenceNo));
  };
  
  const handlePreviousPage = () => {
    setOpenApprovalId(null);
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }

  const handleNextPage = () => {
    setOpenApprovalId(null);
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }

  const handleRejectClick = (approval: Approval) => {
    setSelectedApproval(approval);
    setShowRejectDialog(true);
  }

  const handleConfirmReject = async (remarks: string) => {
    if (!selectedApproval || !userProfile) {
        toast({ variant: 'destructive', title: 'Error', description: 'No approval selected or user profile not found.' });
        return;
    }
    
    const payload = {
        accountNo: 0, 
        approverId: userProfile.userid,
        contractId: selectedApproval.contractId,
        referenceNo: selectedApproval.referenceNo,
        rejectorId: userProfile.userid,
        remarks: remarks
    };

    try {
        const response = await rejectRequest(payload);
        setShowRejectDialog(false);
        if (response.opstatus === 0 && response.ApprovalMatrix[0].opstatus === 0) {
            setApprovals(prev => prev.filter(appr => appr.referenceNo !== selectedApproval.referenceNo));
            setSuccessAlertMessage(response.ApprovalMatrix[0].reqResponse);
            setShowSuccessAlert(true);
        } else {
            toast({ variant: 'destructive', title: 'Rejection Failed', description: response.message || "An unknown error occurred." });
        }
    } catch (error) {
        setShowRejectDialog(false);
        toast({ variant: 'destructive', title: 'Error', description: 'An unexpected error occurred during rejection.' });
    }
  }


  return (
    <>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead className="w-[15%] whitespace-nowrap">Transaction Number</TableHead>
              <TableHead className="w-[25%]">Transaction Type</TableHead>
              <TableHead className="w-[25%]">Request Type</TableHead>
              <TableHead className="w-[15%]">Originator</TableHead>
              <TableHead className="text-right flex-1">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length > 0 ? (
              currentData.map((approval) => (
                <ApprovalRow 
                  key={approval.referenceNo} 
                  approval={approval}
                  isOpen={openApprovalId === approval.referenceNo}
                  onToggle={() => handleRowToggle(approval.referenceNo)}
                  onRejectClick={handleRejectClick}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No Record Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {approvals.length > 0 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6}>
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
                      {startIndex + 1} - {Math.min(endIndex, approvals.length)} of {approvals.length} Transactions
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
       <RejectDialog 
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
        onConfirm={handleConfirmReject}
      />
      <CustomAlertDialog
        open={showSuccessAlert}
        onOpenChange={setShowSuccessAlert}
        title="Success"
        description={successAlertMessage}
        onConfirm={() => setShowSuccessAlert(false)}
      />
    </>
  );
}
