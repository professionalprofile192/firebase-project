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
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Edit, Trash2, BarChart2, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { Checkbox } from '../ui/checkbox';
import { Skeleton } from '../ui/skeleton';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


// --- DELETE CONFIRMATION POPUP COMPONENT ---
const DeleteConfirmPopup = ({ isOpen, onClose, onConfirm, title }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 border-t-4 border-red-500 animate-in fade-in zoom-in duration-200">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Confirm Delete</h2>
        <p className="text-gray-600 mb-6">Are you sure you want to delete <span className="font-semibold text-red-600">{title}</span>?</p>
        <div className="flex gap-3">
          <Button onClick={onClose} variant="outline" className="flex-1">No, Cancel</Button>
          <Button onClick={onConfirm} variant="destructive" className="flex-1">Yes, Delete</Button>
        </div>
      </div>
    </div>
  );
};

// --- RESULT POPUP COMPONENT (CustomPopup) ---
const ResultPopup = ({ isOpen, onClose, type, title, message }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 text-center animate-in fade-in zoom-in duration-200">
        <div className="flex justify-center mb-4">
          {type === 'success' ? <CheckCircle2 className="h-12 w-12 text-green-500" /> : <AlertCircle className="h-12 w-12 text-red-500" />}
        </div>
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <Button onClick={onClose} className="w-full">Okay</Button>
      </div>
    </div>
  );
};

export type Payee = {
  payeeId: string;
  consumerName: string;
  payeeNickName: string;
  billerType: string;
  companyName: string;
  consumerNumber: string;
  status: 'Unpaid' | 'Not Available' | 'Paid';
  amountDue?: string;
  dueDate?: string;
  amountAfterDueDate?: string;
  category?: string;
  rawNotes?: any;
};

interface PayeeTableProps {
  data: Payee[];
  multiPayMode: boolean;
  loading: boolean;
  onViewActivity: () => void; 
}

