'use client';

import { Suspense, useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { type Payee } from '@/components/bill-payment/payee-table';
import ReviewScreen from "@/components/bill-payment/review-screen";

// Interface for Account Detail
interface AccountDetail {
  accountNumber: string;
  accountTitle: string;
  availableBalance: string;
  accountCurrency: string;
}

function PayBillContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const payeeString = searchParams.get('payee');
  const [loading, setLoading] = useState(false);
  const [consumerNos, setConsumerNos] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState<string>('0');
  const [selectedPayees, setSelectedPayees] = useState<Payee[]>([]);
  const [accountsList, setAccountsList] = useState<AccountDetail[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<AccountDetail | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const { toast } = useToast();
  const [otpServiceKey, setOtpServiceKey] = useState('');
  const formatCurrency = (amount: string | number | undefined) => {
    if (amount === undefined || amount === null) return 'PKR 0.00';
    const num = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : amount;
    return `PKR ${new Intl.NumberFormat('en-PK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num)}`;
  };

  const remainingBalance = useMemo(() => {
    if (!selectedAccount) return 0;
    const available = parseFloat(selectedAccount.availableBalance.replace(/,/g, ''));
    const total = parseFloat(totalAmount.replace(/,/g, ''));
    return available - total;
  }, [selectedAccount, totalAmount]);

  useEffect(() => {
    const checkStatus = async () => {
      // 1. Pehle URL parameters se single payee check karein
      const payeeParam: Payee | null = payeeString ? JSON.parse(payeeString) : null;
      
      // 2. Session storage se potential multiple payees uthain
      const savedPayeesStr = sessionStorage.getItem('selected_payees_data');
      const savedConsumers = sessionStorage.getItem('pending_payment_consumers');
      const savedTotal = sessionStorage.getItem('total_payable_amount');
      const profileStr = sessionStorage.getItem("userProfile");
      const claimsToken = sessionStorage.getItem("claimsToken");
      const savedAccountStr = sessionStorage.getItem('accounts');

      const profile = profileStr ? JSON.parse(profileStr) : null;
      const accountsData = savedAccountStr ? JSON.parse(savedAccountStr) : null;
      const token = claimsToken;
      const kuid = profile?.user_attributes?.UserName;
      const accountNumber = accountsData?.[0]?.ACCT_NO;

      // DATA POPULATION LOGIC
      if (savedPayeesStr) {
        // Agar multi-pay table se aaye hain
        setSelectedPayees(JSON.parse(savedPayeesStr));
      } else if (payeeParam) {
        // Agar single "Pay" button se aaye hain
        setSelectedPayees([payeeParam]);
      }

      if (savedTotal) {
        setTotalAmount(savedTotal);
      } else if (payeeParam?.amountDue) {
        setTotalAmount(payeeParam.amountDue);
      }

      if (savedConsumers) {
        setConsumerNos(savedConsumers);
      }
      
      const customerId = profile?.user_attributes?.user_id;
      const payload = { consumerNo: savedConsumers, customer_id: customerId };

      try {
        await fetch('/api/payment-bill-Multiplebill-isBillExist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, payload })
        });

        const accDetailRes = await fetch("/api/get-account-details-retail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, kuid, accountNumber }),
        });
        const response = await accDetailRes.json();
        
        if (response.Accounts) {
          setAccountsList(response.Accounts);
        }
      } catch (err) {
        console.error("Error fetching account details:", err);
      } 
    };

    checkStatus();
  }, [router, payeeString]);

const handleContinue = () => {
    if (!selectedAccount) return;
    setShowReview(true);
  };


  const handleSendOTP = async () => {
    setLoading(true);
    const sessionToken = sessionStorage.getItem("claimsToken");
    const userProfile = JSON.parse(sessionStorage.getItem('userProfile') || '{}');
    
    const customerId = userProfile?.user_attributes?.customer_id;        ; 
    const kuid = userProfile?.user_attributes?.UserName;

    try {
        const res = await fetch("/api/OTPSend", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: sessionToken,
                kuid,
                customerId: customerId,
            })
        });

        const data = await res.json();

        if (data.opstatus === 0 && data.OTP?.[0]?.statusCode === "200") {
            setOtpServiceKey(data.OTP[0].serviceKey);
            setLoading(false); 
        
      
        setTimeout(() => {
            setIsOtpOpen(true);
            console.log("Setting isOtpOpen to true"); // Console mein check karein
        }, 100);
            
            
        } else {
            toast({ 
                variant: "destructive", 
                title: "OTP Failed", 
                description: data.OTP?.[0]?.message || "Could not send OTP" 
            });
        }
    } catch (err) {
        toast({ variant: "destructive", title: "Network Error", description: "Failed to connect to OTP service" });
    } finally {
        setLoading(false);
    }
};

