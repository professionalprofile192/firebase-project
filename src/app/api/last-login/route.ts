export async function POST(req: Request) {
    try {
      const { userID } = await req.json();
      const sessionToken = req.headers.get("x-kony-authorization");
  
      const body = new URLSearchParams();
      body.append("jsondata", JSON.stringify({ userID }));
  
      const response = await fetch(
        "https://prodpk.ubldigital.com/services/data/v1/dcp_custom/operations/LoginServices/getLastloginTime",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-kony-api-version": "1.0",
            "x-kony-authorization": sessionToken,    // ⭐ FINAL TOKEN HERE
          },
          body,
          credentials: "include",
        }
      );
  
      const data = await response.json();
      return Response.json(data);
  
    } catch (e: any) {
      return Response.json({ error: true, message: e.message });
    }
  }
  