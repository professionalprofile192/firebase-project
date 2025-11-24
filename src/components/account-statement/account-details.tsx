'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Account = {
    ACCT_TITLE: string;
    ACCT_NO: string;
    LEDGER_BAL: string;
    AVAIL_BAL: string;
};

interface AccountDetailsProps {
    account: Account;
}

export function AccountDetails({ account }: AccountDetailsProps) {
    const formatCurrency = (amount: string) => {
        return `PKR ${new Intl.NumberFormat('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(parseFloat(amount))}`;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-1">
                        <p className="font-semibold">{account.ACCT_TITLE}</p>
                        <p className="text-sm text-muted-foreground">{account.ACCT_NO}</p>
                    </div>
                    
                    <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                        <div>
                            <p className="text-sm text-muted-foreground">Branch</p>
                            <p className="font-semibold">0605 UBL CBS</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Float Amount</p>
                            <p className="font-semibold">{formatCurrency(account.LEDGER_BAL)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Amount as of</p>
                            <p className="font-semibold">28/10/2020 at 11:12:25 PM</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Reserved Amount</p>
                            <p className="font-semibold">PKR 0.00</p>
                        </div>
                         <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                            <div className="sm:text-right">
                                <p className="text-sm text-muted-foreground">Current Balance:</p>
                                <p className="font-semibold text-primary">{formatCurrency(account.LEDGER_BAL)}</p>
                            </div>
                            <div className="sm:text-right">
                                <p className="text-sm text-muted-foreground">Available Balance:</p>
                                <p className="font-semibold text-primary">{formatCurrency(account.AVAIL_BAL)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
