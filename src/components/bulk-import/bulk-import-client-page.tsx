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
import { format } from 'date-fns';

export type BulkFile = {
    fileName: string;
    uploadDate: string;
    fileReferenceNumber: string;
    status: string;
    comment: string;
};

const FileInput = ({
    id,
    label,
    onFileSelect,
    acceptedFormats,
    fileKey,
    formResetKey
}: {
    id: string;
    label: string;
    onFileSelect: (key: string, file: File | null) => void;
    acceptedFormats: string;
    fileKey: string;
    formResetKey: number;
}) => {
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (formResetKey > 0) {
            setFileName('');
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }, [formResetKey]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setFileName(file ? file.name : '');
        onFileSelect(fileKey, file);
    };

    const handleButtonClick = () => fileInputRef.current?.click();

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
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={handleButtonClick}
                >
                    <Paperclip className="h-5 w-5 text-primary" />
                </Button>
            </div>
        </div>
    );
};

export function BulkImportClientPage() {
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab');

    const [bulkFiles, setBulkFiles] = useState<BulkFile[]>([]);
    const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
    const [files, setFiles] = useState<{ bulkFile: File | null; chequeInvoiceFile: File | null }>({
        bulkFile: null,
        chequeInvoiceFile: null
    });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState<{
        status: 'success' | 'error';
        title: string;
        message: string;
        refNumber?: string;
    }>({ status: 'success', title: '', message: '' });
    const [isUploading, setIsUploading] = useState(false);
    const [formResetKey, setFormResetKey] = useState(0);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [dateFilter, setDateFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [commentFilter, setCommentFilter] = useState('');
    const [activeTab, setActiveTab] = useState(tab || 'upload');
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    // AUTOMATIC API CALL ON PAGE LOAD
    useEffect(() => {
        const profileString = sessionStorage.getItem('userProfile');
        if (!profileString) {
            router.push('/');
            return;
        }

        const profile = JSON.parse(profileString);
        setUserProfile(profile);

        async function fetchBulkFiles() {
            try {
                const res = await fetch('/api/get-bulk-files', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        token: 'TOKEN_FROM_LOGIN',
                        kuid: 'KUID_FROM_LOGIN',
                        userId: profile.userid
                    })
                });

                const data = await res.json();
                if (data?.opstatus === 0 && data?.NDC_BulkPayments) {
                    setBulkFiles(data.NDC_BulkPayments);
                } else {
                    console.error('Failed to fetch bulk files', data);
                }
            } catch (err) {
                console.error('Error fetching bulk files:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchBulkFiles();
    }, [router]);

    const handleFileSelect = (key: string, file: File | null) => {
        setFiles((prev) => ({ ...prev, [key]: file }));
    };

    const handleCancel = () => {
        setSelectedAccount(null);
        setFiles({ bulkFile: null, chequeInvoiceFile: null });
        setFormResetKey((prevKey) => prevKey + 1);
    };

    const closeDialog = () => setDialogOpen(false);

    const uniqueDates = [...new Set(bulkFiles.map((file) => format(new Date(file.uploadDate), 'dd/MM/yyyy')))];

    const filteredBulkFiles = bulkFiles.filter((file) => {
        const formattedDate = format(new Date(file.uploadDate), 'dd/MM/yyyy');
        const statusLabel = file.status === '1' ? 'Success' : file.status === '0' ? 'Failed' : 'In Progress';
        const isSuccessComment = file.comment.toLowerCase().includes('success');
        const isFailedComment = !isSuccessComment;

        let commentMatch = true;
        if (commentFilter.toLowerCase() === 'success') commentMatch = isSuccessComment;
        else if (commentFilter.toLowerCase() === 'failed') commentMatch = isFailedComment;

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
                                {uniqueDates.map((date) => (
                                    <SelectItem key={date} value={date}>
                                        {date}
                                    </SelectItem>
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

    if (loading) {
        return (
            <DashboardLayout>
                <main className="flex-1 p-4 sm:px-6 sm:py-4">
                    <p>Loading data...</p>
                </main>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <main className="flex-1 p-4 sm:px-6 sm:py-4 flex flex-col gap-6">
                <h1 className="text-2xl font-semibold">Bulk Import</h1>

                {tab === 'history' ? (
                    historyView
                ) : (
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col">
                        <TabsList className="grid w-full max-w-md grid-cols-2">
                            <TabsTrigger value="upload">Single Bulk Upload</TabsTrigger>
                            <TabsTrigger value="history">Bulk Import History</TabsTrigger>
                        </TabsList>
                        <TabsContent value="upload" className="w-full">
                            <Card className="w-full max-w-4xl shadow-md">
                                <CardContent className="p-6">
                                    <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6" onSubmit={(e) => e.preventDefault()}>
                                        <FileInput
                                            id="bulk-file"
                                            label="Bulk File Upload"
                                            onFileSelect={handleFileSelect}
                                            acceptedFormats=".csv,.txt"
                                            fileKey="bulkFile"
                                            formResetKey={formResetKey}
                                        />

                                        <FileInput
                                            id="cheque-invoice-file"
                                            label="Upload Cheque Invoice File"
                                            onFileSelect={handleFileSelect}
                                            acceptedFormats=".csv,.txt"
                                            fileKey="chequeInvoiceFile"
                                            formResetKey={formResetKey}
                                        />

                                        <div className="md:col-span-2">
                                            <p className="text-sm text-muted-foreground">
                                                Note: The file size must be less than 5 MB and the supported formats are .csv and .txt.
                                            </p>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="history" className="w-full">
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
