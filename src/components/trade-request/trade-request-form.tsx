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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Paperclip } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

export function TradeRequestForm() {
  const [productType, setProductType] = useState('');
  const [currency, setCurrency] = useState('');
  const [amount, setAmount] = useState('');
  const [requestType, setRequestType] = useState('fresh');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
        title: "Request Submitted",
        description: "Your trade request has been submitted successfully."
    })
    // Reset form
    setProductType('');
    setCurrency('');
    setAmount('');
    setRequestType('fresh');
    setFileName('');
    if(fileInputRef.current) fileInputRef.current.value = '';
  };
  
  const handleCancel = () => {
    setProductType('');
    setCurrency('');
    setAmount('');
    setRequestType('fresh');
    setFileName('');
     if(fileInputRef.current) fileInputRef.current.value = '';
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
                    <Label>Request Type</Label>
                    <RadioGroup
                        value={requestType}
                        onValueChange={setRequestType}
                        className="flex items-center gap-6 mt-2"
                    >
                        <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fresh" id="fresh" />
                        <Label htmlFor="fresh">Fresh</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cancellation" id="cancellation" />
                        <Label htmlFor="cancellation">Cancellation</Label>
                        </div>
                    </RadioGroup>
                </div>
                
                <div>
                  <Label htmlFor="attachment">Attachment</Label>
                  <div className="relative mt-1">
                    <Input
                      id="attachment-display"
                      readOnly
                      placeholder="Click to attach file"
                      value={fileName}
                      className="cursor-pointer"
                      onClick={handleAttachmentClick}
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileChange}
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
                </div>


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
