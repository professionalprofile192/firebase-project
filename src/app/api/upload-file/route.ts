// app/api/upload-file/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { fileName, accountName, accountNo, fileData, user, token } = await req.json();

    if (!fileName || !accountName || !accountNo || !fileData || !user || !token) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const payload = {
      fileName,
      accountName,
      accountNo,
      fileData,
      user
    };

    const res = await fetch(
      "https://prodpk.ubldigital.com/services/DCP_BULKUPLOAD_ORALCE/FileUpload",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "x-kony-api-version": "1.0",
          "x-kony-authorization": token,
          "x-kony-deviceid": "98FBE349-6DE8-4034-84D8-F953C702B055"
        },
        body: new URLSearchParams(payload as any) // form-urlencoded format
      }
    );

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = text; // fallback in case API returns string
    }

    return NextResponse.json({ data, opstatus: 0, httpStatusCode: res.status });
  } catch (error) {
    console.error("File Upload API error:", error);
    return NextResponse.json({ success: false, message: "API failed" }, { status: 500 });
  }
}
