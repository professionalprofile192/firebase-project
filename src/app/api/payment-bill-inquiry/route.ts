import { NextResponse } from "next/server";

export async function POST(req:any) {
  try {
    const body = await req.json();
    const { token, kuid, payload } = body;

    const EXTERNAL_API_URL = "https://prodpk.ubldigital.com/services/data/v1/DCPSOAPaymentsService/operations/Bill/bulkBillInquiry";

    // Headers set karna (Screenshot ki base par)
    const headers = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "x-kony-authorization": token,
      'x-kony-reportingparams': JSON.stringify({ kuid: kuid }), // Token as auth header
      "x-kony-api-version": "1.0",
    };

    const response = await fetch(EXTERNAL_API_URL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload), // payload mein jsondata wali string hogi
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Bulk Bill Inquiry Route Error:", error);
    return NextResponse.json(
      { errmsg: "Internal Server Error", opstatus: -1 },
      { status: 500 }
    );
  }
}