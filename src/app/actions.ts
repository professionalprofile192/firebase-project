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


const decodeCaesar = (str: string) => {
    return str.split('').map(char => {
        const code = char.charCodeAt(0);
        if (code >= 33 && code <= 126) {
            // Ensure the wrap-around is handled correctly for printable ASCII
            let decodedCode = code - 33 - 13;
            if (decodedCode < 0) {
                decodedCode += 94;
            }
            return String.fromCharCode((decodedCode % 94) + 33);
        }
        return char;
    }).join('');
};

const parseTransactionDesc = (desc: string): { [key: string]: string } => {
    const decodedDesc = decodeCaesar(desc);
    const result: { [key: string]: string } = {};

    decodedDesc.split('`/~').forEach(item => {
        const parts = item.replace(/~%dwwulexwhOlvw%=/g, '').replace(/%/g, '').split('`/%wudqvdfwlrqGdwh%');
        parts.forEach(part => {
            const sections = part.split('~%dwwulexwhYdoxh%=');
            if (sections.length > 1) {
                const value = sections[1].split('%/%dwwulexwhNh|%=%');
                if (value.length > 1) {
                    result[value[1].replace(/%/g, '').toLowerCase()] = value[0];
                }
            }
        });
    });
    return result;
};


export async function getAccountStatements(accountNumber: string) {
     if (accountNumber === '060510224211') {
        const response = {
            "Account_Statements": [
                {"amount": "43=?/","runningBalance": "484596:18=?/","sequenceId": "8<4<675<3:=?/", "transactionNature": "Fuhglw=?/","transDate": "5358044053#33=33=33=?/","transactionDesc": "~%dwwulexwhOlvw%=^~%dwwulexwhYdoxh%=%UDDVW#S5S#IW#IURP#V\\HG#EDVKLU#XO#KDVDQ#PHEO#DFFW=#SN4:PH]Q---------<<:#PVJLG=#DPH]QSNND336334435;;<<:5844536368%/%dwwulexwhNh|%=%SDUWLFXODUV%`/%wudqvdfwlrqGdwh%=%5358044053#33=33=33%=?/"},
                {"amount": "8=?/","runningBalance": "484597518=?/","sequenceId": "8<4<693758=?/", "transactionNature": "Fuhglw=?/","transDate": "5358044053#33=33=33=?/","transactionDesc": "~%dwwulexwhOlvw%=^~%dwwulexwhYdoxh%=%XEO#GLJLWDO=LQWHUQDO#IXQGV#WUDQVIHU#IURP#V\\HG#EDVKLU0XO0KDVDQ##dqg##X]PD#+D2F#36<8----879;,#0#EDQN=#XEO%/%dwwulexwhNh|%=%SDUWLFXODUV%`/%wudqvdfwlrqGdwh%=%5358044053#33=33=33%=?/"},
                {"amount": "5=?/","runningBalance": "484597718=?/","sequenceId": "8<53859665=?/", "transactionNature": "Fuhglw=?/","transDate": "5358044053#33=33=33=?/","transactionDesc": "~%dwwulexwhOlvw%=^~%dwwulexwhYdoxh%=%XEO#GLJLWDO=LQWHUQDO#IXQGV#WUDQVIHU#IURP#KXPQD#VDGLD#VDHHG#+D2F#3336----:974,#0#EDQN=#XEO%/%dwwulexwhNh|%=%SDUWLFXODUV%`/%wudqvdfwlrqGdwh%=%5358044053#33=33=33%=?/"},
                {"amount": "4=?/","runningBalance": "484597818=?/","sequenceId": "8<53:44554=?/", "transactionNature": "Fuhglw=?/","transDate": "5358044053#33=33=33=?/","transactionDesc": "~%dwwulexwhOlvw%=^~%dwwulexwhYdoxh%=%XEO#GLJLWDO=LQWHUQDO#IXQGV#WUDQVIHU#IURP#KXPQD#VDGLD#VDHHG#+D2F#3336----:974,#0#EDQN=#XEO%/%dwwulexwhNh|%=%SDUWLFXODUV%`/%wudqvdfwlrqGdwh%=%5358044053#33=33=33%=?/"},
                {"amount": "8333=?/","runningBalance": "483:97818=?/","sequenceId": "8<53:46964=?/", "transactionNature": "Ghelw=?/","transDate": "5358044053#33=33=33=?/","transactionDesc": "~%dwwulexwhOlvw%=^~%dwwulexwhYdoxh%=%FDVK#ZLWKGUDZDO#0#DWP#+EU=#4;:5,%/%dwwulexwhNh|%=%SDUWLFXODUV%`/%wudqvdfwlrqGdwh%=%5358044053#33=33=33%=?/"}
            ],
            "responseCode": "33=?/","opstatus": 0,"httpStatusCode": 0
        };

        const decodedTransactions = response.Account_Statements.map(tx => {
            const decodedNature = decodeCaesar(tx.transactionNature.replace('=?/', ''));
            const particulars = parseTransactionDesc(tx.transactionDesc)?.particulars || 'N/A';
            const decodedDate = decodeCaesar(tx.transDate.replace('=?/', ''));
            
            const datePart = decodedDate.split('#')[0];
            const timePart = (decodedDate.split('#')[1] || '00:00:00').replace(/=/g, ':');
            
            // Reconstruct in a way that JS Date constructor understands: YYYY-MM-DDTHH:mm:ss
            const formattedDate = datePart.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
            const dateString = `${formattedDate}T${timePart}Z`;

            return {
                seqno: decodeCaesar(tx.sequenceId.replace('=?/', '')),
                tranDate: new Date(dateString).toISOString(),
                particulars: particulars,
                CRDR: decodedNature === 'Debit' ? 'D' : 'C',
                tranAmt: decodeCaesar(tx.amount.replace('=?/', '')),
                runBal: decodeCaesar(tx.runningBalance.replace('=?/', '')),
            }
        });
        
        return {
            "payments": decodedTransactions,
            "opstatus": 0,
            "httpStatusCode": 0
        };
    }
     else {
        return {
            payments: [],
            opstatus: 1,
            httpStatusCode: 404,
            message: 'Transactions not found for this account'
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





    





