

'use server';

// This is a placeholder for the actual API call.
// In a real application, this would make a a request to your backend,
// which would then securely call the UBL Digital API.
export async function login(values: any) {
    try {
        const body = new URLSearchParams();
        body.append('UserName', values.username);
        body.append('Password', values.password);
        body.append('rememberMe', 'true');
        body.append('loginOptions', JSON.stringify({ isOfflineEnabled: false, isSSOEnabled: true }));
        body.append('provider', 'DbxUserLogin');

        const response = await fetch('https://prodpk.ubldigital.com/authService/100000002/login?provider=DbxUserLogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body.toString(),
        });

        const data = await response.json();

        if (response.ok) {
            // Successful login
            const userAttributes = data.profile.user_attributes;
            return {
                success: true,
                message: 'Login successful',
                profile: {
                    userid: userAttributes.user_id,
                    firstname: userAttributes.FirstName,
                    lastname: userAttributes.LastName,
                    email: userAttributes.email,
                    CIF_NO: userAttributes.taxId, // Assuming taxId is CIF_NO
                },
            };
        } else {
            // Failed login
            return { 
                success: false, 
                message: data.details?.errmsg || 'Invalid username or password' 
            };
        }
    } catch (error) {
        console.error('Login API call failed:', error);
        return {
            success: false,
            message: 'An unexpected error occurred during login.'
        };
    }
}


// This is a placeholder for the actual API call.
export async function getLastLoginTime(userId: string) {
  // Simulate API call for a specific user
  if (userId === '7884057484' || userId === '5939522605') {
    return {
      LoginServices: [
        {
          Lastlogintime: '2025-11-20 11:44:19.0',
        },
      ],
      opstatus: 0,
      httpStatusCode: 200,
    };
  } else {
    return {
      opstatus: 1,
      httpStatusCode: 404,
      message: 'User not found',
    };
  }
}

// This is a placeholder for the actual API call.
export async function getAccounts(customerId: string, cif: string) {
    if (customerId === '7884057484' && cif === '20269367') {
        return {
            "payments": [
                {
                    "responseCode": "00",
                    "ACCT_STATUS": "A",
                    "ACCT_TITLE": "NAWAZ ALI",
                    "ACCT_NO": "060510224211",
                    "IBAN_CODE": "PK87UNIL0112060510224211",
                    "DEPOSIT_TYPE": "S",
                    "ACCT_TYPE": "100",
                    "LEDGER_BAL": "1512642.5",
                    "AVAIL_BAL": "1512642.5"
                }
            ],
            "opstatus": 0,
            "httpStatusCode": 0
        }
    } else if (customerId === '5939522605') {
         return {
            "payments": [
                {
                    "responseCode": "00",
                    "ACCT_STATUS": "A",
                    "ACCT_TITLE": "IDREES APPROVER",
                    "ACCT_NO": "060510224212",
                    "IBAN_CODE": "PK87UNIL0112060510224212",
                    "DEPOSIT_TYPE": "S",
                    "ACCT_TYPE": "100",
                    "LEDGER_BAL": "2500000.0",
                    "AVAIL_BAL": "2500000.0"
                }
            ],
            "opstatus": 0,
            "httpStatusCode": 0
        }
    }
    else {
        return {
            payments: [],
            opstatus: 1,
            httpStatusCode: 404,
            message: 'Accounts not found'
        }
    }
}


// This is a placeholder for the actual API call
export async function getRecentTransactions(acctNo: string) {
    if (acctNo === '060510224211' || acctNo === '060510224212') {
        const paymentsString = "[{\"CRDR\":\"D\",\"seqno\":\"5920713631\",\"instNo\":\"\",\"tranAmt\":\"5000\",\"tranDate\":\"2025-11-20 00:00:00\",\"particulars\":\"CASH WITHDRAWAL - ATM\",\"runBal\":\"1507645.5\"},{\"CRDR\":\"C\",\"seqno\":\"5920711221\",\"instNo\":\"\",\"tranAmt\":\"1000\",\"tranDate\":\"2025-11-20 00:00:00\",\"particulars\":\"EB985674412 UBL DIGITAL:FUNDS TRANSFER  FR-1564308567641 TO-605060510224211TXNTYPE-0010\",\"runBal\":\"1512645.5\"},{\"CRDR\":\"C\",\"seqno\":\"5920526332\",\"instNo\":\"\",\"tranAmt\":\"2000\",\"tranDate\":\"2025-11-21 00:00:00\",\"particulars\":\"EB985619947 UBL DIGITAL:FUNDS TRANSFER  FR-1564308567641 TO-605060510224211TXNTYPE-0010\",\"runBal\":\"1512644.5\"},{\"CRDR\":\"C\",\"seqno\":\"5919360425\",\"instNo\":\"\",\"tranAmt\":\"500\",\"tranDate\":\"2025-11-22 00:00:00\",\"particulars\":\"EB985298862 UBL DIGITAL:FUNDS TRANSFER  FR-1779039510235468 TO-605060510224211TXNTYPE-0010\",\"runBal\":\"1512642.5\"},{\"CRDR\":\"C\",\"seqno\":\"5919342907\",\"instNo\":\"\",\"tranAmt\":\"1000\",\"tranDate\":\"2025-11-23 00:00:00\",\"particulars\":\"RAAST P2P FT FROM SYED BASHIR UL HASAN MEBL ACCT: PK17MEZN*********997 MSGID: AMEZNPKKA003001102889972511203035\",\"runBal\":\"1512637.5\"},{\"CRDR\":\"D\",\"seqno\":\"5917336308\",\"instNo\":\"\",\"tranAmt\":\"5000\",\"tranDate\":\"2025-11-19 00:00:00\",\"particulars\":\"CASH WITHDRAWAL - ATM\",\"runBal\":\"1512627.5\"},{\"CRDR\":\"D\",\"seqno\":\"5914830496\",\"instNo\":\"\",\"tranAmt\":\"5000\",\"tranDate\":\"2025-11-18 00:00:00\",\"particulars\":\"CASH WITHDRAWAL - ATM\",\"runBal\":\"1517627.5\"},{\"CRDR\":\"D\",\"seqno\":\"5911804812\",\"instNo\":\"\",\"tranAmt\":\"3000\",\"tranDate\":\"2025-11-17 00:00:00\",\"particulars\":\"CASH WITHDRAWAL - ATM\",\"runBal\":\"1522627.5\"},{\"CRDR\":\"D\",\"seqno\":\"5908707170\",\"instNo\":\"\",\"tranAmt\":\"2000\",\"tranDate\":\"2025-11-16 00:00:00\",\"particulars\":\"CASH WITHDRAWAL - ATM\",\"runBal\":\"1525627.5\"},{\"CRDR\":\"D\",\"seqno\":\"5907478642\",\"instNo\":\"\",\"tranAmt\":\"7000\",\"tranDate\":\"2025-11-15 00:00:00\",\"particulars\":\"CASH WITHDRAWAL - ATM\",\"runBal\":\"1527627.5\"}]";
        return {
            "payments": JSON.parse(paymentsString),
            "opstatus": 0,
            "httpStatusCode": 0
          }
    } else {
        return {
            payments: [],
            opstatus: 1,
            httpStatusCode: 404,
            message: 'Transactions not found for this account'
        }
    }
}