const handleOtpConfirm = async (otpValue: string) => {
  setLoading(true);
  const sessionToken = sessionStorage.getItem("claimsToken");

  try {
      const res = await fetch("/api/verify-OTP", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              otp: otpValue,
              securityKey: otpServiceKey, 
              token: sessionToken
          })
      });

      const data = await res.json();

      
      if (data.opstatus === 0 && data.OTP?.[0]?.isOtpVerified === "true") {
          setIsOtpOpen(false); 
          toast({ title: "Verified", description: "OTP verified successfully!" });

          // OTP verify hone ke baad Payee create karne ki final service hit karein
      } else {
          toast({ 
              variant: "destructive", 
              title: "Invalid OTP", 
              description: "The OTP you entered is incorrect or expired." 
          });
      }
  } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Something went wrong during verification." });
  } finally {
      setLoading(false);
  }
};

  if (showReview) {
    // Exactly like Add Payee: conditional rendering
    const paymentReviewData = {
      mode: 'PAYMENT',
      fromAccount: selectedAccount,
      payees: selectedPayees,
      totalAmount: totalAmount,
    };

    return (
      <ReviewScreen 
        data={selectedPayees[0] as any} // Fallback for single data
        formdata={paymentReviewData}
        onBack={() => setShowReview(false)}
        onCancel={() => router.push('/bill-payment')}
        onContinue={handleSendOTP} 
        isOtpOpen={isOtpOpen}
        setIsOtpOpen={setIsOtpOpen}
        onOtpConfirm={handleOtpConfirm}
      />
    );
  }

  return (
    <DashboardLayout>
      <main className="flex-1 flex flex-col p-4 sm:px-6 sm:py-4 gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Pay Bill</h1>
          <div className="flex items-center gap-6 text-right">
            <div>
              <p className="text-sm text-muted-foreground">Total Payment</p>
              <p className="font-semibold text-primary">{formatCurrency(totalAmount)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="font-semibold text-green-600">
                {selectedAccount ? formatCurrency(selectedAccount.availableBalance) : 'PKR ********'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Remaining Balance</p>
              <p className={`font-semibold ${remainingBalance < 0 ? 'text-red-600' : 'text-blue-600'}`}>
                {selectedAccount ? formatCurrency(remainingBalance) : 'PKR ********'}
              </p>
            </div>
          </div>
        </div>

        <Card className="shadow-sm">
          <CardContent className="p-8 pb-20 min-h-[280px] flex flex-col justify-start">
            <div className="max-w-md space-y-4">
              <h2 className="font-semibold text-lg text-gray-800">
                Select an account for Bill Payment
              </h2>
              
              <div className="space-y-3">
                <Label htmlFor="from-account" className="text-sm font-medium text-gray-600">
                  From Account
                </Label>
                <Select 
                  onValueChange={(val) => {
                    const acc = accountsList.find(a => a.accountNumber === val);
                    if (acc) setSelectedAccount(acc);
                  }}
                  value={selectedAccount?.accountNumber || ""}
                >
                  <SelectTrigger 
                    id="from-account" 
                    className="h-24 bg-[#00529B] hover:bg-[#003f75] text-white border-none transition-all rounded-md px-4 flex justify-between items-center"
                  >
                    <div className="flex flex-col items-start overflow-hidden text-left">
                      {selectedAccount ? (
                        <>
                          <span className="font-bold uppercase">{selectedAccount.accountTitle}</span>
                          <span className="text-xs text-blue-100">{selectedAccount.accountNumber}</span>
                        </>
                      ) : (
                        <SelectValue placeholder={<span className="text-blue-100">Select Account</span>} />
                      )}
                    </div>
                  </SelectTrigger>

                  <SelectContent className="bg-white text-black">
                    {accountsList.map((acc) => (
                      <SelectItem key={acc.accountNumber} value={acc.accountNumber} className="py-4 border-b last:border-0 focus:bg-blue-50 cursor-pointer">
                        <div className="flex flex-col items-start gap-0.5">
                          <span className="font-bold">{acc.accountTitle}</span>
                          <span className="text-xs text-gray-500">{acc.accountNumber}</span>
                          <span className="text-xs font-bold text-[#00529B]">
                            {acc.accountCurrency} {parseFloat(acc.availableBalance).toLocaleString()}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {!selectedAccount && (
                  <p className="text-[11px] text-amber-600 italic">
                    * Please select an account to proceed with the payment
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="sticky bottom-0 bg-background/95 p-4 border-t z-10">
        <div className="max-w-7xl mx-auto flex justify-end items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>Back</Button>
          <Button variant="outline" onClick={() => router.push('/bill-payment')}>Cancel</Button>
          <Button 
            className="bg-[#00529B] hover:bg-[#003f75] text-white"
            disabled={!selectedAccount || remainingBalance < 0}
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>
      </footer>
    </DashboardLayout>
  );
}

export default function PayBillPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PayBillContent />
    </Suspense>
  )
}