'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, BarChart2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import Link from 'next/link';

export type TransferActivity = {
  postDate: string;
  transactionDate: string;
  transactionNumber: string;
  transactionType: string;
  status: 'Successful' | 'Failed' | 'In Progress';
  fromAccountName: string;
  fromAccount: string;
  toAccountName: string;
  beneficiaryTitle: string;
  accountNumber: string;
  amount: string;
};

const ITEMS_PER_PAGE = 20;

const StatusIndicator = ({ status }: { status: TransferActivity['status'] }) => {
  return (
    <div className="flex items-center gap-2">
      <span className={cn('h-2 w-2 rounded-full', {
        'bg-green-500': status === 'Successful',
        'bg-red-500': status === 'Failed',
        'bg-yellow-500': status === 'In Progress'
      })}></span>
      <span>{status}</span>
    </div>
  )
}

export function TransferActivityTable() {
  const [activities, setActivities] = useState<TransferActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // --- API Fetch Function ---
  const fetchActivityEntries = useCallback(async () => {
    const profileStr = sessionStorage.getItem("userProfile");
    const claimsToken = sessionStorage.getItem("claimsToken");

    if (!profileStr || !claimsToken) return;

    const profile = JSON.parse(profileStr);
    const customerId = profile?.user_attributes?.customer_id;
    const sessionToken = claimsToken;

    if (!customerId) return;

    try {
      setLoading(true);
      const payload = {
        customerId: customerId,
        accountNumber: "",
        consumerNumber: "",
        searchString: "",
        startDate: "",
        endDate: "",
        startPosition: 0,
        endPosition: 50 // Zyada data mangwa rahe hain pagination ke liye
      };

      const response = await fetch("/api/transfer-GetTransferActivity-History", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          token: sessionToken, 
          payload: payload 
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.RegionalTransfer) {
            const mapped = data.RegionalTransfer.map((item: any) => {
                // Date conversion logic
                const dateObj = new Date(item.transferDate.replace(' ', 'T'));
                const formattedDate = dateObj.toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                }).replace(',', '');

                return {
                    postDate: item.transferDate,
                    transactionDate: formattedDate, 
                    transactionNumber: item.referenceId,
                    transactionType: item.accountType || "Transfer",
                    status: item.status === 'Successful' ? 'Successful' : (item.status === 'Cancelled' ? 'Failed' : 'In Progress'),
                    fromAccount: item.Id,
                    toAccountName: item.beneficiaryName,
                    beneficiaryTitle: item.beneficiaryName,
                    accountNumber: item.beneficiaryNo,
                    amount: item.amount
                };
            });
            setActivities(mapped);
        }
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Call API on Component Mount ---
  useEffect(() => {
    fetchActivityEntries();
  }, [fetchActivityEntries]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(activities.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, activities.length);
  const currentData = activities.slice(startIndex, endIndex);

  const handlePreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-48 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span>Loading History...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : currentData.length > 0 ? (
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
        <Button variant="ghost" size="icon" onClick={handlePreviousPage} disabled={currentPage === 1 || loading}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <span className="text-sm text-muted-foreground">
          {activities.length > 0
            ? `${startIndex + 1}-${endIndex} of ${activities.length} Transactions`
            : '0 Transactions'}
        </span>
        <Button variant="ghost" size="icon" onClick={handleNextPage} disabled={currentPage === totalPages || activities.length === 0 || loading}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </>
  );
}