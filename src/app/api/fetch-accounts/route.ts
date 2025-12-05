import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { cif, token, kuid } = await req.json();

    if (!cif || !token) {
      return NextResponse.json(
        { error: "Missing CIF or token" },
        { status: 400 }
      );
    }

    const reportingParams = JSON.stringify({
      os: "142.0.0.0",
      dm: "",
      did: "E7ECFF73-668B-4093-B4B2-8AE7DE7AC0D5",
      ua: "Mozilla/5.0",
      aid: "OnlineBanking",
      aname: "OnlineBanking",
      chnl: "desktop",
      plat: "web",
      aver: "1.0.0",
      atype: "spa",
      stype: "b2c",
      kuid: kuid ?? "",
      mfaid: "",
      mfbaseid: "",
      mfaname: "",
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
        body: JSON.stringify({
          customerId: cif
        })
      }
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Fetch CIF Accounts ERROR →", err);
    return NextResponse.json(
      { error: "Failed to fetch accounts" },
      { status: 500 }
    );
  }
}
