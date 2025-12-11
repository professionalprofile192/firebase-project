
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
import { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Edit, Trash2, BarChart2 } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

type Payee = {
  consumerName: string;
  billerType: string;
  consumerNumber: string;
  status: 'Unpaid' | 'Not Payable' | 'Paid';
  amountDue?: string;
  dueDate?: string;
  amountAfterDueDate?: string;
};

interface PayeeTableProps {
  data: Payee[];
}

const ITEMS_PER_PAGE = 8;

function PayeeRow({ payee, isOpen, onToggle }: { payee: Payee, isOpen: boolean, onToggle: () => void }) {

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'Unpaid': return 'text-red-600';
      case 'Paid': return 'text-green-600';
      default: return 'text-gray-500';
    }
  }

  const handlePayNowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Logic for 'Pay Now' will be added later
    console.log(`Pay Now clicked for ${payee.consumerNumber}`);
  };

  return (
    <>
      <TableRow onClick={onToggle} className="cursor-pointer">
        <TableCell className="font-medium">
          <div>{payee.consumerName.split(' ')[0]}</div>
          <div className="text-muted-foreground text-xs">{payee.consumerName}</div>
        </TableCell>
        <TableCell>
            <Link href="#" className="text-primary hover:underline" onClick={(e) => e.stopPropagation()}>{payee.billerType}</Link>
        </TableCell>
        <TableCell>{payee.consumerNumber}</TableCell>
        <TableCell>
          <span className={cn("font-semibold", getStatusClass(payee.status))}>{payee.status}</span>
        </TableCell>
        <TableCell className="text-right">
            <div className='flex items-center justify-end gap-2'>
              {payee.status === 'Unpaid' && 
                <Button size="sm" variant="ghost" className="hover:bg-primary/10 text-primary" onClick={handlePayNowClick}>
                    Pay Now <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              }
              <Button size="icon" variant="ghost" onClick={onToggle} className="p-2 h-auto w-auto">
                  {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
            </div>
        </TableCell>
      </TableRow>
      {isOpen && (
        <TableRow>
          <TableCell colSpan={5} className="p-0">
            <div className="bg-muted/50 p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
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

                <div className="flex items-center gap-2 justify-end md:col-start-4">
                    <Button variant="outline" size="sm"><BarChart2 className="h-4 w-4 mr-1" /> View Activity</Button>
                    <Button variant="outline" size="sm"><Edit className="h-4 w-4 mr-1" /> Edit</Button>
                    <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4 mr-1" /> Delete</Button>
                </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export function PayeeTable({ data }: PayeeTableProps) {
  const [openPayeeId, setOpenPayeeId] = useState<string | null>('01271111630306'); // Keep first one open by default as in image
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = data.slice(startIndex, endIndex);

  const handleRowToggle = (consumerNumber: string) => {
    setOpenPayeeId(prevId => (prevId === consumerNumber ? null : consumerNumber));
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
            <TableHead>Consumer Name</TableHead>
            <TableHead>Biller Type</TableHead>
            <TableHead>Consumer / Account Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.length > 0 ? (
            currentData.map((payee) => (
              <PayeeRow 
                key={payee.consumerNumber} 
                payee={payee}
                isOpen={openPayeeId === payee.consumerNumber}
                onToggle={() => handleRowToggle(payee.consumerNumber)}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No Payees Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        {data.length > 0 && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>
                <div className="flex items-center justify-between p-2">
                  <span className="text-sm text-muted-foreground">
                      {startIndex + 1} - {Math.min(endIndex, data.length)} Payee
                  </span>
                  <div className="flex items-center">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  );
}
