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
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

type Payee = {
  consumerName: string;
  billerType: string;
  consumerNumber: string;
  status: string;
};

interface PayeeTableProps {
  data: Payee[];
}

const ITEMS_PER_PAGE = 8;

function PayeeRow({ payee, isOpen, onToggle }: { payee: Payee, isOpen: boolean, onToggle: () => void }) {

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{payee.consumerName}</TableCell>
        <TableCell>
            <Link href="#" className="text-primary hover:underline">{payee.billerType}</Link>
        </TableCell>
        <TableCell>{payee.consumerNumber}</TableCell>
        <TableCell>
          <Badge variant="secondary" className="bg-gray-200 text-gray-700">{payee.status}</Badge>
        </TableCell>
        <TableCell className="text-right">
             <Button size="sm" variant="ghost" onClick={onToggle}>
                <ChevronDown className={cn("h-5 w-5 transition-transform", { "rotate-180": isOpen })} />
             </Button>
        </TableCell>
      </TableRow>
      {isOpen && (
        <TableRow>
          <TableCell colSpan={5} className="p-0">
            <div className="bg-muted/50 p-4 grid grid-cols-4 gap-4 items-center">
                <p className="text-sm text-muted-foreground">Additional details can be shown here.</p>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export function PayeeTable({ data }: PayeeTableProps) {
  const [openPayeeId, setOpenPayeeId] = useState<string | null>(null);
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
                  <div></div>
                  <div className="flex items-center gap-4">
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
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  );
}
