
'use client';

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ChevronRight, ChevronLeft, ChevronDown, ChevronUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Checkbox } from "../ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";

const transferTypes = [
    { title: "Funds Transfer", description: "Own & Internal" },
    { title: "Inter Bank Funds Transfer", description: "Other Banks" },
    { title: "Raast Payment", description: "All Raast Accounts" },
    { title: "Omni Payment", description: "All Omni Accounts" },
];

type BulkDetail = {
    fileReferenceNumber: string;
    beneficiaryName: string;
    accountTitle: string;
    localAmount: string;
    beneficiaryAccountNo: string;
    customerUniqueId: string;
    beneficiaryEmail: string;
    beneficiaryPhone: string;
    beneficiaryBankCode: string;
    beneficiaryBankName: string;
    status: 'Processed' | 'Failed' | 'Pending';
    titleFetch: 'Success' | 'Failed';
    reasonOfFailure: string;
};


const generateBulkDetails = (count: number): BulkDetail[] => {
    return Array.from({ length: count }, (_, i) => ({
        fileReferenceNumber: '0016249076386172',
        beneficiaryName: ['ali akber', 'shahzain', 'Jatoi', 'Ahmed', 'Fatima', 'Bilal'][i % 6],
        accountTitle: 'PGEBSTYCCCESXVGIDQBMKWU',
        localAmount: `${(120000 + i * 1000).toLocaleString()}.00`,
        beneficiaryAccountNo: `PK42UNIL01090002300175${88 + i}`,
        customerUniqueId: `UB_amt_${10 + i}`,
        beneficiaryEmail: `beneficiary${i}@example.com`,
        beneficiaryPhone: `0300-123456${i}`,
        beneficiaryBankCode: `00${i % 9 + 1}`,
        beneficiaryBankName: ['UBL', 'HBL', 'Meezan', 'Alfalah', 'Askari'][i % 5],
        status: i % 3 === 0 ? 'Processed' : i % 3 === 1 ? 'Failed' : 'Pending',
        titleFetch: i % 2 === 0 ? 'Success' : 'Failed',
        reasonOfFailure: i % 3 === 1 ? 'Insufficient funds' : '',
    }));
};

const bulkProcessingDetails = generateBulkDetails(100);

const accounts = [
    { acctNo: '253237095', acctName: 'BUYIRABHPTIJBGGVBLAVMBLQINKV', balance: 1522110.03 },
    { acctNo: '060510224211', acctName: 'NAWAZ ALI', balance: 2500000.00 },
    { acctNo: '060510224212', acctName: 'IDREES APPROVER', balance: 500000.00 },
];

const bulkFiles = [
    { fileId: '0016249_A', fileName: '17-oct-25-01 0016249_A' },
    { fileId: '0016249_B', fileName: '18-oct-25-02 0016249_B' },
    { fileId: '0016249_C', fileName: '19-oct-25-03 0016249_C' },
];

const DetailRow = ({ label, value }: { label: string, value: React.ReactNode }) => (
    <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
    </div>
);