export async function getNotifications(userId: string) {
    if (userId === '7884057484' || userId === '5939522605') {
        return {
            "ApprovalMatrix": [
                {
                    "contractId": "1960646668",
                    "httpStatusCode": 200,
                    "opstatus": 0,
                    "referenceNo": "33994",
                    "requesterId": "raast stp",
                    "featureActionId": "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE",
                    "amount": "1.00",
                    "sentBy": "7884057484",
                    "status": "APPROVED",
                    "transactionType": "ExternalTransfer",
                    "fromAccountNumber": "060510224211",
                    "toAccountNumber": "01050105856769",
                    "lastModifiedAt": "2025-10-18 03:49:32.0",
                    "transactionReferenceId": "2756675839940669",
                    "transactionData": "{\"stan\":\"838297\"}",
                    "transactionType2": "Interbank Account to Account Fund Transfer",
                    "typeId": "MONETARY"
                },
                {
                    "contractId": "1960646668",
                    "httpStatusCode": 200,
                    "opstatus": 0,
                    "referenceNo": "33970",
                    "requesterId": "raast stp",
                    "featureActionId": "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE",
                    "amount": "1.00",
                    "sentBy": "7884057484",
                    "status": "IN PROGRESS",
                    "transactionType": "ExternalTransfer",
                    "fromAccountNumber": "060510224211",
                    "toAccountNumber": "01050105856769",
                    "lastModifiedAt": "2025-10-18 01:19:23.0",
                    "transactionReferenceId": "2612348479607740",
                    "transactionData": "{\"stan\":\"721069\"}",
                    "transactionType2": "Interbank Account to Account Fund Transfer",
                    "typeId": "MONETARY"
                },
                {
                    "contractId": "1960646668",
                    "httpStatusCode": 200,
                    "opstatus": 0,
                    "referenceNo": "26588",
                    "requesterId": "raast stp",
                    "featureActionId": "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE",
                    "amount": "1.00",
                    "sentBy": "7884057484",
                    "status": "APPROVED",
                    "transactionType": "InternalTransfer",
                    "fromAccountNumber": "060510224211",
                    "toAccountNumber": "238921162",
                    "lastModifiedAt": "2025-09-13 04:45:54.0",
                    "transactionReferenceId": "1525665127989248",
                    "transactionData": "{\"stan\":\"007087\"}",
                    "transactionType2": "Interbank Account to Account Fund Transfer",
                    "typeId": "MONETARY"
                },
                {
                    "contractId": "1960646668",
                    "httpStatusCode": 200,
                    "opstatus": 0,
                    "referenceNo": "26587",
                    "requesterId": "raast stp",
                    "featureActionId": "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE",
                    "amount": "1.00",
                    "sentBy": "7884057484",
                    "status": "APPROVED",
                    "transactionType": "InternalTransfer",
                    "fromAccountNumber": "060510224211",
                    "toAccountNumber": "331997792",
                    "lastModifiedAt": "2025-09-13 04:45:49.0",
                    "transactionReferenceId": "4261818738409472",
                    "transactionData": "{\"stan\":\"566616\"}",
                    "transactionType2": "Interbank Account to Account Fund Transfer",
                    "typeId": "MONETARY"
                }
            ],
            "opstatus": 0,
            "httpStatusCode": 200
        }
    } else {
        return {
            ApprovalMatrix: [],
            opstatus: 1,
            httpStatusCode: 404,
            message: 'Notifications not found'
        }
    }
}

export async function sendOtpForUsernameRecovery(values: { email: string, mobileNumber: string }) {
    // This is a placeholder for the actual API call.
    // In a real application, you would use fetch to make a POST request to the UBL API.
    // For now, we'll just check for specific values and return a mock response.
  
    if (values.email === 'humna.sadia@ubl.com.pk' && values.mobileNumber === '03343498426') {
      return {
        "SecurityKEY": "c03fc1f4-6d08-454b-8499-a953dbeaedb3",
        "MessageContent": "Success - In Process",
        "opstatus": 0,
        "message": "Success - In Process",
        "httpStatusCode": 200
      };
    } else {
      return {
        opstatus: 1,
        message: 'Invalid details provided.',
        httpStatusCode: 400
      };
    }
}

export async function verifyOtp(values: { otp: string, email: string, mobileNumber: string }) {
    // This is a placeholder for the actual API call.
    // For now, we'll check for a hardcoded OTP.
    if (values.email === 'humna.sadia@ubl.com.pk' && values.mobileNumber === '03343498426' && values.otp === '123456') {
        return {
            "isOtpVerified": "true",
            "opstatus": 0,
            "httpStatusCode": 200,
            "message": "Successfully verified"
        }
    } else {
        return {
            "isOtpVerified": "false",
            "opstatus": 1,
            "httpStatusCode": 400,
            "message": "Provided OTP is incorrect."
        }
    }
}

export async function forgotUsername(values: { email: string, mobileNumber: string }) {
    // This is a placeholder for the actual API call.
    if (values.email === 'humna.sadia@ubl.com.pk' && values.mobileNumber === '03343498426') {
        return {
            "ForgotServices": [
                {
                    "responseCode": "02"
                }
            ],
            "opstatus": 0,
            "httpStatusCode": 0,
            "errmsg": "JSONObject[\"records\"] not found."
        };
    } else {
        return {
            opstatus: 1,
            message: 'User not found.',
            httpStatusCode: 404
        };
    }
}
  
export async function validateUser(values: { loginId: string, email: string }) {
    if (values.loginId === 'raaststp' && values.email === 'humna.sadia@ubl.com.pk') {
        return {
            "ForgotServices": [
                {
                    "email": "humna.sadia@ubl.com.pk",
                    "phone": "03343498426",
                    "customer_id": "7884057484"
                }
            ],
            "opstatus": 0,
            "httpStatusCode": 0
        };
    } else {
        return {
            opstatus: 1,
            message: 'User does not exist.',
            httpStatusCode: 404
        };
    }
}

