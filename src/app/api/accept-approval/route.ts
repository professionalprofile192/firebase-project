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
    const apiUrl = "https://prodpk.ubldigital.com/services/data/v1/DCP_Approvals_OB_Object/operations/ApprovalMatrix/approveRequest";

    // Payload ko stringify karke 'jsondata' key mein bhejna hai jaisa log mein hai
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
        "Accept": "application/json",
        "x-kony-authorization": token,
        "x-kony-api-version": "1.0",
      },
      body:body
    });
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
    return NextResponse.json({ error: "Approval failed" }, { status: 500 });
  }
}