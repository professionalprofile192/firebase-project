'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Transaction } from "@/app/account-statement/page";
import { format } from "date-fns";
import Link from "next/link";
import { ScrollArea } from "../ui/scroll-area";

interface TransactionsListProps {
    transactions: Transaction[];
}

export function TransactionsList({ transactions }: TransactionsListProps) {
    const formatAmount = (amount: string) => new Intl.NumberFormat('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(parseFloat(amount));
    
    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <CardTitle className="text-base">Transactions</CardTitle>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                     <Select defaultValue="pdf">
                        <SelectTrigger className="w-full sm:w-[150px]">
                            <SelectValue placeholder="Download As" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pdf">Download As: PDF</SelectItem>
                            <SelectItem value="excel">Download As: Excel</SelectItem>
                        </SelectContent>
                    </Select>
                     <Select defaultValue="all">
                        <SelectTrigger className="w-full sm:w-[120px]">
                            <SelectValue placeholder="View" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">View: All</SelectItem>
                            <SelectItem value="debit">View: Debit</SelectItem>
                            <SelectItem value="credit">View: Credit</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
                <ScrollArea className="h-full w-full">
                <Table>
                    <TableHeader>
                        <TableRow>
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
                                    <TableCell className="min-w-[250px]">{tx.particulars}</TableCell>
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
                                        }}>
                                            <Button variant="outline" size="sm">View</Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
