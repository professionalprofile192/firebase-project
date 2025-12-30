import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
      const { userId, token, kuid } = await req.json(); // frontend se ye 3 values aayengi
        if (!userId || !token || !kuid) {
          return NextResponse.json(
            { error: "Missing USERID or token" },
            { status: 400 }
          );
        }
    // API URL
    const url = 'https://prodpk.ubldigital.com/services/data/v1/DCP_Approvals_OB_Object/operations/ApprovalMatrix/FetchAllPendingUserApprovals';

    // Payload with dynamic userId
    const payload = {
      userId: userId, // <-- dynamic userId from frontend
      searchString:'',
      sortBy: 'approveDate',
      sortOrder:'desc',
      limit: 10,
      offset: 0
    };
    const body = `jsondata=${encodeURIComponent(
      JSON.stringify(payload)
    )}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-kony-authorization': token,
        'x-kony-api-version': '1.0',
        'x-kony-deviceid': '98FBE349-6DE8-4034-84D8-F953C702B055'
      },
      body: body,
    });

    const text = await response.text();
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
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('ApprovalMatrix API error:', error);
    return new Response(JSON.stringify({ error: 'Something went wrong' }), { status: 500 });
  }
}
