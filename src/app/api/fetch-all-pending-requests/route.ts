import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token, kuid, userId } = await req.json();

    const externalApiUrl = "https://prodpk.ubldigital.com/services/data/v1/DCP_Approvals_OB_Object/operations/ApprovalMatrix/fetchAllpendingRequests";

    // Payload: userId aur default sorting/pagination
    const payload = {
      userId: userId,
      searchString: "",
      sortBy: "createdate",
      sortOrder: "desc",
      limit: 10,
      offset: 0
    };

    const encodedBody = `jsondata=${encodeURIComponent(JSON.stringify(payload))}`;

    const reportingParams = JSON.stringify({
      os: "142.0.0.0",
      did: "D7383D4E-E193-459E-8B7D-D35D166970FA",
      ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...",
      aid: "OnlineBanking",
      aname: "OnlineBanking",
      chnl: "desktop",
      plat: "web",
      aver: "1.0.0",
      atype: "spa",
      stype: "b2c",
      kuid: kuid,
      svcid: "ApprovalMatrix"
    });

    const response = await fetch(externalApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-kony-authorization": token,
        "x-kony-reportingparams": reportingParams,
        "x-kony-api-version": "1.0",
        "x-kony-deviceid": "D7383D4E-E193-459E-8B7D-D35D166970FA",
      },
      body: encodedBody,
    });

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}