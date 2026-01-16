import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { token, payload } = await request.json();

        const KONY_URL = "https://prodpk.ubldigital.com/services/CustCreatePayment/ConfirmUserAndApprovalLimits";

        const response = await fetch(KONY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Kony-Authorization': token,
                'X-Kony-API-Version': '1.0'
            },
            body: new URLSearchParams({
                customerId: payload.customerId,
                accountNo: payload.accountNo,
                featureAction: payload.featureAction,
                amount: payload.amount.toString(),
                contractId: payload.contractId,
                coreCustomerId: payload.coreCustomerId
            })
        });

        const result = await response.json();
        return NextResponse.json(result);

    } catch (error) {
        return NextResponse.json({ opstatus: -1, message: "Internal Server Error" }, { status: 500 });
    }
}