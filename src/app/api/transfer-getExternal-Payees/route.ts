import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, payeeId } = body;

    

    // Headers jo aapne provide kiye hain
    const headers = {
      "Content-Type": "application/json",
      "x-kony-app-key": "cd45f4095d093055b91a5ebbcd7b71b4",
      "x-kony-app-secret": "d69d7f4912713a97a04cebb9a0eb53e0",
      "x-kony-authorization": token, 
      "x-kony-api-version": "1.0"
    };

    // Payload format as per your requirement
    const payload = {
        id: "",
        payeeId: payeeId,
        searchString: "",
        sortBy: "createdOn",
        sortOrder: "desc",
        dataLimit: 10,
        dataOffset: 0
    };
    const formData = new URLSearchParams();
    formData.append('jsondata', JSON.stringify(payload));

    const apiRes = await fetch(
      "https://prodpk.ubldigital.com/services/data/v1/DCPPayment/operations/PaymentService/getExternalPayees",
      {
        method: "POST",
        headers: headers,
        body:formData.toString()
      }
    );

    const data = await apiRes.json();
    return NextResponse.json(data);

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}