const ITEMS_PER_PAGE = 8;
// --- IMPROVED DUE DATE LOGIC ---
const isOverdue = (dueDateString?: string) => {
  if (!dueDateString || dueDateString === 'N/A') return false;

  try {
    // Agar date "29/07/2015" format mein hai toh usay split karein
    const parts = dueDateString.split('/');
    let dueDate: Date;

    if (parts.length === 3) {
      // Day, Month, Year ko alag karke Date object banayein (Month 0-indexed hota hai isliye -1)
      dueDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    } else {
      // Fallback agar format different ho
      dueDate = new Date(dueDateString);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    
    // Agar date invalid hai
    if (isNaN(dueDate.getTime())) return false;

    return today > dueDate; 
  } catch (e) {
    return false;
  }
};

function PayeeRow({ 
  payee, 
  isOpen,
  onToggle, 
  multiPayMode,
  isSelected,
  onSelectionChange,
  onDelete ,
  onViewActivity
}: { 
  payee: Payee, 
  isOpen: boolean, 
  onToggle: () => void,
  multiPayMode: boolean,
  isSelected: boolean,
  onSelectionChange: (checked: boolean) => void,
  onDelete: (payee: Payee) => void,
  onViewActivity: () => void // Type added
}) {
  
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleRowClick = () => {
   onToggle();
  
  }


const overdue = isOverdue(payee.dueDate);
const router = useRouter();
const handleSelectionInternal = (checked: boolean) => {
  if (checked && overdue) {
    // Yahan hum alert ya toast dikhayenge
    // Kyunke toast hook parent mein hai, aap simple alert use kar sakte hain 
    // ya parent se ek error function pass karwa sakte hain.
    alert(`Record cannot be selected: Due date (${payee.dueDate}) has passed.`);
    return;
  }
  onSelectionChange(checked);
};
  return (
    
    <>
   
      <TableRow onClick={handleRowClick} className="cursor-pointer hover:bg-muted/30 transition-colors">
        {multiPayMode && (
          <TableCell className="w-12 text-center" onClick={stopPropagation}>
            <Checkbox 
              checked={isSelected} 
              disabled={overdue}
              onCheckedChange={(checked) => handleSelectionInternal(Boolean(checked))}
              className={cn(overdue && "opacity-50 cursor-not-allowed border-gray-300")}
            />
          </TableCell>
        )}
        <TableCell className="font-medium">
          <div>{payee.payeeNickName.toUpperCase()}</div>
          <div className="text-muted-foreground text-xs">{payee.consumerName.toUpperCase()}</div>
        </TableCell>
        <TableCell>
            <a href="#" className="text-primary hover:underline" onClick={stopPropagation}>{`${payee.billerType} ${payee.companyName}`}</a>
        </TableCell>
        <TableCell>{payee.consumerNumber}</TableCell>
        <TableCell>
        <span className={cn("text-foreground", overdue && "text-red-500 font-medium")}>
            {overdue ? 'Not Payable' : payee.status}
          </span>
        </TableCell>
        <TableCell className="text-right">
        <div className='flex items-center justify-end gap-3' onClick={stopPropagation}>
          
         {/* PAY NOW BUTTON */}
        {!multiPayMode && !overdue && payee.status !== 'Paid' && (
          <Button 
            variant="ghost" 
            className={cn(
              "bg-[#F1F8FD] text-[#00529B] font-semibold hover:bg-[#E1F0FB] px-4 py-1.5 h-auto rounded-md flex items-center gap-2 border border-transparent transition-colors",
              "text-sm"
            )}
            onClick={() => {
              
              const selectedRecords = [payee]; 
              const totalAmount = payee.amountDue?.replace(/,/g, '') || '0';

              // 2. Session mein usi keys ke saath store karein jo multi-pay use karta hai
              sessionStorage.setItem('pending_payment_consumers', payee.consumerNumber);
              sessionStorage.setItem('total_payable_amount', totalAmount);
              sessionStorage.setItem('selected_payees_data', JSON.stringify(selectedRecords));

              // 3. Navigate karein (ab query param ki zaroorat nahi, sirf navigation kafi hai)
              router.push('/bill-payment/pay');
            }}
          >
            Pay Now
            <div className="flex flex-col -gap-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#49A8E5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/>
              </svg>
            </div>
          </Button>
        )}
          {/* OVERDUE BADGE - UI improvement */}
          {overdue && !multiPayMode && (
             <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">
               Date Expired
             </Badge>
          )}

          {/* DROPDOWN TOGGLE */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="p-1 h-8 w-8 text-[#00529B] hover:bg-muted" 
            onClick={onToggle}
          >
            {isOpen ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
            <span className="sr-only">Toggle Details</span>
          </Button>
        </div>
      </TableCell>
      </TableRow>
      {isOpen && (
        <TableRow>
          <TableCell colSpan={multiPayMode ? 6 : 5} className="p-0">
            <div className="bg-muted/50 p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {payee.amountDue && (
                    <div>
                      <p className="text-xs text-muted-foreground">Amount Due</p>
                      <p className="font-semibold">PKR {payee.amountDue}</p>
                    </div>
                  )}
                  {payee.dueDate && (
                    <div>
                      <p className="text-xs text-muted-foreground">Due Date</p>
                      <p className="font-semibold">{payee.dueDate}</p>
                    </div>
                  )}
                  {payee.amountAfterDueDate && (
                    <div>
                      <p className="text-xs text-muted-foreground">Amount After Due Date</p>
                      <p className="font-semibold">PKR {payee.amountAfterDueDate}</p>
                    </div>
                  )}
                </div>

                  <div className="flex items-center gap-2 justify-end md:col-start-4">
                      <Button variant="outline" size="sm" onClick={(e) => {
      e.stopPropagation(); 
      onViewActivity(); }}
  className="flex items-center gap-1"><BarChart2 className="h-4 w-4 mr-1" /> View Activity</Button>
                    <Button variant="outline" size="sm" asChild>
                    <Link 
                        onClick={() => {
                          if (payee.rawNotes) {
                            const editData = {
                              payeeId: payee.payeeId,
                              payeeNick: payee.payeeNickName,
                              notes: payee.rawNotes
                            };
                            sessionStorage.setItem('editPayeeData', JSON.stringify(editData));
                          }
                        }}
                        href={{
                          pathname: '/bill-payment/add',
                          query: { 
                              id: payee.consumerNumber,
                              payeeId: payee.payeeId,
                              name: payee.consumerName,
                              nickname: payee.payeeNickName,
                              category: payee.category,
                              billerType: payee.billerType, 
                              company: payee.companyName,
                              isEdit: 'true',
                          }
                        }}
                    >
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Link>
                  </Button>
                    {/* TRIGGER DELETE MODAL */}
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                      onClick={() => onDelete(payee)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export function PayeeTable({ data, multiPayMode, loading, onViewActivity}: PayeeTableProps) {
  const router = useRouter();

  const [openPayeeId, setOpenPayeeId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPayees, setSelectedPayees] = useState<string[]>([]);
  
  // Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPayeeForDelete, setSelectedPayeeForDelete] = useState<Payee | null>(null);
  const [resultPopup, setResultPopup] = useState({ isOpen: false, type: 'success', title: '', message: '' });
  const hasSelected = selectedPayees.length > 0;
  const totalPayableAmount = data
  .filter(p => selectedPayees.includes(p.consumerNumber))
  .reduce((sum, p) => {
    // Amount se commas hatana zaroori hai agar string mein hain (e.g. "1,200")
    const amount = parseFloat(p.amountDue?.replace(/,/g, '') || '0');
    return sum + amount;
  }, 0);
  useEffect(() => {
    if (!multiPayMode) setSelectedPayees([]);
    setOpenPayeeId(null);
    setCurrentPage(1);
  }, [multiPayMode, data]);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, data.length);
  const currentData = data.slice(startIndex, endIndex);

  // --- DELETE LOGIC ---
  const deletePayeeService = async (payeeId: string) => {
    const sessionToken = sessionStorage.getItem("claimsToken");
    const userProfile = JSON.parse(sessionStorage.getItem('userProfile') || '{}');
    const userName = userProfile?.user_attributes?.UserName;

    try {
        const finalPayload = { payeeId: payeeId, reqChannel: "DCP" };
        const res = await fetch("/api/payment-bill-DeletePayee", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: sessionToken, kuid: userName, payload: finalPayload })
        });

        const result = await res.json();
        if (result.opstatus === 0) {
            const action = result.CustomPayeeAction?.[0];
            if (action?.referenceNo) {
              await createNewApprovalRequest(action.referenceNo);
          }
            setResultPopup({
                isOpen: true,
                type: action?.responseCode === "01" ? 'error' : 'success',
                title: 'Request Status',
                message: action?.responseMessage || "Processed successfully"
            });
        }
    } catch (err) {
        alert("Network Error: Could not delete payee.");
    }
  };

  const handleConfirmDelete = () => {
    if (selectedPayeeForDelete) {
      deletePayeeService(selectedPayeeForDelete.payeeId);
      setIsDeleteModalOpen(false);
    }
  };
  const handleResultPopupClose = () => {
   
    setResultPopup(prev => ({ ...prev, isOpen: false }));
    if (resultPopup.type === 'success') {
        window.location.reload(); // Isse list update ho jayegi
    }
       
    };

  //create a new request
  const createNewApprovalRequest = async (referenceNo: string) => {
    const sessionToken = sessionStorage.getItem("claimsToken");
    const userProfile = JSON.parse(sessionStorage.getItem('userProfile') || '{}');
    const userAttr = userProfile?.user_attributes;
  
    const approvalPayload = {
      requesterId: userAttr?.userId, 
      contractId: userAttr?.contractId ,
      coreCustomerId: userAttr?.coreCustomerId ,
      referenceNo: referenceNo, 
      featureActionId: "BILL_PAY_DELETE_PAYEES",
      remarks: `DELETE BILL REQUEST FROM ${userAttr?.UserName || 'USER'}`,
    };
  
    try {
      const res = await fetch("/api/payment-bill-createANewRequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          token: sessionToken, 
          payload: approvalPayload 
        })
      });
  
      const data = await res.json();
      if (data.opstatus === 0) {
        console.log("Approval Matrix Entry Created:", data.ApprovalMatrix[0].reqResponse);
      }
    } catch (err) {
      console.error("Approval Request Error:", err);
    }
  };
  // Pagination & Selection Helpers
  const handleRowToggle = (consumerNumber: string) => {
   setOpenPayeeId(prevId => (prevId === consumerNumber ? null : consumerNumber));
  };
  const handlePreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  // PayeeTable ke andar handleSelectAll ko update karein:
