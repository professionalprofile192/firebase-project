'use client';

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { CustomPopup } from "@/components/custom-popup/custom-popup";
import ReviewScreen from "@/components/bill-payment/review-screen";
import { OtpDialog } from '@/components/auth/otp-dialog';


// --- Main Content Component ---
function AddUtilityBillContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    // 1. Pehle saare URL parameters nikal lein
    const isEdit = searchParams.get('isEdit') === 'true';
    const queryCompany = searchParams.get('company') || "";
    const queryCategory = searchParams.get('category') || "";
    const queryBillerType = searchParams.get('billerType') || "";
    const queryId = searchParams.get('id') || "";
    const queryNickname = searchParams.get('nickname') || "";
    const queryCompanyName = searchParams.get('companyName') || queryCompany; 
    const queryCategoryName = searchParams.get('categoryName') || queryCategory;
    const queryBillerTypeName = searchParams.get('billerTypeName') || queryBillerType;
    const [isOtpOpen, setIsOtpOpen] = useState(false);
    const [otpServiceKey, setOtpServiceKey] = useState('');
    const [categories, setCategories] = useState([]);
    const [billerTypes, setBillerTypes] = useState([]);
    const [billerCompanies, setBillerCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [existingPayeeData, setExistingPayeeData] = useState<any>(null);
    
    const [manualConsumerNo, setManualConsumerNo] = useState('');
    const [selectedCompanyCode, setSelectedCompanyCode] = useState('');
    const [selectedBillerType, setSelectedBillerType] = useState(""); 
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedCompany, setSelectedCompany] = useState(queryCompany); 
    
    const [nickName, setNickName] = useState(queryNickname);
    const [billInfo, setBillInfo] = useState(null);
    const [popupData, setPopupData] = useState({
        isOpen: false,
        type: 'success' as 'success' | 'error',
        title: '',
        message: '',
        referenceNo: ''
    });
    const [showReview, setShowReview] = useState(false);
    const [reviewData, setReviewData] = useState({
        billerType: "",
        billerInstitution: "",
        consumerNumber: "",
        consumerName: "",
        payeeNickname: "",
        category: ""
    });
    useEffect(() => {
        if (isEdit) {
            const storedData = sessionStorage.getItem('editPayeeData');
            if (storedData) {
                try {
                    const parsedData = JSON.parse(storedData);
                    setExistingPayeeData(parsedData);
                } catch (e) {
                    toast({ variant: "destructive", title: "Error", description: "Failed to load payee details." });
                }
            }
        }
    }, [isEdit, toast]);
    const handleCompanyChange = (value: string) => {
        // Value yahan 'company_key' (code) hai jo hum SelectItem ki value mein de rahe hain
        setSelectedCompanyCode(value);
        console.log("Selected Company Code for Inquiry:", value);
    };
    const handleBillInquiry = async () => {
        const finalConsumer = isEdit ? (searchParams.get('id') || "") : manualConsumerNo;
        const finalCompany = isEdit ? queryCompany : selectedCompanyCode;

        if (!finalConsumer || !finalCompany) {
            toast({ variant: "destructive", title: "Missing Info", description: "Please select institution and enter consumer number." });
            return;
        }
    
        try {
            setLoading(true);
            const token = sessionStorage.getItem("claimsToken");
            const userProfile = JSON.parse(sessionStorage.getItem('userProfile') || '{}');
            const kuid = userProfile?.user_attributes?.UserName;
      
          const res = await fetch("/api/payment-addpayee-billinquiry", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                consumerNumber: finalConsumer,
                companyCode: finalCompany,          
              token,
              kuid
            }),
          });
      
          const data = await res.json();
      
          if (data?.Bill && data.Bill.length > 0) {
            const bill = data.Bill[0];
            setBillInfo(bill);
            
            // Review Screen ke liye data set karein
            setReviewData({
                billerType: isEdit ? getBillerTypeName(queryBillerType) : getBillerTypeName(selectedBillerType),
                billerInstitution: isEdit ? selectedCompanyCode : getCompanyName(selectedCompanyCode),
                consumerNumber: isEdit ? (searchParams.get('id') || "") : manualConsumerNo,
                consumerName: bill.consumerName,
                payeeNickname: nickName,
                category: isEdit ? getCategoryName(queryCategory) : getCategoryName(selectedCategory)
            });
            setShowReview(true); // Review Screen dikhao
        }else {
            toast({ variant: "destructive", description: "Bill not found." });
        }
     } catch (error) {
          console.error("Inquiry Function Error:", error);
        }
      };
    const fetchCompanies = useCallback(async (selectedAccessCode: string) => {
        if (!selectedAccessCode) return;
        const sessionToken = sessionStorage.getItem("claimsToken");
        const userProfile = JSON.parse(sessionStorage.getItem('userProfile') || '{}');
        const userName = userProfile?.user_attributes?.UserName;

        try {
            const response = await fetch("/api/get-biller-company", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: sessionToken, kuid: userName, accessCode: selectedAccessCode })
            });
            const data = await response.json();
            if (data && data.opstatus === 0) {
                setBillerCompanies(data.DCP_BillerObj || []);
            }
        } catch (err) {
            console.error("Fetch Companies Error:", err);
        }
    }, []);

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
       
        if (!isEdit) {
            fetchInitialData();
        }
    
 
        if (queryBillerType && !isEdit) {
            fetchCompanies(queryBillerType);
        }
    }, [fetchInitialData, fetchCompanies, queryBillerType, isEdit]);

    const getBillerTypeName = (code: string) => {
        if (!code || billerTypes.length === 0) return "Loading..."; 
        const found = billerTypes.find((b: any) => b.accessCode === code);
        return found ? found.displayName : code; 
    };
    
    const getCategoryName = (id: string) => {
        if (!id || categories.length === 0) return "Loading...";
        const found = categories.find((cat: any) => cat.id === id);
        return found ? found.name : id;
    };
    
    const getCompanyName = (code: string) => {
        if (!code || billerCompanies.length === 0) return "Loading...";
        const found = billerCompanies.find((c: any) => c.company_key === code);
        return found ? found.display_name : code;
    };
    const createNewApprovalRequest = async (referenceNo: string) => {
        const sessionToken = sessionStorage.getItem("claimsToken");
        const userProfile = JSON.parse(sessionStorage.getItem('userProfile') || '{}');
        const userAttr = userProfile?.user_attributes;
    
        const approvalPayload = {
            requesterId: userAttr?.userId,
            contractId: userAttr?.contractId,
            coreCustomerId: userAttr?.coreCustomerId,
            referenceNo: referenceNo,
            featureActionId: "BILL_PAY_EDIT_PAYEES",
            remarks: `EDIT BILL REQUEST FROM ${userAttr?.UserName || 'USER'}`,
        };
    
        try {
            const res = await fetch("/api/payment-bill-createANewRequest", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: sessionToken,
                    payload: approvalPayload
                })
            });
    
            const data = await res.json();
            if (data.opstatus === 0) {
                console.log("Approval Matrix Entry Created:", data.ApprovalMatrix?.[0]?.reqResponse);
            }
        } catch (err) {
            console.error("Approval Request Error:", err);
        }
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
            } catch (e) { baseNotes = {}; }

            const finalPayload = {
                "payeeId": existingPayeeData.payeeId || searchParams.get('payeeId'),
                "payeeNick": nickName,
                "notes": { ...baseNotes },
                "reqChannel": "DCP"
            };

            const res = await fetch("/api/payment-bill-EditPayee", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: sessionToken, kuid: userName, payload: finalPayload })
            });

            const result = await res.json();
            if (result.opstatus === 0) {
                const customAction = result.CustomPayeeAction?.[0];
                
                // 1. Check karein agar errmsg maujood hai (Error Case)
                if (customAction && (customAction.errmsg || customAction.dbpErrMsg)) {
                    setPopupData({
                        isOpen: true,
                        type: 'error',
                        title: 'Action Restricted',
                        message: customAction.responseMessage || customAction.errmsg || "Failed to update payee",
                        referenceNo: ''
                    });
                } 
                // 2. Success Case: Agar errmsg nahi hai aur opstatus 0 hai
                else if (customAction) {
                    setPopupData({
                        isOpen: true,
                        type: 'success',
                        title: 'Update Successful',
                        // Aapka naya response message yahan se pick hoga
                        message: customAction.responseMessage || "Payee has been updated successfully",
                        // Agar referenceNo "" hai toh empty string chala jayega
                        referenceNo: customAction.referenceNo || ""
                    });
                }
            }
            
           
        }catch (err) {
            toast({ variant: "destructive", title: "Network Error", description: "Something went wrong" });
        } finally {
            setLoading(false);
        }
    };
    const handlePopupClose = async () => {
 
        if (!isEdit) {
          
            setPopupData(prev => ({ ...prev, isOpen: false }));
            router.push('/bill-payment');
            return; // Function yahan khatam ho jaye
        }
    
        if (popupData.type === 'success' && popupData.referenceNo) { 
            await createNewApprovalRequest(popupData.referenceNo);
        }
    
   
        setPopupData(prev => ({ ...prev, isOpen: false }));
        sessionStorage.removeItem('editPayeeData');
        router.push('/bill-payment');
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
                
                
                // Yahan aap OTP verify wali screen ya popup open kar sakti hain
                // setOtpSent(true); 
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
    const handleFinalAddPayee = async () => {
        setLoading(true);
        const sessionToken = sessionStorage.getItem("claimsToken");
        const userProfile = JSON.parse(sessionStorage.getItem('userProfile') || '{}');
        const uAttr = userProfile?.user_attributes;
        const kuid = uAttr?.UserName;
        const b: any = billInfo || {};
        const cleanDate = b.dueDate.split(' ')[0];
        const storedCoreId = sessionStorage.getItem("decodedCoreId");
        const storedContractId = sessionStorage.getItem("decodedContractId");
        try {
            // --- Service 1: Integration Call (GET) ---
           
            const resIntegration = await fetch(`/api/payment-bill-custompayeeaction-integration?kuid=${kuid}`, {
                method: "GET",
                headers: { 
                    "x-kony-authorization": sessionToken || "" 
                }
            });
    
            const dataIntegration = await resIntegration.json();
    
          
            if (dataIntegration.Metadata?.opstatus === 0) {
                
                
                const finalPayload = {
                    accountNumber: reviewData.consumerNumber,
                    street: "UBL LTD",
                    addressLine2: "Pakistan",
                    cityName: "",
                    payeeNickName: reviewData.payeeNickname,
                    payeeName: b.consumerName || reviewData.consumerName,
                    zipCode: "432156",
                    companyName: reviewData.billerInstitution,
                    nameOnBill: reviewData.billerType,
                    billerId: "",
                    phone: "",
                    state: "",
                    country: "Pakistan",
                    notes: JSON.stringify({
                        typeKey: selectedBillerType,
                        instKey: selectedCompanyCode,
                        typeVal: reviewData.billerType,
                        instVal: reviewData.billerInstitution,//companyCode
                        billerAccountNo: b.companyCollectionAccount,
                        billerBrCode: b.collectionBranchCode,
                        billerBankIMD: "588974",
                        billerBranchName: "UBL CBS",
                        billerBankName: "UBL",
                        billerCurrency: "PKR",
                        categoryKey: selectedCategory,
                        categoryVal: reviewData.category,
                        enquiryID: b.inquiryId ,
                        dueDate: cleanDate,
                        lateSurcharge: b.lateSurcharge,
                        actualAmount: b.actualAmount,
                        partialPaymentAllowed: b.partialPaymentAllowed,
                        consumerNo: reviewData.consumerNumber,
                        contractId: storedContractId,
                        coreCustomerId: storedCoreId,
                        billAmount: b.payableAmount,
                        billStatus: b.billStatus,
                    }),
                    UserID: uAttr?.user_id,
                    serviceKey: otpServiceKey 
                };
    
                // --- Service 2: Main Creation Call (POST) ---
                const resCreate = await fetch("/api/payment-bill-CreateBillPayee", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ...finalPayload,
                        token: sessionToken
                    })
                });
    
                const dataCreate = await resCreate.json();
    
                if (dataCreate.opstatus === 0) {
                    const action = dataCreate.CustomPayeeAction?.[0];
                    setPopupData({
                        isOpen: true,
                        type: 'success',
                        title: 'Payee Added',
                        message: action?.responseMessage,
                        referenceNo: action?.referenceNo
                    });
                } else {
                    toast({ variant: "destructive", title: "Creation Failed", description: dataCreate.errmsg || "Main creation service failed." });
                }
            } else {
                toast({ variant: "destructive", title: "Integration Failed", description: "Step 1 verification failed." });
            }
        } catch (err) {
            console.error("Error in final process:", err);
            toast({ variant: "destructive", title: "Network Error", description: "Something went wrong. Please try again." });
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
                handleFinalAddPayee(); 
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
        return (
            <>
            <ReviewScreen 
                data={reviewData}
                onBack={() => setShowReview(false)} 
                onCancel={() => router.push('/bill-payment')}
                onContinue={handleSendOTP} 
                isOtpOpen={isOtpOpen} 
                setIsOtpOpen={setIsOtpOpen} 
                onOtpConfirm={handleOtpConfirm}
            />
            <CustomPopup 
                isOpen={popupData.isOpen}
                onClose={handlePopupClose}
                type={popupData.type}
                title={popupData.title}
                message={popupData.message}
                referenceNo={popupData.referenceNo}
            />
            </>
        );
    }
  
    
  

    return (
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
                                    <Input value={queryBillerType} disabled className="bg-muted" />
                                ) : (
                                    <Select onValueChange={(val) => {
                                        setSelectedBillerType(val); // State update
                                        fetchCompanies(val);    
                                    }}>
                                        <SelectTrigger><SelectValue placeholder="Select Biller Type" /></SelectTrigger>
                                        <SelectContent>
                                            {billerTypes.map((b: any) => (
                                                <SelectItem key={b.accessCode} value={b.accessCode}>{b.displayName}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>

                            {/* Biller Institution - Yahan logic update hua hai */}
                            <div className="space-y-2">
                                <Label>Biller Institution *</Label>
                                {isEdit ? (
                                    <Input value={queryCompany} disabled className="bg-muted" />
                                ) : (
                                    <Select onValueChange={(val) => setSelectedCompanyCode(val)}>
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
                                <Input 
                                    value={isEdit ? (searchParams.get('id') || "") : manualConsumerNo} 
                                    disabled={isEdit} 
                                    className={isEdit ? "bg-muted" : ""} 
                                    onChange={(e) => setManualConsumerNo(e.target.value)}
                                    placeholder="Enter Account Number"
                                />
                            </div>

                            {/* Nick Name */}
                            <div className="space-y-2">
                                <Label>Nick Name *</Label>
                                <Input value={nickName} onChange={(e) => setNickName(e.target.value)} placeholder="Enter Nick Name" />
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <Label>Category *</Label>
                                {isEdit ? (
                                    <Input value={queryCategory} disabled className="bg-muted" />
                                ) : (
                                    <Select onValueChange={(val) => setSelectedCategory(val)}>
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
                            <Button variant="outline" asChild><Link href="/bill-payment">Cancel</Link></Button>
                            <Button 
                                type="button" 
                                disabled={loading} 
                                onClick={isEdit ? handleUpdatePayee : handleBillInquiry}
                            >
                                {isEdit ? "Update" : "Continue"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <CustomPopup 
            isOpen={popupData.isOpen}
            onClose={handlePopupClose}
            type={popupData.type}
            title={popupData.title}
            message={popupData.message}
            referenceNo={popupData.referenceNo}
        />

        </main>
    );
}

// --- Export with Suspense ---
export default function AddUtilityBillPage() {
    return (
        <DashboardLayout>
            <Suspense fallback={<div className="p-10 text-center">Loading form...</div>}>
                <AddUtilityBillContent />
            </Suspense>
        </DashboardLayout>
    );
}