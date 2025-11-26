'use server';

// This is a placeholder for the actual API call.
// In a real application, this would make a request to your backend,
// which would then securely call the UBL Digital API.
export async function login(values: any) {
  if (values.username === 'raaststp' && values.password === 'Kony@123456') {
    return {
      success: true,
      message: 'Login successful',
      profile: {
        userid: '7884057484',
        firstname: 'Nawaz',
        lastname: 'Ali',
        email: 'profileprofessional192@gmail.com',
        CIF_NO: '20269367', // Adding CIF_NO for the next service call
      },
    };
  } else {
    return { success: false, message: 'Invalid username or password' };
  }
}

// This is a placeholder for the actual API call.
export async function getLastLoginTime(userId: string) {
  // Simulate API call for a specific user
  if (userId === '7884057484') {
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
    } else {
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
    if (acctNo === '060510224211') {
        const paymentsString = "[{\"CRDR\":\"D\",\"seqno\":\"5920713631\",\"instNo\":\"\",\"tranAmt\":\"5000\",\"tranDate\":\"2025-11-20 00:00:00\",\"particulars\":\"CASH WITHDRAWAL - ATM\",\"runBal\":\"1507645.5\"},{\"CRDR\":\"C\",\"seqno\":\"5920711221\",\"instNo\":\"\",\"tranAmt\":\"1\",\"tranDate\":\"2025-11-20 00:00:00\",\"particulars\":\"EB985674412 UBL DIGITAL:FUNDS TRANSFER  FR-1564308567641 TO-605060510224211TXNTYPE-0010\",\"runBal\":\"1512645.5\"},{\"CRDR\":\"C\",\"seqno\":\"5920526332\",\"instNo\":\"\",\"tranAmt\":\"2\",\"tranDate\":\"2025-11-20 00:00:00\",\"particulars\":\"EB985619947 UBL DIGITAL:FUNDS TRANSFER  FR-1564308567641 TO-605060510224211TXNTYPE-0010\",\"runBal\":\"1512644.5\"},{\"CRDR\":\"C\",\"seqno\":\"5919360425\",\"instNo\":\"\",\"tranAmt\":\"5\",\"tranDate\":\"2025-11-20 00:00:00\",\"particulars\":\"EB985298862 UBL DIGITAL:FUNDS TRANSFER  FR-1779039510235468 TO-605060510224211TXNTYPE-0010\",\"runBal\":\"1512642.5\"},{\"CRDR\":\"C\",\"seqno\":\"5919342907\",\"instNo\":\"\",\"tranAmt\":\"10\",\"tranDate\":\"2025-11-20 00:00:00\",\"particulars\":\"RAAST P2P FT FROM SYED BASHIR UL HASAN MEBL ACCT: PK17MEZN*********997 MSGID: AMEZNPKKA003001102889972511203035\",\"runBal\":\"1512637.5\"},{\"CRDR\":\"D\",\"seqno\":\"5917336308\",\"instNo\":\"\",\"tranAmt\":\"5000\",\"tranDate\":\"2025-11-19 00:00:00\",\"particulars\":\"CASH WITHDRAWAL - ATM\",\"runBal\":\"1512627.5\"},{\"CRDR\":\"D\",\"seqno\":\"5914830496\",\"instNo\":\"\",\"tranAmt\":\"5000\",\"tranDate\":\"2025-11-18 00:00:00\",\"particulars\":\"CASH WITHDRAWAL - ATM\",\"runBal\":\"1517627.5\"},{\"CRDR\":\"D\",\"seqno\":\"5911804812\",\"instNo\":\"\",\"tranAmt\":\"3000\",\"tranDate\":\"2025-11-17 00:00:00\",\"particulars\":\"CASH WITHDRAWAL - ATM\",\"runBal\":\"1522627.5\"},{\"CRDR\":\"D\",\"seqno\":\"5908707170\",\"instNo\":\"\",\"tranAmt\":\"2000\",\"tranDate\":\"2025-11-16 00:00:00\",\"particulars\":\"CASH WITHDRAWAL - ATM\",\"runBal\":\"1525627.5\"},{\"CRDR\":\"D\",\"seqno\":\"5907478642\",\"instNo\":\"\",\"tranAmt\":\"5000\",\"tranDate\":\"2025-11-16 00:00:00\",\"particulars\":\"CASH WITHDRAWAL - ATM\",\"runBal\":\"1527627.5\"}]";
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
    if (userId === '7884057484') {
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
  
    if (values.email === 'profileprofessional192@gmail.com' && values.mobileNumber === '03343498426') {
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
    if (values.email === 'profileprofessional192@gmail.com' && values.mobileNumber === '03343498426' && values.otp === '123456') {
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
            "message": "Invalid OTP"
        }
    }
}
  