const BulkDetailRow = ({ detail, onSelect, isSelected }: { detail: BulkDetail; onSelect: (id: string, checked: boolean) => void; isSelected: boolean }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
         <Collapsible asChild open={isOpen} onOpenChange={setIsOpen}>
            <>
                <TableRow>
                    <TableCell>
                        <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => onSelect(detail.customerUniqueId, !!checked)}
                        />
                    </TableCell>
                    <TableCell>{detail.beneficiaryName}</TableCell>
                    <TableCell>{detail.accountTitle}</TableCell>
                    <TableCell>{detail.customerUniqueId}</TableCell>
                    <TableCell>{detail.beneficiaryAccountNo}</TableCell>
                    <TableCell>{detail.localAmount}</TableCell>
                    <TableCell>
                        <span className={cn('px-2 py-1 text-xs rounded-full', {
                            'bg-green-100 text-green-800': detail.status === 'Processed',
                            'bg-red-100 text-red-800': detail.status === 'Failed',
                            'bg-yellow-100 text-yellow-800': detail.status === 'Pending',
                        })}>
                            {detail.status}
                        </span>
                    </TableCell>
                    <TableCell className="text-right">
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm">View {isOpen ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}</Button>
                        </CollapsibleTrigger>
                    </TableCell>
                </TableRow>
                <CollapsibleContent asChild>
                    <TableRow>
                        <TableCell colSpan={8} className="p-0">
                            <div className="bg-muted/50 p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                                <DetailRow label="File Reference" value={detail.fileReferenceNumber} />
                                <DetailRow label="Beneficiary Email" value={detail.beneficiaryEmail} />
                                <DetailRow label="Beneficiary Phone" value={detail.beneficiaryPhone} />
                                <DetailRow label="Bank Code" value={detail.beneficiaryBankCode} />
                                <DetailRow label="Bank Name" value={detail.beneficiaryBankName} />
                                <DetailRow label="Title Fetch" value={detail.titleFetch} />
                                {detail.reasonOfFailure && <DetailRow label="Reason of Failure" value={detail.reasonOfFailure} />}
                            </div>
                        </TableCell>
                    </TableRow>
                </CollapsibleContent>
            </>
        </Collapsible>
    )
}

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
        <footer className="sticky bottom-0 bg-background/95 p-4 border-t z-10 mt-6">
            <div className="max-w-7xl mx-auto flex flex-col gap-4">
                 <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Review Summary</h2>
                    <div className="flex items-center gap-6 text-right">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Payment</p>
                            <p className="font-semibold text-primary">{formatCurrency(totalPayment)}</p>
                        </div>
                         <div>
                            <p className="text-sm text-muted-foreground">Available Balance</p>
                            <p className="font-semibold text-green-600">{formatCurrency(availableBalance)}</p>
                        </div>
                         <div>
                            <p className="text-sm text-muted-foreground">Remaining Balance</p>
                            <p className="font-semibold text-red-600">{formatCurrency(remainingBalance)}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50" style={{ backgroundColor: '#ECECEC8C' }}>
                                <TableHead></TableHead>
                                <TableHead className="font-bold">Grand Total</TableHead>
                                <TableHead className="font-bold">Transactions to Hold</TableHead>
                                <TableHead className="font-bold">Transactions Selected</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium text-muted-foreground">Transactions Selected</TableCell>
                                <TableCell>{grandTotalCount}</TableCell>
                                <TableCell>{transactionsToHoldCount}</TableCell>
                                <TableCell>{selectedCount}</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell className="font-medium text-muted-foreground">Amount</TableCell>
                                <TableCell>{formatCurrency(grandTotalAmount)}</TableCell>
                                <TableCell>{formatCurrency(transactionsToHoldAmount)}</TableCell>
                                <TableCell>{formatCurrency(totalPayment)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
                
                 <div className="flex justify-end items-center gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button variant="destructive">Reject</Button>
                    <Button>Continue</Button>
                </div>
            </div>
        </footer>
    );
};


