import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try{
        const { token, payload } = await req.json();

    const formData = new URLSearchParams();
    // Stringify the payload and wrap it in 'jsondata' key
    formData.append("jsondata", JSON.stringify(payload));

    const res = await fetch("https://prodpk.ubldigital.com/services/data/v1/DCPTransfers/operations/RegionalTransfer/getTransferHistory_byCusId", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Kony-Authorization": token,
            "Accept": "application/json",
            // baki zaroori headers yahan add karein
        },
        body: formData.toString()
    });

    const data = await res.json();
    return NextResponse.json(data);

} catch (err: any) {
  return NextResponse.json({ error: err.message }, { status: 500 });
}
}