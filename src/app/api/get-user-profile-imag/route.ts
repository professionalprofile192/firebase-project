import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 🔥 Get REAL session token saved earlier
    const sessionToken = req.headers.get("x-session-token");

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Missing session token" },
        { status: 400 }
      );
    }

    // 🔥 LIVE API URL
    const url =
      "https://prodpk.ubldigital.com/services/data/v1/Login/operations/Users/getUserProfileImage";

    // ⭐ Empty payload
    const apiPayload = "jsondata={}";

    const apiRes = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "x-kony-authorization": sessionToken,
      },
      body: apiPayload,
    });

    const data = await apiRes.json();

    return NextResponse.json(data);
  } catch (err) {
    console.error("PROFILE IMAGE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to fetch user profile image" },
      { status: 500 }
    );
  }
}
