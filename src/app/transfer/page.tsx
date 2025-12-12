'use client';

import { Suspense } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BeneficiaryList, type Beneficiary } from '@/components/transfer/beneficiary-list';

// Dummy data based on the provided image
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


function InitiateTransferContent() {
    return (
        <DashboardLayout>
            <main className="flex-1 p-4 sm:px-6 sm:py-4 flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h1 className="text-2xl font-semibold">Initiate Transfer</h1>
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

                <Tabs defaultValue="transfer">
                    <TabsList className="grid w-full max-w-lg grid-cols-3">
                        <TabsTrigger value="transfer">Transfer</TabsTrigger>
                        <TabsTrigger value="activity">Transfer Activity</TabsTrigger>
                        <TabsTrigger value="bulk">Bulk Transfers</TabsTrigger>
                    </TabsList>
                    <TabsContent value="transfer">
                        <BeneficiaryList beneficiaries={beneficiaries} />
                    </TabsContent>
                    <TabsContent value="activity">
                        <p className="p-6 text-center text-muted-foreground">Transfer activity will be shown here.</p>
                    </TabsContent>
                    <TabsContent value="bulk">
                        <p className="p-6 text-center text-muted-foreground">Bulk transfers functionality will be here.</p>
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