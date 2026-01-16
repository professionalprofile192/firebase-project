import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { token, fileID } = body;

        const externalApiUrl = "https://prodpk.ubldigital.com/services/PaymentsService/bulkInquiryRaast_2";

        const response = await fetch(externalApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-kony-authorization': token,
                'x-kony-api-version': '1.0',
            },
            body: new URLSearchParams({ fileID: fileID })
        });

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}