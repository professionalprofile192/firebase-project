import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Live UBL API
    const url =
      "https://prodpk.ubldigital.com/authService/100000002/session/user_attributes?provider=DbxUserLogin";

    // Extract required forwarded headers
    const konyAuth = req.headers.get("x-kony-authorization") || "";
    const konyReqId = req.headers.get("x-kony-requestid") || "";
    const cookies = req.headers.get("cookie") || "";

    if (!konyAuth) {
      return NextResponse.json(
        { error: "Missing x-kony-authorization" },
        { status: 400 }
      );
    }

    // Send request to UBL server exactly like browser
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "x-kony-app-version": "1.0",

        // Forward client headers
        "x-kony-authorization": konyAuth,
        "x-kony-requestid": konyReqId,
        cookie: cookies,
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Unable to fetch user attributes", details: error.message },
      { status: 500 }
    );
  }
}
