'use client';

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";


export default function AddUtilityBillPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [categories, setCategories] = useState([]);
    const [billerTypes, setBillerTypes] = useState([]);
    const [billerCompanies, setBillerCompanies] = useState([]);
    const [isCompanyLoading, setIsCompanyLoading] = useState(false);
    const [loading, setLoading] = useState(false);

    
    const fetchAllCategories = useCallback(async () => {
        const sessionToken = sessionStorage.getItem("claimsToken");
        const userProfileString = sessionStorage.getItem('userProfile');
    
        if (!sessionToken || !userProfileString) {
            toast({ variant: "destructive", title: "Error", description: "Session not found. Please log in again." });
            router.push('/');
            return;
        }
    
        const userProfile = JSON.parse(userProfileString);
        const userName = userProfile?.user_attributes?.UserName;
    
        try {
            setLoading(true);
    
            const response = await fetch("/api/get-all-categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: sessionToken,
                    kuid: userName,
                    payload: { categorytype: "transfer" } 
                })
            });
    
            const categoryRes = await response.json();
            if (categoryRes && categoryRes.opstatus === 0) {
                setCategories(categoryRes.PaymentService || []);
            } else {
                console.error("Categories API Error:", categoryRes.errmsg);
            }
    
            // --- 2. Fetch Biller Types ---
            const res2 = await fetch("/api/get-bill-categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    token: sessionToken, 
                    kuid: userName 
                })
            });
    
            const data2 = await res2.json();
            if (data2 && data2.opstatus === 0) {
                setBillerTypes(data2.DCP_BillerObj || []);
            } else {
                console.error("Biller Institutions API Error:", data2.errmsg);
            }
    
        } catch (err) {
            console.error("System Fetch Error:", err);
            toast({ variant: "destructive", title: "System Error", description: "Failed to load form data." });
        } finally {
            setLoading(false);
        }
    }, [toast, router]);
    
    useEffect(() => {
        fetchAllCategories();
    }, [fetchAllCategories]);

    // Component ke andar states
// Function jab Biller Type select ho
// AddUtilityBillPage component ke andar ye naya function dalien

const handleBillerTypeChange = async (selectedAccessCode: string) => {
    // 1. Pehle purani companies ki list clear kar dein taake purana data na dikhe
    setBillerCompanies([]);
    
    
    const sessionToken = sessionStorage.getItem("claimsToken");
    const userProfileString = sessionStorage.getItem('userProfile');
    const userProfile = JSON.parse(userProfileString || '{}');
    const userName = userProfile?.user_attributes?.UserName;

    if (!selectedAccessCode) return;

    try {
        setIsCompanyLoading(true); // Naya loading state companies ke liye

        const response = await fetch("/api/get-biller-company", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: sessionToken,
                kuid: userName,
                accessCode: selectedAccessCode // Ye wahi code hai jo dropdown se aaya (e.g. "UT_EC")
            })
        });

        const data = await response.json();
        
        if (data && data.opstatus === 0) {
            setBillerCompanies(data.DCP_BillerObj || []);
        } else {
            console.error("Biller Company Error:", data.errmsg);
        }
    } catch (err) {
        console.error("Fetch Companies Error:", err);
    } finally {
        setIsCompanyLoading(false);
    }
};
    return (
        <DashboardLayout>
            <main className="flex-1 p-4 sm:px-6 sm:py-4 flex flex-col gap-6">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-semibold">Add Utility Bill</h1>
                </div>

                <Card className="w-full">
                    <CardContent className="p-6">
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           {/* Biller Type Dropdown */}
                        <div className="space-y-2">
                            <Label htmlFor="biller-type">Biller Type *</Label>
                            <Select onValueChange={handleBillerTypeChange}> {/* Selection par function trigger hoga */}
                                <SelectTrigger id="biller-type">
                                    <SelectValue placeholder={loading ? "Loading..." : "Select Biller Type"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {billerTypes.map((biller: any) => (
                                        <SelectItem key={biller.accessCode} value={biller.accessCode}>
                                            {biller.displayName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Biller Institution Dropdown */}
                        <div className="space-y-2">
                            <Label htmlFor="biller-institution">Biller Institution *</Label>
                            <Select>
                                <SelectTrigger id="biller-institution">
                                    <SelectValue placeholder={isCompanyLoading ? "Loading Companies..." : "Select Biller Institution"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {billerCompanies.length > 0 ? (
                                        billerCompanies.map((company: any) => (
                                            <SelectItem key={company.company_key} value={company.company_key}>
                                                {company.display_name}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="none" disabled>
                                            {isCompanyLoading ? "Fetching..." : "Please select a Biller Type first"}
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                                <div className="space-y-2">
                                    <Label htmlFor="consumer-id">Consumer / Account # *</Label>
                                    <Input id="consumer-id" placeholder="Consumer ID" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nick-name">Nick Name *</Label>
                                    <Input id="nick-name" placeholder="Enter Nick Name" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Category *</Label>
                                    <Select>
                                        <SelectTrigger id="category">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {/* Yahan API se aayi hui categories map hongi */}
                                            {categories.map((cat: any) => (
                                                <SelectItem key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            
                            <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                                <AlertDescription>
                                    Note: Online bill payment for all utility company billers to be made by their bill due dates. However, it is recommended to pay bills two working days prior to their due dates to avoid late payment charges in the case where the payment may get rejected or reversed in two working days from the billers end.
                                </AlertDescription>
                            </Alert>

                            <div className="flex justify-end gap-4 pt-4">
                                <Button variant="outline" asChild>
                                    <Link href="/bill-payment">Cancel</Link>
                                </Button>
                                <Button type="submit">Continue</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </DashboardLayout>
    )
}