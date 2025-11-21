'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Transaction } from "@/app/account-statement/page";
import { format } from "date-fns";

interface TransactionsListProps {
    transactions: Transaction[];
}

export function TransactionsList({ transactions }: TransactionsListProps) {
    const formatAmount = (amount: string) => new Intl.NumberFormat('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(parseFloat(amount));
    
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Transactions</CardTitle>
                <div className="flex items-center gap-2">
                     <Select defaultValue="pdf">
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Download As" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pdf">Download As: PDF</SelectItem>
                            <SelectItem value="excel">Download As: Excel</SelectItem>
                        </SelectContent>
                    </Select>
                     <Select defaultValue="all">
                        <SelectTrigger className="w-[120px]">
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
            <CardContent>
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
                            return (
                                <TableRow key={tx.seqno}>
                                    <TableCell>{format(date, 'dd/MM/yyyy')}</TableCell>
                                    <TableCell className="max-w-xs truncate">{tx.particulars}</TableCell>
                                    <TableCell className="text-right">
                                        {tx.CRDR === 'D' ? formatAmount(tx.tranAmt) : '-'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {tx.CRDR === 'C' ? formatAmount(tx.tranAmt) : '-'}
                                    </TableCell>
                                    <TableCell className="text-right">{formatAmount(tx.runBal)}</TableCell>
                                    <TableCell className="text-center">
                                        <Button variant="outline" size="sm">View</Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
