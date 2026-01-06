import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { CIF, Customer_id, token, kuid } = await req.json();

    if (!Customer_id || !token) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Prod ke mutabiq object banayein
    const payload = {
      appChannel: "DCPCRP",
      CIF_NO: CIF,        
      CUSTOMER_ID: Customer_id 
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
      kuid: kuid ?? "",
      sdkversion: "9.6.19",
      sdktype: "js",
      fid: "frmLoginDCP",
      sessiontype: "I",
      clientUUID: crypto.randomUUID(),
      rsid: crypto.randomUUID(),
      svcid: "payments"
    });


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
