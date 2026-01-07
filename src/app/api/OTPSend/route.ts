import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { token, kuid, customerId } = await request.json();

        const jsonDataObj = {
            customerId: customerId,
            frmName: "frmAddPayeeDCP"
        };

        const body = new URLSearchParams();
        body.append("jsondata", JSON.stringify(jsonDataObj));

        const response = await fetch("https://prodpk.ubldigital.com/services/data/v1/DCP_OTP_OBJ/operations/OTP/sendOTPDCP", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-kony-authorization": token,
                "accept": "application/json"
            },
            body: body.toString(),
        });

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("OTP API Error:", error);
        return NextResponse.json({ opstatus: -1, errmsg: "Internal Server Error" }, { status: 500 });
    }
}