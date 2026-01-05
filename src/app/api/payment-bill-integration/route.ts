import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, kuid } = body;

    const externalApiUrl = 'https://prodpk.ubldigital.com/services/metadata/v1/DCPSOAPaymentsService/Bill';

    const response = await fetch(externalApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-kony-authorization': token,
        'x-kony-reportingparams': JSON.stringify({ kuid: kuid }), // Reporting params mein kuid bhej rahe hain
        'x-kony-api-version': '1.0',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/143.0.0.0 Safari/537.36',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch bill data' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}