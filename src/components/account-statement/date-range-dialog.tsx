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

interface DateRangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DateRangeDialog({ open, onOpenChange }: DateRangeDialogProps) {
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();

  const handleView = () => {
    // Logic to handle viewing/downloading transactions for the selected date range
    console.log('From:', fromDate, 'To:', toDate);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">View Transactions</DialogTitle>
          <DialogDescription className="text-center">
            Please select the date to initiate view.
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
          <Button onClick={handleView}>View</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
