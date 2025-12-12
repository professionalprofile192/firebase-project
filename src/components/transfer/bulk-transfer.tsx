'use client';

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Checkbox } from "../ui/checkbox";

const transferTypes = [
    { title: "Funds Transfer", description: "Own & Internal" },
    { title: "Inter Bank Funds Transfer", description: "Other Banks" },
    { title: "Raast Payment", description: "All Raast Accounts" },
    { title: "Omni Payment", description: "All Omni Accounts" },
];

const bulkProcessingDetails = [
    {
        fileReferenceNumber: '0016249076386172',
        beneficiaryName: 'ali akber',
        accountTitle: 'PGEBSTYCCCESXVGIDQBMKWU',
        localAmount: '120,000.00',
        beneficiaryAccountNo: 'PK42UNIL0109000230017588',
        customerUniqueId: 'UB_amt_10',
    },
    {
        fileReferenceNumber: '0016249076386172',
        beneficiaryName: 'shahzain',
        accountTitle: 'PGEBSTYCCCESXVGIDQBMKWU',
        localAmount: '130,000.00',
        beneficiaryAccountNo: 'PK42UNIL0109000230017588',
        customerUniqueId: 'UB_amt_11',
    },
    {
        fileReferenceNumber: '0016249076386172',
        beneficiaryName: 'Jatoi',
        accountTitle: 'PGEBSTYCCCESXVGIDQBMKWU',
        localAmount: '140,000.00',
        beneficiaryAccountNo: 'PK42UNIL0109000230017588',
        customerUniqueId: 'UB_amt_12',
    }
];

export function BulkTransfer() {
    const [selectedType, setSelectedType] = useState(transferTypes[0].title);

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
                        onClick={() => setSelectedType(type.title)}
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
                            <Select defaultValue="253237095">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="253237095">253237095</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                             <label className="text-sm text-muted-foreground">Account Name</label>
                            <Input disabled value="BUYIRABHPTIJBGGVBLAVMBLQINKV" />
                        </div>
                        <div>
                             <label className="text-sm text-muted-foreground">Bulk File</label>
                             <div className="flex items-center justify-between border rounded-md px-3 py-2 bg-muted/50">
                                <span>17-oct-25-01 0016249076386172</span>
                                <ChevronRight className="h-5 w-5 text-muted-foreground"/>
                             </div>
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
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12"><Checkbox /></TableHead>
                                    <TableHead>File Reference Number</TableHead>
                                    <TableHead>Beneficiary Name</TableHead>
                                    <TableHead>Account Title</TableHead>
                                    <TableHead>Local Amount</TableHead>
                                    <TableHead>Beneficiary Account No.</TableHead>
                                    <TableHead>Customer Unique ID</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bulkProcessingDetails.map((detail, index) => (
                                    <TableRow key={index}>
                                        <TableCell><Checkbox /></TableCell>
                                        <TableCell>{detail.fileReferenceNumber}</TableCell>
                                        <TableCell>{detail.beneficiaryName}</TableCell>
                                        <TableCell>{detail.accountTitle}</TableCell>
                                        <TableCell>{detail.localAmount}</TableCell>
                                        <TableCell>{detail.beneficiaryAccountNo}</TableCell>
                                        <TableCell>{detail.customerUniqueId}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                         <div className="flex items-center justify-between p-4 border-t">
                            <Button variant="ghost" size="icon" disabled>
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-muted-foreground">Rows per page</span>
                                <Select defaultValue="100">
                                    <SelectTrigger className="w-20">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="50">50</SelectItem>
                                        <SelectItem value="100">100</SelectItem>
                                        <SelectItem value="200">200</SelectItem>
                                    </SelectContent>
                                </Select>
                                 <span className="text-sm text-muted-foreground">1 - 100 Transactions</span>
                            </div>
                            <Button variant="ghost" size="icon">
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
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