export async function downloadStatement(params: {
    fileType: string;
    fromDate: string;
    toDate: string;
    accountNumber: string;
}) {
    const { fileType, fromDate, toDate, accountNumber } = params;

    // This is a mock service to generate a file for download.
    // In a real application, this would fetch data and generate a file based on it.
    try {
        let base64Data;
        let mimeType;

        if (fileType === 'pdf') {
            // A valid, minimal PDF file encoded in Base64
            base64Data = 'JVBERi0xLjQKJfbk/N8KMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovT3V0bGluZXMgMiAwIFIKL1BhZ2VzIDMgMCBSCi9QYWdlTW9kZSAvVXNlT3V0bGluZXMKL1ZpZXdlclByZWZlcmVuY2VzIDw8Ci9GaXQgV2luZG93IHRydWUKPj4KPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL091dGxpbmVzCi9Db3VudCAwCj4+CmVuZG9iagozIDAgb2JqCjw8Ci9UeXBlIC9QYWdlcwovS2lkcyBbNCAwIFJdCi9Db3VudCAxCi9NZWRpYUJveCBbMCAwIDU5NSA4NDJdCj4+CmVuZG9iago0IDAgb2JqCjw8Ci9UeXBlIC9QYWdlCi9QYXJlbnQgMyAwIFIKL1JvdGF0ZSAwCi9Db250ZW50cyA1IDAgUgovUmVzb3VyY2VzIDw8Ci9Gb250IDw8Ci9GMSA2IDAgUgovRmEuIDw8Ci9GMSA2IDAgUgovRmIgIDw8Ci9GMSA2IDAgUgovRmMuIDw8Ci9GMSA2IDAgUgovRmQuIDw8Ci9GMSA2IDAgUgovRmUuIDw8Ci9GMSA2IDAgUgovRmYuIDw8Ci9GMSA2IDAgUgo+Pgo+Pgo+Pgo+PgplbmRvYmoKNSAwIG9iago8PAovTGVuZ3RoIDE0NQo+PgpzdHJlYW0KMSAwIDAgLTEgMCA4NDIgY20KLjYwMCAwIDAgLjYwMCAwIDAgY20KQlQKMCBUZAooQWNjb3VudCBTdGF0ZW1lbnQgZm9yIC0gYWNjb3VudE51bWJlcjogKSBUagplbmRzdHJlYW0KZW5kb2JqCjYgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvSGVsdmV0aWNhCi9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nCj4+CmVuZG9iagp4cmVmCjAgOAowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwMDA5MyAwMDAwMCBuIAowMDAwMDAwMTQ4IDAwMDAwIG4gCjAwMDAwMDAyMzAgMDAwMDAgbiAKMDAwMDAwMzc4IDAwMDAwIG4gCjAwMDAwMDA1MDkgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA4Ci9Sb290IDEgMCBSCi9JbmZvIDcgMCBSCi9JbmZvIDcgMCBSCi9JbmZvIDcgMCBSCi9JbmZvIDcgMCBSCi9JbmZvIDcgMCBSCi9JbmZvIDcgMCBSCi9JbmZvIDcgMCBSCi9JbmZvIDcgMCBSCi9JbmZvIDcgMCBSCj4+CgpzdGFydHhyZWY6NzE5CiUlRU9G';
            mimeType = 'application/pdf';
        } else {
            const header = `Account Statement for ${accountNumber} from ${fromDate} to ${toDate}\n\n`;
            const transactions = 'Date,Description,Debit,Credit,Balance\n2025-11-28,"CASH WITHDRAWAL - ATM","500.00","0","1,590,841.33"\n2025-11-28,"RAAST P2P FT","0","4,518.00","1,591,341.33"';
            const fileContent = header + transactions;
            base64Data = btoa(fileContent);
            
            switch (fileType) {
                case 'csv':
                    mimeType = 'text/csv';
                    break;
                case 'xls':
                case 'xlsx':
                     mimeType = 'application/vnd.ms-excel';
                    break;
                default:
                    mimeType = 'application/octet-stream';
            }
        }

        return { 
            success: true,
            base64: base64Data,
            mimeType,
            fileType,
            opstatus: 0,
            httpStatusCode: 200
        };

    } catch (error: any) {
        console.error('Download statement error:', error);
        return { success: false, message: error.message || 'An unexpected error occurred.' };
    }
}

export async function getBulkFiles(userId: string) {
    if (userId === '7884057484' || userId === '5939522605') {
        return {
            "NDC_BulkPayments": [
                {
                    "fileName": "Omni.csv",
                    "uploadDate": "2025-12-01 10:31:01.0",
                    "accountName": "NAWAZ ALI",
                    "fileReferenceNumber": "0081917700012351",
                    "comment": "file is not in proper format kindly re upload file",
                    "accountNumber": "060510224211",
                    "isActive": "0",
                    "uploadedBy": "7884057484",
                    "fileType": "CSV",
                    "status": "0"
                },
                {
                    "fileName": "Bank islami -mnp.csv",
                    "uploadDate": "2025-11-28 13:06:00.0",
                    "accountName": "NAWAZ ALI",
                    "fileReferenceNumber": "0005918007246727",
                    "comment": "FILE UPLOADED SUCCESS",
                    "accountNumber": "060510224211",
                    "isActive": "1",
                    "uploadedBy": "7884057484",
                    "fileType": "CSV",
                    "status": "1"
                },
                {
                    "fileName": "Publishex.2.csv",
                    "uploadDate": "2025-11-26 15:08:17.0",
                    "accountName": "NAWAZ ALI",
                    "fileReferenceNumber": "0059501680341863",
                    "comment": "FILE UPLOADED SUCCESS",
                    "accountNumber": "060510224211",
                    "isActive": "1",
                    "uploadedBy": "7884057484",
                    "fileType": "CSV",
                    "status": "1"
                },
                {
                    "fileName": "Publishex.1.csv",
                    "uploadDate": "2025-11-26 15:02:02.0",
                    "accountName": "NAWAZ ALI",
                    "fileReferenceNumber": "0097644861752175",
                    "comment": "FILE UPLOADED SUCCESS",
                    "accountNumber": "060510224211",
                    "isActive": "1",
                    "uploadedBy": "7884057484",
                    "fileType": "CSV",
                    "status": "1"
                },
                {
                    "fileName": "Publishex.csv",
                    "uploadDate": "2025-11-26 14:48:13.0",
                    "accountName": "NAWAZ ALI",
                    "fileReferenceNumber": "0035374899391518",
                    "comment": "FILE UPLOADED SUCCESS",
                    "accountNumber": "060510224211",
                    "isActive": "1",
                    "uploadedBy": "7884057484",
                    "fileType": "CSV",
                    "status": "1"
                }
            ],
            "opstatus": 0,
            "httpStatusCode": 200
        }
    } else {
        return {
            NDC_BulkPayments: [],
            opstatus: 1,
            httpStatusCode: 404,
            message: 'Bulk file history not found'
        }
    }
}
    
