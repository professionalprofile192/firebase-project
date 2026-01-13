import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
  
    const { token, payload } = await request.json();

    const url = "https://prodpk.ubldigital.com/services/data/v1/DCPPayment/operations/PaymentService/isBillRequestExists";

   
    const jsonDataString = JSON.stringify(payload);

    const bodyParams = new URLSearchParams();
    bodyParams.append('jsondata', jsonDataString);

    // 3. UBL Server ko request bhejna
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-kony-authorization': token, // Aapka session token
        'x-kony-api-version': '1.0',
        'Accept': 'application/json',
      },
      body: bodyParams.toString(),
    });


    const data = await response.json();
    
    return NextResponse.json(data);

  } catch (error) {
    console.error("Route Error:", error);
    return NextResponse.json(
      { error: 'Internal Server Error', opstatus: -1 }, 
      { status: 500 }
    );
  }
}