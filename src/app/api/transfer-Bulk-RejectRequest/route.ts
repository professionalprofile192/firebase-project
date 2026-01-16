import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { token, payload } = await request.json();

        // Kony Endpoint for Reject (Add Bulk Payment Transaction List)
        const KONY_URL = "https://prodpk.ubldigital.com/services/DCP_ORACLE_DB/EBANK_GNB_DCP_ADDBULKPAYMENTTRANSACTION_LIST10K";

        const response = await fetch(KONY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Kony-Authorization': token, // Ye session se aayega
                'X-Kony-API-Version': '1.0'
            },
            // Form data format mein payload bhejna hai jaisa browser network tab mein hai
            body: new URLSearchParams({
                P_RECORDID: payload.P_RECORDID,
                P_BATCHID: payload.P_BATCHID,
                P_USERNAME: payload.P_USERNAME,
                P_STATUS: payload.P_STATUS, // 3 for Reject
                P_TRANSACTIONID: payload.P_TRANSACTIONID,
                P_EXTRA5: payload.P_EXTRA5 || ""
            })
        });

        const result = await response.json();
        return NextResponse.json(result);

    } catch (error) {
        return NextResponse.json({ opstatus: -1, P_RESDESC: "Internal Server Error" }, { status: 500 });
    }
}