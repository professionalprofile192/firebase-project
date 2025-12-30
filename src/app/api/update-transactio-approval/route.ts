import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { token, transactionId, status, kuid} = await req.json();

    if (!token || !transactionId || !kuid) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const apiUrl = "https://prodpk.ubldigital.com/services/data/v1/UBL_DCP_ObjectServiceApprovals/operations/UBL_DCP_ObjectServiceApprovals/dcp_updateTransactionStatus";

    // Payload ko stringify karke 'jsondata' key mein bhejna hai
    const payload = {
      jsondata: JSON.stringify({
        transactionId: transactionId.toString(),
        status: status // e.g., "REJECTED"
      })
    };

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "x-kony-authorization": token,
        "x-kony-api-version": "1.0",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Update Status Failed" }, { status: 500 });
  }
}