export async function uploadBulkFile(accountNumber: string, file: File) {
    if (accountNumber === '060510224211') {
        const extension = file.name.split('.').pop()?.toLowerCase();
        if (extension !== 'csv' && extension !== 'txt') {
             return {
                opstatus: 1,
                httpStatusCode: 400,
                message: 'File format is not supported. Please upload a .csv or .txt file.'
            };
        }

        // Mocking the API call
        return {
            "NDC_BulkPayments": [
                {
                    "accountNumber": accountNumber,
                    "fileType": extension?.toUpperCase()
                }
            ],
            "opstatus": 0,
            "httpStatusCode": 200
        };
    } else {
         return {
            opstatus: 1,
            httpStatusCode: 404,
            message: 'Account not found for bulk file upload.'
        };
    }
}

async function fileToBase64(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer.toString('base64');
}

export async function getBulkFileData(payload: {
    user_id: string;
    file_refid: string;
    file_name: string;
    file_type: string;
    product_type: string;
    file_content: File; // Changed to File
}) {
    // This is a mock service. In a real scenario, you'd post this to your backend.
    const { user_id, file_refid, file_name, file_type, product_type, file_content } = payload;
    
    // Simulate converting file to base64
    const base64String = await fileToBase64(file_content);

    // Basic validation
    if (!user_id || !file_name || !base64String) {
        return { opstatus: 1, httpStatusCode: 400, message: "Invalid payload provided" };
    }

    // Mock successful response
    return {
        "records": [
            {
                "file_refid": file_refid,
                "file_name": file_name,
                "product_type": product_type,
                "file_type": file_type,
            }
        ],
        "opstatus": 0,
        "httpStatusCode": 0
    };
}


export async function createBulkFileData(payload: {
    user_id: string;
    file_refid: string;
}) {
    // This is a mock service.
     const { user_id, file_refid } = payload;
    
    if (!user_id || !file_refid) {
         return { opstatus: 1, httpStatusCode: 400, message: "Invalid payload for createBulkFileData" };
    }
    
    return {
        "response": "{\"map\":{\"records\":{\"myArrayList\":[{\"map\":{\"resCode\":\"2\"}}]},\"opstatus\":0,\"httpStatusCode\":0}}",
        "opstatus": 0,
        "httpStatusCode": 0
    };
}
    
export async function getTradeRequestHistory(userId: string) {
    if (userId === '6747741730') {
        return {
            "records": [
                {
                    "file_refid": "0008068236624052",
                    "product_type": "Contract Reg - DP",
                    "user_id": "6747741730",
                    "children": "[{\"id\": 174, \"extra3\": \"{\\\"Applicant_Name\\\":\\\"\\\",\\\"Currency\\\":\\\"usd\\\",\\\"Amount_CCY\\\":\\\"23\\\",\\\"Tenor\\\":\\\"\\\",\\\"Shipment_Date\\\":\\\"\\\",\\\"HS_Code\\\":\\\"\\\",\\\"userName\\\":\\\"Hassan Ahmed4\\\"}\", \"status\": \"Open\", \"createdts\": \"2025-12-01 16:30:35.000000\", \"file_name\": \"ubl_logo.png\", \"file_type\": \"LC Application\", \"product_type\": \"Contract Reg - DP\"}]",
                    "FirstName": "Hassan",
                    "name": "NAWAZ ALI 2",
                    "extra1": "Open",
                    "LastName": "Ahmed4"
                },
                {
                    "file_refid": "0008849199402560",
                    "product_type": "Contract Reg - DP",
                    "user_id": "6747741730",
                    "children": "[{\"id\": 172, \"extra3\": \"{\\\"Applicant_Name\\\":\\\"\\\",\\\"Currency\\\":\\\"fvf\\\",\\\"Amount_CCY\\\":\\\"344\\\",\\\"Tenor\\\":\\\"\\\",\\\"Shipment_Date\\\":\\\"\\\",\\\"HS_Code\\\":\\\"\\\",\\\"userName\\\":\\\"Hassan Ahmed4\\\"}\", \"status\": \"Open\", \"createdts\": \"2025-12-01 15:53:49.000000\", \"file_name\": \"omni app testing.xlsx\", \"file_type\": \"LC Application\", \"product_type\": \"Contract Reg - DP\"}]",
                    "FirstName": "Hassan",
                    "name": "NAWAZ ALI 2",
                    "extra1": "Open",
                    "LastName": "Ahmed4"
                },
                {
                    "file_refid": "0036233731207122",
                    "product_type": "Contract Reg - DP",
                    "user_id": "6747741730",
                    "children": "[{\"id\": 173, \"extra3\": \"{\\\"Applicant_Name\\\":\\\"\\\",\\\"Currency\\\":\\\"eee\\\",\\\"Amount_CCY\\\":\\\"20\\\",\\\"Tenor\\\":\\\"\\\",\\\"Shipment_Date\\\":\\\"\\\",\\\"HS_Code\\\":\\\"\\\",\\\"userName\\\":\\\"Hassan Ahmed4\\\"}\", \"status\": \"Open\", \"createdts\": \"2025-12-01 16:26:40.000000\", \"file_name\": \"ubl_logo.png\", \"file_type\": \"LC Application\", \"product_type\": \"Contract Reg - DP\"}]",
                    "FirstName": "Hassan",
                    "name": "NAWAZ ALI 2",
                    "extra1": "Open",
                    "LastName": "Ahmed4"
                }
            ],
            "opstatus": 0,
            "httpStatusCode": 0
        }
    } else {
        return {
            records: [],
            opstatus: 1,
            httpStatusCode: 404,
            message: 'Trade request history not found'
        }
    }
}

