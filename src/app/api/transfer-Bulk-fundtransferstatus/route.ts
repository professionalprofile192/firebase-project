import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { token, payload } = await request.json();

        const response = await fetch('https://prodpk.ubldigital.com/services/data/v1/DCPSOAPaymentsService/operations/Payments/bulkFundTransferStatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-kony-api-version': '1.0',
                'Authorization': token, // Claims token
            },
            body: JSON.stringify({
                appChannel: "DCPCRP",
                subTransactions: JSON.stringify(payload.subTransactions),
                transactionType: payload.transactionType
            }),
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("API Route Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}