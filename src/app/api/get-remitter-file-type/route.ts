import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { accountNumber, token } = await req.json();

    if (!accountNumber || !token) {
      return NextResponse.json(
        { success: false, message: "Missing accountNumber or token" },
        { status: 400 }
      );
    }

    const payload = {
      accountnumbers: `${accountNumber},`
    };

    const res = await fetch(
      "https://prodpk.ubldigital.com/services/data/v1/NDC_BulkPayments/operations/NDC_BulkPayments/ndc_getRemmiterFileType",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-kony-api-version": "1.0",
          "x-kony-authorization": token,
          "x-kony-deviceid": "98FBE349-6DE8-4034-84D8-F953C702B055"
        },
        body: JSON.stringify({ jsondata: payload })
      }
    );

    const text = await res.text();
    const data = JSON.parse(text);

    return NextResponse.json(
      data
    );
  } catch (error) {
    console.error("Remitter File Type API error:", error);
    return NextResponse.json(
      { success: false, message: "API failed" },
      { status: 500 }
    );
  }
}