export async function getPendingApprovals(userId: string, searchString: string = "", sortBy: string = "approveDate", sortOrder: string = "desc", limit: number = 10, offset: number = 0) {
    if (userId === '5939522605') {
        return {
            "ApprovalMatrix": [
                {
                    "approverId": "5939522605",
                    "contractId": "1960646668",
                    "httpStatusCode": 200,
                    "opstatus": 0,
                    "referenceNo": "5233",
                    "featureActionId": "BILL_PAY_CREATE_PAYEES",
                    "assignedDate": "2025-11-21 23:38:39.0",
                    "sentBy": "3943220338",
                    "status": "IN PROGRESS",
                    "requesterName": "Mehmood Sanjrani",
                    "transactionType2": "Bill Payment Payee",
                    "notes2": "{\"notes\":\"{\\\"instVal\\\":\\\"K-Electric\\\\\\/KE\\\",\\\"consumerNo\\\":\\\"123456789\\\",\\\"typeVal\\\":\\\"Utility\\\"}\",\"isVerified\":\"false\",\"nickName\":\"Test Bill\",\"accountType\":\"BILLER\",\"createdOn\":\"2025-11-21 23:38:39.0\",\"isInternationalAccount\":\"false\",\"softDelete\":\"true\",\"beneficiaryName\":\"Test Bill\",\"response\":\"1\",\"isSTP\":\"1\",\"isSameBankAccount\":\"true\",\"Id\":\"00983107\",\"User_id\":\"3943220338\",\"isInsert\":\"1\",\"cId\":\"1960646668\"}",
                    "typeId": "NON_MONETARY"
                },
                {
                    "approverId": "5939522605",
                    "contractId": "1960646668",
                    "httpStatusCode": 200,
                    "opstatus": 0,
                    "referenceNo": "5232",
                    "featureActionId": "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT",
                    "assignedDate": "2025-11-21 23:37:37.0",
                    "sentBy": "3943220338",
                    "status": "IN PROGRESS",
                    "requesterName": "Mehmood Sanjrani",
                    "transactionType2": "Interbank Payee",
                    "notes2": "{\"notes\":\"{\\\"catergoryId\\\":\\\"5\\\",\\\"shelf\\\":\\\"Tax Payments\\\",\\\"branchCode\\\":\\\"0105\\\",\\\"bankIMD\\\":\\\"627873\\\"}\",\"isVerified\":\"false\",\"nickName\":\"IBFT PAYEE\",\"accountType\":\"EXTERNAL_ACCOUNT\",\"bankName\":\"Meezan Bank Limited\",\"accountNumber\":\"01050105856769\",\"routingNumber\":\"123456789\",\"isInternationalAccount\":\"false\",\"beneficiaryName\":\"MUHAMMAD HASSAN SIDDIQUI\",\"isSameBankAccount\":\"false\",\"httpStatusCode\":\"200\",\"opStatus\":\"0\",\"createdOn\":\"2025-11-21 23:37:37.0\",\"initialView\":\"makeTransfer\"}",
                    "typeId": "NON_MONETARY"
                },
                {
                    "approverId": "5939522605",
                    "contractId": "1960646668",
                    "httpStatusCode": 200,
                    "opstatus": 0,
                    "referenceNo": "50916",
                    "featureActionId": "RAAST_TRANSACTION_CREATE",
                    "amount": "1.00",
                    "assignedDate": "2025-11-29 02:53:32.0",
                    "sentBy": "3943220338",
                    "status": "IN PROGRESS",
                    "transactionType": "BulkRaast",
                    "fromAccountNumber": "060510224211",
                    "toAccountNumber": "",
                    "notes": "{\"fromAccountName\":\"NAWAZ ALI\",\"fromBranchCode\":\"0605\",\"fileid\":\"0048557389899874\",\"filename\":\"nov_02\",\"fromAccIdentificationVal\":\"4110385560469\"}",
                    "requesterName": "Mehmood Sanjrani",
                    "transactionType2": "Raast Transfer",
                    "typeId": "MONETARY"
                }
            ],
            "opstatus": 0,
            "httpStatusCode": 200,
            "_warning": "Sort By Field name 'approveDate' is not valid. Defaulting to 'assignedDate'"
        };
    } else {
         return {
            ApprovalMatrix: [],
            opstatus: 0,
            httpStatusCode: 200,
            message: 'No pending approvals for this user'
        }
    }
}

