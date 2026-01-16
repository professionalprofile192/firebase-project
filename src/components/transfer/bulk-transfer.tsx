
'use client';

import { useState, useEffect, useMemo, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Check,ChevronRight, ChevronLeft, ChevronDown, ChevronUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Checkbox } from "../ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { OtpDialog } from '@/components/auth/otp-dialog';
import { 
    Command, 
    CommandInput, 
    CommandList, 
    CommandEmpty, 
    CommandGroup, 
    CommandItem 
  } from "@/components/ui/command";

  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
const transferTypes = [
    { title: "Funds Transfer", description: "Own & Internal" },
    { title: "Inter Bank Funds Transfer", description: "Other Banks" },
    { title: "Raast Payment", description: "All Raast Accounts" },
    { title: "Omni Payment", description: "All Omni Accounts" },
];


const DetailRow = ({ label, value }: { label: string, value: React.ReactNode }) => (
    <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
    </div>
);

const BulkDetailRow = ({ detail, onSelect, isSelected }: { detail: any; onSelect: (id: string, checked: boolean) => void; isSelected: boolean }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        /* Fragments (<>) use karein taaki HTML structure break na ho */
        <> 
            <TableRow className={cn("hover:bg-muted/50 border-b", isOpen && "bg-muted/50")}>
                <TableCell className="w-[50px]">
                    <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => onSelect(detail.id, !!checked)}
                    />
                </TableCell>
                <TableCell className="font-medium">{detail.fileReferenceNumber}</TableCell>
                <TableCell>{detail.fetchedAccountTitle}</TableCell> 
                <TableCell className="font-mono text-xs">{detail.customerUniqueId}</TableCell>
                <TableCell>{detail.beneficiaryAccountNumber}</TableCell>
                <TableCell className="font-semibold text-right">
                    {new Intl.NumberFormat('en-PK', { minimumFractionDigits: 2 }).format(Number(detail.remittanceAmount))}
                </TableCell>
                <TableCell>
                    <span className={cn('px-2 py-1 text-[10px] font-bold uppercase rounded-full', 
                        (detail.status === 'Success' || detail.status === 'Ready to Process') ? 'bg-green-100 text-green-800' : 
                        detail.status === 'Failure' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                    )}>
                        {detail.status}
                    </span>
                </TableCell>
                <TableCell className="text-right">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 gap-1" 
                        onClick={() => setIsOpen(!isOpen)} // Manual toggle
                    >
                        View {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                </TableCell>
            </TableRow>
            
            {/* Expanded Content Row */}
            {isOpen && (
                <TableRow className="bg-muted/30 border-b">
                    <TableCell colSpan={8} className="p-0">
                        <div className="p-4 grid grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-1">
                            <DetailRow label="Beneficiary Name" value={detail.beneficiaryName || "N/A"} />
                            <DetailRow label="Beneficiary Phone" value={detail.beneficiaryPhone || "N/A"} />
                            <DetailRow label="Bank Name" value={detail.beneficiaryBankName || "N/A"} />
                            <DetailRow label="Bank Code" value={detail.beneficiaryBankCode || "N/A"} />
                            <DetailRow label="Email" value={detail.beneficiaryEmail || "N/A"} />
                            <DetailRow label="File Title" value={detail.title || "N/A"} />
                            <DetailRow label="Comment" value={detail.errmsg || "N/A"} />
                        </div>
                    </TableCell>
                </TableRow> 
            )}
        </>
    );
};

const formatCurrency = (amount: number) => {
    return `PKR ${new Intl.NumberFormat('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)}`;
};

