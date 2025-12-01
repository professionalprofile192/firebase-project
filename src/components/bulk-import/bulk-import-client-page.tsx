

'use client';

import { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Paperclip, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UploadStatusDialog } from '@/components/bulk-import/upload-status-dialog';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { BulkFileHistoryTable } from './bulk-file-history-table';
import type { BulkFile } from '@/app/bulk-import/page';
import { uploadBulkFile } from '@/app/actions';
import { format } from 'date-fns';

type Account = {
    ACCT_NO: string;
    ACCT_TITLE: string;
};

interface BulkImportClientPageProps {
    initialAccounts: Account[];
    initialBulkFiles: BulkFile[];
}

const FileInput = ({ id, label, onFileSelect, acceptedFormats, fileKey, formResetKey }: { id: string, label: string, onFileSelect: (key: string, file: File | null) => void, acceptedFormats: string, fileKey: string, formResetKey: number }) => {
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (formResetKey > 0) {
            setFileName('');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }, [formResetKey]);

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
                    key={formResetKey}
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    accept={acceptedFormats}
                />
                <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={handleButtonClick}>
                    <Paperclip className="h-5 w-5 text-primary" />
                </Button>
            </div>
        </div>
    );
};


export function BulkImportClientPage({ initialAccounts, initialBulkFiles }: BulkImportClientPageProps) {
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab');
    
    const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
    const [bulkFiles, setBulkFiles] = useState<BulkFile[]>(initialBulkFiles);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [files, setFiles] = useState<{ bulkFile: File | null, chequeInvoiceFile: File | null }>({ bulkFile: null, chequeInvoiceFile: null });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState<{ status: 'success' | 'error'; title: string; message: string; refNumber?: string }>({ status: 'success', title: '', message: '' });
    const [isUploading, setIsUploading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const [formResetKey, setFormResetKey] = useState(0);
    const [userProfile, setUserProfile] = useState<any>(null);

    const [dateFilter, setDateFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [commentFilter, setCommentFilter] = useState('');
    const [activeTab, setActiveTab] = useState(tab || 'upload');

    useEffect(() => {
        const userProfileString = sessionStorage.getItem('userProfile');
        if (userProfileString) {
            setUserProfile(JSON.parse(userProfileString));
        } else if (!initialAccounts.length) {
            router.push('/dashboard');
        }
        setAccounts(initialAccounts);
        setBulkFiles(initialBulkFiles);
    }, [initialAccounts, initialBulkFiles, router]);

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
        setFormResetKey(prevKey => prevKey + 1);
    };
    
    const handleSuccessfulUpload = (file: File, refNumber: string) => {
        const newFileEntry: BulkFile = {
            fileName: file.name,
            uploadDate: new Date().toISOString(),
            fileReferenceNumber: refNumber,
            status: '1', // '1' for success
            comment: 'FILE UPLOADED SUCCESS',
        };
        setBulkFiles(prevFiles => [newFileEntry, ...prevFiles]);
    };
    
    const handleUpload = async () => {
        if (!selectedAccount) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please select an account.' });
            return;
        }
        const fileToUpload = files.bulkFile || files.chequeInvoiceFile;
        if (!fileToUpload) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please upload at least one file.' });
            return;
        }

        setIsUploading(true);

        try {
            const response = await uploadBulkFile(selectedAccount.ACCT_NO, fileToUpload);
            
            if (response.opstatus === 0) {
                const refNumber = `008${Date.now().toString().slice(-12)}`;
                setDialogContent({
                    status: 'success',
                    title: 'Single Bulk Upload',
                    message: 'Bulk file has been uploaded and is being validated by the system. Please refer to the Bulk History Tab in case of any errors.',
                    refNumber
                });
                handleSuccessfulUpload(fileToUpload, refNumber);
            } else {
                setDialogContent({
                    status: 'error',
                    title: 'Upload Failed',
                    message: response.message || 'An unknown error occurred.'
                });
            }
        } catch (error) {
            setDialogContent({
                status: 'error',
                title: 'Upload Failed',
                message: 'An unexpected error occurred during upload.'
            });
        } finally {
            setIsUploading(false);
            setDialogOpen(true);
        }
    };

    const closeDialog = () => {
        setDialogOpen(false);
        if (dialogContent.status === 'success') {
            handleCancel();
        }
    }

    const uniqueDates = [...new Set(bulkFiles.map(file => format(new Date(file.uploadDate), 'dd/MM/yyyy')))];

    const filteredBulkFiles = bulkFiles.filter(file => {
        const formattedDate = format(new Date(file.uploadDate), 'dd/MM/yyyy');
        const statusLabel = file.status === '1' ? 'Success' : file.status === '0' ? 'Failed' : 'In Progress';
        const isSuccessComment = file.comment.toLowerCase().includes('success');
        const isFailedComment = !isSuccessComment;
        
        let commentMatch = true;
        if (commentFilter.toLowerCase() === 'success') {
            commentMatch = isSuccessComment;
        } else if (commentFilter.toLowerCase() === 'failed') {
            commentMatch = isFailedComment;
        }

        return (
            (dateFilter === '' || dateFilter.toLowerCase() === 'all' || formattedDate.includes(dateFilter)) &&
            (statusFilter === '' || statusFilter.toLowerCase() === 'all' || statusLabel.toLowerCase() === statusFilter.toLowerCase()) &&
            (commentFilter === '' || commentFilter.toLowerCase() === 'all' || commentMatch)
        );
    });

    const historyView = (
        <div>
            <Card>
                <CardHeader className="flex flex-row items-center gap-4 p-4 border-b">
                     <Filter className="h-5 w-5 text-muted-foreground" />
                     <h3 className="text-lg font-semibold">Filters</h3>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <Select value={dateFilter} onValueChange={setDateFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by Upload Date..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                {uniqueDates.map(date => (
                                    <SelectItem key={date} value={date}>{date}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by Status..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="Success">Success</SelectItem>
                                <SelectItem value="Failed">Failed</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={commentFilter} onValueChange={setCommentFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by Comment..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="Success">Success</SelectItem>
                                <SelectItem value="Failed">Failed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>
            <BulkFileHistoryTable data={filteredBulkFiles} />
        </div>
    );

    return (
        <DashboardLayout>
            <main className="flex-1 p-4 sm:px-6 sm:py-4 flex flex-col gap-6">
                <h1 className="text-2xl font-semibold">Bulk Import</h1>

                {tab === 'history' ? (
                    historyView
                ) : (
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full max-w-md grid-cols-2">
                            <TabsTrigger value="upload">Single Bulk Upload</TabsTrigger>
                            <TabsTrigger value="history">Bulk Import History</TabsTrigger>
                        </TabsList>
                        <TabsContent value="upload">
                            <Card className="w-full max-w-4xl mx-auto shadow-md">
                                <CardContent className="p-6">
                                    <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6" onSubmit={(e) => e.preventDefault()}>
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
                                        
                                        <FileInput id="bulk-file" label="Bulk File Upload" onFileSelect={handleFileSelect} acceptedFormats=".csv,.txt" fileKey="bulkFile" formResetKey={formResetKey} />

                                        <FileInput id="cheque-invoice-file" label="Upload Cheque Invoice File" onFileSelect={handleFileSelect} acceptedFormats=".csv,.txt" fileKey="chequeInvoiceFile" formResetKey={formResetKey} />

                                        <div className="md:col-span-2">
                                            <p className="text-sm text-muted-foreground">
                                                Note: The file size must be less than 5 MB and the supported formats are .csv and .txt.
                                            </p>
                                        </div>

                                        <div className="md:col-span-2 flex items-center gap-4 mt-4">
                                            <Button type="button" variant="outline" onClick={handleCancel} disabled={isUploading}>Cancel</Button>
                                            <Button type="button" onClick={handleUpload} disabled={isUploading}>
                                                {isUploading ? 'Uploading...' : 'Upload'}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="history">
                           {historyView}
                        </TabsContent>
                    </Tabs>
                )}
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
