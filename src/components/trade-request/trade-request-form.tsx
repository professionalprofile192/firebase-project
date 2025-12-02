'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Paperclip, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SuccessDialog } from './success-dialog';
import { getBulkFileData, createBulkFileData } from '@/app/actions';

const productTypes = [
  'Contract Reg - DP',
  'Contract Reg - DA',
  'Contract Reg Ameen - DP',
  'Contract Reg Ameen - DA',
  'Letter of Credit - Sight',
  'Letter of Credit - Usance',
  'Letter of Credit Ameen - Sight',
  'Letter of Credit Ameen - Usance',
  'Import Payments',
  'FOC',
  'Acceptance',
  'Lc Amendments',
  'Advance Payments',
  'Open account',
  'contract amendments',
  'shipping guarantee',
  'FI amendment/correction',
];

const requestTypes = [
    'LC Application',
    'Proforma Invoice / Order / Intent',
    'Insurance Cover Note / Policy',
    'Covering Letter',
    "NOC's / Permits"
];

type UploadedFile = {
    id: number;
    file: File;
    requestType: string;
    productType: string;
    fileReferenceNumber: string;
    currency: string;
    amount: string;
}

export function TradeRequestForm() {
  const [productType, setProductType] = useState('');
  const [currency, setCurrency] = useState('');
  const [amount, setAmount] = useState('');
  const [requestType, setRequestType] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [editFileId, setEditFileId] = useState<number | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogRefId, setDialogRefId] = useState<string | undefined>();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [dialogDoneHandler, setDialogDoneHandler] = useState(() => () => {});


  useEffect(() => {
    const profile = sessionStorage.getItem('userProfile');
    if (profile) {
      setUserProfile(JSON.parse(profile));
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
        if (editFileId !== null) {
            // Find the original file details
            const originalFile = uploadedFiles.find(f => f.id === editFileId);
            if (originalFile) {
                // Prepare new uploaded file object before calling upload service
                 const newFileToUpload: Omit<UploadedFile, 'id'|'fileReferenceNumber'> & { file: File } = {
                    file: selectedFile,
                    requestType: originalFile.requestType,
                    productType: originalFile.productType,
                    currency: originalFile.currency,
                    amount: originalFile.amount,
                };
                handleUpload(newFileToUpload, editFileId);
            }
            setEditFileId(null);
        } else {
            setFile(selectedFile);
        }
    }
    // Reset file input value to allow re-uploading the same file
    if(event.target) {
        event.target.value = '';
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async (fileToUpload?: {file: File, requestType: string, productType: string, currency: string, amount: string}, existingId?: number | null) => {
    const currentFile = fileToUpload?.file || file;
    const currentRequestType = fileToUpload?.requestType || requestType;
    const currentProductType = fileToUpload?.productType || productType;
    const currentCurrency = fileToUpload?.currency || currency;
    const currentAmount = fileToUpload?.amount || amount;

    if (!currentFile || !currentRequestType || !currentProductType || !currentCurrency || !currentAmount) {
        toast({
            variant: 'destructive',
            title: "Missing Information",
            description: "Please fill all fields and select a file to upload."
        });
        return;
    }

    if (!userProfile) {
        toast({ variant: 'destructive', title: "User not found", description: "Could not find user profile. Please log in again." });
        return;
    }

    setIsUploading(true);

    try {
        const file_refid = `00${Date.now().toString().slice(-14)}`;
        const response = await getBulkFileData({
            user_id: userProfile.userid,
            file_refid: file_refid,
            file_name: currentFile.name,
            file_type: currentRequestType,
            product_type: currentProductType,
            file_content: currentFile,
        });

        if (response.opstatus === 0 && response.records) {
            const newFile: UploadedFile = {
                id: existingId || Date.now(),
                file: currentFile,
                requestType: currentRequestType,
                productType: currentProductType,
                fileReferenceNumber: response.records[0].file_refid,
                currency: currentCurrency,
                amount: currentAmount,
            };

            const addFileToList = () => {
              if(existingId !== null && existingId !== undefined) {
                   setUploadedFiles(prevFiles => prevFiles.map(f => f.id === existingId ? newFile : f));
              } else {
                  setUploadedFiles(prev => [...prev, newFile]);
              }
            }
            
            setDialogTitle('Single Bulk Upload');
            setDialogMessage('File has been uploaded and is being validated by the system. Please refer to the Dashboard to view it.');
            setDialogRefId(undefined); // No ref ID for single upload dialog
            setShowSuccessDialog(true);
            
            // This is a new closure to be passed to the dialog's onDone
            const onDialogDone = () => {
                addFileToList();
                setShowSuccessDialog(false);
            };
            
            // We set a temporary handler for the dialog
            setDialogDoneHandler(() => onDialogDone);


        } else {
            toast({ variant: 'destructive', title: 'Upload Failed', description: response.message || "Failed to upload file." });
        }

    } catch(error) {
        toast({ variant: 'destructive', title: 'Error', description: 'An unexpected error occurred during upload.' });
    } finally {
        setIsUploading(false);
        setFile(null);
        if(fileInputRef.current) fileInputRef.current.value = '';
    }
  };
  
  const handleCancel = () => {
    setProductType('');
    setCurrency('');
    setAmount('');
    setRequestType('');
    setFile(null);
    setUploadedFiles([]);
    if(fileInputRef.current) fileInputRef.current.value = '';
  }

  const handleEdit = (id: number) => {
    setEditFileId(id);
    handleAttachmentClick();
  }

  const handleDelete = (id: number) => {
    setUploadedFiles(prevFiles => prevFiles.filter(f => f.id !== id));
    toast({ title: 'File Removed', description: 'The selected file has been removed.' });
  }

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if(uploadedFiles.length === 0) {
          toast({ variant: 'destructive', title: "No Files Uploaded", description: "Please upload at least one file before submitting." });
          return;
      }
      if (!userProfile) {
        toast({ variant: 'destructive', title: "User not found", description: "Could not find user profile. Please log in again." });
        return;
      }

      setIsSubmitting(true);
      try {
        const promises = uploadedFiles.map(file => createBulkFileData({
            user_id: userProfile.userid,
            file_refid: file.fileReferenceNumber
        }));

        await Promise.all(promises);

        // Store submitted files in session storage
        const existingHistory = JSON.parse(sessionStorage.getItem('tradeRequestHistory') || '[]');
        const newHistoryItems = uploadedFiles.map(f => ({
            file_refid: f.fileReferenceNumber,
            product_type: f.productType,
            request_type: f.requestType,
            file_name: f.file.name,
            currency: f.currency,
            status: 'Open', // Default status for new submissions
        }));
        sessionStorage.setItem('tradeRequestHistory', JSON.stringify([...newHistoryItems, ...existingHistory]));
        
        setDialogTitle('Success');
        setDialogMessage(`Request has been sent successfully with file reference id:`);
        setDialogRefId(uploadedFiles[0].fileReferenceNumber);
        
        const onDialogDone = () => {
          setShowSuccessDialog(false);
          handleCancel();
        };
        setDialogDoneHandler(() => onDialogDone);

        setShowSuccessDialog(true);
      
      } catch (error) {
        toast({ variant: 'destructive', title: 'Submission Failed', description: 'An error occurred while submitting your request.' });
      } finally {
        setIsSubmitting(false);
      }
  }

  const getFileName = () => {
      if (editFileId !== null) return "Select a new file...";
      return file?.name || "";
  }

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto shadow-md">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="product-type">Product Type</Label>
                <Select value={productType} onValueChange={setProductType}>
                  <SelectTrigger id="product-type">
                    <SelectValue placeholder="Select Product Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {productTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {productType && (
                <div className="space-y-6 pt-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                          <Label htmlFor="ccy">CCY</Label>
                          <Input
                          id="ccy"
                          placeholder="e.g., USD, EUR"
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          />
                      </div>
                      <div>
                          <Label htmlFor="amount">Amount</Label>
                          <Input
                          id="amount"
                          type="number"
                          placeholder="Enter Amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          />
                      </div>
                  </div>

                  <div>
                    <Label htmlFor="request-type">Request Type</Label>
                    <Select value={requestType} onValueChange={setRequestType}>
                      <SelectTrigger id="request-type">
                        <SelectValue placeholder="Select Request Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {requestTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="attachment">File Upload</Label>
                    <div className="relative mt-1">
                      <Input
                        id="attachment-display"
                        readOnly
                        placeholder="Click to attach file"
                        value={getFileName()}
                        className="cursor-pointer"
                        onClick={handleAttachmentClick}
                      />
                      <input
                        key={editFileId}
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".pdf,.png,.jpeg,.jpg,.doc,.docx,.xls,.xlsx,.txt"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={handleAttachmentClick}
                      >
                        <Paperclip className="h-5 w-5 text-muted-foreground" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                          Note: The file size must be less than 5 MB and the supported formats are .pdf, .png, .jpeg, .doc, .docx, .xls, .xlsx and .txt.
                      </p>
                  </div>

                  <div className="flex justify-start">
                      <Button type="button" onClick={() => handleUpload()} disabled={isUploading}>
                        {isUploading ? 'Uploading...' : 'Upload'}
                      </Button>
                  </div>

                  {uploadedFiles.length > 0 && (
                      <div className="pt-4 border-t">
                          <h3 className="text-lg font-semibold mb-2">File Details</h3>
                          <Table>
                              <TableHeader>
                                  <TableRow>
                                      <TableHead>File Name</TableHead>
                                      <TableHead>Request Type</TableHead>
                                      <TableHead>Product Type</TableHead>
                                      <TableHead className="text-right">Actions</TableHead>
                                  </TableRow>
                              </TableHeader>
                              <TableBody>
                                  {uploadedFiles.map(uploaded => (
                                      <TableRow key={uploaded.id}>
                                          <TableCell className="font-medium">{uploaded.file.name}</TableCell>
                                          <TableCell>{uploaded.requestType}</TableCell>
                                          <TableCell>{uploaded.productType}</TableCell>
                                          <TableCell className="text-right">
                                              <Button type="button" variant="outline" size="sm" className="mr-2" onClick={() => handleEdit(uploaded.id)}>
                                                  <Edit className="h-4 w-4 mr-1" /> Edit
                                              </Button>
                                              <Button type="button" variant="destructive" size="sm" onClick={() => handleDelete(uploaded.id)}>
                                                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                                              </Button>
                                          </TableCell>
                                      </TableRow>
                                  ))}
                              </TableBody>
                          </Table>
                      </div>
                  )}


                  <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting || uploadedFiles.length === 0}>
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
      <SuccessDialog 
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        onDone={dialogDoneHandler}
        title={dialogTitle}
        message={dialogMessage}
        referenceId={dialogRefId}
      />
    </>
  );
}