export async function getApprovalHistory(userId: string) {
    // For 'idrees.approver' (userId: 5939522605), return the detailed mock data.
    // For other users like 'raaststp', return an empty list to simulate no history.
    if(userId === '5939522605') {
        return {
            "ApprovalMatrix": [
                {
                    "approverId": "5939522605",
                    "contractId": "1960646668",
                    "httpStatusCode": 200,
                    "opstatus": 0,
                    "referenceNo": "5881",
                    "featureActionId": "BILL_PAY_CREATE_PAYEES",
                    "assignedDate": "2025-12-01 16:52:26.0",
                    "sentBy": "7905211902",
                    "status": "REJECTED",
                    "requesterName": "Humna Saeed",
                    "transactionType2": "Bill Payment Service",
                    "notes2": "{\"isWiredRecepient\":\"false\",\"zipCode\":\"432156\",\"country\":\"Pakistan\",\"notes\":\"{\\\"typeKey\\\":\\\"ONE_BILL\\\",\\\"instKey\\\":\\\"ONEBILLINVOICE\\\",\\\"typeVal\\\":\\\"1 Bill\\\",\\\"instVal\\\":\\\"Invoice/Voucher\\\",\\\"billerAccountNo\\\":\\\"256185056\\\",\\\"billerBrCode\\\":\\\"1888\\\",\\\"billerBankIMD\\\":\\\"588974\\\",\\\"billerBranchName\\\":\\\"UBL CBS\\\",\\\"billerBankName\\\":\\\"UBL\\\",\\\"billerCurrency\\\":\\\"PKR\\\",\\\"categoryKey\\\":\\\"4\\\",\\\"categoryVal\\\":\\\"Travels\\\",\\\"enquiryID\\\":\\\"982654105\\\",\\\"dueDate\\\":\\\"2025-12-01\\\",\\\"lateSurcharge\\\":\\\"-9000000\\\",\\\"actualAmount\\\":\\\"9000000\\\",\\\"partialPaymentAllowed\\\":\\\"false\\\",\\\"consumerNo\\\":\\\"1364762032170397\\\",\\\"contractId\\\":\\\"1960646668\\\",\\\"coreCustomerId\\\":\\\"20269367\\\",\\\"billAmount\\\":\\\"9000000\\\",\\\"billStatus\\\":\\\"Paid\\\"}\",\"isAutoPayEnabled\":\"false\",\"nickName\":\"1bill\",\"companyName\":\"Invoice/Voucher\",\"transitDays\":\"3\",\"accountNumber\":\"1364762032170397\",\"billermaster_id\":\"1\",\"softDelete\":\"true\",\"response\":\"1\",\"isSTP\":\"1\",\"name\":\"1bill\",\"addressLine1\":\"$addressLine1\",\"addressLine2\":\"Pakistan\",\"isManuallyAdded\":\"false\",\"eBillEnable\":\"0\",\"Id\":\"00126006\",\"User_Id\":\"7905211902\",\"email\":\"$email\",\"isInsert\":\"1\",\"nameOnBill\":\"1 Bill\"}",
                    "typeId": "NON_MONETARY"
                },
                {
                    "approverId": "5939522605",
                    "contractId": "1960646668",
                    "httpStatusCode": 200,
                    "opstatus": 0,
                    "referenceNo": "47668",
                    "featureActionId": "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE",
                    "amount": "1.00",
                    "assignedDate": "2025-11-21 22:22:47.0",
                    "sentBy": "3943220338",
                    "status": "APPROVED",
                    "transactionType": "ExternalTransfer",
                    "fromAccountNumber": "060510224211",
                    "toAccountNumber": "01050105856769",
                    "notes": "{\"reviewContext\":{\"reviewDetails\":true,\"transferSuccess\":false,\"beneDetails\":{\"id\":\"00964353\",\"notes\":\"{\\\"catergoryId\\\":\\\"5\\\",\\\"shelf\\\":\\\"Tax Payments\\\",\\\"branchCode\\\":\\\"0105\\\",\\\"bankIMD\\\":\\\"627873\\\"}\",\"isVerified\":\"false\",\"nickName\":\"MUHAMMAD HASSAN SIDDIQUI\",\"accountType\":\"EXTERNAL_ACCOUNT\",\"bankName\":\"Meezan Bank Limited\",\"accountNumber\":\"01050105856769\",\"routingNumber\":\"123456789\",\"isInternationalAccount\":\"false\",\"beneficiaryName\":\"MUHAMMAD HASSAN SIDDIQUI\",\"isSameBankAccount\":\"false\",\"httpStatusCode\":\"200\",\"opStatus\":\"0\",\"createdOn\":\"2025-11-11 14:49:22.0\",\"initialView\":\"makeTransfer\"},\"otherDetails\":{\"amount\":\"1.00\",\"fromAccount\":\"060510224211\",\"purpose\":\"Fund Transfer\",\"fromAccountName\":\"NAWAZ ALI\",\"toAccountName\":\"MUHAMMAD HASSAN SIDDIQUI\",\"toAccountNumber\":\"01050105856769\",\"currency\":\"PKR\"}},\"selectedAccount\":{\"depositType\":\"S\",\"GLCode\":\"31100400\",\"accountTitle\":\"NAWAZ ALI\",\"accountType\":\"100\",\"accountCurrency\":\"PKR\",\"accountNumber\":\"060510224211\",\"BlockedAmount\":\"0\",\"availableBalance\":\"1502645.5\",\"accountStatus\":\"A\",\"categoryType\":\"01\",\"branchCode\":\"0605\",\"bankName\":\"United Bank Limited\",\"branchName\":\"UBL CBS\",\"AcctOpenDate\":\"11.04.2007\",\"DCCFlag\":\"Y\",\"cnic\":\"4110385560469\",\"contactno\":\"03013577447\",\"fromIban\":\"PK87UNIL0112060510224211\"},\"transferContext\":{\"id\":\"00964353\",\"notes\":\"{\\\"catergoryId\\\":\\\"5\\\",\\\"shelf\\\":\\\"Tax Payments\\\",\\\"branchCode\\\":\\\"0105\\\",\\\"bankIMD\\\":\\\"627873\\\"}\",\"isVerified\":\"false\",\"nickName\":\"MUHAMMAD HASSAN SIDDIQUI\",\"accountType\":\"EXTERNAL_ACCOUNT\",\"bankName\":\"Meezan Bank Limited\",\"accountNumber\":\"01050105856769\",\"routingNumber\":\"123456789\",\"isInternationalAccount\":\"false\",\"beneficiaryName\":\"MUHAMMAD HASSAN SIDDIQUI\",\"isSameBankAccount\":\"false\",\"httpStatusCode\":\"200\",\"opStatus\":\"0\",\"createdOn\":\"2025-11-11 14:49:22.0\",\"initialView\":\"makeTransfer\"},\"fromAccountName\":\"NAWAZ ALI\",\"payeeName\":\"MUHAMMAD HASSAN SIDDIQUI\"}",
                    "transactionReferenceId": "8210184066909956",
                    "transactionData": "{\"stan\":\"486213\"}",
                    "requesterName": "Mehmood Sanjrani",
                    "transactionType2": "Interbank Account to Account Fund Transfer",
                    "typeId": "MONETARY"
                },
                {
                    "approverId": "5939522605",
                    "contractId": "1960646668",
                    "httpStatusCode": 200,
                    "opstatus": 0,
                    "referenceNo": "5231",
                    "featureActionId": "INTRA_BANK_FUND_TRANSFER_CREATE_RECEPIENT",
                    "assignedDate": "2025-11-21 23:36:14.0",
                    "sentBy": "3943220338",
                    "status": "REJECTED",
                    "requesterName": "Mehmood Sanjrani",
                    "transactionType2": "Intra Bank Fund Transfer",
                    "notes2": "{\"notes\":\"{\\\"catergoryId\\\":\\\"4\\\",\\\"shelf\\\":\\\"Travels\\\",\\\"branchCode\\\":\\\"3319\\\",\\\"bankIMD\\\":\\\"588974\\\"}\",\"isVerified\":\"false\",\"nickName\":\"HASSAN\",\"accountType\":\"INTERNAL_ACCOUNT\",\"bankName\":\"UBL\",\"accountNumber\":\"331997792\",\"createdOn\":\"2025-11-21 23:36:14.0\",\"routingNumber\":\"588974\",\"phoneNumber\":\"03122715025\",\"isInternationalAccount\":\"false\",\"softDelete\":\"true\",\"beneficiaryName\":\"MUHAMMAD HASAAN SIDDIQUI\",\"response\":\"1\",\"isSTP\":\"1\",\"isSameBankAccount\":\"true\",\"Id\":\"00983105\",\"User_id\":\"3943220338\",\"isInsert\":\"1\",\"cId\":\"1960646668\"}",
                    "typeId": "NON_MONETARY"
                },
                {
                    "approverId": "5939522605",
                    "contractId": "1960646668",
                    "httpStatusCode": 200,
                    "opstatus": 0,
                    "referenceNo": "50913",
                    "featureActionId": "INTRA_BANK_FUND_TRANSFER_CREATE",
                    "amount": "1.00",
                    "assignedDate": "2025-11-29 02:51:06.0",
                    "sentBy": "3943220338",
                    "status": "APPROVED",
                    "transactionType": "BulkFT",
                    "fromAccountNumber": "060510224211",
                    "toAccountNumber": "",
                    "notes": "{\"fromAccountName\":\"NAWAZ ALI\",\"fromBranchCode\":\"0605\",\"fileid\":\"0048557389899874\",\"filename\":\"nov_02\"}",
                    "transactionReferenceId": "7643666660631890",
                    "transactionData": "{\"stan\":\"358561\"}",
                    "requesterName": "Mehmood Sanjrani",
                    "transactionType2": "Intra Bank Fund Transfer",
                    "typeId": "MONETARY"
                },
                {
                    "approverId": "5939522605",
                    "contractId": "1960646668",
                    "httpStatusCode": 200,
                    "opstatus": 0,
                    "referenceNo": "50914",
                    "featureActionId": "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE",
                    "amount": "1.00",
                    "assignedDate": "2025-11-29 02:51:33.0",
                    "sentBy": "3943220338",
                    "status": "APPROVED",
                    "transactionType": "BulkIBFT",
                    "fromAccountNumber": "060510224211",
                    "toAccountNumber": "",
                    "notes": "{\"fromAccountName\":\"NAWAZ ALI\",\"fromBranchCode\":\"0605\",\"fileid\":\"0048557389899874\",\"filename\":\"nov_02\"}",
                    "transactionReferenceId": "7643666934754670",
                    "transactionData": "{\"stan\":\"937758\"}",
                    "requesterName": "Mehmood Sanjrani",
                    "transactionType2": "Interbank Account to Account Fund Transfer",
                    "typeId": "MONETARY"
                },
                {
                    "approverId": "5939522605",
                    "contractId": "1960646668",
                    "httpStatusCode": 200,
                    "opstatus": 0,
                    "referenceNo": "50915",
                    "featureActionId": "RAAST_TRANSACTION_CREATE",
                    "amount": "1.00",
                    "assignedDate": "2025-11-29 02:53:07.0",
                    "sentBy": "3943220338",
                    "status": "APPROVED",
                    "transactionType": "BulkRaast",
                    "fromAccountNumber": "060510224211",
                    "toAccountNumber": "",
                    "notes": "{\"fromAccountName\":\"NAWAZ ALI\",\"fromBranchCode\":\"0605\",\"fileid\":\"0048557389899874\",\"filename\":\"nov_02\",\"fromAccIdentificationVal\":\"4110385560469\"}",
                    "transactionReferenceId": "7643667875793050",
                    "transactionData": "{\"stan\":\"827474\"}",
                    "requesterName": "Mehmood Sanjrani",
                    "transactionType2": "Raast Transfer",
                    "typeId": "MONETARY"
                },
                {
                    "approverId": "5939522605",
                    "contractId": "1960646668",
                    "httpStatusCode": 200,
                    "opstatus": 0,
                    "referenceNo": "50911",
                    "featureActionId": "RAAST_TRANSACTION_CREATE",
                    "amount": "2.00",
                    "assignedDate": "2025-11-29 01:50:09.0",
                    "sentBy": "3943220338",
                    "status": "APPROVED",
                    "transactionType": "BulkRaast",
                    "fromAccountNumber": "060510224211",
                    "toAccountNumber": "",
                    "notes": "{\"fromAccountName\":\"NAWAZ ALI\",\"fromBranchCode\":\"0605\",\"fileid\":\"0012413468344393\",\"filename\":\"Prod_file_3k_01\",\"fromAccIdentificationVal\":\"4110385560469\"}",
                    "transactionReferenceId": "7643630095973440",
                    "transactionData": "{\"stan\":\"288366\"}",
                    "requesterName": "Mehmood Sanjrani",
                    "transactionType2": "Raast Transfer",
                    "typeId": "MONETARY"
                },
                {
                    "approverId": "5939522605",
                    "contractId": "1960646668",
                    "httpStatusCode": 200,
                    "opstatus": 0,
                    "referenceNo": "50910",
                    "featureActionId": "INTRA_BANK_FUND_TRANSFER_CREATE",
                    "amount": "2.00",
                    "assignedDate": "2025-11-29 01:49:20.0",
                    "sentBy": "3943220338",
                    "status": "APPROVED",
                    "transactionType": "BulkFT",
                    "fromAccountNumber": "060510224211",
                    "toAccountNumber": "",
                    "notes": "{\"fromAccountName\":\"NAWAZ ALI\",\"fromBranchCode\":\"0605\",\"fileid\":\"0012413468344393\",\"filename\":\"Prod_file_3k_01\"}",
                    "transactionReferenceId": "7643629605995580",
                    "transactionData": "{\"stan\":\"644223\"}",
                    "requesterName": "Mehmood Sanjrani",
                    "transactionType2": "Intra Bank Fund Transfer",
                    "typeId": "MONETARY"
                },
                {
                    "approverId": "5939522605",
                    "contractId": "1960646668",
                    "httpStatusCode": 200,
                    "opstatus": 0,
                    "referenceNo": "50912",
                    "featureActionId": "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE",
                    "amount": "1.00",
                    "assignedDate": "2025-11-29 01:54:34.0",
                    "sentBy": "3943220338",
                    "status": "APPROVED",
                    "transactionType": "ExternalTransfer",
                    "fromAccountNumber": "060510224211",
                    "toAccountNumber": "01050105856769",
                    "notes": "{\"reviewContext\":{\"reviewDetails\":true,\"transferSuccess\":false,\"beneDetails\":{\"id\":\"00964353\",\"notes\":\"{\\\"catergoryId\\\":\\\"5\\\",\\\"shelf\\\":\\\"Tax Payments\\\",\\\"branchCode\\\":\\\"0105\\\",\\\"bankIMD\\\":\\\"627873\\\"}\",\"isVerified\":\"false\",\"nickName\":\"MUHAMMAD HASSAN SIDDIQUI\",\"accountType\":\"EXTERNAL_ACCOUNT\",\"bankName\":\"Meezan Bank Limited\",\"accountNumber\":\"01050105856769\",\"routingNumber\":\"123456789\",\"isInternationalAccount\":\"false\",\"beneficiaryName\":\"MUHAMMAD HASSAN SIDDIQUI\",\"isSameBankAccount\":\"false\",\"httpStatusCode\":\"200\",\"opStatus\":\"0\",\"createdOn\":\"2025-11-11 14:49:22.0\",\"initialView\":\"makeTransfer\"},\"otherDetails\":{\"amount\":\"1.00\",\"fromAccount\":\"060510224211\",\"purpose\":\"Fund Transfer\",\"fromAccountName\":\"NAWAZ ALI\",\"toAccountName\":\"MUHAMMAD HASSAN SIDDIQUI\",\"toAccountNumber\":\"01050105856769\",\"currency\":\"PKR\"}},\"selectedAccount\":{\"depositType\":\"S\",\"GLCode\":\"31100400\",\"accountTitle\":\"NAWAZ ALI\",\"accountType\":\"100\",\"accountCurrency\":\"PKR\",\"accountNumber\":\"060510224211\",\"BlockedAmount\":\"0\",\"availableBalance\":\"1590841.33\",\"accountStatus\":\"A\",\"categoryType\":\"01\",\"branchCode\":\"0605\",\"bankName\":\"United Bank Limited\",\"branchName\":\"UBL CBS\",\"AcctOpenDate\":\"11.04.2007\",\"DCCFlag\":\"Y\",\"cnic\":\"4110385560469\",\"contactno\":\"03013577447\",\"fromIban\":\"PK87UNIL0112060510224211\"},\"transferContext\":{\"id\":\"00964353\",\"notes\":\"{\\\"catergoryId\\\":\\\"5\\\",\\\"shelf\\\":\\\"Tax Payments\\\",\\\"branchCode\\\":\\\"0105\\\",\\\"bankIMD\\\":\\\"627873\\\"}\",\"isVerified\":\"false\",\"nickName\":\"MUHAMMAD HASSAN SIDDIQUI\",\"accountType\":\"EXTERNAL_ACCOUNT\",\"bankName\":\"Meezan Bank Limited\",\"accountNumber\":\"01050105856769\",\"routingNumber\":\"123456789\",\"isInternationalAccount\":\"false\",\"beneficiaryName\":\"MUHAMMAD HASSAN SIDDIQUI\",\"isSameBankAccount\":\"false\",\"httpStatusCode\":\"200\",\"opStatus\":\"0\",\"createdOn\":\"2025-11-11 14:49:22.0\",\"initialView\":\"makeTransfer\"},\"fromAccountName\":\"NAWAZ ALI\",\"payeeName\":\"MUHAMMAD HASSAN SIDDIQUI\"}",
                    "transactionReferenceId": "4909468072766220",
                    "transactionData": "{\"stan\":\"392600\"}",
                    "requesterName": "Mehmood Sanjrani",
                    "transactionType2": "Interbank Account to Account Fund Transfer",
                    "typeId": "MONETARY"
                },
                {
                    "approverId": "5939522605",
                    "contractId": "1960646668",
                    "httpStatusCode": 200,
                    "opstatus": 0,
                    "referenceNo": "50909",
                    "featureActionId": "INTRA_BANK_FUND_TRANSFER_CREATE",
                    "amount": "1.00",
                    "assignedDate": "2025-11-29 01:48:18.0",
                    "sentBy": "3943220338",
                    "status": "APPROVED",
                    "transactionType": "InternalTransfer",
                    "fromAccountNumber": "060510224211",
                    "toAccountNumber": "PK08UNIL0109000331997792",
                    "notes": "{\"reviewContext\":{\"reviewDetails\":true,\"transferSuccess\":false,\"beneDetails\":{\"id\":\"00653852\",\"notes\":\"{\\\"catergoryId\\\":\\\"3\\\",\\\"shelf\\\":\\\"Salary Payments\\\",\\\"branchCode\\\":\\\"pk08\\\",\\\"bankIMD\\\":\\\"588974\\\"}\",\"isVerified\":\"false\",\"nickName\":\"MUHAMMAD HASAAN SIDDIQUI\",\"accountType\":\"INTERNAL_ACCOUNT\",\"bankName\":\"UBL\",\"accountNumber\":\"PK08UNIL0109000331997792\",\"routingNumber\":\"588974\",\"isInternationalAccount\":\"false\",\"beneficiaryName\":\"MUHAMMAD HASAAN SIDDIQUI\",\"isSameBankAccount\":\"true\",\"httpStatusCode\":\"200\",\"opStatus\":\"0\",\"createdOn\":\"2025-11-11 14:49:22.0\",\"initialView\":\"makeTransfer\"},\"otherDetails\":{\"amount\":\"1.00\",\"fromAccount\":\"060510224211\",\"purpose\":\"Fund Transfer\",\"fromAccountName\":\"NAWAZ ALI\",\"toAccountName\":\"MUHAMMAD HASAAN SIDDIQUI\",\"toAccountNumber\":\"PK08UNIL0109000331997792\",\"currency\":\"PKR\"}},\"selectedAccount\":{\"depositType\":\"S\",\"GLCode\":\"31100400\",\"accountTitle\":\"NAWAZ ALI\",\"accountType\":\"100\",\"accountCurrency\":\"PKR\",\"accountNumber\":\"060510224211\",\"BlockedAmount\":\"0\",\"availableBalance\":\"1590841.33\",\"accountStatus\":\"A\",\"categoryType\":\"01\",\"branchCode\":\"0605\",\"bankName\":\"United Bank Limited\",\"branchName\":\"UBL CBS\",\"AcctOpenDate\":\"11.04.2007\",\"DCCFlag\":\"Y\",\"cnic\":\"4110385560469\",\"contactno\":\"03013577447\",\"fromIban\":\"PK87UNIL0112060510224211\"},\"transferContext\":{\"id\":\"00653852\",\"notes\":\"{\\\"catergoryId\\\":\\\"3\\\",\\\"shelf\\\":\\\"Salary Payments\\\",\\\"branchCode\\\":\\\"pk08\\\",\\\"bankIMD\\\":\\\"588974\\\"}\",\"isVerified\":\"false\",\"nickName\":\"MUHAMMAD HASAAN SIDDIQUI\",\"accountType\":\"INTERNAL_ACCOUNT\",\"bankName\":\"UBL\",\"accountNumber\":\"PK08UNIL0109000331997792\",\"routingNumber\":\"588974\",\"isInternationalAccount\":\"false\",\"beneficiaryName\":\"MUHAMMAD HASAAN SIDDIQUI\",\"isSameBankAccount\":\"true\",\"httpStatusCode\":\"200\",\"opStatus\":\"0\",\"createdOn\":\"2025-11-11 14:49:22.0\",\"initialView\":\"makeTransfer\"},\"fromAccountName\":\"NAWAZ ALI\",\"payeeName\":\"MUHAMMAD HASAAN SIDDIQUI\"}",
                    "transactionReferenceId": "4057746037756640",
                    "transactionData": "{\"stan\":\"350590\"}",
                    "requesterName": "Mehmood Sanjrani",
                    "transactionType2": "Intra Bank Fund Transfer",
                    "typeId": "MONETARY"
                }
            ],
            "opstatus": 0,
            "httpStatusCode": 200
        }
    } else {
         return {
            ApprovalMatrix: [],
            opstatus: 1,
            httpStatusCode: 404,
            message: 'Approval history not found'
        }
    }
}


export async function rejectRequest(payload: {
    accountNo: number;
    approverId: string;
    contractId: string;
    referenceNo: string;
    rejectorId: string;
    remarks: string;
}) {
    // This is a mock service call.
    return {
        "ApprovalMatrix": [
            {
                "httpStatusCode": 200,
                "opstatus": 0,
                "reqResponse": "REQUEST REJECTED SUCCESSFULLY"
            }
        ],
        "opstatus": 0,
        "httpStatusCode": 200
    };
}

export async function updateBulkRecordsStatus(payload: {
    customerId: string;
    transactionId: string;
    status: 'REJECTED';
}) {
    // This is a mock service call
    return {
        "responses": "{\"records\":[{\"resMsg\":\"Rejected\"}],\"opstatus\":0,\"httpStatusCode\":0}&*&{\"P_RESDESC\":\"ORA-06500: PL/SQL: storage error\",\"opstatus\":0,\"P_RESCODE\":\"500\",\"P_RESMSG\":\"Failure\",\"httpStatusCode\":0}",
        "opstatus": 0,
        "responseMessage": "Success",
        "responseCode": "00",
        "httpStatusCode": 0
    };
}

    