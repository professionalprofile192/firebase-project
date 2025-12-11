import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token, kuid } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Missing session token" },
        { status: 400 }
      );
    }
    
    const encodedBody = "jsondata=" + encodeURIComponent(JSON.stringify({ categorytype: "bill" }));

    const reportingParams = JSON.stringify({
        os: "143.0.0.0",
        dm: "",
        did: "FCA7FB9F-C412-4995-93BD-2CE2D507A467",
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
        fid: "frmManagePayeesDCP",
        sessiontype: "I",
        clientUUID: crypto.randomUUID(),
        rsid: crypto.randomUUID(),
        svcid: "PaymentService"
    });

    const res = await fetch(
      "https://prodpk.ubldigital.com/services/data/v1/DCPPayment/operations/PaymentService/getAllCategory",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "x-kony-api-version": "1.0",
          "x-kony-authorization": token,
          "x-kony-deviceid": "FCA7FB9F-C412-4995-93BD-2CE2D507A467",
          "x-kony-requestid": crypto.randomUUID(),
          "x-kony-reportingparams": reportingParams
        },
        body: encodedBody
      }
    );

    const data = await res.json();
    return NextResponse.json(data);

  } catch (err) {
    console.error("GET BILL CATEGORIES API ERROR →", err);
    return NextResponse.json(
      { error: "Failed to fetch bill categories" },
      { status: 500 }
    );
  }
}
