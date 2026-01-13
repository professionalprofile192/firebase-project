'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, BarChart2, Loader2, Search, Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  const [userAccounts, setUserAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewFilter, setViewFilter] = useState<string>("all");

  // --- 1. Account Selection Fix ---
  useEffect(() => {
    const accountsStr = sessionStorage.getItem("accounts");
    if (accountsStr) {
      try {
        const parsedData = JSON.parse(accountsStr);
        // Ensure we are getting the payments array correctly
        const accountsList = parsedData.payments || (Array.isArray(parsedData) ? parsedData : []);
        setUserAccounts(accountsList);
      } catch (e) {
        console.error("Error parsing accounts", e);
      }
    }
  }, []);

  const fetchActivityEntries = useCallback(async () => {
    const profileStr = sessionStorage.getItem("userProfile");
    const claimsToken = sessionStorage.getItem("claimsToken");

    if (!profileStr || !claimsToken) return;

    const profile = JSON.parse(profileStr);
    const customerId = profile?.user_attributes?.customer_id;

    if (!customerId) return;

    try {
      setLoading(true);
      const payload = {
        customerId: customerId,
        accountNumber: selectedAccount === "all" ? "" : selectedAccount,
        consumerNumber: "",
        searchString: "", // Frontend filtering will handle search for better UX
        startDate: "",
        endDate: "",
        startPosition: 0,
        endPosition: 50
      };

      const response = await fetch("/api/transfer-GetTransferActivity-History", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: claimsToken, payload: payload })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.RegionalTransfer) {
            const mapped = data.RegionalTransfer.map((item: any) => {
                const dateObj = new Date(item.transferDate.replace(' ', 'T'));
                const formattedDate = dateObj.toLocaleString('en-GB', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: 'numeric', minute: '2-digit', hour12: true,
                }).replace(',', '');

                return {
                    postDate: item.transferDate,
                    transactionDate: formattedDate, 
                    transactionNumber: item.referenceId || item.transactionID || "N/A",
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
  }, [selectedAccount]); 

  useEffect(() => {
    fetchActivityEntries();
  }, [fetchActivityEntries]);

  // --- 2. MULTI-TERM SEARCH LOGIC (Status, Date, Number) ---
  const filteredActivities = useMemo(() => {
    let result = [...activities];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((activity) =>
        activity.status.toLowerCase().includes(query) ||
        activity.transactionDate.toLowerCase().includes(query) ||
        activity.transactionNumber.toLowerCase().includes(query)
      );
    }
    if (viewFilter === "last10days") {
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
      
      result = result.filter((activity) => {
        // activity.postDate "2025-12-19 23:59:15.0" format mein hai
        const activityDate = new Date(activity.postDate.replace(' ', 'T'));
        return activityDate >= tenDaysAgo;
      });
    } 
    else if (viewFilter === "last10transactions") {
      // Sirf top 10 transactions dikhayega
      result = result.slice(0, 10);
    }
  
    return result;
  }, [activities, searchQuery, viewFilter]);

  // Pagination on filtered data
  const totalPages = Math.ceil(filteredActivities.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredActivities.length);
  const currentData = filteredActivities.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* 1. Header Section: Title aur Download Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Transfer Activity</h1>
        <Button variant="outline" className="flex items-center gap-2 border-slate-200 shadow-sm bg-white">
          <Download className="h-4 w-4" /> Download
        </Button>
      </div>

      {/* 2. Filters Section: Search Bar aur Dropdowns */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search" 
            className="pl-10 bg-slate-100 border-none h-11 focus-visible:ring-1 focus-visible:ring-slate-200"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }} 
          />
        </div>

        {/* Account Select */}
        <Select value={selectedAccount} onValueChange={setSelectedAccount}>
          <SelectTrigger className="w-full sm:w-[280px] h-11 border-slate-200 bg-white">
            <SelectValue placeholder="Select Account" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Accounts</SelectItem>
            {userAccounts.map((acc, index) => (
              <SelectItem key={index} value={acc.ACCT_NO}>
                <div className="flex flex-col items-start text-left">
                  <span className="font-medium">{acc.ACCT_TITLE}</span>
                  <span className="text-xs text-muted-foreground">{acc.ACCT_NO}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* View Filter */}
        <Select value={viewFilter} onValueChange={(v) => { setViewFilter(v); setCurrentPage(1); }}>
          <SelectTrigger className="w-full sm:w-[200px] h-11 border-slate-200 bg-white">
            <SelectValue placeholder="View: All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">View: All</SelectItem>
            <SelectItem value="last10transactions">Last 10 Transactions</SelectItem>
            <SelectItem value="last10days">Last 10 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 3. Table Section (Jo Tabs ke niche show hoga) */}
      <div className="rounded-lg border bg-white text-card-foreground shadow-sm overflow-hidden">
        <ScrollArea className="w-full">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80">
                <TableHead className="font-semibold">Transaction Date</TableHead>
                <TableHead className="font-semibold">Transaction Number</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Beneficiary Title</TableHead>
                <TableHead className="font-semibold">Account Number</TableHead>
                <TableHead className="font-semibold">Amount</TableHead>
                <TableHead className="text-center font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-64 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                      <span className="text-slate-500">Loading history...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : currentData.length > 0 ? (
                currentData.map((activity) => (
                  <TableRow key={activity.transactionNumber} className="hover:bg-slate-50/50">
                    <TableCell>{activity.transactionDate}</TableCell>
                    <TableCell className="font-medium text-slate-700">{activity.transactionNumber}</TableCell>
                    <TableCell><StatusIndicator status={activity.status} /></TableCell>
                    <TableCell>{activity.beneficiaryTitle}</TableCell>
                    <TableCell className="font-mono text-sm">{activity.accountNumber}</TableCell>
                    <TableCell className="font-semibold text-slate-900 text-nowrap">PKR {activity.amount}</TableCell>
                    <TableCell className="text-center">
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          Print <BarChart2 className="ml-2 h-4 w-4" />
                        </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-48 text-center text-muted-foreground">
                    No records found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* 4. Pagination Section */}
      <div className="flex items-center justify-between border-t pt-4">
        <div className="text-sm text-muted-foreground">
           Showing {filteredActivities.length > 0 ? startIndex + 1 : 0} to {endIndex} of {filteredActivities.length} transactions
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
            disabled={currentPage === 1 || loading}
            className="h-9 px-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
            disabled={currentPage === totalPages || filteredActivities.length === 0 || loading}
            className="h-9 px-4"
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}