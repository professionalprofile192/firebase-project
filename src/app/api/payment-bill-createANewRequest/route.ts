import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, kuid, payload } = body;

    // Payload ko URL encoded string mein convert karna (jaisa aapke log mein hai)
    const formData = new URLSearchParams();
    formData.append('jsondata', JSON.stringify({
      requesterId: payload.requesterId,
      contractId: payload.contractId,
      referenceNo: payload.referenceNo, // Ye Edit/Delete service se aayega
      featureActionId: payload.featureActionId || "BILL_PAY_DELETE_PAYEES", // Hardcoded default
      remarks: payload.remarks || `REQUEST FROM ${payload.requesterId}`, // Hardcoded default
      accountNo: "0",
      amount: "0",
      coreCustomerId: payload.coreCustomerId,
      reqChannel: "DCP" // Hardcoded
    }));

    const response = await fetch("https://prodpk.ubldigital.com/services/data/v1/DCP_Approvals_OB_Object/operations/ApprovalMatrix/createNewRequest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-kony-authorization": token,
        "x-kony-api-version": "1.0",
      },
      body: formData.toString(),
    });

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create approval request" }, { status: 500 });
  }
}