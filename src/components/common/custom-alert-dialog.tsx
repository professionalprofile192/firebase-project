'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, X } from 'lucide-react';

interface CustomAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm?: () => void;
}

export function CustomAlertDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
}: CustomAlertDialogProps) {

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onOpenChange(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader className="items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-primary">
            <AlertCircle className="h-8 w-8" strokeWidth={2} />
          </div>
          <AlertDialogTitle className="text-xl font-bold">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogAction onClick={handleConfirm} className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300">
            Done
          </AlertDialogAction>
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
