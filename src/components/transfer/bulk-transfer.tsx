
'use client';

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Checkbox } from "../ui/checkbox";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

const transferTypes = [
    { title: "Funds Transfer", description: "Own & Internal" },
    { title: "Inter Bank Funds Transfer", description: "Other Banks" },
    { title: "Raast Payment", description: "All Raast Accounts" },
    { title: "Omni Payment", description: "All Omni Accounts" },
];

const generateBulkDetails = (count: number) => {
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
    { acctNo: '253237095', acctName: 'BUYIRABHPTIJBGGVBLAVMBLQINKV' },
    { acctNo: '060510224211', acctName: 'NAWAZ ALI' },
    { acctNo: '060510224212', acctName: 'IDREES APPROVER' },
];

const bulkFiles = [
    { fileId: '0016249076386172', fileName: '17-oct-25-01 0016249076386172' },
    { fileId: '0016249076386173', fileName: '18-oct-25-02 0016249076386173' },
    { fileId: '0016249076386174', fileName: '19-oct-25-03 0016249076386174' },
];


export function BulkTransfer() {
    const [selectedType, setSelectedType] = useState(transferTypes[0].title);
    const [selectedAccount, setSelectedAccount] = useState<typeof accounts[0] | null>(null);
    const [selectedBulkFile, setSelectedBulkFile] = useState<string | undefined>(undefined);
    const [rowsPerPage, setRowsPerPage] = useState<string | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);

    const rows = rowsPerPage ? parseInt(rowsPerPage) : bulkProcessingDetails.length;
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
        setRowsPerPage(undefined);
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
                            <ScrollArea className="w-full whitespace-nowrap" style={{ height: '400px' }}>
                                <Table>
                                    <TableHeader className='sticky top-0 z-20'>
                                        <TableRow style={{ backgroundColor: '#ECECEC8C' }} className="bg-card">
                                            <TableHead className="w-12 sticky left-0 z-20" style={{ backgroundColor: '#ECECEC8C' }}>
                                                <Checkbox
                                                    checked={isAllSelected}
                                                    onCheckedChange={handleSelectAll}
                                                />
                                            </TableHead>
                                            <TableHead>File Reference Number</TableHead>
                                            <TableHead>Beneficiary Name</TableHead>
                                            <TableHead>Account Title</TableHead>
                                            <TableHead>Local Amount</TableHead>
                                            <TableHead>Beneficiary Account No.</TableHead>
                                            <TableHead>Customer Unique ID</TableHead>
                                            <TableHead>Beneficiary Email Id</TableHead>
                                            <TableHead>Beneficiary Phone Number</TableHead>
                                            <TableHead>Beneficiary Bank Code</TableHead>
                                            <TableHead>Beneficiary Bank Name</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Title fetch</TableHead>
                                            <TableHead>Reason of Failure</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {currentData.map((detail) => (
                                            <TableRow key={detail.customerUniqueId}>
                                                <TableCell className="sticky left-0 bg-card z-10">
                                                    <Checkbox
                                                        checked={selectedRows.includes(detail.customerUniqueId)}
                                                        onCheckedChange={(checked) => handleRowSelect(detail.customerUniqueId, checked)}
                                                    />
                                                </TableCell>
                                                <TableCell>{detail.fileReferenceNumber}</TableCell>
                                                <TableCell>{detail.beneficiaryName}</TableCell>
                                                <TableCell>{detail.accountTitle}</TableCell>
                                                <TableCell>{detail.localAmount}</TableCell>
                                                <TableCell>{detail.beneficiaryAccountNo}</TableCell>
                                                <TableCell>{detail.customerUniqueId}</TableCell>
                                                <TableCell>{detail.beneficiaryEmail}</TableCell>
                                                <TableCell>{detail.beneficiaryPhone}</TableCell>
                                                <TableCell>{detail.beneficiaryBankCode}</TableCell>
                                                <TableCell>{detail.beneficiaryBankName}</TableCell>
                                                <TableCell>{detail.status}</TableCell>
                                                <TableCell>{detail.titleFetch}</TableCell>
                                                <TableCell>{detail.reasonOfFailure}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                            <div className="flex items-center justify-between p-4 border-t">
                                <Button variant="ghost" size="icon" onClick={handlePreviousPage} disabled={currentPage === 1}>
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-muted-foreground">Rows per page</span>
                                    <Select value={rowsPerPage} onValueChange={handleRowsPerPageChange}>
                                        <SelectTrigger className="w-28">
                                            <SelectValue placeholder="100" />
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

        </div>
    )
}
