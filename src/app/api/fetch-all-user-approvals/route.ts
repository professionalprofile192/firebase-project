import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token, kuid, userId, limit = "10", offset = "0", sortBy = "modifydate", sortOrder = "desc" } =
      await req.json();

    if (!token || !kuid || !userId) {
      return NextResponse.json(
        { error: "Missing token, kuid, or userId" },
        { status: 400 }
      );
    }

    const payload = {
      userId: userId,
      isCreated: false,
      sortBy: sortBy,
      sortOrder: sortOrder,
      limit: limit,
      offset: offset,
    };

    const reportingParams = JSON.stringify({
      os: "142.0.0.0",
      dm: "",
      did: crypto.randomUUID(),
      ua: "Mozilla/5.0",
      aid: "OnlineBanking",
      aname: "OnlineBanking",
      chnl: "desktop",
      plat: "web",
      aver: "1.0.0",
      atype: "spa",
      stype: "b2c",
      kuid: kuid,
      mfaid: "64b27d29-eac2-472b-927b-d6052c564f24",
      mfbaseid: "ce401c19-81b6-41f8-a358-79e5b7c38ace",
      mfaname: "DigitalBanking-Composite",
      sdkversion: "9.6.19",
      sdktype: "js",
      fid: "frmDashboardDCP",
      sessiontype: "I",
      clientUUID: crypto.randomUUID(),
      rsid: crypto.randomUUID(),
      svcid: "ApprovalMatrix",
    });

    const res = await fetch(
      "https://prodpk.ubldigital.com/services/data/v1/DCP_Approvals_OB_Object/operations/ApprovalMatrix/fetchalluserapprovals",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-kony-api-version": "1.0",
          "x-kony-authorization": token,
          "x-kony-deviceid": crypto.randomUUID(),
          "x-kony-reportingparams": reportingParams,
          "x-kony-requestid": crypto.randomUUID(),
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("FETCH ALL USER APPROVALS ERROR →", err);
    return NextResponse.json(
      { error: "Failed to fetch user approvals" },
      { status: 500 }
    );
  }
}
