import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userID, token, kuid } = await req.json();

    if (!userID || !token) {
      return NextResponse.json(
        { error: "Missing userID or token" },
        { status: 400 }
      );
    }

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
      kuid: kuid ?? "",
      mfaid: "64b27d29-eac2-472b-927b-d6052c564f24",
      mfbaseid: "ce401c19-81b6-41f8-a358-79e5b7c38ace",
      mfaname: "DigitalBanking-Composite",
      sdkversion: "9.6.19",
      sdktype: "js",
      fid: "frmDashboardDCP",
      sessiontype: "I",
      clientUUID: crypto.randomUUID(),
      rsid: crypto.randomUUID(),
      svcid: "LoginServices",
    });

    const res = await fetch(
      "https://prodpk.ubldigital.com/services/data/v1/dcp_custom/operations/LoginServices/getUserGroup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-kony-api-version": "1.0",
          "x-kony-authorization": token,
          "x-kony-deviceid": crypto.randomUUID(),
          "x-kony-requestid": crypto.randomUUID(),
          "x-kony-reportingparams": reportingParams,
        },
        body: JSON.stringify({
          userID: userID,
        }),
      }
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("GET USER GROUP ERROR →", err);
    return NextResponse.json(
      { error: "Failed to fetch user group" },
      { status: 500 }
    );
  }
}
