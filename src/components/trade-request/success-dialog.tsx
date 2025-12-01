'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, X } from 'lucide-react';

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactionRef: string;
  onDone: () => void;
}

export function SuccessDialog({
  open,
  onOpenChange,
  transactionRef,
  onDone,
}: SuccessDialogProps) {
    
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader className="items-center text-center space-y-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-500">
                <CheckCircle2 className="h-8 w-8" strokeWidth={2} />
            </div>
          <AlertDialogTitle className="text-xl font-bold">Success</AlertDialogTitle>
          <p className="text-muted-foreground text-sm">
            Request has been sent successfully with file reference id: <strong>{transactionRef}</strong>.
          </p>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <Button onClick={onDone} className="w-full">
            Done
          </Button>
        </AlertDialogFooter>
        <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-7 w-7 rounded-full bg-gray-200/50 hover:bg-gray-200"
            onClick={() => onOpenChange(false)}
        >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
        </Button>
      </AlertDialogContent>
    </AlertDialog>
  );
}
