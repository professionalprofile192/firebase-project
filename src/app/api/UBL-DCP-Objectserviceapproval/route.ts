import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Frontend se bheje gaye custom headers read karein
    const token = req.headers.get("x-kony-token");
    const kuid = req.headers.get("x-kony-kuid");

    // Validation jaisa aapne example mein dikhaya
    if (!token || !kuid) {
      return NextResponse.json(
        { error: "Missing KUID or token" },
        { status: 400 }
      );
    }

    const apiUrl = "https://prodpk.ubldigital.com/services/metadata/v1/UBL_DCP_ObjectServiceApprovals/UBL_DCP_ObjectServiceApprovals";

    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "x-kony-authorization": token,
        "x-kony-api-version": "1.0",
      },
    });

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
    console.error("Metadata API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}