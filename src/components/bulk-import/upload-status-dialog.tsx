
'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, AlertTriangle, Copy } from 'lucide-react';

interface UploadStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: 'success' | 'error';
  title: string;
  message: string;
  transactionRef?: string;
  onDone: () => void;
}

export function UploadStatusDialog({
  open,
  onOpenChange,
  status,
  title,
  message,
  transactionRef,
  onDone,
}: UploadStatusDialogProps) {
    const { toast } = useToast();
    
    const handleCopy = () => {
        if (!transactionRef) return;
        navigator.clipboard.writeText(transactionRef).then(() => {
            toast({ title: 'Copied!', description: 'Transaction reference has been copied to your clipboard.' });
        }).catch(err => {
            toast({ variant: 'destructive', title: 'Copy Failed', description: 'Could not copy reference number.' });
        })
    }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader className="items-center text-center space-y-4">
          {status === 'success' ? (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-500">
                <CheckCircle2 className="h-8 w-8" strokeWidth={2} />
            </div>
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-500">
                <AlertTriangle className="h-8 w-8" strokeWidth={2} />
            </div>
          )}
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-muted-foreground text-sm">
            {message}
            {status === 'success' && transactionRef && (
                <>
                    {' '}Your Transaction Reference is: <strong>{transactionRef}</strong>.
                </>
            )}
          </p>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 flex-col gap-2">
            {status === 'success' && transactionRef && (
                <Button onClick={handleCopy} className="w-full">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                </Button>
            )}
          <Button variant="outline" onClick={onDone} className="w-full">
            Done
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

