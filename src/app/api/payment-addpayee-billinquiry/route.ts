import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { consumerNumber, companyCode, token, kuid } = await req.json();

    if (!consumerNumber || !companyCode || !token) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Bill Inquiry Payload
    const rawPayload = {
      consumerNumber: consumerNumber,
      companyCode: companyCode,
      appChannel: "DCPCRP" 
    };

  
    const params = new URLSearchParams();
    params.append("jsondata", JSON.stringify(rawPayload));

    // 3. Reporting Params (Kony requirement)
    const reportingParams = JSON.stringify({
      os: "143.0.0.0",
      did: crypto.randomUUID(),
      ua: "Mozilla/5.0",
      aid: "OnlineBanking",
      aname: "OnlineBanking",
      chnl: "desktop",
      plat: "web",
      aver: "1.0.0",
      atype: "spa",
      stype: "b2c",
      kuid: kuid ?? "ublcreator",
      sdkversion: "9.6.19",
      sdktype: "js",
      fid: "frmAddPayeeDCP",
      sessiontype: "I",
      clientUUID: crypto.randomUUID(),
      rsid: crypto.randomUUID(),
      svcid: "Bill"
    });

    // 4. External API Call
    const res = await fetch(
      "https://prodpk.ubldigital.com/services/data/v1/DCPSOAPaymentsService/operations/Bill/inquiryUtilityBill",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Must be this
          "x-kony-api-version": "1.0",
          "x-kony-authorization": token,
          "x-kony-deviceid": crypto.randomUUID(),
          "x-kony-requestid": crypto.randomUUID(),
          "x-kony-reportingparams": reportingParams
        },
        body: params.toString()
      }
    );

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Bill Inquiry Error →", error.message);
    return NextResponse.json({ error: "Failed to inquire bill" }, { status: 500 });
  }
}