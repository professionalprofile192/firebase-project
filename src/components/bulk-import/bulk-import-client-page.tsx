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

type Account = {
    ACCT_NO: string;
    ACCT_TITLE: string;
    AVAIL_BAL: string;
    DEPOSIT_TYPE: string;
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
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [referenceNumber, setReferenceNumber] = useState<string | null>(null);
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
    const hitBulkFiles = async (profile: any, token: string, kuid: string) => {
        try {
          const res = await fetch("/api/get-bulk-files", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: profile.userid, // ✅ correct key
              token,
              kuid,
            }),
          });

          const result = await res.json();

          console.log("GET BULK FILES RESPONSE:", result);
      
          const list = result?.NDC_BulkPayments || [];
      
          //  YAHAN TABLE DATA SET HO RHA HAI
          setBulkFiles(list);
        
          console.log("Bulk Files API HIT, status:", res.status);
        } catch (err) {
            console.error("Error hitting API route:", err);
            
        } 
        finally {
            setLoading(false);
          }
      };
      const hitRemitterFileType = async (
        accountNumber: string,
        token:string
      ) => {
        try {
          const res = await fetch("/api/get-remitter-file-type", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              accountNumber,
              token
            })
          });
      
          const result = await res.json();
          const bulkPayments = result?.NDC_BulkPayments || [];
            console.log("Bulk Payments:", bulkPayments);
          console.log("Remitter File Type response:", result);
        } catch (err) {
          console.error("Remitter File Type error:", err);
        }
        finally {
            setLoading(false);
          }
      };

      const hasRun = useRef(false);
  
      // Example useEffect
      useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;
        const init = async () => {
           
          const profileStr = sessionStorage.getItem("userProfile");
          const claimsToken = sessionStorage.getItem("claimsToken");
          const accountsStr = sessionStorage.getItem("accounts");
      
          if (!profileStr || !claimsToken) {
            router.push("/login");
            return;
          }
      
          const profile = JSON.parse(profileStr);
          setUserProfile(profile);
      
          const token = claimsToken;
          const kuid = profile?.user_attributes?.UserName;
      
          if (!profile?.userid || !token || !kuid) {
            setLoading(false);
            return;
          }
         
          // Hit Bulk Files API first
          await hitBulkFiles(profile, token, kuid);
      
          // Then hit Remitter File Type API using first account
          if (accountsStr) {
            const accounts = JSON.parse(accountsStr);
            setAccounts(accounts);
      
            const accountNumber = accounts[0]?.ACCT_NO; // first account ka ACCT_NO
            if (accountNumber) {
              await hitRemitterFileType(accountNumber, token); 
            }
          }
      
          setLoading(false);
        };
      
        init();
      }, []);
      

        const handleAccountChange = (acctNo: string) => {
        const account = accounts.find(a => a.ACCT_NO === acctNo) || null;
        setSelectedAccount(account);
        };

    const handleFileSelect = (key: string, file: File | null) => {
        setFiles((prev) => ({ ...prev, [key]: file }));
    };

    const handleCancel = () => {
        router.push("/dashboard");
    };

    const handleUpload = async () => {
        if (!files.bulkFile) {
            toast({
                title: "File required",
                description: "Please select a bulk file to upload",
                variant: "destructive",
            });
            return;
        }
    
        if (!selectedAccount) {
            toast({
                title: "Select account",
                description: "Please select an account to upload the file",
                variant: "destructive",
            });
            return;
        }
    
        setIsUploading(true);
    
        try {
            const file = files.bulkFile;
    
            const arrayBuffer = await file.arrayBuffer(); // modern approach
            const fileData = btoa(
                new Uint8Array(arrayBuffer)
                    .reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
    
            const profileStr = sessionStorage.getItem("userProfile");
            const token = sessionStorage.getItem("claimsToken");
    
            if (!profileStr || !token) {
                toast({
                    title: "Session expired",
                    description: "Please login again",
                    variant: "destructive",
                });
                setIsUploading(false);
                return;
            }
    
            const profile = JSON.parse(profileStr);
    
            const payload = {
                fileName: file.name,
                accountName: selectedAccount.ACCT_TITLE,
                accountNo: selectedAccount.ACCT_NO,
                fileData,
                user: profile.userid,
                token
            };
    
            const res = await fetch("/api/upload-file", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              });
              
              const apiResponse = await res.json();
              console.log("UPLOAD RAW RESPONSE:", apiResponse);
              
              // 🔑 backend ne data STRING me bheja hai
              const parsedData =
                typeof apiResponse?.data === "string"
                  ? JSON.parse(apiResponse.data)
                  : apiResponse.data;
              
              console.log("UPLOAD PARSED DATA:", parsedData);
              
              const dataObj =
                            typeof parsedData.data === "string"
                                ? JSON.parse(parsedData.data)
                                : parsedData.data;
             

              if (dataObj?.errMsg) {
                toast({
                    variant: "destructive",
                    title: "Upload Failed",
                    description: dataObj.errMsg, // 
                  });
              
                console.log("FILE ID:", parsedData.fileId);
              
                // reset form etc
                setFiles({ bulkFile: null, chequeInvoiceFile: null });
                setSelectedAccount(null);
                setFormResetKey((prev) => prev + 1);
              }
              // CASE 2: errMsg present → popup with message
              else {
                
                setReferenceNumber(dataObj.fileId);
setShowSuccessModal(true);

                  const profileStr = sessionStorage.getItem("userProfile");
                    const token = sessionStorage.getItem("claimsToken");

                    if (profileStr && token) {
                        const profile = JSON.parse(profileStr);
                        const kuid = profile?.user_attributes?.UserName;

                        if (profile?.userid && kuid) {
                        await hitBulkFiles(profile, token, kuid);
                        }
                    }

                    // reset form
                    setFiles({ bulkFile: null, chequeInvoiceFile: null });
                    setSelectedAccount(null);
                    setFormResetKey((prev) => prev + 1);
}
                
            } catch (error) {
                console.error("UPLOAD ERROR:", error);
                toast({
                    variant: "destructive",
                    title: "Upload Error",
                    description: "Something went wrong while uploading file",
                });
            } finally {
                setIsUploading(false);
            }
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
<>
        <DashboardLayout>
            <main className="flex-1 p-4 sm:px-6 sm:py-4 flex flex-col gap-6">
                <h1 className="text-2xl font-semibold">Bulk Import</h1>

                {tab === 'history' ? (
                    historyView
                ) : (
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col">
                        <TabsList className="grid w-full max-w-md grid-cols-1">
                            <TabsTrigger value="upload">Single Bulk Upload</TabsTrigger>
                        </TabsList>
                        <TabsContent value="upload" className="w-full">
                            <Card className="w-full max-w-4xl shadow-md">
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
        {showSuccessModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-xl w-[420px] p-6 text-center animate-fadeIn">
      
      {/* Header decoration instead of icon */}
      <div className="flex justify-center mb-4">
        <div className="h-2 w-16 bg-blue-500 rounded-full animate-pulse"></div>
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold mb-2 text-gray-800">
        Single Bulk Upload
      </h2>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
        Bulk file has been uploaded and is being validated by the system.
        Please refer to the Bulk History tab in case of any errors.
      </p>

      {/* Reference */}
      <p className="text-sm font-medium mb-2 text-gray-700">
        Your Transaction Reference is:
      </p>
      <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm font-mono mb-5 text-gray-800">
        {referenceNumber}
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-3">
        <button
          className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={() => {
            navigator.clipboard.writeText(referenceNumber || "");
            toast({ title: "Copied to clipboard" });
          }}
        >
          Copy
        </button>

        <button
          className="px-5 py-2 rounded-lg bg-gray-200 text-sm font-medium transition duration-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
          onClick={async () => {
            setShowSuccessModal(false);

            const profileStr = sessionStorage.getItem("userProfile");
            const token = sessionStorage.getItem("claimsToken");

            if (profileStr && token) {
              const profile = JSON.parse(profileStr);
              const kuid = profile?.user_attributes?.UserName;

              if (profile?.userid && kuid) {
                await hitBulkFiles(profile, token, kuid);
              }
            }

            setActiveTab("history");
            router.push("/bulk-import?tab=history");
            setFiles({ bulkFile: null, chequeInvoiceFile: null });
            setSelectedAccount(null);
            setFormResetKey((prev) => prev + 1);
          }}
        >
          Done
        </button>
      </div>
    </div>
  </div>
)}

       </>
    );
}
