'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { format } from "date-fns";
import { ScanLine } from "lucide-react";

type TransactionDetail = {
    tranDate: string;
    fromAccount: string;
    accountTitle: string;
    tranAmt: string;
    runBal: string;
    particulars: string;
}

interface TransactionDetailsCardProps {
    transaction: TransactionDetail;
}

export function TransactionDetailsCard({ transaction }: TransactionDetailsCardProps) {
    
    const formatCurrency = (amount: string) => {
        return `PKR ${new Intl.NumberFormat('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(parseFloat(amount))}`;
    }

    const details = [
        { label: "Post Date", value: format(new Date(transaction.tranDate), 'dd/MM/yyyy') },
        { label: "From Account", value: transaction.fromAccount },
        { label: "Account Name", value: transaction.accountTitle },
        { label: "Status", value: "Success" },
        { label: "Amount", value: formatCurrency(transaction.tranAmt) },
        { label: "Balance Amount", value: formatCurrency(transaction.runBal) },
    ];

    return (
        <Card className="shadow-lg">
            <CardHeader className="bg-primary text-primary-foreground p-4 rounded-t-lg flex-row items-center gap-4">
                <ScanLine className="w-6 h-6" />
                <div>
                    <h2 className="text-lg font-semibold">Review Details</h2>
                    <p className="text-sm">UBL</p>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {details.map(detail => (
                        <div key={detail.label} className="flex justify-between items-center text-sm border-b pb-2">
                            <span className="text-muted-foreground">{detail.label}</span>
                            <span className="font-semibold text-right">{detail.value}</span>
                        </div>
                    ))}
                     <div className="md:col-span-2 flex justify-between items-center text-sm border-b pb-2">
                        <span className="text-muted-foreground">Description</span>
                        <span className="font-semibold text-right">{transaction.particulars}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
