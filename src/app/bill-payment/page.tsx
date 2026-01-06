
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
          // Fetch Payees
          const payeeData = await fetch("/api/get-payee-list", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  token: sessionToken,
                  kuid: userProfile?.user_attributes?.UserName,
                  payload: {
                    offset: 0,
                    limit: 10,
                    sortBy: "createdOn",
                    order: "desc",
                    payeeId: userProfile?.userid,
                    searchString: "",
                  },
              }),
          });
          const payeeRes = await payeeData.json();

          // Fetch Categories
          const categoryData = await fetch("/api/get-all-categories", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  token: sessionToken,
                  kuid: userProfile?.user_attributes?.UserName,
                  payload: { categorytype: "bill" }
              })
              
          })
          const categoryRes = await categoryData.json();

          // --- Payee Response Handling ---
        if (payeeRes && payeeRes.opstatus === 0 && payeeRes.payee && payeeRes.payee.length > 0) {
        
            const mappedPayees = payeeRes.payee.map((p: any) => {
              let parsedNotes: any = {};
              try {
                parsedNotes = typeof p.notes === 'string' ? JSON.parse(p.notes) : (p.notes || {});
              } catch (e) {
                console.error("Failed to parse notes for payee:", p.payeeId, e);
              }
              return {
                payeeId: p.payeeId || p.id,
                consumerName: p.payeeName || 'N/A',
                payeeNickName: p.payeeNickName || p.nickName || 'N/A',
                billerType: p.nameOnBill || 'N/A',
                companyName: p.companyName || 'N/A',
                consumerNumber: p.accountNumber || '',
                status: parsedNotes.billStatus || 'Not Available',
                amountDue: parsedNotes.billAmount || '0',
                dueDate: parsedNotes.dueDate ? format(new Date(parsedNotes.dueDate), 'dd/MM/yyyy') : 'N/A',
                amountAfterDueDate: parsedNotes.lateSurcharge || '0',
                category: parsedNotes.categoryVal || 'Uncategorized',
                
                // Ye key poora parsed object hold karegi taake Edit page par kaam aaye
                rawNotes: parsedNotes 
              };
            });

          setAllPayees(mappedPayees);
          setFilteredPayees(mappedPayees);

          // Sirf tab chalega jab Payee list ka data aaye ---
          try {
              console.log("Payee list found, fetching bill details...");
              const billData = await fetch("/api/payment-bill-integration", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                      token: sessionToken,
                      kuid: userProfile?.user_attributes?.UserName,
                  }),
              });
              const billRes = await billData.json();
              console.log("Integration Bill Response:", billRes);



          } catch (billError) {
              console.error("Bill Service failed but continuing with payees:", billError);
          }
            //bill inquiry service

            if (payeeRes && payeeRes.payee && payeeRes.payee.length > 0) {
                
              // 1. Payload Taiyar Karna (Payee List se data map karna)
              const bulkRequests = payeeRes.payee.map((p) => {
                  let parsedNotes = {};
                  try {
                      parsedNotes = JSON.parse(p.notes || '{}');
                  } catch (e) { console.error("Notes parse error", e); }

                  return {
                      billInquiryRequest: {
                          billDetails: {
                              // instKey ko companyCode banaya aur accountNumber ko consumerNumber
                              companyCode: parsedNotes.instKey || "", 
                              consumerNumber: p.accountNumber || "",
                              expiryDays: "2" // Jaisa aapke network payload mein tha
                          }
                      }
                  };
              });

              // Final Object Structure (Jaisa aapne bataya)
              const bulkInquiryPayload = {
                  bulkBillInquiryRequest: JSON.stringify({
                      bulkBillInquiryRequest: bulkRequests
                  })
              };

              // 2. Service Call (Just after get-bill)
              try {
                  console.log("Fetching Bulk Bill Inquiry...");
                  const bulkInquiryData = await fetch("/api/payment-bill-inquiry", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                          token: sessionToken,
                          kuid:  userProfile?.user_attributes?.UserName,
                          payload: bulkInquiryPayload // Dynamic payload pass ho raha hai
                      }),
                  });
                  const bulkRes = await bulkInquiryData.json();
                  console.log("Bulk Inquiry Response:", bulkRes);
              } catch (err) {
                  console.error("Bulk Inquiry Service Failed:", err);
              }
            }

        } else {
          
          setFilteredPayees([]);
          if (payeeRes?.opstatus !== -1) { 
              toast({ 
                  variant: "destructive", 
                  title: "Failed to fetch payees", 
                  description: payeeRes?.errmsg || 'Could not load payee data.' 
              });
          }
        }

        // --- Category Response Handling ---
        if (categoryRes && categoryRes.opstatus === 0 && categoryRes.PaymentService) {
          setCategories(categoryRes.PaymentService);
        } else {
          setCategories([]);

               if (categoryRes?.opstatus !== -1) {
                toast({ variant: "destructive", title: "Failed to fetch categories", description: categoryRes?.errmsg || 'Could not load category data.' });
               }
          }

    } catch (error) {
       toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred while fetching data." });
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
            payee.billerType.toLowerCase().includes(payeeSearchTerm.toLowerCase())
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
    (item.transactionId?.toLowerCase() || '').includes(historySearchTerm.toLowerCase())
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
