import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token, kuid, accessCode } = await req.json();

    const externalApiUrl = "https://prodpk.ubldigital.com/services/data/v1/DCP_BillerObjService/operations/DCP_BillerObj/getBillerCompany";

    // Payload format matching PROD logs: jsondata={"accessCode":"ONE_BILL"}
    const encodedBody = `jsondata=${encodeURIComponent(JSON.stringify({ accessCode }))}`;

    const reportingParams = JSON.stringify({
      os: "143.0.0.0",
      did: "98FBE349-6DE8-4034-84D8-F953C702B055",
      ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...",
      aid: "OnlineBanking",
      aname: "OnlineBanking",
      chnl: "desktop",
      plat: "web",
      aver: "1.0.0",
      atype: "spa",
      stype: "b2c",
      kuid: kuid,
      fid: "frmAddPayeeDCP",
      svcid: "DCP_BillerObj"
    });

    const response = await fetch(externalApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-kony-authorization": token,
        "x-kony-reportingparams": reportingParams,
        "x-kony-api-version": "1.0",
        "x-kony-deviceid": "98FBE349-6DE8-4034-84D8-F953C702B055",
      },
      body: encodedBody,
    });

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}