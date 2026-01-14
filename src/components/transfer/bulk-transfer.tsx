
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
                        onCheckedChange={(checked) => onSelect(detail.customerUniqueId, !!checked)}
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
                        detail.status === 'Success' ? 'bg-green-100 text-green-800' : 
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
                            <DetailRow label="Bank Code" value={detail.beneficiaryBankName || "N/A"} />
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
}: {
    totalPayment: number;
    availableBalance: number;
    grandTotalCount: number;
    grandTotalAmount: number;
    selectedCount: number;
    transactionsToHoldCount: number;
    transactionsToHoldAmount: number;
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
                    <Button variant="destructive" className="px-8">Reject</Button>
                    <Button className="px-10 bg-primary hover:bg-primary/90">Continue</Button>
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
  
    
    const rows = parseInt(rowsPerPage);
    // const totalPages = Math.ceil(bulkProcessingDetails.length / rows);
    const startIndex = (currentPage - 1) * rows;
    // const endIndex = Math.min(startIndex + rows, bulkProcessingDetails.length);
    // const currentData = bulkProcessingDetails.slice(startIndex, endIndex);
    const hasFetched = useRef(false);
            //api calling

            const fetchBulkReferences = async () => {
                if (hasFetched.current) return;
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
                
                    // Pure API call (No state mapping/updates)
                    const response = await fetch("/api/transfer-Bulk-getReferenceBulk", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            token: token,
                            payload: {
                                fromAccountNumber: "", 
                                userId: userId,
                                remitterType: "FT" 
                            }
                        }),
                    });
                
                    const result = await response.json();
                    console.log("API Call successful, status:", result.opstatus);
                    
                    // Note: Data is received in 'result', but not being saved to state as requested.
        
                } catch (err) {
                    console.error("Fetch Error:", err);
                    hasFetched.current = false;
                } finally {
                    setLoadingFiles(false);
                }
            };
        
            // This triggers the call once when the component mounts
            useEffect(() => {
                fetchBulkReferences();
            }, []);
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
            setLoadingAccount(true);
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
                        token, 
                        kuid, 
                        accountNumber: acctNo 
                    }),
                });
    
                const result = await response.json();
    
                // API response ke mutabiq state update karein
                if (result && result.Accounts && result.Accounts.length > 0) {
                    const accData = result.Accounts[0];
                    
                    setSelectedAccount({
                        acctNo: accData.accountNumber,
                        acctName: accData.accountTitle,
                        balance: parseFloat(accData.availableBalance || 0),
                    });
                
                    const totalDataRes = await fetch("/api/transfer-bulk-getTotalData", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            token: token,
                            payload: {
                                remitterType: "FT",
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
                                    remitterType: "FT" 
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
    
        const handleFileSelect = async (fileReference: string) => {
            setSelectedBulkFile(fileReference); // Dropdown update
            setOpenFileDropdown(false);
            //session
            const claimsToken = sessionStorage.getItem("claimsToken");
            const approvalsRaw = sessionStorage.getItem("approvals");
            const approvalsData = approvalsRaw ? JSON.parse(approvalsRaw) : null;
            const userId = approvalsData?.ApprovalMatrix?.[0]?.sentBy;
            const token = claimsToken;
          
            const currentAccountNo = selectedAccount?.acctNo; 

            if (!currentAccountNo || !userId) {
                console.error("Account number or User ID missing");
                return;
            }
        
            try {
                const response = await fetch('/api/transfer-bulk-getbulkpayments', {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" }, // Header lazmi add karein
                    body: JSON.stringify({
                        token: token,
                        fromAccount: currentAccountNo, 
                        userId: userId,
                        fileReference: fileReference,
                    }),
                });
        
                const result = await response.json();
                if (result && result.NDC_BulkPayments) {
                    const rawPayments = result.NDC_BulkPayments;
        
                    // --- STEP 2: Fetch Titles ---
                    // Payload taiyar karna (jitne accounts records mein hain)
                    const accountsPayload = rawPayments.map((p: any) => ({
                        appChannel: "DCPCRP",
                        accountNumber: p.beneficiaryAccountNumber,
                        accountCurrency: "PKR",
                        accountType: "C",
                        bankIMD: p.beneficiaryBankCode || "588974",
                        bankName: "UBL",
                        branchCode: p.beneficiaryAccountNumber.substring(0, 4),
                        customerId: userId 
                    }));
        
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
                            // Match by index (kyunki sequence usually same rehta hai)
                            const fetchedInfo = titleData.Payments[index];
                            const opStatusValue = Number(fetchedInfo?.opstatus);

                            return {
                                ...record,
                                // Agar service title laayi hai to wo dikhao, warna purana wala
                                fetchedAccountTitle: fetchedInfo?.accountTitle || record.accountTitle || "N/A",
                                branchCode: fetchedInfo?.branchCode || "",
                                title:fetchedInfo?.type,
                                errorDescription: opStatusValue < 0 ? (fetchedInfo?.errorMessage): "",
                                status: (opStatusValue === 0 || opStatusValue === 1) ? 'Success' : 
                                (opStatusValue < 0) ? 'Failure' : 'Pending',
                                opstatus: opStatusValue
                            };
                        });
        
                        setPaymentRecords(mergedData);
                    } else {
                        setPaymentRecords(rawPayments);
                    }
                }
            } catch (error) {
                console.error("Error in selection flow:", error);
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
            setSelectedRows(currentData.map(d => d.customerUniqueId));
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
            selectedRows.includes(d.customerUniqueId)
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
        filteredIds = paymentRecords.map((d: any) => d.customerUniqueId);
    } else if (type === 'Success') {
        filteredIds = paymentRecords
            .filter((d: any) => d.status === 'Success')
            .map((d: any) => d.customerUniqueId);
    } else if (type === 'Failure') {
        filteredIds = paymentRecords
            .filter((d: any) => d.status === 'Failure')
            .map((d: any) => d.customerUniqueId);
    }
    
    setSelectedRows(filteredIds);
    setIsStatusPopupOpen(false);
};
    return (
        <div className="mt-4 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {transferTypes.map(type => (
                    <Card
                        key={type.title}
                        className={cn(
                            "cursor-pointer transition-all",
                            selectedType === type.title ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50"
                        )}
                        onClick={() => handleTypeSelect(type.title)}
                    >
                        <CardContent className="p-4">
                            <h3 className="font-semibold text-sm">{type.title}</h3>
                            <p className="text-xs text-muted-foreground">{type.description}</p>
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
                            <Select onValueChange={handleAccountChange} value={selectedAccount?.acctNo}>
                                <SelectTrigger className={loadingAccount ? "opacity-50" : ""}>
                                    <SelectValue placeholder={loadingAccount ? "Fetching details..." : "Please select"}/>
                                </SelectTrigger>
                                <SelectContent>
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

            <Tabs defaultValue="details">
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
                                            key={detail.customerUniqueId}
                                            detail={detail}
                                            isSelected={selectedRows.includes(detail.customerUniqueId)}
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
                <TabsContent value="history">
                     <div className="p-6 text-center text-muted-foreground border rounded-lg">
                        Bulk Processing History will be shown here.
                    </div>
                </TabsContent>
            </Tabs>
            
            {selectedRows.length > 0 && summaryData && (
    <ReviewSummary {...summaryData} />
)}

        </div>
    )
}
