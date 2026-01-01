import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
      const {token, kuid,payload } = await req.json();

          const externalApiUrl = "https://prodpk.ubldigital.com/services/PaymentsService/getBillPaymentHistory_byCusID";

              // Production screenshot ke mutabiq Form Data taiyar karein
                  const formData = new URLSearchParams();
                      formData.append("fromAccountNumber", payload?.fromAccountNumber || "");
                          formData.append("consumerNumber", payload?.consumerNumber || "");
                              formData.append("searchString", payload?.searchString || "");
                                  formData.append("limit", "10");
                                      formData.append("offset", "0");
                                          formData.append("startDate", payload?.startDate || "");
                                              formData.append("endDate", payload?.endDate || "");

                                                  const reportingParams = JSON.stringify({
                                                        os: "143.0.0.0",
                                                              dm: "",
                                                                    did: "98FBE349-6DE8-4034-84D8-F953C702B055", // Static Device ID (Prod wali same use kar sakte hain)
                                                                          ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
                                                                                aid: "OnlineBanking",
                                                                                      aname: "OnlineBanking",
                                                                                            chnl: "desktop",
                                                                                                  plat: "web",
                                                                                                        aver: "1.0.0",
                                                                                                              atype: "spa",
                                                                                                                    stype: "b2c",
                                                                                                                          kuid: kuid, // YAHAN AAPKA DYNAMIC KUID AAYEGA
                                                                                                                                sdkversion: "9.6.19",
                                                                                                                                      sdktype: "js",
                                                                                                                                            svcid: "getBillPaymentHistory_byCusID"
                                                                                                                                                });
                                                                                                                                                    const response = await fetch(externalApiUrl, {
                                                                                                                                                          method: "POST",
                                                                                                                                                                headers: {
                                                                                                                                                                       "x-kony-authorization": token, // "Bearer" nahi lagana, direct token bhejna hai
                                                                                                                                                                               "x-kony-api-version": "1.0",
                                                                                                                                                                                       "x-kony-reportingparams": reportingParams, // Encode kiya hua JSON
                                                                                                                                                                                               "x-kony-requestid": `req_${Date.now()}`,
                                                                                                                                                                                                       "x-kony-deviceid":"98FBE349-6DE8-4034-84D8-F953C702B055",// Form data ke liye lazmi hai
                                                                                                                                                                                                             },
                                                                                                                                                                                                                   body: formData.toString(),
                                                                                                                                                                                                                       });

                                                                                                                                                                                                                           const data = await response.json();
                                                                                                                                                                                                                               return NextResponse.json(data);

                                                                                                                                                                                                                                 } catch (error: any) {
                                                                                                                                                                                                                                     return NextResponse.json({ error: error.message }, { status: 500 });
                                                                                                                                                                                                                                       }
                                                                                                                                                                                                                                       }