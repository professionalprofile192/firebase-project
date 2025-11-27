'use client';

import { Transaction } from "@/app/account-statement/page";
import { format } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Card, CardContent } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";

interface TransactionCardsProps {
    transactions: Transaction[];
    loading?: boolean;
}

const formatAmount = (amount: string) => new Intl.NumberFormat('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(parseFloat(amount));

function TransactionCardItem({ transaction }: { transaction: Transaction }) {
    const [isOpen, setIsOpen] = useState(false);
    const date = new Date(transaction.tranDate);
    const transactionData = {
        ...transaction,
        accountTitle: 'NAWAZ ALI',
        fromAccount: '060510224211',
    };

    const truncateDescription = (description: string) => {
        const parts = description.split(":");
        if (parts.length > 1 && parts[0].startsWith('EB')) {
            const firstPart = parts[0];
            const secondPart = parts[1].split(' ')[0];
            return `${firstPart}:${secondPart}...`;
        }
        if (description.length > 30) {
            return `${description.substring(0, 30)}...`;
        }
        return description;
    }

    return (
        <Card>
            <CardContent className="p-4">
                <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                    <div className="flex flex-wrap justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-muted-foreground">{format(date, 'dd/MM/yyyy')}</p>
                            <p className="font-medium text-sm break-words truncate" title={transaction.particulars}>
                                {truncateDescription(transaction.particulars)}
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                             <Link href={{
                                pathname: `/account-statement/${transaction.seqno}`,
                                query: { tx: JSON.stringify(transactionData) }
                            }} passHref>
                                <Button variant="outline" size="sm">View</Button>
                            </Link>
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" className="w-full justify-center">
                                    Details
                                    {isOpen ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
                                    <span className="sr-only">Toggle details</span>
                                </Button>
                            </CollapsibleTrigger>
                        </div>
                    </div>
                    <CollapsibleContent className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Debit</span>
                            <span>{transaction.CRDR === 'D' ? formatAmount(transaction.tranAmt) : '-'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Credit</span>
                             <span>{transaction.CRDR === 'C' ? formatAmount(transaction.tranAmt) : '-'}</span>
                        </div>
                        <div className="flex justify-between text-sm font-semibold">
                            <span className="text-muted-foreground">Balance</span>
                            <span>{formatAmount(transaction.runBal)}</span>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </CardContent>
        </Card>
    )
}

export function TransactionCards({ transactions, loading }: TransactionCardsProps) {
    if (loading) {
        return (
            <div className="space-y-4 pr-4">
                {[...Array(5)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-4">
                            <Skeleton className="h-20 w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }
    
    return (
        <ScrollArea className="h-full">
            <div className="space-y-4 pr-4">
                {transactions.map(tx => <TransactionCardItem key={tx.seqno} transaction={tx} />)}
            </div>
        </ScrollArea>
    )
}
