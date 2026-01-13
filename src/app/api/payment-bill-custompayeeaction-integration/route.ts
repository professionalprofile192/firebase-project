import { NextResponse } from 'next/server';

export async function GET(request: Request) {
       
    try {
        const { searchParams } = new URL(request.url);
        const kuid = searchParams.get('kuid');
        
        // Token humne headers mein bheja hai frontend se
        const token = request.headers.get('x-kony-authorization');

        if (!token) {
            return NextResponse.json({ error: 'Token is required' }, { status: 401 });
        }
        const externalApiUrl =  "https://prodpk.ubldigital.com/services/metadata/v1/CustomBillPay/CustomPayeeAction";
        
        const response = await fetch(externalApiUrl, {
            method: "GET",
            headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-kony-authorization': token,
        'x-kony-reportingparams': JSON.stringify({ kuid: kuid }), // Reporting params mein kuid bhej rahe hain
        'x-kony-api-version': '1.0',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/143.0.0.0 Safari/537.36',
            }
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