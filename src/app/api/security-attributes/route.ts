export async function GET(req: Request) {
    try {
      // LIVE UBL API
      const url =
        "https://prodpk.ubldigital.com/authService/100000002/session/security_attributes?provider=DbxUserLogin";
  
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "x-kony-app-version": "1.0",
          "x-kony-authorization": req.headers.get("x-kony-authorization") || "",
          "x-kony-requestid": req.headers.get("x-kony-requestid") || "",
          cookie: req.headers.get("cookie") || "",
        },
        credentials: "include",
      });
  
      const data = await response.json();
      return Response.json(data);
    } catch (error) {
      return Response.json(
        { errmsg: "Security attributes fetch failed", error },
        { status: 500 }
      );
    }
  }
  