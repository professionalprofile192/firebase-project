import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { token, kuid, payload } = await req.json();

       
        const jsonDataString = JSON.stringify(payload);
        
        const body = `jsondata=${encodeURIComponent(jsonDataString)}`;

        const response = await fetch("https://prodpk.ubldigital.com/services/data/v1/CustomBillPay/operations/CustomPayeeAction/DeletePayee", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Network log ke mutabiq
                'x-kony-authorization': token,
                'x-kony-api-version': '1.0',
                // Reporting params mein dynamic 'kuid' pass ho raha hai
                'x-kony-reportingparams': encodeURIComponent(JSON.stringify({
                    "aid": "OnlineBanking",
                    "chnl": "desktop",
                    "plat": "web",
                    "kuid": kuid || "ublcreator",
                    "svcid": "CustomPayeeAction"
                }))
            },
            body: body
        });

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        return NextResponse.json({ errmsg: "Internal Server Error", opstatus: 8001 }, { status: 500 });
    }
}