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
        email: 'humna.sadia@ubl.com.pk',
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
        return {
            "payments": [
                {
                    "CRDR": "C",
                    "seqno": "5919360425",
                    "instNo": "",
                    "tranAmt": "5",
                    "tranDate": "2025-11-20 00:00:00",
                    "particulars": "EB985298862 UBL DIGITAL:FUNDS TRANSFER  FR-1779039510235468 TO-605060510224211TXNTYPE-0010",
                    "runBal": "1512642.5"
                },
                {
                    "CRDR": "C",
                    "seqno": "5919342907",
                    "instNo": "",
                    "tranAmt": "10",
                    "tranDate": "2025-11-20 00:00:00",
                    "particulars": "RAAST P2P FT FROM SYED BASHIR UL HASAN MEBL ACCT: PK17MEZN*********997 MSGID: AMEZNPKKA003001102889972511203035",
                    "runBal": "1512637.5"
                },
                {
                    "CRDR": "D",
                    "seqno": "5917336308",
                    "instNo": "",
                    "tranAmt": "5000",
                    "tranDate": "2025-11-19 00:00:00",
                    "particulars": "CASH WITHDRAWAL - ATM",
                    "runBal": "1512627.5"
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
            message: 'Transactions not found for this account'
        }
    }
}
