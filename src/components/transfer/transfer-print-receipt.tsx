
'use client';

import Image from "next/image";
import { type TransferActivity } from "./transfer-activity-table";

interface TransferPrintReceiptProps {
    activity: TransferActivity;
}

const DetailRow = ({ label, value }: { label: string, value: string | undefined | null }) => {
    if (!value) return null;
    return (
        <div className="flex justify-between items-center text-sm py-2 border-b">
            <span className="text-gray-600">{label}</span>
            <span className="font-medium text-right break-all">{value}</span>
        </div>
    )
}

// A simple number to words converter for small amounts
const toWords = (num: number): string => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if (num === 0) return 'Zero';
    
    let words = '';

    if (num >= 1000) {
        words += toWords(Math.floor(num / 1000)) + ' Thousand ';
        num %= 1000;
    }

    if (num >= 100) {
        words += ones[Math.floor(num / 100)] + ' Hundred ';
        num %= 100;
    }
    
    if (num >= 20) {
        words += tens[Math.floor(num / 10)] + ' ';
        num %= 10;
    }

    if (num >= 10) {
        return words + teens[num - 10];
    }
    
    return (words + ones[num]).trim();
};


export function TransferPrintReceipt({ activity }: TransferPrintReceiptProps) {

    const amountNumber = parseFloat(activity.amount);
    const amountInWords = `AED ${toWords(amountNumber)} Only`.toUpperCase();

    return (
        <div className="bg-white p-8 font-sans">
            <header className="bg-[#007DC5] text-white py-4 px-8 flex justify-between items-center">
                <Image
                    src="/ubl_logo.png"
                    alt="UBL Logo"
                    width={100}
                    height={40}
                />
                <div className="text-right">
                    <p className="font-semibold">Transaction Receipt:</p>
                    <p className="text-sm">{activity.transactionDate}</p>
                </div>
            </header>

            <main className="py-8 px-10 text-gray-800">
                <p className="mb-6">This is to certify that the following amount(s) have been paid on</p>

                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-2">{activity.toAccountName}</h2>
                    <p className="text-sm">Account Number: {activity.accountNumber}</p>
                    <p className="text-sm">Status: {activity.status}</p>
                </div>

                <div>
                    <h3 className="text-xl font-bold border-b-2 border-black pb-2 mb-2">Details</h3>
                    <DetailRow label="Post Date" value={activity.postDate} />
                    <DetailRow label="Transaction Date" value={activity.transactionDate} />
                    <DetailRow label="To" value={activity.accountNumber} />
                    <DetailRow label="Account Name" value={activity.toAccountName} />
                </div>
                
                <div className="mt-8">
                    <h3 className="text-xl font-bold border-b-2 border-black pb-2 mb-2">Amount</h3>
                     <div className="flex justify-between items-center text-lg font-bold py-4">
                        <span>AED {activity.amount}</span>
                     </div>
                     <p className="text-sm text-gray-600">{amountInWords}</p>
                </div>

                <footer className="mt-12 text-center text-xs text-gray-500">
                    <p>This is a system generated document and does not require a signature and stamp.</p>
                </footer>
            </main>
        </div>
    );
}
