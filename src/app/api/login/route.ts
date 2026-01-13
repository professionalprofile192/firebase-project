import { NextResponse } from "next/server";

function generateKonyRequestId() {
  const timestamp = Date.now().toString(); // 1768210761189 waala part
  
  // Random hex strings generate karne ke liye helper
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  
  // Format: timestamp-s4-s4-s4 (Aapke format se match karne ke liye)
  return `${timestamp}-${s4()}-${s4()}-${s4()}`;
}

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
// Dynamic Request ID jo aapke format jaisa hai
    const requestId = generateKonyRequestId(); 
    console.log("Generated Request ID:", requestId);

    const body = new URLSearchParams();
    body.append("UserName", username);
    body.append("Password", password);
    body.append("rememberMe", "true");
    body.append("loginOptions", '{"isOfflineEnabled":false,"isSSOEnabled":true}');
    body.append("provider", "DbxUserLogin");

    const headers: Record<string, string> = {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json",
      "x-kony-app-key": "cd45f4095d093055b91a5ebbcd7b71b4",
      "x-kony-app-secret": "d69d7f4912713a97a04cebb9a0eb53e0",
      "x-kony-app-version": "1.0",
      "x-kony-platform-type": "web",
      "x-kony-sdk-type": "js",
      "x-kony-sdk-version": "9.6.19",
      "x-kony-reportingparams": "YOUR REPORTING PARAMS",
      "x-kony-requestid": "1768281725713-e4b6-0fe2-a7f3",//"1768210761189-f7ad-96c7-0239"//
    };

    const apiRes = await fetch(
      "https://prodpk.ubldigital.com/authService/100000002/login?provider=DbxUserLogin",
      {
        method: "POST",
        headers,
        body: body.toString(),
      }
    );

    const data = await apiRes.json();

    return NextResponse.json(data);

  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
