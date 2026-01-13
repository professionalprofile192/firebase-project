
'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PayeeTable, type Payee } from '@/components/bill-payment/payee-table';
import { BillPaymentHistoryTable, type HistoryItem } from '@/components/bill-payment/bill-payment-history-table';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const billPaymentHistory: HistoryItem[] = [];

type Account = {
  ACCT_NO: string;
  ACCT_TITLE: string;
  AVAIL_BAL: string;
  DEPOSIT_TYPE: string;
};


type Category = {
    id: string;
    name: string;
};


function BillPaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'bill-payment');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [multiPayMode, setMultiPayMode] = useState(false);
  const [payeeSearchTerm, setPayeeSearchTerm] = useState('');
  const [historySearchTerm, setHistorySearchTerm] = useState('');
  const [billPaymentHistory, setBillPaymentHistory] = useState<HistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [allPayees, setAllPayees] = useState<Payee[]>([]);
  const [filteredPayees, setFilteredPayees] = useState<Payee[]>([]);
  const [loadingPayees, setLoadingPayees] = useState(true);
  const { toast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const tabFromParams = searchParams.get('tab'); 

  //bill history
  const fetchBillHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const token = sessionStorage.getItem("claimsToken");
      const userProfileString = sessionStorage.getItem('userProfile');
      
      if (!token || !userProfileString) return;

      const userProfile = JSON.parse(userProfileString);

      const res = await fetch("/api/get-bill-payment-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token,
          kuid: userProfile?.user_attributes?.UserName,
            payload: {
                fromAccountNumber:"",
                consumerNumber: "",
                searchString: "",
                startDate: "",
                endDate: ""
            }
        })
    });

      const result = await res.json();

      if (result.opstatus === 0) {
       
        const historyData = typeof result.getBillHistory === "string" 
          ? JSON.parse(result.getBillHistory) 
          : result.getBillHistory;
        
        setBillPaymentHistory(historyData?.records || []);
      } else {
        toast({ variant: "destructive", title: "History Error", description: result.errmsg || "Failed to fetch history" });
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoadingHistory(false);
    }
  }, [selectedAccount, toast]);


//for bulk bill payment
const fetchBulkData = useCallback(async () => {
  const sessionToken = sessionStorage.getItem("claimsToken");
  const userProfileStr = sessionStorage.getItem("userProfile");

  if (!sessionToken || !userProfileStr) return;
  const userProfile = JSON.parse(userProfileStr);

  const requestBody = {
    token: sessionToken,
    kuid: userProfile?.user_attributes?.UserName,
    payload: {
      remitterType: "UBP",
      status: 1,
      fromAccountNumber: selectedAccount?.ACCT_NO || "",
      userId: userProfile?.userid || ""
    }
  };

  try {
    // 1. Hit Total Transfers Count Service
    const resCount = await fetch("/api/get-bulk-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });
    const countData = await resCount.json();

    // 2. Hit Payments List Service
    const resList = await fetch("/api/get-bulk-payment-total", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });
    const listData = await resList.json();

    // Update States
    if (countData.opstatus === 0) {
      // e.g. setTotalCount(countData.NDC_BulkPayments[0].noOfTransaactions)
    }
    if (listData.opstatus === 0) {
      // e.g. setBulkList(listData.NDC_BulkPayments)
    }

  } catch (error) {
    console.error("Bulk Services Error:", error);
  }
}, [selectedAccount]);


    //for view activity
    const handleViewActivity = () => {
      setActiveTab('bill-payment-history');
    };

  //for bill history
  useEffect(() => {
    if (activeTab === 'bill-payment-history') {
      fetchBillHistory();
    } 
    else if (activeTab === 'bulk-bill-payment') {
      fetchBulkData();}
  }, [activeTab, fetchBillHistory, fetchBulkData]);

  useEffect(() => {
    // 1. Account Selection Logic
    const accountsStr = sessionStorage.getItem("accounts");
    if (accountsStr) {
        try {
            const parsedAccounts: Account[] = JSON.parse(accountsStr);
            setAccounts(parsedAccounts);
            
            // Agar pehle se koi account selected nahi hai, tabhi pehla select karein
            if (parsedAccounts.length > 0 && !selectedAccount) {
                setSelectedAccount(parsedAccounts[0]);
            }
        } catch (err) {
            console.error("Error parsing accounts from session:", err);
        }
    }

    // 2. Tab Selection Logic (Jo URL params se aa raha hai)
    if (tabFromParams) {
        setActiveTab(tabFromParams);
    }
}, [tabFromParams]); // Jab bhi tab change ho, ye dobara check kare
   
