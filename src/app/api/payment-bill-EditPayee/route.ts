import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { token, kuid, payload } = body;

        // UBL expect karta hai ke 'jsondata' key ke andar pura object stringify ho
        const formData = new URLSearchParams();
        formData.append('jsondata', JSON.stringify(payload));

        const response = await fetch("https://prodpk.ubldigital.com/services/data/v1/CustomBillPay/operations/CustomPayeeAction/EditPayee", {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // Payee APIs aksar ye mangti hain
                "x-kony-authorization": token,
                "x-kony-api-version": "1.0",
                'x-kony-reportingparams': JSON.stringify({ kuid: kuid }), 
                "Accept": "application/json"
            },
            body: formData.toString()
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Edit Payee Route Error:", error);
        return NextResponse.json({ error: "Failed to update payee" }, { status: 500 });
    }
}