import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { otp, securityKey, token } = body;

        
        const jsonData = JSON.stringify({
            Otp: otp,
            securityKey: securityKey,
            serviceKey: ""
        });

        const params = new URLSearchParams();
        params.append('jsondata', jsonData);

        const response = await fetch("https://prodpk.ubldigital.com/services/data/v1/DCP_OTP_OBJ/operations/OTP/verifyOTPDCPN", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Kony-Authorization": token,
                "Accept": "application/json",
            },
            body: params.toString(),
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "OTP Verification Failed" }, { status: 500 });
    }
}