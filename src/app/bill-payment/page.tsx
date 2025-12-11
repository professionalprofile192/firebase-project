
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
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const billPaymentHistory: HistoryItem[] = [];

type Account = {
  acctNo: string;
  acctName: string;
}

const accounts: Account[] = [
    { acctNo: '060510224211', acctName: 'NAWAZ ALI' },
    { acctNo: '060510224212', acctName: 'IDREES APPROVER' },
];

type Category = {
    id: string;
    name: string;
};


function BillPaymentContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'bill-payment');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [multiPayMode, setMultiPayMode] = useState(false);
  const [payeeSearchTerm, setPayeeSearchTerm] = useState('');
  const [historySearchTerm, setHistorySearchTerm] = useState('');

  const [allPayees, setAllPayees] = useState<Payee[]>([]);
  const [filteredPayees, setFilteredPayees] = useState<Payee[]>([]);
  const [loadingPayees, setLoadingPayees] = useState(true);
  const { toast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const tabFromParams = searchParams.get('tab'); 

  useEffect(() => {
    if (tabFromParams) {
      setActiveTab(tabFromParams);
    }
  }, [tabFromParams]);


  const fetchData = useCallback(async () => {
    setLoadingPayees(true);
    setPayeeSearchTerm('');
    setHistorySearchTerm('');
    setSelectedCategory('all');

    const sessionToken = sessionStorage.getItem("sessionToken");
    const userProfileString = sessionStorage.getItem('userProfile');

    if (!sessionToken || !userProfileString) {
      toast({ variant: "destructive", title: "Error", description: "Session not found. Please log in again." });
      setLoadingPayees(false);
      return;
    }
    
    const userProfile = JSON.parse(userProfileString);

    try {
        const [payeeData, categoryData] = await Promise.all([
            // Fetch Payees
            fetch("/api/get-payee-list", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: sessionToken,
                    kuid: userProfile.UserName,
                    payload: {
                        id: "",
                        offset: 0,
                        limit: 100,
                        sortBy: "createdOn",
                        order: "desc",
                        payeeId: userProfile.UserName, 
                        searchString: ""
                    }
                })
            }).then(res => res.json()),

            // Fetch Categories
            fetch("/api/get-bill-categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: sessionToken,
                    kuid: userProfile.UserName,
                })
            }).then(res => res.json())
        ]);

      if (payeeData.opstatus === 0 && payeeData.payee) {
        const mappedPayees: Payee[] = payeeData.payee.map((p: any) => {
          let notes = {};
          try {
            notes = JSON.parse(p.notes || '{}');
          } catch (e) { console.error("Failed to parse payee notes", e); }
          
          const billStatus = (notes as any).billStatus;
          let status: Payee['status'] = 'Not Payable';
          if (billStatus === 'Unpaid') status = 'Unpaid';
          else if (billStatus === 'Paid') status = 'Paid';

          return {
            consumerName: p.payeeNickName || 'N/A',
            billerType: p.nameOnBill || p.companyName || 'N/A',
            consumerNumber: p.accountNumber,
            status: status,
            amountDue: (notes as any).billAmount,
            dueDate: (notes as any).dueDate ? format(new Date((notes as any).dueDate), 'dd/MM/yyyy') : undefined,
            amountAfterDueDate: (notes as any).lateSurcharge,
            category: (notes as any).categoryVal || 'Uncategorized'
          };
        });
        setAllPayees(mappedPayees);
        setFilteredPayees(mappedPayees);
      } else {
        setAllPayees([]);
        setFilteredPayees([]);
        toast({ variant: "destructive", title: "Failed to fetch payees", description: payeeData.errmsg || payeeData.error || 'Could not load payee data.' });
      }

      if (categoryData.opstatus === 0 && categoryData.PaymentService) {
          setCategories(categoryData.PaymentService);
      } else {
          setCategories([]);
          toast({ variant: "destructive", title: "Failed to fetch categories", description: categoryData.errmsg || categoryData.error || 'Could not load category data.' });
      }

    } catch (error) {
       toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred while fetching data." });
    } finally {
      setLoadingPayees(false);
    }
  }, [toast]);

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
    const account = accounts.find(a => a.acctNo === acctNo);
    setSelectedAccount(account || null);
  };
  
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
    (item.transactionId && item.transactionId.toLowerCase().includes(historySearchTerm.toLowerCase()))
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
            <PayeeTable data={filteredPayees} multiPayMode={multiPayMode} loading={loadingPayees}/>
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
                            <SelectItem value="acc1">Account 1</SelectItem>
                            <SelectItem value="acc2">Account 2</SelectItem>
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
            <BillPaymentHistoryTable data={filteredHistory} />
          </TabsContent>
          <TabsContent value="bulk-bill-payment">
            <Card className="mt-6">
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl">
                        <div className="space-y-2">
                            <Label htmlFor="account-number">Account Number</Label>
                             <Select onValueChange={handleAccountChange} value={selectedAccount?.acctNo}>
                                <SelectTrigger id="account-number">
                                    <SelectValue placeholder="Select Account" />
                                </SelectTrigger>
                                <SelectContent>
                                     {accounts.map((account) => (
                                        <SelectItem key={account.acctNo} value={account.acctNo}>
                                            {account.acctNo}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="account-name">Account Name</Label>
                            <Input 
                                id="account-name" 
                                value={selectedAccount?.acctName || ''} 
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

    