// src/app/api/get-bulk-files/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId, token, kuid } = await req.json(); // frontend se ye 3 values aayengi

    const payloadObj = {
      fromAccountNumber: "",
      userId: userId,          // dynamic
      searchString: "",
      limit: 10,
      offset: 0,
    };
    const payload = `jsondata=${encodeURIComponent(JSON.stringify(payloadObj))}`;

    const res = await fetch(
      "https://prodpk.ubldigital.com/services/data/v1/DCP_BULKFILE_OBJ/operations/NDC_BulkPayments/getBulkFiles",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-kony-authorization": token,
          "x-kony-deviceid": "01EBDE25-E32D-4C9B-8AAF-45A3FD12BEFA", // static ya dynamic
          "x-kony-api-version": "1.0",
        },
        body: JSON.stringify({
          jsondata: payload,
        }),
      }
    );
    console.log("SENDING PAYLOAD:", payload);
 
    // response text read
    const text = await res.text();
    console.log("RAW RESPONSE FROM KONY:", text);
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON from upstream", raw: text },
        { status: 502 }
      );
    }

    // ✅ IMPORTANT: yahin se REAL RESPONSE frontend ko bhejo
    return NextResponse.json(data, { status: res.status });

  } catch (err) {
    console.error("Error hitting Bulk Files API:", err);
    return NextResponse.json(
      { success: false, message: "API hit failed", error: err },
      { status: 500 }
    );
  }
}
