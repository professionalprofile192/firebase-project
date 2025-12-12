
'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import Link from 'next/link';

export type TransferActivity = {
  postDate: string;
  transactionDate: string;
  transactionNumber: string;
  transactionType: string;
  status: 'Completed' | 'Failed' | 'In Progress';
  fromAccountName: string;
  fromAccount: string;
  toAccountName: string;
  beneficiaryTitle: string;
  accountNumber: string; // This is 'To Account'
  amount: string;
};

interface TransferActivityTableProps {
  activities: TransferActivity[];
}

const ITEMS_PER_PAGE = 20;

const StatusIndicator = ({ status }: { status: TransferActivity['status'] }) => {
    return (
        <div className="flex items-center gap-2">
            <span className={cn('h-2 w-2 rounded-full', {
                'bg-green-500': status === 'Completed',
                'bg-red-500': status === 'Failed',
                'bg-yellow-500': status === 'In Progress'
            })}></span>
            <span>{status}</span>
        </div>
    )
}

export function TransferActivityTable({ activities }: TransferActivityTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(activities.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, activities.length);
    const currentData = activities.slice(startIndex, endIndex);

    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    }

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    }

  return (
    <>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm mt-4">
            <ScrollArea>
                <Table>
                    <TableHeader>
                    <TableRow style={{ backgroundColor: '#ECECEC8C' }}>
                        <TableHead>Transaction Date</TableHead>
                        <TableHead>Transaction Number</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Beneficiary Title</TableHead>
                        <TableHead>Account Number</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {currentData.length > 0 ? (
                        currentData.map((activity) => (
                        <TableRow key={activity.transactionNumber}>
                            <TableCell>{activity.transactionDate}</TableCell>
                            <TableCell>{activity.transactionNumber}</TableCell>
                            <TableCell>
                                <StatusIndicator status={activity.status} />
                            </TableCell>
                            <TableCell>{activity.beneficiaryTitle}</TableCell>
                            <TableCell>{activity.accountNumber}</TableCell>
                            <TableCell>PKR {activity.amount}</TableCell>
                            <TableCell className="text-center">
                                <Link href={{
                                    pathname: '/transfer/review',
                                    query: { activity: JSON.stringify(activity) }
                                }} passHref>
                                    <Button variant="outline" size="sm">
                                        Print <BarChart2 className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} className="h-48 text-center text-muted-foreground">
                                No Record Found
                            </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
            </ScrollArea>
        </div>
        <div className="flex items-center justify-between mt-4">
             <Button variant="ghost" size="icon" onClick={handlePreviousPage} disabled={currentPage === 1}>
                <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {activities.length > 0
                ? `${startIndex + 1}-${endIndex} of ${activities.length} Transactions`
                : '0 Transactions'}
            </span>
             <Button variant="ghost" size="icon" onClick={handleNextPage} disabled={currentPage === totalPages || activities.length === 0}>
                <ChevronRight className="h-5 w-5" />
            </Button>
        </div>
    </>
  );
}
