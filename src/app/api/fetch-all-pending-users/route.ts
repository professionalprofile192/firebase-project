// src/app/api/get-approvals/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Frontend se dynamic values receive karein
    const { userId, token, kuid } = await req.json();

    if (!userId || !token ||  !kuid) {
      return NextResponse.json(
        { error: "Missing USERID or token" },
        { status: 400 }
      );
    }

    // 1. Construct the payload object exactly like the live API requires
    const payloadObj = {
      userId: userId,           // Dynamic from frontend
      searchString: "",
      sortBy: "approveDate",  
      sortOrder: "desc",
      limit: 10,
      offset:0,
    };

    // 2. Encode payload as jsondata string (Your DNA Style)
    const body = `jsondata=${encodeURIComponent(
      JSON.stringify(payloadObj)
    )}`;

    // 3. Hit the Production URL
    const res = await fetch(
      "https://prodpk.ubldigital.com/services/data/v1/DCP_Approvals_OB_Object/operations/ApprovalMatrix/fetchAlluserApproveRequest",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-kony-authorization": token,
          "x-kony-deviceid": "98FBE349-6DE8-4034-84D8-F953C702B055",
          "x-kony-api-version": "1.0",
        },
        body: body,
      }
    );

    // 4. Safe Response Handling (Text -> JSON)
    const text = await res.text();
    console.log("RAW RESPONSE FROM APPROVALS API:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON from upstream", raw: text },
        { status: 502 }
      );
    }

    // 5. Return clean data to frontend
    return NextResponse.json(data, { status: res.status });

  } catch (err) {
    console.error("Error hitting Approvals API:", err);
    return NextResponse.json(
      { success: false, message: "API hit failed", error: err },
      { status: 500 }
    );
  }
}