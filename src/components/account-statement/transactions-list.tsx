'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Transaction } from "@/app/account-statement/page";
import { useIsMobile } from "@/hooks/use-mobile";
import { TransactionTable } from "./transaction-table";
import { TransactionCards } from "./transaction-cards";
import { useState } from "react";
import { DateRangeDialog } from "./date-range-dialog";

interface TransactionsListProps {
    transactions: Transaction[];
    loading?: boolean;
}

export function TransactionsList({ transactions, loading }: TransactionsListProps) {
    const isMobile = useIsMobile();
    const [showDateRangeDialog, setShowDateRangeDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState<'view' | 'download'>('view');
    
    const handleViewChange = (value: string) => {
        if (value === 'range') {
            setDialogMode('view');
            setShowDateRangeDialog(true);
        }
        // Handle other view options if necessary
    }

    const handleDownload = (value: string) => {
        // Any download option will trigger the date range dialog
        if (value) {
            setDialogMode('download');
            setShowDateRangeDialog(true);
        }
    }

    return (
        <>
            <Card className="h-full flex flex-col flex-1 rounded-md">
                <CardHeader className="flex flex-col md:flex-row sm:flex-row rounded-md items-start md:items-center sm:items-center justify-between bg-[#f2f2f2] p-3">
                    <CardTitle className="text-[18px] text-gray-700">Transactions</CardTitle>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                        <Select onValueChange={handleDownload}>
                            <SelectTrigger className="w-full sm:w-[150px]">
                                <SelectValue placeholder="Download As" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pdf">PDF</SelectItem>
                                <SelectItem value="csv">CSV</SelectItem>
                                <SelectItem value="xls">XLS</SelectItem>
                                <SelectItem value="xlsx">XLSX</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select onValueChange={handleViewChange}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="View" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="range">Select Range</SelectItem>
                                <SelectItem value="last10transactions">Last 10 Transactions</SelectItem>
                                <SelectItem value="last10days">Last 10 Days</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto p-0 sm:p-6">
                    {isMobile ? (
                        <TransactionCards transactions={transactions} loading={loading} />
                    ) : (
                        <TransactionTable transactions={transactions} loading={loading} />
                    )}
                </CardContent>
            </Card>
            <DateRangeDialog 
                open={showDateRangeDialog} 
                onOpenChange={setShowDateRangeDialog} 
                mode={dialogMode}
            />
        </>
    )
}
