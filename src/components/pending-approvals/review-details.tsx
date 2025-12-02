
'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { format } from "date-fns";
import type { Approval } from "@/app/pending-approvals/page";
import { ScanLine } from "lucide-react";

interface ReviewDetailsProps {
    approval: Approval;
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

export function ReviewDetails({ approval }: ReviewDetailsProps) {
    let notes = null;
    try {
        notes = approval.notes2 ? JSON.parse(approval.notes2) : (approval.notes ? JSON.parse(approval.notes) : null);
    } catch (e) {
        // Notes are not a valid JSON
    }

    let innerNotes = null;
    if (notes?.notes) {
        try {
        innerNotes = JSON.parse(notes.notes);
        } catch (e) {
        // notes.notes is not a valid JSON
        }
    }
    const reviewContext = notes?.reviewContext;
    const isBillPayment = approval.featureActionId === 'BILL_PAY_CREATE_PAYEES';
    
    const details = [
        { label: "Reference Number", value: approval.referenceNo },
        { label: "Biller Type", value: isBillPayment ? innerNotes?.typeVal : null },
        { label: "Biller Institution", value: isBillPayment ? innerNotes?.instVal : null },
        { label: "Consumer/Account Number", value: isBillPayment ? innerNotes?.consumerNo : (approval.fromAccountNumber || reviewContext?.otherDetails?.fromAccount) },
        { label: "Consumer Name", value: isBillPayment ? notes?.nickName : (reviewContext?.payeeName) },
        { label: "Payee Nickname", value: isBillPayment ? notes?.nickName : null },
        { label: "Date Submitted", value: format(new Date(approval.assignedDate), 'dd/MM/yyyy h:mm a') },
        { label: "Effective Date", value: format(new Date(approval.assignedDate), 'dd/MM/yyyy h:mm a') },
        { label: "Transaction Type", value: approval.transactionType2 },
        { label: "Approval Status", value: approval.status || "Pending" }
    ];

    return (
        <Card className="shadow-lg">
            <CardHeader className="bg-primary text-primary-foreground p-4 rounded-t-lg flex-row items-center gap-4">
                <ScanLine className="w-6 h-6" />
                <div>
                    <h2 className="text-lg font-semibold">Transaction Details</h2>
                    <p className="text-sm">{approval.transactionType2}</p>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                    {details.map(detail => (
                        <DetailRow key={detail.label} label={detail.label} value={detail.value} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

