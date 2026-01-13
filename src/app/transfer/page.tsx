'use client';

import { Suspense, useState, useCallback, useEffect, useMemo } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react'; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BeneficiaryList, type Beneficiary } from '@/components/transfer/beneficiary-list';
import { TransferActivityTable } from '@/components/transfer/transfer-activity-table';
import { BulkTransfer } from '@/components/transfer/bulk-transfer';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

function InitiateTransferContent() {
    const searchParams = useSearchParams();
    const tabFromUrl = searchParams.get('tab') || 'transfer';
    const [activeTab, setActiveTab] = useState(tabFromUrl);
    const [categories, setCategories] = useState<any[]>([]);
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
    
    // Nayi states search aur category filter ke liye
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        const params = new URLSearchParams(searchParams);
        params.set('tab', value);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const fetchTransferData = useCallback(async () => {
        const sessionToken = sessionStorage.getItem("claimsToken");
        const userProfile = JSON.parse(sessionStorage.getItem('userProfile') || '{}');
        const userName = userProfile?.user_attributes?.UserName;
        
        const approvalsRaw = sessionStorage.getItem("approvals");
        const approvalsData = approvalsRaw ? JSON.parse(approvalsRaw) : null;
        const payeeIdFromSession = approvalsData?.ApprovalMatrix?.[0]?.sentBy;

        if (!sessionToken) return;

        try {
            setLoading(true);
            const [catRes, payeeRes] = await Promise.all([
                fetch("/api/get-all-categories", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        token: sessionToken, 
                        kuid: userName, 
                        payload: { categorytype: "transfer" } 
                    })
                }),
                payeeIdFromSession ? fetch("/api/transfer-getExternal-Payees", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token: sessionToken, payeeId: payeeIdFromSession }),
                }) : Promise.resolve(null)
            ]);

            const categoryData = await catRes.json();
            if (categoryData.opstatus === 0) {
                setCategories(categoryData.PaymentService || []);
            }

            if (payeeRes) {
                const payeeData = await payeeRes.json();
                if (payeeData.PaymentService) {
                    const mappedData: Beneficiary[] = payeeData.PaymentService.map((item: any) => ({
                        id: item.id,
                        name: item.beneficiaryName,
                        bank: item.bankName,
                        accountNumber: item.accountNumber,
                        nickName: item.nickName,
                        accountType: item.accountType,
                        categoryId: item.categoryId // Category base filter ke liye
                    }));
                    setBeneficiaries(mappedData);
                }
            }
        } catch (err) {
            console.error("Data Load Error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (activeTab === 'transfer') fetchTransferData();
    }, [activeTab, fetchTransferData]);

    // --- Search & Filter Logic ---
    const filteredBeneficiaries = useMemo(() => {
        return beneficiaries.filter((bene) => {
            const matchesSearch = 
                bene.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                bene.accountNumber?.includes(searchTerm) ||
                bene.bank?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesCategory = selectedCategory === "all" || bene.categoryId === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [beneficiaries, searchTerm, selectedCategory]);

    const getPageTitle = () => {
        switch (activeTab) {
            case 'activity': return 'Transfer Activity';
            case 'bulk': return 'Bulk Transfer';
            default: return 'Initiate Transfer';
        }
    }


    return (
        <DashboardLayout>
            <main className="flex-1 p-4 sm:px-8 sm:py-6 flex flex-col gap-8 bg-slate-50/50">
                
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                    {/* 1. TabsList Heading se upar aa gayi */}
                  {/* TabsList container ko full width (90% approx via max-w) aur triggers ko left align kiya gaya hai */}
                  <TabsList className="flex justify-start w-[100%] bg-slate-200/50 backdrop-blur-sm p-1.5 mb-8 rounded-xl border border-slate-300/40">
                    <TabsTrigger 
                        value="transfer" 
                        className="
                            min-w-[120px] 
                            sm:w-[15%] 
                            rounded-lg
                            px-4 py-2 
                            text-sm font-medium 
                            transition-all duration-200
                            data-[state=active]:bg-white 
                            data-[state=active]:text-[#0070BA] 
                            data-[state=active]:shadow-[0_2px_10px_rgba(0,0,0,0.08)]
                            text-slate-600
                            hover:text-slate-900
                        "
                    >
                        Transfers
                    </TabsTrigger>
                    
                    <TabsTrigger 
                        value="activity" 
                        className="
                            min-w-[120px] 
                            sm:w-[15%] 
                            rounded-lg
                            px-4 py-2 
                            text-sm font-medium 
                            transition-all duration-200
                            data-[state=active]:bg-white 
                            data-[state=active]:text-[#0070BA] 
                            data-[state=active]:shadow-[0_2px_10px_rgba(0,0,0,0.08)]
                            text-slate-600
                            hover:text-slate-900
                        "
                    >
                        Transfer Activity
                    </TabsTrigger>
                    
                    <TabsTrigger 
                        value="bulk" 
                        className="
                            min-w-[120px] 
                            sm:w-[15%] 
                            rounded-lg
                            px-4 py-2 
                            text-sm font-medium 
                            transition-all duration-200
                            data-[state=active]:bg-white 
                            data-[state=active]:text-[#0070BA] 
                            data-[state=active]:shadow-[0_2px_10px_rgba(0,0,0,0.08)]
                            text-slate-600
                            hover:text-slate-900
                        "
                    >
                        Bulk Transfer
                    </TabsTrigger>
                </TabsList>
    
                    {/* 2. Page Title aur baaki filters TabsList ke neeche */}
                    {activeTab === 'transfer' && (
                        <div className="space-y-6 mb-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <h1 className="text-2xl font-semibold">{getPageTitle()}</h1>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" className="border-slate-200">Multiple Transfers</Button>
                                    <Button className="bg-[#0070BA] hover:bg-[#005a96]">Add Beneficiary +</Button>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="relative w-full sm:w-80">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input 
                                        placeholder="Search name, account or bank..." 
                                        className="pl-10 bg-slate-100 border-none h-11"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger className="w-full sm:w-[200px] h-11 border-slate-200">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {categories.map((cat: any) => (
                                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
    
                    {/* 3. Bulk Transfer Page ka Title (Alag Layout) */}
                    {activeTab === 'bulk' && (
                        <div className="mb-6">
                            <h1 className="text-2xl font-semibold">{getPageTitle()}</h1>
                            {/* Agar bulk page par koi extra button ya text chahiye toh yahan add kar sakte hain */}
                        </div>
                    )}
    
    
                    {/* Content Area */}
                    <div className="mt-6">
                        <TabsContent value="transfer" className="m-0 focus-visible:outline-none">
                            {loading ? (
                                <div className="flex justify-center p-20"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>
                            ) : (
                                <BeneficiaryList beneficiaries={filteredBeneficiaries} />
                            )}
                        </TabsContent>
    
                        <TabsContent value="activity" className="m-0 focus-visible:outline-none">
                            <TransferActivityTable />
                        </TabsContent>
    
                        <TabsContent value="bulk" className="m-0 focus-visible:outline-none">
                            <BulkTransfer />
                        </TabsContent>
                    </div>
                </Tabs>
            </main>
        </DashboardLayout>
    );
}

export default function InitiateTransferPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <InitiateTransferContent />
        </Suspense>
    )
}