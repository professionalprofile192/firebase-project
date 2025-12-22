import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // frontend se sirf yeh 2 cheezen aayengi
    const { customer_id, token, kuid } = await req.json();

    if (!customer_id || !token) {
      return NextResponse.json(
        { error: "Missing customer_id or token" },
        { status: 400 }
      );
    }

    // ✅ HARD CODED VALUES (as discussed)
    const payload = {
      appChannel: "DCPCRP",
      CIF_NO: "20269367",
      CUSTOMER_ID: customer_id
    };

    // ✅ reporting params (kony requirement)
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
      sdkversion: "9.6.19",
      sdktype: "js",
      fid: "frmLoginDCP",
      sessiontype: "I",
      clientUUID: crypto.randomUUID(),
      rsid: crypto.randomUUID(),
      svcid: "payments"
    });

    // EXTERNAL API CALL
    const res = await fetch(
      "https://prodpk.ubldigital.com/services/data/v1/ArrangmentSOA_Object/operations/payments/fetchAccountsByCIF",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-kony-api-version": "1.0",
          "x-kony-authorization": token,
          "x-kony-deviceid": crypto.randomUUID(),
          "x-kony-requestid": crypto.randomUUID(),
          "x-kony-reportingparams": reportingParams
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Fetch Accounts Error →", error);
    return NextResponse.json(
      { error: "Failed to fetch accounts" },
      { status: 500 }
    );
  }
}
