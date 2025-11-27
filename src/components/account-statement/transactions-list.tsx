'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Transaction } from "@/app/account-statement/page";
import { useIsMobile } from "@/hooks/use-mobile";
import { TransactionTable } from "./transaction-table";
import { TransactionCards } from "./transaction-cards";

interface TransactionsListProps {
    transactions: Transaction[];
    loading?: boolean;
}

export function TransactionsList({ transactions, loading }: TransactionsListProps) {
    const isMobile = useIsMobile();
    
    return (
        <Card className="h-full flex flex-col flex-1">
            <CardHeader className="flex flex-col md:flex-row sm:flex-row items-start md:items-center sm:items-center justify-between gap-4">
                <CardTitle className="text-base">Transactions</CardTitle>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                     <Select defaultValue="pdf">
                        <SelectTrigger className="w-full sm:w-[150px]">
                            <SelectValue placeholder="Download As" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="excel">Excel</SelectItem>
                        </SelectContent>
                    </Select>
                     <Select defaultValue="range">
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="View" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="range" disabled>Select Range</SelectItem>
                            <SelectItem value="last10transactions">Last 10 Transactions</SelectItem>
                            <SelectItem value="last10days">Last 10 Days</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
                {isMobile ? (
                    <TransactionCards transactions={transactions} loading={loading} />
                ) : (
                    <TransactionTable transactions={transactions} loading={loading} />
                )}
            </CardContent>
        </Card>
    )
}