const fetchData = useCallback(async () => {
  setLoadingPayees(true);
  setPayeeSearchTerm('');
  setHistorySearchTerm('');
  setSelectedCategory('all');

  const sessionToken = sessionStorage.getItem("claimsToken");
  const userProfileString = sessionStorage.getItem('userProfile');

  if (!sessionToken || !userProfileString) {
    toast({ variant: "destructive", title: "Error", description: "Session not found. Please log in again." });
    setLoadingPayees(false);
    router.push('/');
    return;
  }
  
  try {
    const userProfile = JSON.parse(userProfileString);
    const userName = userProfile?.user_attributes?.UserName;

    // 1. FETCH PAYEE LIST
    const payeeData = await fetch("/api/get-payee-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            token: sessionToken,
            kuid: userName,
            payload: {
              offset: 0, limit: 10, sortBy: "createdOn", order: "desc",
              payeeId: userProfile?.userid, searchString: "",
            },
        }),
    });
    const payeeRes = await payeeData.json();

    // 2. FETCH ALL CATEGORIES
    const categoryData = await fetch("/api/get-all-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            token: sessionToken,
            kuid: userName,
            payload: { categorytype: "bill" }
        })
    });
    const categoryRes = await categoryData.json();
    if (categoryRes && categoryRes.opstatus === 0 && categoryRes.PaymentService) {
      setCategories(categoryRes.PaymentService);
    }

    // Check if payees exist for Integration and Inquiry
    if (payeeRes && payeeRes.opstatus === 0 && payeeRes.payee && payeeRes.payee.length > 0) {
      
      // 3. HIT BILL INTEGRATION
      try {
          await fetch("/api/payment-bill-integration", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token: sessionToken, kuid: userName }),
          });
      } catch (billError) {
          console.error("Integration failed:", billError);
      }

      // 4. PREPARE & HIT BILL INQUIRY
      const bulkRequests = payeeRes.payee.map((p: any) => {
          let parsedNotes: any = {};
          try { parsedNotes = JSON.parse(p.notes || '{}'); } catch (e) {}
          return {
              billInquiryRequest: {
                  billDetails: {
                      companyCode: parsedNotes.instKey || "", 
                      consumerNumber: p.accountNumber || "",
                      expiryDays: "2"
                  }
              }
          };
      });

      const bulkInquiryPayload = {
          bulkBillInquiryRequest: JSON.stringify({ bulkBillInquiryRequest: bulkRequests })
      };

      const inquiryData = await fetch("/api/payment-bill-inquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              token: sessionToken,
              kuid: userName,
              payload: bulkInquiryPayload
          }),
      });
      const inquiryRes = await inquiryData.json();

      // 5. PARSE INQUIRY DATA FOR TABLE (Mapping logic)
      if (inquiryRes?.Bill?.[0]?.Response) {
        const innerResponse = JSON.parse(inquiryRes.Bill[0].Response);
        const inquiryResults = innerResponse.bulkInquiryResponseList || [];

        const finalTableData = inquiryResults.map((item: any) => {
          const bill = item.billInquiryResponse.billInfo;
          // Payee list se matching record nikalna for nickname and original notes
          const originalPayee = payeeRes.payee.find((p: any) => p.accountNumber === bill.consumerNo);
          
          let originalNotes: any = {};
          try { originalNotes = JSON.parse(originalPayee?.notes || '{}'); } catch (e) {}

          return {
            payeeId: originalPayee?.payeeId || originalPayee?.id,
            consumerName: bill.consumerName || originalPayee?.payeeName || 'N/A',
            payeeNickName: originalPayee?.payeeNickName || originalPayee?.nickName || 'N/A',
            billerType: bill.companyName || originalPayee?.companyName || 'N/A',
            companyName: bill.companyName,
            consumerNumber: bill.consumerNo,
            status: bill.billStatus,
            amountDue: bill.payableAmount?.toString(),
            dueDate: bill.dueDate ? format(new Date(bill.dueDate), 'dd/MM/yyyy') : 'N/A',
            amountAfterDueDate: (bill.payableAmount + (bill.lateSurcharge || 0)).toString(),
            category: originalNotes.categoryVal,
            rawNotes: originalNotes
          };
        });

        setAllPayees(finalTableData);
        setFilteredPayees(finalTableData);
      }
    } else {
      setAllPayees([]);
      setFilteredPayees([]);
    }

  } catch (error) {
     console.error("Fetch Data Error:", error);
     toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred." });
  } finally {
    setLoadingPayees(false);
  }
}, [toast, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  useEffect(() => {
    let newFilteredPayees = allPayees;

    // Filter by category
    if(selectedCategory !== 'all') {
        newFilteredPayees = newFilteredPayees.filter(payee => payee.category === selectedCategory);
    }
    
    // Filter by search term
    if(payeeSearchTerm) {
        newFilteredPayees = newFilteredPayees.filter(payee => 
            payee.consumerName.toLowerCase().includes(payeeSearchTerm.toLowerCase()) ||
            payee.consumerNumber.toLowerCase().includes(payeeSearchTerm.toLowerCase()) ||
            payee.billerType.toLowerCase().includes(payeeSearchTerm.toLowerCase()) ||
            payee.payeeNickName.toLowerCase().includes(payeeSearchTerm.toLowerCase())
        );
    }
    
    setFilteredPayees(newFilteredPayees);

  }, [payeeSearchTerm, selectedCategory, allPayees]);

  const handleAccountChange = (acctNo: string) => {
    const account = accounts.find(a => a.ACCT_NO === acctNo);
    setSelectedAccount(account || null);
}
  
  const getHeading = () => {
    if (multiPayMode) {
      return 'Multiple Bill Payment';
    }
    switch (activeTab) {
      case 'bill-payment':
        return 'Bill Payment';
      case 'bill-payment-history':
        return 'Bill Payment History';
      case 'bulk-bill-payment':
        return 'Bulk Utility Bill Payments';
      default:
        return 'Bill Payment';
    }
  }

  const filteredHistory = billPaymentHistory.filter(item => 
    (item.consumerName?.toLowerCase() || '').includes(historySearchTerm.toLowerCase()) ||
    (item.consumerNumber?.toLowerCase() || '').includes(historySearchTerm.toLowerCase()) ||
    (item.transactionId?.toLowerCase() || '').includes(historySearchTerm.toLowerCase()) ||
    (item.payeeNickName?.toLowerCase() || item.nickName?.toLowerCase() || '').includes(historySearchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <main className="flex-1 p-4 sm:px-6 sm:py-4 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold">
                {getHeading()}
            </h1>
            {activeTab === 'bill-payment' && (
                <div className='flex items-center gap-2'>
                    {multiPayMode ? (
                        <Button variant="outline" onClick={() => setMultiPayMode(false)}>Pay Single Bills</Button>
                    ) : (
                        <Button variant="outline" onClick={() => setMultiPayMode(true)}>Pay Multiple Bills</Button>
                    )}
                     <Button asChild>
                        <Link href="/bill-payment/add">Add Utility Bill +</Link>
                    </Button>
                </div>
            )}
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-lg grid-cols-3">
          <TabsTrigger value="bill-payment">Bill Payment</TabsTrigger>
          <TabsTrigger value="bill-payment-history">Bill Payment History</TabsTrigger>
          <TabsTrigger value="bulk-bill-payment">Bulk Bill Payment</TabsTrigger>
        </TabsList>

          <TabsContent value="bill-payment">
            <div className="mt-6 flex items-center gap-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        placeholder="Search"
                        className="pl-10 bg-muted border-none"
                        value={payeeSearchTerm}
                        onChange={(e) => setPayeeSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(category => (
                            <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <PayeeTable data={filteredPayees} multiPayMode={multiPayMode} loading={loadingPayees} onViewActivity={handleViewActivity}/>
          </TabsContent>

          <TabsContent value="bill-payment-history">
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div className="relative sm:col-span-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        placeholder="Search by name, number, or ID"
                        className="pl-10 bg-background"
                        value={historySearchTerm}
                        onChange={(e) => setHistorySearchTerm(e.target.value)}
                    />
                </div>
                <div className='sm:col-span-2 flex items-center gap-4'>
                    <Select>
                        <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select Account" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ACCT_NO">Account</SelectItem>
                           
                        </SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger className="flex-1">
                            <SelectValue placeholder="View" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="last7">Last 7 days</SelectItem>
                            <SelectItem value="last30">Last 30 days</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {loadingHistory ? (
            <div className="py-10 text-center">Loading History...</div>
          ) : (
            <BillPaymentHistoryTable data={filteredHistory} />
          )}
          </TabsContent>
          <TabsContent value="bulk-bill-payment">
            <Card className="mt-6">
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl">
                        <div className="space-y-2">
                            <Label htmlFor="account-number">Account Number</Label>
                             <Select onValueChange={handleAccountChange} value={selectedAccount?.ACCT_NO || ''}>
                                <SelectTrigger id="account-number">
                                    <SelectValue placeholder="Select Account" />
                                </SelectTrigger>
                                <SelectContent>
                                {accounts.map((account) => (
                                        <SelectItem key={account.ACCT_NO} value={account.ACCT_NO}>
                                            {account.ACCT_NO}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="account-name">Account Name</Label>
                            <Input 
                                id="account-name" 
                                value={selectedAccount?.ACCT_TITLE || ''}
                                disabled 
                                className="bg-gray-100"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </DashboardLayout>
  );
}

export default function BillPaymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BillPaymentContent />
    </Suspense>
  )
}
