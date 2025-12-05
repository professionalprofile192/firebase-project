export async function GET(req: Request) {
    try {
      const claimsToken = req.headers.get("x-kony-authorization");
  
      const res = await fetch(
        "https://prodpk.ubldigital.com/services/data/v1/Login/objects/Users",
        {
          method: "GET",
          headers: {
            "accept": "application/json",
            "content-type": "application/json",
            "x-kony-api-version": "1.0",
            "x-kony-authorization": claimsToken || "",
            "x-kony-requestid": crypto.randomUUID(),
            "x-kony-deviceid": "E7ECFF73-668B-4093-B4B2-8AE7DE7AC0D5",
            "x-kony-reportingparams":
              '{"os":"windows","chnl":"desktop","plat":"web","stype":"b2c"}'
          },
        }
      );
  
      const data = await res.json();
      return new Response(JSON.stringify(data), { status: 200 });
  
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }
  