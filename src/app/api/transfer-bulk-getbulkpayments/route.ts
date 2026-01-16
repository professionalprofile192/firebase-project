import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { token, fromAccount, userId,remitterType, fileReference } = body;

  const payload = new URLSearchParams();
  payload.append('jsondata', JSON.stringify({
    fromAccountNumber: fromAccount,
    userId: userId,
    remitterType: remitterType,
    searchString: fileReference, // Aapka select kiya hua file reference
    sortBy: "createdAt",
    sortOrder: "desc",
    limit: 100,
    offset: 0,
    status: 1
  }));

  try {
    const response = await fetch('https://prodpk.ubldigital.com/services/data/v1/DCP_BULKFILE_OBJ/operations/NDC_BulkPayments/getBulkPayments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-kony-authorization': token, // Token pass karein
        'x-kony-deviceid': 'B7CD4751-913D-4C55-81E4-BF14DB0C3D57',
        'X-Kony-API-Version': '1.0',
        'Accept': 'application/json',
        // Baaki headers jo aapne upar diye hain wo yahan add karein
      },
      body: payload,
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Service call failed' }, { status: 500 });
  }
}