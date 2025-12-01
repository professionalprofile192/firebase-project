'use client';

import { useState, useRef } from 'react';
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
        if (editFileId !== null) {
            setUploadedFiles(prevFiles => prevFiles.map(f => f.id === editFileId ? {...f, file: selectedFile} : f));
            setEditFileId(null);
            toast({ title: "File Updated", description: `${selectedFile.name} has been updated.` });

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

  const handleUpload = () => {
    if (!file || !requestType || !productType) {
        toast({
            variant: 'destructive',
            title: "Missing Information",
            description: "Please select a product type, request type, and a file to upload."
        });
        return;
    }
    const newFile: UploadedFile = {
        id: Date.now(),
        file,
        requestType,
        productType,
    };
    setUploadedFiles(prev => [...prev, newFile]);
    // Clear the file input after upload
    setFile(null);
    if(fileInputRef.current) fileInputRef.current.value = '';
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

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(uploadedFiles.length === 0) {
          toast({ variant: 'destructive', title: "No Files Uploaded", description: "Please upload at least one file before submitting." });
          return;
      }
      toast({
          title: "Request Submitted",
          description: "Your trade request has been submitted successfully."
      });
      handleCancel();
  }

  const getFileName = () => {
      if (editFileId !== null) return "Select a new file...";
      return file?.name || "";
  }

  return (
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
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.png,.jpeg,.doc,.docx,.xls,.xlsx,.txt"
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
                    <Button type="button" onClick={handleUpload}>Upload</Button>
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
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit">Submit</Button>
                </div>
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
