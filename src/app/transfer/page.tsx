'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BeneficiaryList, type Beneficiary } from '@/components/transfer/beneficiary-list';
import { TransferActivityTable, type TransferActivity } from '@/components/transfer/transfer-activity-table';
import { BulkTransfer } from '@/components/transfer/bulk-transfer';


// Dummy data based on the provided image for Beneficiaries
const beneficiaries: Beneficiary[] = [
    {
        name: 'BURQUE ENTERPRISES PVT LTD',
        secondaryName: 'BURQUE ENTERPRISES PVT LTD',
        accountNumber: 'PK79HABB0000307901346105',
        bankName: 'Habib Bank Limited',
    },
    {
        name: 'ELEGANZ LUXURY',
        secondaryName: 'ELEGANZ LUXURY PVT LTD',
        accountNumber: 'PK21HABB0000307901346105',
        bankName: 'Habib Bank',
    },
    {
        name: 'NAVEED BROTHERS',
        secondaryName: 'NAVEED BROTHERS',
        accountNumber: 'PK24MPBL9736774000000',
        bankName: 'Habib Metropolitan Bank Limited',
    },
    {
        name: 'VISCOUNT PHARMA DISTRIBUTOR',
        secondaryName: 'VISCOUNT PHARMA DISTRIBUTORS',
        accountNumber: 'PK20ASCM0000309080002302',
        bankName: 'Askari Commercial Bank Limited',
    },
    {
        name: 'HAIDRI BEVERAGES PVT LTD',
        secondaryName: 'HAIDRI BEVERAGES PVT LTD DRINK',
        accountNumber: 'PK08UNIL01120280115246',
        bankName: 'UBL',
    },
    {
        name: 'AL-GANI TRADING',
        secondaryName: 'AL-GANI TRADING',
        accountNumber: 'PK75SONE0002620002866977',
        bankName: 'Soneri Bank Limited',
    },
    {
        name: 'RAWAL MARKETING SERVICES',
        secondaryName: 'RAWAL MARKETING SERVICES',
        accountNumber: 'PK27APBL0010023092050028',
        bankName: 'Allied Bank Limited',
    },
    {
        name: 'DETHEALTH PHARM',
        secondaryName: 'S&T HEALTH PHARMA',
        accountNumber: 'PK79HABB0000307902984603',
        bankName: 'Habib Bank',
    },
    {
        name: 'BE HAPPY PETS (PRIVATE) LIMITE',
        secondaryName: 'BE HAPPY PETS PVT LTD',
        accountNumber: 'PK32MEZN0002010106245444',
        bankName: 'Meezan Bank Limited',
    },
    {
        name: 'MQ LOGISTICS (MEGA DISTRIBUTIO',
        secondaryName: 'MQ LOGISTICS',
        accountNumber: 'PK25ASCM0001140900003670',
        bankName: 'Askari Commercial Bank Limited',
    },
];

// Dummy data for Transfer Activity
const transferActivities: TransferActivity[] = [];


function InitiateTransferContent() {
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'transfer');
    
    const getPageTitle = () => {
        switch (activeTab) {
            case 'activity':
                return 'Transfer History';
            case 'bulk':
                return 'Bulk Transfer';
            case 'transfer':
            default:
                return 'Initiate Transfer';
        }
    }
    
    const TransferTabHeader = () => (
        <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-semibold">{getPageTitle()}</h1>
                <div className="flex items-center gap-2">
                    <Button variant="outline">Multiple Transfers</Button>
                    <Button>Add Beneficiary +</Button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-full sm:w-auto sm:min-w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Search"
                        className="pl-10 bg-muted border-none"
                    />
                </div>
                <Select>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="cat1">Category 1</SelectItem>
                        <SelectItem value="cat2">Category 2</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </>
    );

    const ActivityTabHeader = () => (
         <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-semibold">{getPageTitle()}</h1>
                 <Button>Download</Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-full sm:w-auto sm:min-w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Search"
                        className="pl-10 bg-background"
                    />
                </div>
                <Select>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Select Account" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="acc1">Account 1</SelectItem>
                        <SelectItem value="acc2">Account 2</SelectItem>
                    </SelectContent>
                </Select>
                 <Select>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="View" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="last7">Last 7 Days</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </>
    );

    const BulkTransferHeader = () => (
        <h1 className="text-2xl font-semibold">{getPageTitle()}</h1>
    );

    const renderHeader = () => {
        switch (activeTab) {
            case 'activity':
                return <ActivityTabHeader />;
            case 'bulk':
                return <BulkTransferHeader />;
            case 'transfer':
            default:
                return <TransferTabHeader />;
        }
    }


    return (
        <DashboardLayout>
            <main className="flex-1 p-4 sm:px-6 sm:py-4 flex flex-col gap-6">
                
                {renderHeader()}

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full max-w-lg grid-cols-3">
                        <TabsTrigger value="transfer">Transfers</TabsTrigger>
                        <TabsTrigger value="activity">Transfer History</TabsTrigger>
                        <TabsTrigger value="bulk">Bulk Transfer</TabsTrigger>
                    </TabsList>
                    <TabsContent value="transfer">
                        <BeneficiaryList beneficiaries={beneficiaries} />
                    </TabsContent>
                    <TabsContent value="activity">
                        <TransferActivityTable activities={transferActivities} />
                    </TabsContent>
                    <TabsContent value="bulk">
                        <BulkTransfer />
                    </TabsContent>
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
