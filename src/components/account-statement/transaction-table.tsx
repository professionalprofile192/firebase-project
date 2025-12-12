'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "../ui/button";
import { Transaction } from "@/app/account-statement/page";
import { format } from "date-fns";
import Link from "next/link";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";

interface TransactionTableProps {
    transactions: Transaction[];
    loading?: boolean;
}

export function TransactionTable({ transactions, loading }: TransactionTableProps) {
    const formatAmount = (amount: string) => new Intl.NumberFormat('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(parseFloat(amount));
    
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
        )
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
                    {transactions.map((tx) => {
                        const date = new Date(tx.tranDate);
                        const transactionData = {
                            ...tx,
                            accountTitle: 'NAWAZ ALI',
                            fromAccount: '060510224211',
                        }
                        return (
                            <TableRow key={tx.seqno}>
                                <TableCell className="whitespace-nowrap">{format(date, 'dd/MM/yyyy')}</TableCell>
                                <TableCell className="min-w-[250px] break-words">{tx.particulars}</TableCell>
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
                        )
                    })}
                </TableBody>
            </Table>
        </ScrollArea>
    )
}
