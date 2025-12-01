
'use client';

import { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Paperclip } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UploadStatusDialog } from '@/components/bulk-import/upload-status-dialog';

type Account = {
    ACCT_NO: string;
    ACCT_TITLE: string;
};

const FileInput = ({ id, label, onFileSelect, acceptedFormats, fileKey }: { id: string, label: string, onFileSelect: (key: string, file: File | null) => void, acceptedFormats: string, fileKey: string }) => {
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setFileName(file ? file.name : '');
        onFileSelect(fileKey, file);
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
    const [files, setFiles] = useState<{ bulkFile: File | null, chequeInvoiceFile: File | null }>({ bulkFile: null, chequeInvoiceFile: null });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState<{ status: 'success' | 'error'; title: string; message: string; refNumber?: string }>({ status: 'success', title: '', message: '' });
    const { toast } = useToast();

    useEffect(() => {
        const accountsString = sessionStorage.getItem('accounts');
        if (accountsString) {
            setAccounts(JSON.parse(accountsString));
        }
    }, []);

    const handleFileSelect = (key: string, file: File | null) => {
        setFiles(prev => ({...prev, [key]: file}));
    }
    
    const handleAccountChange = (acctNo: string) => {
        const account = accounts.find(a => a.ACCT_NO === acctNo);
        setSelectedAccount(account || null);
    };

    const handleCancel = () => {
        setSelectedAccount(null);
        setFiles({ bulkFile: null, chequeInvoiceFile: null });
        // This is a bit of a hack to reset the uncontrolled file inputs
        window.location.reload();
    };
    
    const handleUpload = () => {
        if (!selectedAccount) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please select an account.' });
            return;
        }
        if (!files.bulkFile && !files.chequeInvoiceFile) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please upload at least one file.' });
            return;
        }

        const checkFile = (file: File | null) => {
            if (file) {
                const extension = file.name.split('.').pop()?.toLowerCase();
                if (extension !== 'csv' && extension !== 'txt') {
                    return false;
                }
            }
            return true;
        }

        if (!checkFile(files.bulkFile) || !checkFile(files.chequeInvoiceFile)) {
            setDialogContent({
                status: 'error',
                title: 'Upload Failed',
                message: 'File format is not supported. Please upload a .csv or .txt file.'
            });
            setDialogOpen(true);
            return;
        }

        // --- Mock successful upload ---
        const refNumber = `008${Date.now().toString().slice(-12)}`;
        setDialogContent({
            status: 'success',
            title: 'Single Bulk Upload',
            message: 'Bulk file has been uploaded and is being validated by the system. Please refer to the Bulk History Tab in case of any errors.',
            refNumber
        });
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        if (dialogContent.status === 'success') {
            handleCancel(); // Reset form on success
        }
    }

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
                            
                            <FileInput id="bulk-file" label="Bulk File Upload" onFileSelect={handleFileSelect} acceptedFormats=".csv,.txt" fileKey="bulkFile" />

                            <FileInput id="cheque-invoice-file" label="Upload Cheque Invoice File" onFileSelect={handleFileSelect} acceptedFormats=".csv,.txt" fileKey="chequeInvoiceFile" />

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
            <UploadStatusDialog 
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                status={dialogContent.status}
                title={dialogContent.title}
                message={dialogContent.message}
                transactionRef={dialogContent.refNumber}
                onDone={closeDialog}
            />
        </DashboardLayout>
    );
}

