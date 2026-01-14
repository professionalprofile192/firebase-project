import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { token, payload } = await req.json();

    const formData = new URLSearchParams();
    // UBL/Kony services 'jsondata' key ke andar stringified payload expect karti hain
    formData.append("jsondata", JSON.stringify(payload));

    const response = await fetch("https://prodpk.ubldigital.com/services/data/v1/DCP_BULKFILE_OBJ/operations/NDC_BulkPayments/getTotalBulkTransfersData", {
      method: "POST",
      headers: {
        // ERROR FIX: Jab URLSearchParams bhejte hain to Content-Type ye hona chahiye
        'Content-Type': 'application/json', 
        'X-Kony-Authorization': token,
        'X-Kony-API-Version': '1.0',
        'Accept': 'application/json',
      },
      body: formData.toString(),
    });

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Bulk Total API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bulk totals', details: error.message }, 
      { status: 500 }
    );
  }
} 