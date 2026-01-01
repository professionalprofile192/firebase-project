import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token, kuid, payload } = await req.json();

    // 1. Prod URL (As per your latest header logs)
    const externalApiUrl = "https://prodpk.ubldigital.com/services/data/v1/DCPPayment/operations/PaymentService/getAllCategory";

    // 2. Exact Payload Formatting
    const jsondata = JSON.stringify({ categorytype: payload?.categorytype});
    const encodedBody = `jsondata=${encodeURIComponent(jsondata)}`;

    // 3. Precise Reporting Params from Prod Logs
    const reportingParams = JSON.stringify({
      os: "143.0.0.0",
      dm: "",
      did: "98FBE349-6DE8-4034-84D8-F953C702B055",
      ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
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
      sessiontype: "I",
      clientUUID: "1766727832176-bdb8-de1f-c38f",
      rsid: `req_${Date.now()}`, 
      svcid: "PaymentService"
    });

    const response = await fetch(externalApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "x-kony-authorization": token,
        "x-kony-api-version": "1.0",
        "x-kony-deviceid": "98FBE349-6DE8-4034-84D8-F953C702B055",
        "x-kony-reportingparams": reportingParams,
        "x-kony-requestid": `req_${Date.now()}`
      },
      body: encodedBody,
    });

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}