export function BulkTransfer() {
    const [selectedType, setSelectedType] = useState(transferTypes[0].title);
    const [selectedAccount, setSelectedAccount] = useState<typeof accounts[0] | null>(null);
    const [selectedBulkFile, setSelectedBulkFile] = useState<string | undefined>(undefined);
    const [rowsPerPage, setRowsPerPage] = useState('50');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);

    const rows = parseInt(rowsPerPage);
    const totalPages = Math.ceil(bulkProcessingDetails.length / rows);
    const startIndex = (currentPage - 1) * rows;
    const endIndex = Math.min(startIndex + rows, bulkProcessingDetails.length);
    const currentData = bulkProcessingDetails.slice(startIndex, endIndex);

    useEffect(() => {
        setSelectedRows([]);
    }, [currentPage, rowsPerPage, selectedBulkFile]);

    const handleAccountChange = (acctNo: string) => {
        const account = accounts.find(a => a.acctNo === acctNo);
        setSelectedAccount(account || null);
        setSelectedBulkFile(undefined); // Reset bulk file selection
    }
    
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

    const isAllSelected = selectedRows.length === currentData.length && currentData.length > 0;
    
    const summaryData = useMemo(() => {
        if (selectedRows.length === 0) return null;

        const selectedTransactions = bulkProcessingDetails.filter(d => selectedRows.includes(d.customerUniqueId));
        const totalPayment = selectedTransactions.reduce((sum, d) => sum + parseFloat(d.localAmount.replace(/,/g, '')), 0);
        
        const grandTotalCount = bulkProcessingDetails.length;
        const grandTotalAmount = bulkProcessingDetails.reduce((sum, d) => sum + parseFloat(d.localAmount.replace(/,/g, '')), 0);

        const transactionsToHoldCount = grandTotalCount - selectedTransactions.length;
        const transactionsToHoldAmount = grandTotalAmount - totalPayment;
        
        return {
            totalPayment,
            availableBalance: selectedAccount?.balance ?? 0,
            grandTotalCount,
            grandTotalAmount,
            selectedCount: selectedTransactions.length,
            transactionsToHoldCount,
            transactionsToHoldAmount,
        };
    }, [selectedRows, selectedAccount]);


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
                        <div>
                            <label className="text-sm text-muted-foreground">Account Number</label>
                            <Select onValueChange={handleAccountChange} value={selectedAccount?.acctNo}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Please select"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {accounts.map(account => (
                                        <SelectItem key={account.acctNo} value={account.acctNo}>{account.acctNo}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                             <label className="text-sm text-muted-foreground">Account Name</label>
                            <Input disabled value={selectedAccount?.acctName || ''} placeholder="" />
                        </div>
                        <div>
                             <label className="text-sm text-muted-foreground">Bulk File</label>
                             <Select value={selectedBulkFile} onValueChange={setSelectedBulkFile}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Please select" />
                                </SelectTrigger>
                                <SelectContent>
                                    {bulkFiles.map(file => (
                                        <SelectItem key={file.fileId} value={file.fileId}>{file.fileName}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                            <div className="overflow-auto h-[450px]">
                                <Table>
                                    <TableHeader className="sticky top-0 z-10 bg-card" style={{ backgroundColor: '#ECECEC8C' }}>
                                        <TableRow>
                                            <TableHead>
                                                <Checkbox
                                                    checked={isAllSelected}
                                                    onCheckedChange={handleSelectAll}
                                                />
                                            </TableHead>
                                            <TableHead>Beneficiary Name</TableHead>
                                            <TableHead>Account Title</TableHead>
                                            <TableHead>Customer Unique ID</TableHead>
                                            <TableHead>Beneficiary Account No.</TableHead>
                                            <TableHead>Local Amount</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {currentData.map((detail) => (
                                            <BulkDetailRow
                                                key={detail.customerUniqueId}
                                                detail={detail}
                                                isSelected={selectedRows.includes(detail.customerUniqueId)}
                                                onSelect={handleRowSelect}
                                            />
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="flex items-center justify-between p-4 border-t">
                                <Button variant="ghost" size="icon" onClick={handlePreviousPage} disabled={currentPage === 1}>
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-muted-foreground">Rows per page</span>
                                    <Select value={rowsPerPage} onValueChange={handleRowsPerPageChange}>
                                        <SelectTrigger className="w-28">
                                            <SelectValue placeholder="50" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="50">50</SelectItem>
                                            <SelectItem value="100">100</SelectItem>
                                            <SelectItem value="200">200</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <span className="text-sm text-muted-foreground">{startIndex + 1} - {endIndex} of {bulkProcessingDetails.length} Transactions</span>
                                </div>
                                <Button variant="ghost" size="icon" onClick={handleNextPage} disabled={currentPage === totalPages}>
                                    <ChevronRight className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm mt-4">
                            <div className="h-48 flex items-center justify-center">
                                <p className="text-muted-foreground">No Record Found</p>
                            </div>
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="history">
                     <div className="p-6 text-center text-muted-foreground border rounded-lg">
                        Bulk Processing History will be shown here.
                    </div>
                </TabsContent>
            </Tabs>
            
            {summaryData && <ReviewSummary {...summaryData} />}

        </div>
    )
}
