'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Label } from '../ui/label';
import { downloadStatement } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

interface DateRangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'view' | 'download';
  fileType?: string;
  accountNumber?: string;
}

export function DateRangeDialog({ open, onOpenChange, mode, fileType, accountNumber }: DateRangeDialogProps) {
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleAction = async () => {
    if (mode === 'download') {
        if (!fileType || !fromDate || !toDate || !accountNumber) {
            toast({
                variant: 'destructive',
                title: 'Missing information',
                description: 'Please select a file type, date range, and account.',
            });
            return;
        }

        setIsDownloading(true);
        try {
            const response = await downloadStatement({
                fileType,
                fromDate: format(fromDate, 'yyyy-MM-dd'),
                toDate: format(toDate, 'yyyy-MM-dd'),
                accountNumber,
            });

            if (response.success && response.base64 && response.mimeType) {
                const byteCharacters = atob(response.base64);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: response.mimeType });
                
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `statement.${fileType}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                toast({ title: 'Download Started', description: `Your statement is downloading as a ${fileType.toUpperCase()} file.` });
                onOpenChange(false);
            } else {
                 toast({ variant: 'destructive', title: 'Download Failed', description: response.message });
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'An unexpected error occurred during download.' });
        } finally {
            setIsDownloading(false);
        }

    } else {
        // Logic to handle viewing transactions for the selected date range
        console.log('Mode:', mode, 'From:', fromDate, 'To:', toDate);
        onOpenChange(false);
    }
  };

  const title = mode === 'download' ? "Download Transaction" : "View Transactions";
  const buttonText = mode === 'download' ? (isDownloading ? 'Downloading...' : 'Download') : "View";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">
            Please select the date to initiate.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="from-date">From</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="from-date"
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !fromDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fromDate ? format(fromDate, 'dd/MM/yyyy') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  captionLayout="dropdown-buttons"
                  fromYear={1960}
                  toYear={new Date().getFullYear()}
                  mode="single"
                  selected={fromDate}
                  onSelect={setFromDate}
                  disabled={(date) => date > new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="to-date">To</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="to-date"
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !toDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {toDate ? format(toDate, 'dd/MM/yyyy') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  captionLayout="dropdown-buttons"
                  fromYear={1960}
                  toYear={new Date().getFullYear()}
                  mode="single"
                  selected={toDate}
                  onSelect={setToDate}
                  disabled={(date) => date > new Date() || (fromDate && date < fromDate)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAction} disabled={!fromDate || !toDate || isDownloading}>{buttonText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    