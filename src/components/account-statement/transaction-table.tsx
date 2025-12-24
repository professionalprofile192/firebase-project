'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "../ui/button";
import { Transaction } from "@/app/account-statement/page";
import { format } from "date-fns";
import Link from "next/link";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";
import { useEffect, useState } from "react";

export type Transaction = {
    CRDR: 'C' | 'D';
    seqno: string;
    tranAmt: string;
    tranDate: string;
    particulars: string;
    runBal: string;
};

interface TransactionTableProps {
    loading?: boolean;
}

export function TransactionTable({ loading }: TransactionTableProps) {
    const [tableData, setTableData] = useState<Transaction[]>([]);

    const formatAmount = (amount: string) =>
        new Intl.NumberFormat('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(parseFloat(amount));

    useEffect(() => {
        // sessionStorage se recent transactions uthao
        const stored = sessionStorage.getItem("allTransactions");
        if (!stored) return;

        try {
            const parsed = JSON.parse(stored);
            // agar string me aa gaya ho
            const finalData: Transaction[] = typeof parsed === "string" ? JSON.parse(parsed) : parsed;
            setTableData(finalData);
        } catch (err) {
            console.error("Transaction parse error", err);
        }
    }, []);
    if (loading) {
        return (
            <Table>
                <TableHeader>
                    <TableRow style={{ backgroundColor: '#ECECEC8C' }}>
                        <TableHead>Transaction Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Debit Amount</TableHead>
                        <TableHead className="text-right">Credit Amount</TableHead>
                        <TableHead className="text-right">Running Balance</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-64" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20 float-right" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20 float-right" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-24 float-right" /></TableCell>
                            <TableCell className="text-center"><Skeleton className="h-8 w-16 mx-auto" /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }

    return (
        <ScrollArea className="h-full w-full">
            <Table>
                <TableHeader>
                    <TableRow style={{ backgroundColor: '#ECECEC8C' }}>
                        <TableHead>Transaction Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Debit Amount</TableHead>
                        <TableHead className="text-right">Credit Amount</TableHead>
                        <TableHead className="text-right">Running Balance</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tableData.map((tx) => {
                        const date = new Date(tx.tranDate);
                        const transactionData = {
                            ...tx,
                            accountTitle: 'NAWAZ ALI',
                            fromAccount: '060510224211',
                        };

                        // truncate particulars to 30 chars
                        const particularsShort = tx.particulars.length > 30 ? tx.particulars.slice(0, 30) + '...' : tx.particulars;

                        return (
                            <TableRow key={tx.seqno}>
                                <TableCell className="whitespace-nowrap">{format(date, 'dd/MM/yyyy')}</TableCell>
                                <TableCell className="min-w-[250px] break-words">{particularsShort}</TableCell>
                                <TableCell className="text-right whitespace-nowrap">
                                    {tx.CRDR === 'D' ? formatAmount(tx.tranAmt) : '-'}
                                </TableCell>
                                <TableCell className="text-right whitespace-nowrap">
                                    {tx.CRDR === 'C' ? formatAmount(tx.tranAmt) : '-'}
                                </TableCell>
                                <TableCell className="text-right whitespace-nowrap">{formatAmount(tx.runBal)}</TableCell>
                                <TableCell className="text-center">
                                    <Link href={{
                                        pathname: `/account-statement/${tx.seqno}`,
                                        query: { tx: JSON.stringify(transactionData) }
                                    }} passHref>
                                        <Button variant="outline" size="sm">View</Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </ScrollArea>
    );
}
