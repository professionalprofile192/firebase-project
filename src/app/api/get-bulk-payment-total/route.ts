import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token, kuid, payload } = await req.json();

    const externalApiUrl = "https://prodpk.ubldigital.com/services/data/v1/DCP_BULKFILE_OBJ/operations/NDC_BulkPayments/getBulkPayments";

    // 1. JSON Data Payload
    const jsondata = JSON.stringify({
      remitterType: payload?.remitterType || "UBP",
      status: payload?.status || 1,
      fromAccountNumber: payload?.fromAccountNumber || "",
      userId: payload?.userId || ""
    });

    const body = new URLSearchParams();
    body.append("jsondata", jsondata);

    // 2. Reporting Params (fid: frmBulkPayments)
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
      kuid: kuid,
    });

    const response = await fetch(externalApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "x-kony-authorization": token,
        "x-kony-reportingparams": reportingParams,
        "x-kony-api-version": "1.0",
        "x-kony-deviceid": "98FBE349-6DE8-4034-84D8-F953C702B055",
      },
      body: body.toString(),
    });

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}