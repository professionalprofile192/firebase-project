import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { token, bulkData } = await req.json();

    if (!token || !bulkData) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 });
    }

    const apiUrl = "https://prodpk.ubldigital.com/services/DCP_BULKPAYMENT_ORACLE/bulkRecordPosting_oracle";

    // Kony service application/x-www-form-urlencoded expect kar rahi hai
    const formData = new URLSearchParams();
    formData.append("customerId", bulkData.customerId);
    formData.append("transactionId", bulkData.transactionId);
    formData.append("CIF", bulkData.CIF);

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "x-kony-authorization": token,
        "x-kony-api-version": "1.0",
      },
      body: formData.toString(),
    });

    const data = await res.json();
    return NextResponse.json(data);

  } catch (err) {
    console.error("Bulk Posting Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}