import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
      const {  accountNo,  approverId, contractId, referenceNo, rejectorId, remarks, token, kuid,} = await req.json();
    
        if (!approverId || !token ||  !kuid) {
          return NextResponse.json(
            { error: "Missing USERID or token" },
            { status: 400 }
          );
        }

    // Live API URL for Rejection
    const apiUrl = "https://prodpk.ubldigital.com/services/data/v1/DCP_Approvals_OB_Object/operations/ApprovalMatrix/rejectRequest";

    // Payload construction based on your shared details
    const payloadObj = {
      accountNo,
      approverId,
      contractId,
      referenceNo,
      rejectorId,
      remarks
    };

    const body = `jsondata=${encodeURIComponent(JSON.stringify(payloadObj))}`;

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-kony-authorization": token,
        "x-kony-api-version": "1.0",
        "x-kony-deviceid": "98FBE349-6DE8-4034-84D8-F953C702B055", // Static as per network tab
      },
      body: body,
    });

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
    console.error("Reject API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}