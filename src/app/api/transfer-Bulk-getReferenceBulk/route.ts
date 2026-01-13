import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { token, payload } = await req.json();

    // Form data format (jsondata=...) jaisa aapne request body mein dikhaya
    const formData = new URLSearchParams();
    formData.append('jsondata', JSON.stringify(payload));

    const response = await fetch('https://prodpk.ubldigital.com/services/data/v1/DCP_BULKFILE_OBJ/operations/NDC_BulkPayments/GetBulkFileReferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Kony-Authorization': token, // Session token
        'X-Kony-API-Version': '1.0',
        'Accept': 'application/json',
      },
      body: formData.toString(),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Bulk Reference API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch bulk references' }, { status: 500 });
  }
}