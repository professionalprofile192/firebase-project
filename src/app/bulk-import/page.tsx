
'use client';

import { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Paperclip } from 'lucide-react';

type Account = {
    ACCT_NO: string;
    ACCT_TITLE: string;
};

const FileInput = ({ id, label, onFileSelect, acceptedFormats }: { id: string, label: string, onFileSelect: (file: File | null) => void, acceptedFormats: string }) => {
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setFileName(file ? file.name : '');
        onFileSelect(file);
    };
    
    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };


    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <div className="relative">
                <Input
                    id={id}
                    type="text"
                    readOnly
                    placeholder="Upload File"
                    value={fileName}
                    className="bg-gray-100 cursor-pointer"
                    onClick={handleButtonClick}
                />
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    accept={acceptedFormats}
                />
                <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={handleButtonClick}>
                    <Paperclip className="h-5 w-5 text-primary" />
                </Button>
            </div>
        </div>
    );
};


export default function BulkImportPage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [bulkFile, setBulkFile] = useState<File | null>(null);
    const [chequeInvoiceFile, setChequeInvoiceFile] = useState<File | null>(null);

    useEffect(() => {
        const accountsString = sessionStorage.getItem('accounts');
        if (accountsString) {
            setAccounts(JSON.parse(accountsString));
        }
    }, []);
    
    const handleAccountChange = (acctNo: string) => {
        const account = accounts.find(a => a.ACCT_NO === acctNo);
        setSelectedAccount(account || null);
    };

    const handleCancel = () => {
        setSelectedAccount(null);
        setBulkFile(null);
        setChequeInvoiceFile(null);
    };
    
    const handleUpload = () => {
        // Handle file upload logic here
        console.log('Uploading files:', { bulkFile, chequeInvoiceFile, selectedAccount });
    };

    return (
        <DashboardLayout>
            <main className="flex-1 p-4 sm:px-6 sm:py-4 flex flex-col gap-6">
                <h1 className="text-2xl font-semibold">Bulk Import</h1>

                <Card className="w-full max-w-4xl mx-auto shadow-md">
                    <CardContent className="p-6">
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="account-number">Account Number</Label>
                                <Select onValueChange={handleAccountChange} value={selectedAccount?.ACCT_NO || ''}>
                                    <SelectTrigger id="account-number">
                                        <SelectValue placeholder="Select Account" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {accounts.map(account => (
                                            <SelectItem key={account.ACCT_NO} value={account.ACCT_NO}>
                                                {account.ACCT_NO}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="account-name">Account Name</Label>
                                <Input 
                                    id="account-name"
                                    placeholder="Enter Name"
                                    value={selectedAccount?.ACCT_TITLE || ''}
                                    disabled
                                    className="bg-gray-100"
                                />
                            </div>
                            
                            <FileInput id="bulk-file" label="Bulk File Upload" onFileSelect={setBulkFile} acceptedFormats=".csv,.txt" />

                            <FileInput id="cheque-invoice-file" label="Upload Cheque Invoice File" onFileSelect={setChequeInvoiceFile} acceptedFormats=".csv,.txt" />

                            <div className="md:col-span-2">
                                <p className="text-sm text-muted-foreground">
                                    Note: The file size must be less than 5 MB and the supported formats are .csv and .txt.
                                </p>
                            </div>

                            <div className="md:col-span-2 flex items-center gap-4 mt-4">
                                <Button variant="outline" type="button" onClick={handleCancel}>Cancel</Button>
                                <Button type="button" onClick={handleUpload}>Upload</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </DashboardLayout>
    );
}

