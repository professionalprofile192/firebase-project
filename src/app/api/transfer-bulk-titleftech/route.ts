import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { token, accounts } = body;

        // Payload prepare karna as per service requirement
        const formData = new URLSearchParams();
        formData.append('listOfAccounts', JSON.stringify({ accounts: accounts }));

        const response = await fetch('https://prodpk.ubldigital.com/services/PaymentsService/BulkTitleFetchDCP', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-kony-authorization': token,
                'x-kony-api-version': '1.0',
            },
            body: formData.toString(),
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Title Fetch Error:', error);
        return NextResponse.json({ error: 'Failed to fetch titles' }, { status: 500 });
    }
}