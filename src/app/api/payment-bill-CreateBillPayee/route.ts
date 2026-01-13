import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { token, ...dataForUBL } = body;

        const params = new URLSearchParams();
        params.append('jsondata', JSON.stringify(dataForUBL));

        const response = await fetch("https://prodpk.ubldigital.com/services/data/v1/CustomBillPay/operations/CustomPayeeAction/CreateBillPayeeDCP", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Kony-Authorization": token,
                "X-Kony-API-Version": "1.0"
            },
            body: params.toString(),
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Creation Failed" }, { status: 500 });
    }
}