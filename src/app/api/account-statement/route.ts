import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { accountNumber, token, kuid } = await req.json();

    if (!accountNumber || !token || !kuid) {
      return NextResponse.json(
        { error: "Missing accountNumber, token, or kuid" },
        { status: 400 }
      );
    }

    const payload = {
      fromDate: new Date(new Date().setDate(new Date().getDate() - 7))
        .toISOString()
        .split("T")[0],
      toDate: new Date().toISOString().split("T")[0],
      noOfTransactions: 0,
      transactionNature: "All",
      accountNumber: accountNumber,
      accountCurrency: "PKR",
      bankInfoname: "United Bank Limited",
      bankIMD: "588974",
      branchCode: "1234",
      branchName: "City Branch",
      accountType: "SYM",
      requestType: "Savings",
      isMock: "0",
      token: token,
      kuid: kuid,
    };

    const res = await fetch(
      "https://prodpk.ubldigital.com/services/data/v1/AccountStatement/operations/AccountStatement/getAccountStatements",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-kony-authorization": token,
          "x-kony-deviceid": crypto.randomUUID(),
          "x-kony-api-version": "1.0",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("ACCOUNT STATEMENTS ERROR →", err);
    return NextResponse.json(
      { error: "Failed to fetch account statements" },
      { status: 500 }
    );
  }
}