const ReviewSummary = ({
    totalPayment,
    availableBalance,
    grandTotalCount,
    grandTotalAmount,
    selectedCount,
    transactionsToHoldCount,
    transactionsToHoldAmount,
    onReject,
    onContinue,

}: {
    totalPayment: number;
    availableBalance: number;
    grandTotalCount: number;
    grandTotalAmount: number;
    selectedCount: number;
    transactionsToHoldCount: number;
    transactionsToHoldAmount: number;
    onReject: () => void;
    onContinue: () => void;
}) => {
    const remainingBalance = availableBalance - totalPayment;

    return (
        <footer className="sticky bottom-0 bg-background/95 p-4 border-t z-10 mt-6 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
            <div className="max-w-7xl mx-auto flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-800">Review Summary</h2>
                    <div className="flex items-center gap-8 text-right">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Selected Payment</p>
                            <p className="text-lg font-bold text-primary">{formatCurrency(totalPayment)}</p>
                        </div>
                        <div className="h-8 w-px bg-border"></div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Available Balance</p>
                            <p className={cn("text-lg font-bold", availableBalance < 0 ? "text-red-600" : "text-black-600")}>
                                {formatCurrency(availableBalance)}
                            </p>
                        </div>
                        <div className="h-8 w-px bg-border"></div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Remaining Balance</p>
                            <p className={cn("text-lg font-bold", remainingBalance < 0 ? "text-red-600" : "text-green-600")}>
                                {formatCurrency(remainingBalance)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50">
                                <TableHead className="w-[200px]"></TableHead>
                                <TableHead className="font-bold text-slate-900 text-center border-x">File Grand Total</TableHead>
                                <TableHead className="font-bold text-slate-900 text-center border-x">Transactions to Hold</TableHead>
                                <TableHead className="font-bold text-primary text-center">Transactions Selected</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium bg-slate-50/50">No. of Transactions</TableCell>
                                <TableCell className="text-center border-x font-semibold">{grandTotalCount}</TableCell>
                                <TableCell className="text-center border-x text-orange-600">{transactionsToHoldCount}</TableCell>
                                <TableCell className="text-center font-bold text-primary bg-blue-50/30">{selectedCount}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium bg-slate-50/50">Total Amount</TableCell>
                                <TableCell className="text-center border-x font-semibold">{formatCurrency(grandTotalAmount)}</TableCell>
                                <TableCell className="text-center border-x text-orange-600">{formatCurrency(transactionsToHoldAmount)}</TableCell>
                                <TableCell className="text-center font-bold text-primary bg-blue-50/30">{formatCurrency(totalPayment)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
                
                <div className="flex justify-end items-center gap-3 pt-2">
                    <Button variant="outline" className="px-8">Cancel</Button>
                    <Button variant="destructive" className="px-8" onClick={onReject}>Reject</Button>
                    <Button className="px-10 bg-primary hover:bg-primary/90" onClick={onContinue}>Continue</Button>
                </div>
            </div>
        </footer>
    );
};


export function BulkTransfer() {
    const [selectedType, setSelectedType] = useState(transferTypes[0].title);
    const [selectedAccount, setSelectedAccount] = useState<typeof accounts[0] | null>(null);
    const [selectedBulkFile, setSelectedBulkFile] = useState<string | undefined>(undefined);
    const [openFileDropdown, setOpenFileDropdown] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState('50');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [bulkFiles, setBulkFiles] = useState<{fileId: string, fileName: string}[]>([]);
    const [loadingFiles, setLoadingFiles] = useState(false);
    const [accounts, setAccounts] = useState<any[]>([]); // Dynamic accounts list
    const [loadingAccount, setLoadingAccount] = useState(false);
    const [paymentRecords, setPaymentRecords] = useState([]);
    const [bulkStats, setBulkStats] = useState({ grandTotal: "0", noOfTransaactions: "0" });
    const [selectedTransferType, setSelectedTransferType] = useState("Funds Transfer");
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRejectSuccessOpen, setIsRejectSuccessOpen] = useState(false);
    const [rejectMessage, setRejectMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [isOtpOpen, setIsOtpOpen] = useState(false);
    const [otpServiceKey, setOtpServiceKey] = useState('');
    const { toast } = useToast();
    const [historyRecords, setHistoryRecords] = useState<any[]>([]);
const [activeTab, setActiveTab] = useState("details"); // Tab track karne ke liye

    
    const getRemitterType = (title: string) => {
        switch (title) {
            case "Inter Bank Funds Transfer": return "IBFT";
            case "Raast Payment": return "RAAST";
            case "Omni Payment": return "OMNI";
            default: return "FT"; // Funds Transfer ke liye
        }
    };
    const handleTransferTypeClick = (title: string) => {
        // 1. Agar user ne same type par dubara click kiya toh bhi reset hoga ya switch hoga
        setSelectedTransferType(title);
        
        // 2. Account selection aur related states empty karna
        setSelectedAccount(null);
        setBulkFiles([]);
        setPaymentRecords([]);
        setSelectedRows([]);
        setSelectedBulkFile(undefined);
        setBulkStats({ grandTotal: "0", noOfTransaactions: "0" });
        
        console.log(`Switched to ${title}, RemitterType: ${getRemitterType(title)}`);
    };
    
    const rows = parseInt(rowsPerPage);
    // const totalPages = Math.ceil(bulkProcessingDetails.length / rows);
    const startIndex = (currentPage - 1) * rows;
    // const endIndex = Math.min(startIndex + rows, bulkProcessingDetails.length);
    // const currentData = bulkProcessingDetails.slice(startIndex, endIndex);
    
            //api calling

            const fetchBulkReferences = async () => {
                
                try {
                    setLoadingFiles(true);
                    
                    // Retrieving necessary credentials from session
                    const token = sessionStorage.getItem("claimsToken");
                    const approvalsRaw = sessionStorage.getItem("approvals");
                    
                    if (!token || !approvalsRaw) {
                        console.warn("Missing token or approvals in session");
                        return;
                    }
                
                    const approvalsData = JSON.parse(approvalsRaw);
                    const userId = approvalsData?.ApprovalMatrix?.[0]?.sentBy;
                
                    if (!userId) {
                        console.warn("User ID not found in approvals data");
                        return;
                    }
                    const currentRemitterType = getRemitterType(selectedTransferType);
                    // Pure API call (No state mapping/updates)
                    const response = await fetch("/api/transfer-Bulk-getReferenceBulk", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            token: token,
                            payload: {
                                fromAccountNumber: "", 
                                userId: userId,
                                remitterType: currentRemitterType
                            }
                        }),
                    });
                
                    const result = await response.json();
                    console.log("API Call successful, status:", result.opstatus);
                    
                    // Note: Data is received in 'result', but not being saved to state as requested.
        
                } catch (err) {
                    console.error("Fetch Error:", err);
                   
                } finally {
                    setLoadingFiles(false);
                }
            };
        
            // This triggers the call once when the component mounts
            useEffect(() => {
                fetchBulkReferences();
            }, [selectedTransferType]);
    useEffect(() => {
        setSelectedRows([]);
    }, [currentPage, rowsPerPage, selectedBulkFile]);
        //account 
        useEffect(() => {
            const storedAccounts = sessionStorage.getItem("accounts");
            if (storedAccounts) {
                const parsedAccounts = JSON.parse(storedAccounts);
                // API mapping ke hisaab se ACCT_NO ya acctNo ko standardize karein
                const formattedAccounts = parsedAccounts.map((acc: any) => ({
                    acctNo: acc.ACCT_NO || acc.accountNumber || acc.acctNo,
                    acctName: acc.ACCT_NAME || acc.accountName || acc.acctName,
                }));
                setAccounts(formattedAccounts);
            }
        }, []);
        const handleAccountChange = async (acctNo: string) => {
            if (!acctNo) return;
            setLoadingAccount(true);
            const currentRemitterType = getRemitterType(selectedTransferType);
            try {
                const profileStr = sessionStorage.getItem("userProfile");
                const claimsToken = sessionStorage.getItem("claimsToken");
                const profile = JSON.parse(profileStr);
                const approvalsRaw = sessionStorage.getItem("approvals");
                const approvalsData = approvalsRaw ? JSON.parse(approvalsRaw) : null;
        
        // 1. SentBy (User ID) uthana session se
        const userId = approvalsData?.ApprovalMatrix?.[0]?.sentBy;
        
                const token = claimsToken;
                const kuid = profile?.user_attributes?.UserName;
    
                const response = await fetch("/api/get-account-details-retail", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        token: claimsToken, 
                        kuid: profile?.user_attributes?.UserName, 
                        accountNumber: acctNo 
                    }),
                });
        
                const result = await response.json();
        
                if (result && result.Accounts?.length > 0) {
                    const accData = result.Accounts[0];
                    
                    // State update: Ensure karein key names match ho rahe hain
                    setSelectedAccount({
                        acctNo: accData.accountNumber, // dropdown ki 'value' isi se match hogi
                        acctName: accData.accountTitle,
                        balance: parseFloat(accData.availableBalance || 0),
                    });
                    const totalDataRes = await fetch("/api/transfer-bulk-getTotalData", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            token: token,
                            payload: {
                                remitterType: currentRemitterType,
                                status: 1,
                                fromAccountNumber: acctNo, // Selected account number
                                userId: userId // sentBy key from session
                            }
                        }),
                    });
        
                    const totalResult = await totalDataRes.json();
                    
                    if (totalResult.opstatus === 0 && totalResult.NDC_BulkPayments?.length > 0) {
                        const stats = totalResult.NDC_BulkPayments[0];
                        
                        // State mein save kar rahe hain Review Summary ke liye
                        setBulkStats({
                            grandTotal: stats.grandTotal,
                            noOfTransaactions: stats.noOfTransaactions
                        });
                        
                        console.log("Stats Saved:", stats);
                        // again calling this api with account number for file reference numbers
                        const fileRefRes = await fetch("/api/transfer-Bulk-getReferenceBulk", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                token: token,
                                payload: {
                                    fromAccountNumber: acctNo, 
                                    userId: userId,
                                    remitterType:currentRemitterType
                                }
                            }),
                        });
                    
                        const fileData = await fileRefRes.json();
            
                        // Yahan dropdown update ho raha hai
                        if (fileData && fileData.NDC_BulkPayments) {
                            const mappedFiles = fileData.NDC_BulkPayments.map((f: any) => ({
                                fileId: f.fileReferenceNumber,
                                fileName: f.fileName
                            }));
                            setBulkFiles(mappedFiles);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching account details:", error);
            } finally {
                setLoadingAccount(false);
                setSelectedBulkFile(undefined);
            }
        };
    
        const handleFileSelect = async (fileReference: string, isHistory: boolean = false) => {
            setSelectedBulkFile(fileReference);
            setOpenFileDropdown(false);
        
            const claimsToken = sessionStorage.getItem("claimsToken");
            const approvalsRaw = sessionStorage.getItem("approvals");
            const approvalsData = approvalsRaw ? JSON.parse(approvalsRaw) : null;
            const userId = approvalsData?.ApprovalMatrix?.[0]?.sentBy;
            const token = claimsToken;
            const currentRemitterType = getRemitterType(selectedTransferType);
            const currentAccountNo = selectedAccount?.acctNo;
            if (!currentAccountNo || !userId) {
                console.error("Account number or User ID missing");
                return;
            }
        
            try {
                
                const response = await fetch('/api/transfer-bulk-getbulkpayments', {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        token: token,
                        fromAccount: currentAccountNo,
                        userId: userId,
                        remitterType: currentRemitterType,
                        fileReference:  isHistory ?"": fileReference,
                        sortBy: isHistory ? "transactionDate" : "createdAt",
                        limit: isHistory ? 20 : 100,
                        status: isHistory ? "2,3" : "1"
                    }),
                });
        
                const result = await response.json();
        
                if (result && result.NDC_BulkPayments) {
                    const rawPayments = result.NDC_BulkPayments;
                    if(!isHistory){
                    // 1. Condition for FT and IBFT
                    if (currentRemitterType === "FT" || currentRemitterType === "IBFT" || currentRemitterType === "OMNI") {
                        const isFT = currentRemitterType === "FT";
                        const isOMNI = currentRemitterType === "OMNI";
                        
                        const accountsPayload = rawPayments.map((p: any) => {
                            return {
                                appChannel: "DCPCRP",
                                accountNumber: p.beneficiaryAccountNumber,
                                accountCurrency: "PKR",
                                accountType: "C",
                                bankIMD: (isFT || isOMNI) ? "588974" : p.bankCode,
                                bankName: (isFT || isOMNI) ? "UBL" : p.bankName,
                                branchCode: isFT 
                                ? p.beneficiaryAccountNumber.substring(0, 4) 
                                : isOMNI 
                                    ? "1256" // OMNI ke liye fixed branch code
                                    : p.beneficiaryBankCode,
                                customerId: userId
                            };
                        });
        
                        // Step 3: Call Title Fetch API
                        const titleRes = await fetch('/api/transfer-bulk-titleftech', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                token: claimsToken,
                                accounts: accountsPayload
                            }),
                        });
        
                        const titleData = await titleRes.json();
        
                        if (titleData && titleData.Payments) {
                            const mergedData = rawPayments.map((record: any, index: number) => {
                                const fetchedInfo = titleData.Payments[index];
                                const opStatusValue = Number(fetchedInfo?.opstatus);
        
                                return {
                                    ...record,
                                    fetchedAccountTitle: fetchedInfo?.accountTitle || record.accountTitle || record.beneficiaryName,
                                    branchCode: fetchedInfo?.branchCode || "",
                                    title: fetchedInfo?.type,
                                    errorDescription: opStatusValue < 0 ? (fetchedInfo?.errorMessage) : "",
                                    status: (opStatusValue === 0 || opStatusValue === 1) ? 'Ready to Process' : 
                                            (opStatusValue < 0) ? 'Failure' : 'Pending',
                                    opstatus: opStatusValue
                                };
                            });
                            setPaymentRecords(mergedData);
                        } else {
                            setPaymentRecords(rawPayments);
                        }
                    } 
                    // 2. Condition for RAAST
                    else if (currentRemitterType === "RAAST") {
                        // FileReference ko as a FileID use karte hue
                        await fetchRaastInquiry(fileReference, rawPayments);
                    }
                    // 3. Condition for OMNI (Yahan 'if' missing tha aur semicolon galat tha)
                    else if (currentRemitterType === "OMNI") {
                        // OMNI API call logic here
                    }
                }
                else{
                    await fetchBulkStatusHistory(rawPayments);
                }
            
            }} catch (error) {
                console.error("Error in selection flow:", error);
            }
            
        };
        //history service
        const fetchBulkStatusHistory = async (rawPayments: any[]) => {
            try {
                console.log(rawPayments);
                const claimsToken = sessionStorage.getItem("claimsToken");
                const currentRemitterType = getRemitterType(selectedTransferType);
        
                // Logic for transactionType
                let txType = currentRemitterType;
                if (currentRemitterType === "FT" || currentRemitterType === "OMNI") {
                    txType = "FT";
                }
        
              // 2. ChildReferenceId se referenceId extract karna
                    const subTransactions = rawPayments
                    .filter(p => p.childReferenceId) // Sirf wo records jinme childReferenceId ho
                    .map(p => {
                        try {
                            // Stringified JSON ko parse kar rahe hain
                            const parsedChild = JSON.parse(p.childReferenceId);
                            return {
                                referenceId: parsedChild.referenceId // Internal referenceId nikal li
                            };
                        } catch (e) {
                            console.error("Error parsing childReferenceId for record:", p.id);
                            return null;
                        }
                    })
                    .filter(item => item !== null); // Jo parse nahi ho sakay unhein nikal dein

        
                const response = await fetch('/api/transfer-Bulk-fundtransferstatus', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        token: claimsToken,
                        payload: {
                            subTransactions: subTransactions,
                            transactionType: txType
                        }
                    })
                });
        
                const result = await response.json();
        
                if (result.opstatus === 0 && result.Payments?.[0]) {
                   
                    // Raw payments ko updated status ke saath merge karna
                    const mergedHistory = rawPayments.map(record => {
                        let finalStatus = record.status;

                    // Condition: Agar status 2 hai to extra5, agar 3 hai to SUCCESS
                        if (record.status === "2") {
                            finalStatus = record.extra5;
                        } else if (record.status === "3") {
                            finalStatus = "SUCCESS";
                        }
                        return {
                            ...record,
                            status: finalStatus,
                            fetchedAccountTitle: record.beneficiaryName || "N/A",
                            amount:record.remmitanceAmount  
                        };
                    });
        
                    setPaymentRecords(mergedHistory);
                }
            } catch (error) {
                console.error("Error fetching bulk status history:", error);
            }
        };
        //raast API
        const fetchRaastInquiry = async (fileID: string, rawPayments: any[]) => {
            try {
                const claimsToken = sessionStorage.getItem("claimsToken");
                
                const response = await fetch("/api/transfer-Bulk-RaastTitle", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        token: claimsToken,
                        fileID: fileID
                    }),
                });
        
                const result = await response.json();
        
                if (result.opstatus === 0) {
                    const instructions = result.validateStatusRes?.instructions || [];
            
                    const mergedData = rawPayments.map((record: any) => {
                        // ID based matching jo kabhi fail nahi hogi
                        const match = instructions.find((ins: any) => {
                            const recordId = String(record.id || "");
                            return ins.instructionId && ins.instructionId.endsWith(recordId);
                        });
            
                        const raastReason = match?.reportedStatus?.rejectedReason; 
                        const raastStatus = match?.reportedStatus?.name;
            
                        return {
                            ...record,
                            fetchedAccountTitle: record.beneficiaryName || "N/A",
                            errmsg: raastReason || record.comment ||record.errorMessage|| "", // Ab yahan "PROCESSED" aayega
                            status: raastStatus === "PROCESSED" ? 'Success' : 
                                    raastStatus === "FAILURE" ? 'Failure' : 'Pending',
                            title: raastStatus === "PROCESSED" ? 'Processed' : 
                                   raastStatus === "PROCESSING" ? 'Processing' : 'Pending',
                            errorDescription: raastReason || ""
                        };
                    });
            
                    setPaymentRecords(mergedData);
                }
            }
                    

        catch (error) {
                console.error("Raast Inquiry Error:", error);
            }
        };
        const handleReject = async () => {
            try {
                setIsSubmitting(true);
                const claimsToken = sessionStorage.getItem("claimsToken");
                const profileStr = sessionStorage.getItem("userProfile");
                const profile = profileStr ? JSON.parse(profileStr) : null;
        
                if (!selectedRows.length || !paymentRecords.length) return;
        
                // Selected records ki IDs ko comma separated string banana
                const recordIds = selectedRows.join(',');
        
                // User name session se
                const userName = profile?.user_attributes?.UserName || "System User";
        
                const payload = {
                    P_RECORDID: recordIds, // e.g. "375550639,375550640"
                    P_BATCHID: selectedBulkFile, // Jo file select ki hai uski ID
                    P_USERNAME: userName,
                    P_STATUS: "3", // Rejected status
                    P_TRANSACTIONID: "0",
                    P_EXTRA5: ""
                };
        
                const response = await fetch('/api/transfer-Bulk-RejectRequest', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        token: claimsToken,
                        payload: payload
                    })
                });
        
                const result = await response.json();
        
                if (result.opstatus === 0) {
                    // Success Message Popup (jaisa screenshot mein hai)
                    setRejectMessage("Transaction has been rejected successfully.");
                    setIsRejectSuccessOpen(true); // Success Popup open karein
                    // alert(`${result.P_RESDESC}\nBatch Reference: ${result.P_BATCHID || payload.P_BATCHID}`);
                    
                    // UI refresh karein ya records remove karein
                    setSelectedRows([]);
                    // Dobara file fetch kar sakte hain status update dekhne ke liye
                    handleFileSelect(selectedBulkFile!); 
                } else {
                    alert("Error: " + result.P_RESDESC);
                }
        
            } catch (error) {
                console.error("Reject API Error:", error);
            }
            finally {
                setIsSubmitting(false);
            }
        };

        const handleContinue = async () => {
            try {
                setIsSubmitting(true);
                const claimsToken = sessionStorage.getItem("claimsToken");
                const profileStr = sessionStorage.getItem("userProfile");
                const profile = profileStr ? JSON.parse(profileStr) : null;
                
                // Contract aur Core Customer ID aksar profile ya session mein hoti hain
                const contractId = sessionStorage.getItem("contractId") || "1960646668"; 
                const coreCustomerId = profile?.user_attributes?.coreCustomerId || "20269367";
                const customerId = profile?.user_attributes?.primary_id || "3943220338";
        
                if (!selectedAccount || !summaryData) {
                    alert("Please select account and transactions");
                    return;
                }
        
                const payload = {
                    customerId: customerId,
                    accountNo: selectedAccount.acctNo,
                    featureAction: getFeatureAction(selectedTransferType),
                    amount: summaryData.totalPayment,
                    contractId: contractId,
                    coreCustomerId: coreCustomerId
                };
        
                const response = await fetch('/api/transfer-bulk-Confirmapproval', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        token: claimsToken,
                        payload: payload
                    })
                });
        
                const result = await response.json();
        
                // Agar service success ho jaye (opstatus 0 aur responseCode 00)
                if (result.opstatus === 0 && result.responseCode === "00") {
                    // Success par popup open karein
                    setIsConfirmDialogOpen(true);
                } else {
                    alert(result.message || "Service confirmation failed");
                }
        
            } catch (error) {
                console.error("API Error:", error);
            } finally {
                setIsSubmitting(false);
            }
        };
        const handleContinueYes = async () => {
            setIsConfirmDialogOpen(false); // Pehla popup band karein
            
            try {
                setIsSubmitting(true);
                handleSendOTP();
                // Yahan aapki OTP service call hogi jo aapne pehle banayi hogi
                // Example: const res = await requestOtpService();
                
                console.log("OTP Sent Successfully");
                setIsOtpOpen(true); // OTP wala popup open karein
            } catch (error) {
                console.error("OTP Error:", error);
            } finally {
                setIsSubmitting(false);
            }
        };
        // Helper function to map transfer types to feature actions
        const getFeatureAction = (type: string) => {
            switch (type) {
                case "Funds Transfer": return "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE";
                case "Inter Bank Funds Transfer": return "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE";
                case "Raast Payment": return "P2P_CREATE";
                case "Omni Payment": return "OMNI_CREATE";
                default: return "FT_CREATE";
            }
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
        const handleFinalSubmit = async (otpValue: string) => {
            try {
                setIsSubmitting(true);
                // Final service hit karein yahan
                // const res = await finalizeBulkTransfer(otpValue);
                
                setIsOtpOpen(false);
                // Success message ya popup dikhayein
            } catch (error) {
                alert("Invalid OTP or Transaction Failed");
            } finally {
                setIsSubmitting(false);
            }
        };
    
    const handleTypeSelect = (title: string) => {
        setSelectedType(title);
        setSelectedAccount(null);
        setSelectedBulkFile(undefined);
        setRowsPerPage('50');
        setCurrentPage(1);
    }
    
    const handleRowsPerPageChange = (value: string) => {
        setRowsPerPage(value);
        setCurrentPage(1);
    }

    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    const handleSelectAll = (checked: boolean | string) => {
        if (checked) {
            setSelectedRows(paymentRecords.map((d: any) => String(d.id)));
        } else {
            setSelectedRows([]);
        }
    };

    const handleRowSelect = (rowId: string, checked: boolean | string) => {
        setSelectedRows(prev => 
            checked ? [...prev, rowId] : prev.filter(id => id !== rowId)
        );
    };

    const currentData = paymentRecords; 

    const isAllSelected = selectedRows.length === currentData.length && currentData.length > 0;
    
    const summaryData = useMemo(() => {
        // Pehla Check: Agar koi row select NAHI hui, to summary mat dikhao
        if (selectedRows.length === 0 || paymentRecords.length === 0) {
            return null;
        }
    
        // 1. Jo transactions user ne checkbox se select ki hain
        const selectedTransactions = paymentRecords.filter((d: any) => 
            selectedRows.includes(String(d.id))
    );
    
        // 2. Selected transactions ka total amount
        const totalPayment = selectedTransactions.reduce(
            (sum, d: any) => sum + Number(d.remittanceAmount || 0), 0
        );
    
        // 3. API wala Grand Total (bulkStats state se)
        const grandTotalCount = parseInt(bulkStats.noOfTransaactions || "0");
        const grandTotalAmount = parseFloat(bulkStats.grandTotal || "0");
    
        // 4. Hold Calculation (Total - Selected)
        const transactionsToHoldCount = grandTotalCount - selectedTransactions.length;
        const transactionsToHoldAmount = grandTotalAmount - totalPayment;
    
        return {
            totalPayment,
            availableBalance: selectedAccount?.balance ?? 0,
            grandTotalCount,
            grandTotalAmount,
            selectedCount: selectedTransactions.length,
            transactionsToHoldCount: Math.max(0, transactionsToHoldCount),
            transactionsToHoldAmount: Math.max(0, transactionsToHoldAmount),
        };
    }, [selectedRows, selectedAccount, paymentRecords, bulkStats]);

const [isStatusPopupOpen, setIsStatusPopupOpen] = useState(false);

const handleStatusSelection = (type: 'All' | 'Success' | 'Failure') => {
    let filteredIds: string[] = [];
    
    if (type === 'All') {
        filteredIds = paymentRecords.map((d: any) => String(d.id));
    } else if (type === 'Success') {
        // Yahan 'Ready to Process' ka check bhi shamil karein
        filteredIds = paymentRecords
            .filter((d: any) => d.status === 'Success' || d.status === 'Ready to Process')
            .map((d: any) => String(d.id));
    } else if (type === 'Failure') {
        filteredIds = paymentRecords
            .filter((d: any) => d.status === 'Failure')
            .map((d: any) => String(d.id));
    }
    
    setSelectedRows(filteredIds);
    setIsStatusPopupOpen(false);
};

    return (
        <div className="mt-4 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {transferTypes.map((type) => (
                    <Card
                        key={type.title}
                        className={cn(
                            "cursor-pointer transition-all hover:border-primary/50",
                            selectedTransferType === type.title ? "border-primary ring-1 ring-primary" : ""
                        )}
                        onClick={() => handleTransferTypeClick(type.title)}
                    >
                        <CardContent className="p-4 flex items-start gap-4">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <Check className={cn(
                                    "h-5 w-5",
                                    selectedTransferType === type.title ? "text-primary" : "text-transparent"
                                )} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">{type.title}</h3>
                                <p className="text-xs text-muted-foreground">{type.description}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        {/* Account Number Dropdown (Dynamic) */}
                        <div>
                            <label className="text-sm text-muted-foreground">Account Number</label>
                            <Select 
                            onValueChange={handleAccountChange} 
                            // Fallback empty string reset ke liye zaroori hai
                            value={selectedAccount?.acctNo || ""}
                        >
                            <SelectTrigger className={cn("w-full", loadingAccount && "opacity-50 pointer-events-none")}>
                                <SelectValue placeholder="Please select">
                                    {/* Jab account select ho jaye to uska number screen par dikhane ke liye logic */}
                                    {selectedAccount ? selectedAccount.acctNo : "Please select"}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {/* 'accounts' array wahi hai jo API se load ho rahi hai */}
                                {accounts.map((account, idx) => (
                                    <SelectItem key={idx} value={account.acctNo}>
                                        {account.acctNo}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        </div>

                      {/* Account Name */}
                      <div>
                            <label className="text-sm text-muted-foreground">Account Name</label>
                            <Input disabled value={selectedAccount?.acctName || ''} className="bg-slate-50" />
                        </div>

                        {/* SEARCHABLE DROP DOWN YAHAN HAI */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-muted-foreground">Bulk File</label>
                            <Popover open={openFileDropdown} onOpenChange={setOpenFileDropdown}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openFileDropdown}
                                        className="justify-between font-normal"
                                    >
                                        {selectedBulkFile
                                            ? bulkFiles.find((file) => file.fileId === selectedBulkFile)?.fileName
                                            : "Search or Select file..."}
                                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-cyan-50 border-cyan-200" 
  align="start">
                                    <Command>
                                        <CommandInput placeholder="Type file name..." />
                                        <CommandList className="max-h-[200px] overflow-y-auto">
                                            <CommandEmpty>No file found.</CommandEmpty>
                                            <CommandGroup>
                                                {bulkFiles.map((file) => (
                                                  <CommandItem
                                                  key={file.fileId}
                                                  onSelect={() => handleFileSelect(file.fileId)} // Reference number pass karein
                                                  className="text-cyan-900 aria-selected:bg-cyan-100"
                                                >
                                                  <Check className={cn("mr-2 h-4 w-4", selectedBulkFile === file.fileId ? "opacity-100" : "opacity-0")} />
                                                  {file.fileName}
                                                </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs 
              value={activeTab}
              onValueChange={(value) => {
                  setActiveTab(value);
                  
                  // Agar koi file pehle se selected hai, to tab switch hote hi API hit hogi
                  if (selectedBulkFile) {
                      const isHistory = (value === "history");
                      handleFileSelect(selectedBulkFile, isHistory);
                  }
                }}
            >
                <TabsList>
                    <TabsTrigger value="details">Bulk Processing Details</TabsTrigger>
                    <TabsTrigger value="history">Bulk Processing History</TabsTrigger>
                </TabsList>
                <TabsContent value="details">
                {selectedBulkFile ? (
                    <div className="rounded-lg border bg-card shadow-sm mt-4">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-[#ECECEC8C]">
                                    <TableHead className="w-[50px]">
                                <Dialog open={isStatusPopupOpen} onOpenChange={setIsStatusPopupOpen}>
                                    <DialogTrigger asChild>
                                        <div className="flex items-center cursor-pointer">
                                            <Checkbox
                                                checked={isAllSelected}
                                                className="data-[state=checked]:bg-primary"
                                            />
                                        </div>
                                    </DialogTrigger>

                                    {/* Iska background automatically fade/overlay hota hai */}
                                    <DialogContent className="sm:max-w-[400px] p-0 border-none bg-white overflow-hidden">
                                        <div className="p-8">
                                            <DialogHeader className="mb-6">
                                                <DialogTitle className="text-center text-2xl font-bold">Transactions</DialogTitle>
                                                <p className="text-center text-sm text-muted-foreground">Select type of status</p>
                                            </DialogHeader>
                                            
                                            <div className="flex justify-center items-center gap-3">
                                                <Button 
                                                    variant="outline" 
                                                    className="flex-1 bg-slate-100 hover:bg-slate-200 border-none text-slate-700 font-semibold h-12"
                                                    onClick={() => handleStatusSelection('All')}
                                                >
                                                    All
                                                </Button>
                                                <Button 
                                                    className="flex-1 bg-[#007dbd] hover:bg-[#006ca3] text-white font-semibold h-12"
                                                    onClick={() => handleStatusSelection('Success')}
                                                >
                                                    Success
                                                </Button>
                                                <Button 
                                                    className="flex-1 bg-[#ff5b4d] hover:bg-[#e04b3d] text-white font-semibold h-12"
                                                    onClick={() => handleStatusSelection('Failure')}
                                                >
                                                    Failure
                                                </Button>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </TableHead>
                                        <TableHead>File Reference Number</TableHead>
                                        <TableHead>Account Title</TableHead>
                                        <TableHead>Customer Unique ID</TableHead>
                                        <TableHead>Beneficiary Account No.</TableHead>
                                        <TableHead className="text-right">Local Amount</TableHead>
                                        <TableHead>File Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                
                                {/* Body ko ek hi table ke andar rakhein */}
                                <TableBody>
                                {paymentRecords.length > 0 ? (
                                    paymentRecords.map((detail: any) => (
                                        <BulkDetailRow
                                            // key={detail.customerUniqueId}
                                            // detail={detail}
                                            // isSelected={selectedRows.includes(detail.customerUniqueId)}
                                            key={detail.id} // customerUniqueId ki jagah id use karein
        detail={detail}
        isSelected={selectedRows.includes(detail.id)}
                                            onSelect={handleRowSelect}
                                        />
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                                            No Records Found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                            </Table>
                        </div>
                        
                        {/* Pagination UI yahan aayega */}
                    </div>
                ) : (
                    <div className="h-48 flex items-center justify-center border rounded-lg mt-4">
                        <p className="text-muted-foreground">Please select a Bulk File</p>
                    </div>
                )}
            </TabsContent>
            {/* HISTORY TAB */}
            <TabsContent value="history">
        {selectedBulkFile ? (
            <div className="rounded-lg border bg-card shadow-sm mt-4">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-[#ECECEC8C]">
                                {/* History mein checkbox nahi dikhana */}
                                <TableHead>File Reference Number</TableHead>
                                <TableHead>Account Title</TableHead>
                                <TableHead>Customer Unique ID</TableHead>
                                <TableHead>Beneficiary Account No.</TableHead>
                                <TableHead >Local Amount</TableHead>
                                <TableHead>File Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paymentRecords.length > 0 ? (
                                paymentRecords.map((detail: any) => (
                                    <TableRow key={detail.id}>
                                        <TableCell>{detail.fileId || selectedBulkFile}</TableCell>
                                        <TableCell>{detail.fetchedAccountTitle}</TableCell>
                                        <TableCell>{detail.customerUniqueId}</TableCell>
                                        <TableCell>{detail.beneficiaryAccountNumber}</TableCell>
                                        <TableCell >{detail.remittanceAmount}. 00</TableCell>
                                        <TableCell>
                                            <span className={cn(
                                                "px-2 py-1 rounded-full text-xs font-semibold",
                                                detail.status === "Ready to Process" ? "bg-blue-100 text-blue-700" : 
                                                detail.status === "Success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                            )}>
                                                {detail.status}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                        No Records Found in History
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        ) : (
            <div className="h-48 flex items-center justify-center border rounded-lg mt-4 text-muted-foreground">
                Please select a Bulk File to view history
            </div>
        )}
    </TabsContent>
</Tabs>
                        
                        {selectedRows.length > 0 && summaryData && (
                <ReviewSummary {...summaryData} onReject={handleReject} onContinue={handleContinue} 
                    />
            )}

                                    {/* Confirmation Dialog after Service Success */}
                                    <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                                <DialogContent className="sm:max-w-[450px] p-8">
                                    <div className="flex flex-col items-center text-center gap-4">
                                        <h2 className="text-2xl font-bold text-slate-800">Bulk Transfers</h2>
                                        <p className="text-slate-600">Do you want to continue?</p>
                                        
                                        <div className="flex gap-4 w-full mt-4">
                                            <Button 
                                                variant="outline" 
                                                className="flex-1 h-12 bg-slate-100 hover:bg-slate-200 border-none font-semibold"
                                                onClick={() => setIsConfirmDialogOpen(false)}
                                            >
                                                No
                                            </Button>
                                            <Button 
                                                className="flex-1 h-12 bg-[#007dbd] hover:bg-[#006ca3] text-white font-semibold"
                                                onClick={handleContinueYes}
                                            >
                                                Yes
                                            </Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                            {/* Reject Success Popup */}
            <Dialog open={isRejectSuccessOpen} onOpenChange={setIsRejectSuccessOpen}>
                <DialogContent className="sm:max-w-[400px] p-0 border-none bg-white overflow-hidden shadow-2xl">
                    <div className="p-8 flex flex-col items-center text-center">
                        {/* Success Icon/Circle */}
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                                !
                            </div>
                        </div>
                        
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Rejected</h2>
                        <p className="text-slate-600 text-sm mb-6">
                            {rejectMessage}
                        </p>
                        
                        <Button 
                            className="w-full h-12 bg-[#007dbd] hover:bg-[#006ca3] text-white font-semibold rounded-md"
                            onClick={() => {
                                setIsRejectSuccessOpen(false);
                                // Optionally: Page refresh ya state clear karne ka logic yahan dalein
                            }}
                        >
                            Done
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            {/* OTP Popup */}
          {/* OTP Dialog Component */}
          <OtpDialog 
                open={isOtpOpen} 
                onOpenChange={setIsOtpOpen} 
                onConfirm={handleOtpConfirm} 
                onResend={() => console.log("OTP Resend Clicked")}
            />
        </div>
    )
}
