'use client';

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function AddUtilityBillPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    // Edit Mode Check
    const isEdit = searchParams.get('isEdit') === 'true';
    
    // States
    const [categories, setCategories] = useState([]);
    const [billerTypes, setBillerTypes] = useState([]);
    const [billerCompanies, setBillerCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // --- CHANGE 1: State for raw session data ---
    const [existingPayeeData, setExistingPayeeData] = useState<any>(null);

    // Form Values from URL
    const queryBillerType = searchParams.get('billerType') || ""; // Key
    const queryCompany = searchParams.get('company') || "";       // Key or Name
    const queryCategory = searchParams.get('category') || "";
    const [nickName, setNickName] = useState(searchParams.get('nickname') || '');

    // --- CHANGE 2: Fetch Data from Session Storage on Edit Mode ---
    useEffect(() => {
        if (isEdit) {
            const storedData = sessionStorage.getItem('editPayeeData');
            if (storedData) {
                try {
                    const parsedData = JSON.parse(storedData);
                    setExistingPayeeData(parsedData);
                } catch (e) {
                    console.error("Failed to parse edit payee data", e);
                    toast({ variant: "destructive", title: "Error", description: "Failed to load payee details." });
                }
            }
        }
    }, [isEdit, toast]);

    // 1. Fetch Companies (Used only in Add mode or for background matching)
    const fetchCompanies = useCallback(async (selectedAccessCode: string) => {
        if (!selectedAccessCode) return;
        const sessionToken = sessionStorage.getItem("claimsToken");
        const userProfile = JSON.parse(sessionStorage.getItem('userProfile') || '{}');
        const userName = userProfile?.user_attributes?.UserName;

        try {
            const response = await fetch("/api/get-biller-company", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: sessionToken,
                    kuid: userName,
                    accessCode: selectedAccessCode
                })
            });
            const data = await response.json();
            if (data && data.opstatus === 0) {
                setBillerCompanies(data.DCP_BillerObj || []);
            }
        } catch (err) {
            console.error("Fetch Companies Error:", err);
        }
    }, []);

    // 2. Initial Data Fetch
    const fetchInitialData = useCallback(async () => {
        const sessionToken = sessionStorage.getItem("claimsToken");
        const userProfile = JSON.parse(sessionStorage.getItem('userProfile') || '{}');
        const userName = userProfile?.user_attributes?.UserName;

        if (!sessionToken) return;

        try {
            setLoading(true);
            const [catRes, billCatRes] = await Promise.all([
                fetch("/api/get-all-categories", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token: sessionToken, kuid: userName, payload: { categorytype: "transfer" } })
                }),
                fetch("/api/get-bill-categories", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token: sessionToken, kuid: userName })
                })
            ]);

            const categoryData = await catRes.json();
            const billCategoryData = await billCatRes.json();

            if (categoryData.opstatus === 0) setCategories(categoryData.PaymentService || []);
            if (billCategoryData.opstatus === 0) setBillerTypes(billCategoryData.DCP_BillerObj || []);

        } catch (err) {
            toast({ variant: "destructive", title: "Error", description: "Failed to load data." });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchInitialData();
        if (queryBillerType) {
            fetchCompanies(queryBillerType);
        }
    }, [fetchInitialData, fetchCompanies, queryBillerType]);

    // Helper to get display names from IDs
    const getBillerTypeName = () => {
        const found = billerTypes.find((b: any) => b.accessCode === queryBillerType);
        return found ? found.displayName : queryBillerType;
    };

    const getCompanyName = () => {
        const found = billerCompanies.find((c: any) => c.company_key === queryCompany);
        return found ? found.display_name : queryCompany;
    };

    const getCategoryName = () => {
        const found = categories.find((cat: any) => cat.id === queryCategory);
        return found ? found.name : queryCategory;
    };
 
    const handleUpdatePayee = async () => {
        if (!existingPayeeData) {
            toast({ variant: "destructive", title: "Error", description: "Original data not found." });
            return;
        }
    
        setLoading(true);
        const sessionToken = sessionStorage.getItem("claimsToken");
        const userProfile = JSON.parse(sessionStorage.getItem('userProfile') || '{}');
        const userName = userProfile?.user_attributes?.UserName;
    
        try {
            let baseNotes: any = {};
            try {
                baseNotes = typeof existingPayeeData.notes === 'string' 
                    ? JSON.parse(existingPayeeData.notes) 
                    : (existingPayeeData.notes || {});
            } catch (e) {
                baseNotes = {};
            }
    
            const finalPayload = {
                "payeeId": existingPayeeData.payeeId || searchParams.get('payeeId'),
                "payeeNick": nickName,
                "notes": {
                    "typeKey": baseNotes.typeKey,
                    "instKey": baseNotes.instKey,
                    "typeVal": baseNotes.typeVal,
                    "instVal": baseNotes.instVal,
                    "billerAccountNo": baseNotes.billerAccountNo,
                    "billerBrCode": baseNotes.billerBrCode,
                    "billerBankIMD": baseNotes.billerBankIMD,
                    "billerBranchName": baseNotes.billerBranchName,
                    "billerBankName": baseNotes.billerBankName,
                    "billerCurrency": baseNotes.billerCurrency,
                    "categoryKey": baseNotes.categoryKey,
                    "categoryVal": baseNotes.categoryVal,
                    "enquiryID": baseNotes.enquiryID,
                    "dueDate": baseNotes.dueDate,
                    "lateSurcharge": baseNotes.lateSurcharge,
                    "actualAmount": baseNotes.actualAmount,
                    "partialPaymentAllowed": baseNotes.partialPaymentAllowed,
                    "consumerNo": baseNotes.consumerNo,
                    "contractId": baseNotes.contractId,
                    "coreCustomerId": baseNotes.coreCustomerId,
                    "billAmount": baseNotes.billAmount,
                    "billStatus": baseNotes.billStatus
                },
                "reqChannel": "DCP"
            };
    
            const res = await fetch("/api/payment-bill-EditPayee", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: sessionToken,
                    kuid: userName,
                    payload: finalPayload
                })
            });
    
            const result = await res.json();
    
            if (result.opstatus === 0) {
                const customAction = result.CustomPayeeAction?.[0];
            
                // Case 1: Agar Error Message (errmsg) maujood hai
                if (customAction && customAction.errmsg) {
                    const errorMsg = customAction.responseMessage || customAction.errmsg;
                    
                    // Native Alert ya aapka Custom Modal use karein
                    alert(`Error: ${errorMsg}`); 
            
                    // Error ke baad bhi redirect karna hai to yahan rakhein
                    sessionStorage.removeItem('editPayeeData');
                    router.push('/bill-payment');
                } 
                // Case 2: Agar Success message aur Reference Number hai
                else if (customAction && customAction.referenceNo) {
                    const successMsg = customAction.responseMessage || "Record sent for approval";
                    const refNo = customAction.referenceNo;
            
                    // Success Popup jis mein Message aur Reference No dono hon
                    alert(`${successMsg}\nReference Number: ${refNo}`);
            
                    sessionStorage.removeItem('editPayeeData');
                    router.push('/bill-payment');
                }
                // Default Success (agar upar wali dono keys missing hon)
                else {
                    toast({ title: "Success", description: "Operation completed successfully" });
                    sessionStorage.removeItem('editPayeeData');
                    router.push('/bill-payment');
                }
            }
        } catch (err) {
            toast({ 
                variant: "destructive", 
                title: "Network Error", 
                description: "Something went wrong" 
            });
        } finally {
            setLoading(false);
        }
    }; 
    return (
        <DashboardLayout>
            <main className="flex-1 p-4 sm:px-6 sm:py-4 flex flex-col gap-6">
                <h1 className="text-2xl font-semibold">
                    {isEdit ? "Edit Utility Bill" : "Add Utility Bill"}
                </h1>

                <Card className="w-full">
                    <CardContent className="p-6">
                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                
                                {/* Biller Type */}
                                <div className="space-y-2">
                                    <Label>Biller Type *</Label>
                                    {isEdit ? (
                                        <Input value={getBillerTypeName()} disabled className="bg-muted" />
                                    ) : (
                                        <Select onValueChange={(val) => fetchCompanies(val)}>
                                            <SelectTrigger><SelectValue placeholder="Select Biller Type" /></SelectTrigger>
                                            <SelectContent>
                                                {billerTypes.map((b: any) => (
                                                    <SelectItem key={b.accessCode} value={b.accessCode}>{b.displayName}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </div>

                                {/* Biller Institution */}
                                <div className="space-y-2">
                                    <Label>Biller Institution *</Label>
                                    {isEdit ? (
                                        <Input value={getCompanyName()} disabled className="bg-muted" />
                                    ) : (
                                        <Select>
                                            <SelectTrigger><SelectValue placeholder="Select Institution" /></SelectTrigger>
                                            <SelectContent>
                                                {billerCompanies.map((c: any) => (
                                                    <SelectItem key={c.company_key} value={c.company_key}>{c.display_name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </div>

                                {/* Consumer Number */}
                                <div className="space-y-2">
                                    <Label>Consumer / Account # *</Label>
                                    <Input disabled value={searchParams.get('id') || ""} className="bg-muted" />
                                </div>

                                {/* Nick Name */}
                                <div className="space-y-2">
                                    <Label>Nick Name *</Label>
                                    <Input 
                                        value={nickName} 
                                        onChange={(e) => setNickName(e.target.value)} 
                                        placeholder="Enter Nick Name" 
                                    />
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <Label>Category *</Label>
                                    {isEdit ? (
                                        <Input value={getCategoryName()} disabled className="bg-muted" />
                                    ) : (
                                        <Select>
                                            <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                                            <SelectContent>
                                                {categories.map((cat: any) => (
                                                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <Button variant="outline" asChild>
                                    <Link href="/bill-payment">Cancel</Link>
                                </Button>
                                <Button 
                                    type="button" 
                                    disabled={loading}
                                    onClick={isEdit ? handleUpdatePayee : undefined} 
                                >
                                    {loading ? "Processing..." : isEdit ? "Update" : "Continue"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </DashboardLayout>
    );
}