const handleSelectAll = (checked: boolean) => {
  if (checked) {
    // Sirf wo payees filter karein jo overdue nahi hain
    const validPayees = currentData
      .filter(p => !isOverdue(p.dueDate))
      .map(p => p.consumerNumber);
    
    if (validPayees.length < currentData.length) {
       // Optional: User ko batane ke liye ke kuch records select nahi hue
       console.log("Some expired records were skipped");
    }
    setSelectedPayees(validPayees);
  } else {
    setSelectedPayees([]);
  }
};
  const handleSelectionChange = (id: string, checked: boolean) => setSelectedPayees(prev => checked ? [...prev, id] : prev.filter(cn => cn !== id));

  const isAllSelected = currentData.length > 0 && selectedPayees.length === currentData.length;
  const handleContinueToPay = () => {
    if (selectedPayees.length > 0) {
      const selectedRecords = data.filter(p => selectedPayees.includes(p.consumerNumber));
      
      // Agle page ke liye data taiyar karein
      sessionStorage.setItem('pending_payment_consumers', selectedPayees.join(','));
      sessionStorage.setItem('total_payable_amount', totalPayableAmount.toString());
      sessionStorage.setItem('selected_payees_data', JSON.stringify(selectedRecords));
  
      router.push('/bill-payment/pay');
    }
  };
  return (
    <div className={cn("relative rounded-lg border bg-card shadow-sm mt-4", hasSelected && multiPayMode ? "pb-24" : "")}>
      {/* CONFIRMATION MODAL */}
      <DeleteConfirmPopup 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleConfirmDelete} 
        title={selectedPayeeForDelete?.payeeNickName}
      />

      {/* FINAL RESULT MODAL */}
      <ResultPopup 
       isOpen={resultPopup.isOpen} 
       onClose={handleResultPopupClose} // Yahan update kiya
       type={resultPopup.type}
       title={resultPopup.title}
       message={resultPopup.message}
      />

      <Table>
        <TableHeader>
          <TableRow style={{ backgroundColor: '#ECECEC8C' }}>
            {multiPayMode && (
              <TableHead className="w-12 text-center">
                <Checkbox checked={isAllSelected} onCheckedChange={(checked) => handleSelectAll(Boolean(checked))} />
              </TableHead>
            )}
            <TableHead>Consumer Name</TableHead>
            <TableHead>Biller Type</TableHead>
            <TableHead>Consumer / Account Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            [...Array(ITEMS_PER_PAGE)].map((_, i) => (
              <TableRow key={i}><TableCell colSpan={6}><Skeleton className="h-10 w-full" /></TableCell></TableRow>
            ))
          ) : currentData.length > 0 ? (
            currentData.map((payee) => (
              <PayeeRow 
                key={payee.consumerNumber} 
                payee={payee}
                isOpen={openPayeeId === payee.consumerNumber}
                onToggle={() => handleRowToggle(payee.consumerNumber)}
                multiPayMode={multiPayMode}
                isSelected={selectedPayees.includes(payee.consumerNumber)}
                onSelectionChange={(checked) => handleSelectionChange(payee.consumerNumber, checked)}
                onDelete={(p) => { setSelectedPayeeForDelete(p); setIsDeleteModalOpen(true); }}
                onViewActivity={onViewActivity}
              />
            ))
          ) : (
             <TableRow>
              <TableCell colSpan={6} className="h-48 text-center font-semibold text-muted-foreground">No Payees Found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* --- MULTI-PAY FOOTER --- */}
      {multiPayMode && selectedPayees.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-10px_20px_rgba(0,0,0,0.1)] p-4 z-[100] animate-in slide-in-from-bottom duration-300">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 font-medium italic">
                {selectedPayees.length} Payees selected for payment
              </span>
              <span className="text-lg font-bold text-[#00529B]">
          Total: PKR {totalPayableAmount.toLocaleString()}
        </span>
            </div>

            <div className="flex gap-4 items-center">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedPayees([])}
                className="text-gray-500 hover:text-red-500"
              >
                Clear Selection
              </Button>
              <Button 
                onClick={handleContinueToPay}
                className="bg-[#00529B] hover:bg-[#003f75] text-white px-10 h-11 rounded-md font-semibold flex items-center gap-2"
              >
                Continue to Pay
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14m-7-7 7 7-7 7"/>
                </svg>
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-center p-4 border-t">
          <Button variant="ghost" size="icon" onClick={handlePreviousPage} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="text-sm text-muted-foreground mx-4">
              {data.length > 0 ? `${startIndex + 1} - ${endIndex} of ${data.length} Payees` : '0 Payees'}
          </span>
          <Button variant="ghost" size="icon" onClick={handleNextPage} disabled={currentPage === totalPages || data.length === 0}><ChevronRight className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}