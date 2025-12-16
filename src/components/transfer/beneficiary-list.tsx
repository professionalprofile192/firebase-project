
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  BarChart2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export type Beneficiary = {
  name: string;
  secondaryName: string;
  accountNumber: string;
  bankName: string;
};

interface BeneficiaryListProps {
  beneficiaries: Beneficiary[];
}

const ITEMS_PER_PAGE = 10;

function BeneficiaryRow({
  beneficiary,
  isOpen,
  onToggle,
}: {
  beneficiary: Beneficiary;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b">
      <div className="flex items-center px-4 py-3">
        <div className="flex-1 w-1/3">
          <p className="font-semibold text-sm">{beneficiary.name}</p>
          <p className="text-xs text-muted-foreground">{beneficiary.secondaryName}</p>
        </div>
        <div className="flex-1 w-1/3">
          <a href="#" className="text-primary hover:underline text-sm">
            {beneficiary.accountNumber}
          </a>
        </div>
        <div className="flex-1 w-1/3 text-sm">{beneficiary.bankName}</div>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
                Transfer Now
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9" onClick={onToggle}>
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                <span className="sr-only">Toggle Details</span>
            </Button>
        </div>
      </div>
      {isOpen && (
        <div className="bg-muted/50 px-4 py-3">
          <div className="flex justify-end items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  <Link href="/transfer?tab=activity">
                    <BarChart2 className="h-4 w-4 mr-1" /> View Activity
                  </Link>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                  <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
              </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function BeneficiaryList({ beneficiaries }: BeneficiaryListProps) {
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(beneficiaries.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, beneficiaries.length);
  const currentData = beneficiaries.slice(startIndex, endIndex);

  const handleRowToggle = (accountNumber: string) => {
    setOpenRow(prev => (prev === accountNumber ? null : accountNumber));
  };
  
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }

  return (
    <div className="mt-4 rounded-lg border bg-card text-card-foreground shadow-sm">
      {/* Header */}
      <div className="flex items-center px-4 py-2 border-b bg-muted/50">
        <div className="flex-1 w-1/3 text-xs font-semibold text-muted-foreground">Beneficiary Details</div>
        <div className="flex-1 w-1/3 text-xs font-semibold text-muted-foreground">Account Number</div>
        <div className="flex-1 w-1/3 text-xs font-semibold text-muted-foreground">Bank Name</div>
        <div className="w-48 text-xs font-semibold text-muted-foreground text-right pr-4">Actions</div>
      </div>

      {/* Body */}
      <div>
        {currentData.length > 0 ? (
          currentData.map(b => (
            <BeneficiaryRow
              key={b.accountNumber}
              beneficiary={b}
              isOpen={openRow === b.accountNumber}
              onToggle={() => handleRowToggle(b.accountNumber)}
            />
          ))
        ) : (
          <div className="p-6 text-center text-muted-foreground">No beneficiaries found.</div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-4 border-t">
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handlePreviousPage} disabled={currentPage === 1}>
                <ChevronLeft className="h-5 w-5" />
            </Button>
             <Button variant="ghost" size="icon" onClick={handleNextPage} disabled={currentPage === totalPages}>
                <ChevronRight className="h-5 w-5" />
            </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {beneficiaries.length > 0 ? `${startIndex + 1} - ${endIndex} of ${beneficiaries.length} Beneficiaries` : '0 Beneficiaries'}
        </div>
      </div>
    </div>
  );
}
