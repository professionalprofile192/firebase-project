
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
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Edit, Trash2, BarChart2, AlertTriangle } from 'lucide-react';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { Checkbox } from '../ui/checkbox';
import { Skeleton } from '../ui/skeleton';

export type Payee = {
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
};

interface PayeeTableProps {
  data: Payee[];
  multiPayMode: boolean;
  loading?: boolean;
}

const ITEMS_PER_PAGE = 8;

function PayeeRow({ 
  payee, 
  isOpen, 
  onToggle, 
  multiPayMode,
  isSelected,
  onSelectionChange
}: { 
  payee: Payee, 
  isOpen: boolean, 
  onToggle: () => void,
  multiPayMode: boolean,
  isSelected: boolean,
  onSelectionChange: (checked: boolean) => void
}) {
  
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleRowClick = () => {
    if (!multiPayMode) {
      onToggle();
    }
  }

  return (
    <>
      <TableRow onClick={handleRowClick} className={cn({'cursor-pointer': !multiPayMode})}>
        {multiPayMode && (
          <TableCell className="w-12 text-center" onClick={stopPropagation}>
            <Checkbox 
              checked={isSelected} 
              onCheckedChange={(checked) => onSelectionChange(Boolean(checked))}
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
          <span className="text-foreground">{payee.status}</span>
        </TableCell>
        <TableCell className="text-right">
              <div className='flex items-center justify-end gap-2' onClick={stopPropagation}>
                <Button variant="ghost" size="icon" className="p-2 h-auto w-auto" onClick={onToggle}>
                    {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
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
                    <Button variant="outline" size="sm"><BarChart2 className="h-4 w-4 mr-1" /> View Activity</Button>
                    <Button variant="outline" size="sm"><Edit className="h-4 w-4 mr-1" /> Edit</Button>
                    <Button variant="outline" size="icon" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
                </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export function PayeeTable({ data, multiPayMode, loading }: PayeeTableProps) {
  const [openPayeeId, setOpenPayeeId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPayees, setSelectedPayees] = useState<string[]>([]);
  
  useEffect(() => {
    if (!multiPayMode) {
      setSelectedPayees([]);
    }
    setOpenPayeeId(null);
    setCurrentPage(1);
  }, [multiPayMode, data]);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, data.length);
  const currentData = data.slice(startIndex, endIndex);

  const handleRowToggle = (consumerNumber: string) => {
    if (!multiPayMode) {
      setOpenPayeeId(prevId => (prevId === consumerNumber ? null : consumerNumber));
    }
  };
  
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPayees(currentData.map(p => p.consumerNumber));
    } else {
      setSelectedPayees([]);
    }
  }

  const handleSelectionChange = (consumerNumber: string, checked: boolean) => {
    if (checked) {
      setSelectedPayees(prev => [...prev, consumerNumber]);
    } else {
      setSelectedPayees(prev => prev.filter(cn => cn !== consumerNumber));
    }
  }

  const isAllSelected = currentData.length > 0 && selectedPayees.length === currentData.length;


  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm mt-4">
      <Table>
        <TableHeader>
          <TableRow style={{ backgroundColor: '#ECECEC8C' }}>
            {multiPayMode && (
              <TableHead className="w-12 text-center">
                <Checkbox 
                  checked={isAllSelected}
                  onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                />
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
              <TableRow key={i}>
                <TableCell colSpan={multiPayMode ? 6 : 5}>
                  <Skeleton className="h-10 w-full" />
                </TableCell>
              </TableRow>
            ))
          ) : currentData.length > 0 ? (
            currentData.map((payee) => (
              <PayeeRow 
                key={payee.consumerNumber} 
                payee={payee}
                isOpen={!multiPayMode && openPayeeId === payee.consumerNumber}
                onToggle={() => handleRowToggle(payee.consumerNumber)}
                multiPayMode={multiPayMode}
                isSelected={selectedPayees.includes(payee.consumerNumber)}
                onSelectionChange={(checked) => handleSelectionChange(payee.consumerNumber, checked)}
              />
            ))
          ) : (
             <TableRow>
              <TableCell colSpan={multiPayMode ? 6 : 5} className="h-48">
                 <div className="flex flex-col items-center justify-center gap-4 py-10 h-full">
                    <p className="font-semibold text-lg text-muted-foreground">No Payees Found</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
       <div className="flex items-center justify-center p-4 border-t">
            <Button variant="ghost" size="icon" onClick={handlePreviousPage} disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground mx-4">
                {data.length > 0 ? `${startIndex + 1} - ${endIndex} of ${data.length} Payees` : '0 Payees'}
            </span>
            <Button variant="ghost" size="icon" onClick={handleNextPage} disabled={currentPage === totalPages || data.length === 0}>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    </div>
  );
}
