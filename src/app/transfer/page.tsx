'use client';

import { Suspense, useState, useCallback, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, Download } from 'lucide-react'; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BeneficiaryList, type Beneficiary } from '@/components/transfer/beneficiary-list';
import { TransferActivityTable, type TransferActivity } from '@/components/transfer/transfer-activity-table';
import { BulkTransfer } from '@/components/transfer/bulk-transfer';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

function InitiateTransferContent() {
    const searchParams = useSearchParams();
    const tabFromUrl = searchParams.get('tab') || 'transfer';
    const [activeTab, setActiveTab] = useState(tabFromUrl);
    const [categories, setCategories] = useState<any[]>([]);
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
    const [activities, setActivities] = useState<TransferActivity[]>([]); // Dynamic Activity State
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
        if (activeTab === 'transfer') {
            fetchTransferData();
        }
    }, [activeTab, fetchTransferData]);

    useEffect(() => {
        if (tabFromUrl !== activeTab) {
            setActiveTab(tabFromUrl);
        }
    }, [tabFromUrl]);

    const getPageTitle = () => {
        switch (activeTab) {
            case 'activity': return 'Transfer Activity';
            case 'bulk': return 'Bulk Transfer';
            default: return 'Initiate Transfer';
        }
    }

    // --- Tab Specific Headers ---

    const TransferTabHeader = () => (
        <div className="space-y-6">
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
                    <Input placeholder="Search" className="pl-10 bg-slate-100 border-none h-11" />
                </div>
                <Select>
                    <SelectTrigger className="w-full sm:w-[200px] h-11 border-slate-200">
                        <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((cat: any) => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );

    const ActivityTabHeader = () => (
         <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-semibold">{getPageTitle()}</h1>
                 <Button variant="outline" className="flex items-center gap-2 border-slate-200">
                    <Download className="h-4 w-4" /> Download
                 </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input placeholder="Search" className="pl-10 bg-white border-slate-200 h-11" />
                </div>
                <Select>
                    <SelectTrigger className="w-full sm:w-[220px] h-11 border-slate-200">
                        <SelectValue placeholder="Select Account" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Accounts</SelectItem>
                        <SelectItem value="acc1">PKR 1234...567</SelectItem>
                    </SelectContent>
                </Select>
                 <Select>
                    <SelectTrigger className="w-full sm:w-[180px] h-11 border-slate-200">
                        <SelectValue placeholder="View: All" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">View: All</SelectItem>
                        <SelectItem value="last7">Last 7 Days</SelectItem>
                        <SelectItem value="last30">Last 30 Days</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );

    const renderHeader = () => {
        if (activeTab === 'activity') return <ActivityTabHeader />;
        if (activeTab === 'bulk') return <h1 className="text-2xl font-semibold">{getPageTitle()}</h1>;
        return <TransferTabHeader />;
    }

    return (
        <DashboardLayout>
            <main className="flex-1 p-4 sm:px-8 sm:py-6 flex flex-col gap-8 bg-slate-50/50">
                
                {renderHeader()}

                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                    <TabsList className="grid w-full max-w-md grid-cols-3 bg-slate-100 p-1">
                        <TabsTrigger value="transfer" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Transfers</TabsTrigger>
                        <TabsTrigger value="activity" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Transfer Activity</TabsTrigger>
                        <TabsTrigger value="bulk" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Bulk Transfer</TabsTrigger>
                    </TabsList>

                    <div className="mt-6">
                        <TabsContent value="transfer" className="m-0 focus-visible:outline-none">
                            {loading ? (
                                <div className="flex justify-center p-20"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>
                            ) : (
                                <BeneficiaryList beneficiaries={beneficiaries} />
                            )}
                        </TabsContent>

                            <TabsContent value="activity" className="m-0 focus-visible:outline-none">
                            {loading ? (
                                <div className="flex justify-center p-20"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>
                            ) : (
                            <TransferActivityTable activities={activities} />
                        )}
                        </TabsContent>

                        <TabsContent value="bulk" className="m-0 focus-visible:outline-none">
                            <BulkTransfer />
                        </TabsContent>
                    </div>
                </Tabs>
            </main>
        </DashboardLayout>
    )
}

export default function InitiateTransferPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <InitiateTransferContent />
        </Suspense>
    )
}