
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { type TransferActivity } from "./transfer-activity-table";
import { ScanLine } from "lucide-react";

interface TransferReviewDetailsProps {
    activity: TransferActivity;
}

const DetailRow = ({ label, value }: { label: string, value: string | undefined | null }) => {
    if (!value) return null;
    return (
        <div className="flex justify-between items-center text-sm py-3 border-b last:border-none">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-semibold text-right break-all">{value}</span>
        </div>
    )
}


export function TransferReviewDetails({ activity }: TransferReviewDetailsProps) {

    const details = [
        { label: "Post Date", value: activity.postDate },
        { label: "Transaction Number", value: activity.transactionNumber },
        { label: "Transaction Type", value: activity.transactionType },
        { label: "Transaction Date", value: activity.transactionDate },
        { label: "From Account Name", value: activity.fromAccountName },
        { label: "From Account", value: activity.fromAccount },
        { label: "To Account Name", value: activity.toAccountName },
        { label: "To Account", value: activity.accountNumber },
        { label: "Amount Debited", value: `PKR ${activity.amount}` },
    ];

    return (
        <Card className="shadow-lg">
            <div className="bg-primary text-primary-foreground p-4 rounded-t-lg flex items-center gap-4">
                <ScanLine className="w-6 h-6" />
                <div>
                    <h2 className="text-lg font-semibold">Review Details</h2>
                    <p className="text-sm">UBL</p>
                </div>
            </div>
            <CardContent className="p-6">
                 <div className="grid grid-cols-1">
                    {details.map(detail => (
                        <DetailRow key={detail.label} label={detail.label} value={detail.value} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
