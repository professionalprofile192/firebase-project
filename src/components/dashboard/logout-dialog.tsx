
'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, X } from 'lucide-react';

interface LogoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

export function LogoutDialog({
  open,
  onOpenChange,
  onConfirm,
}: LogoutDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader className="items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-500">
            <AlertCircle className="h-8 w-8" strokeWidth={1.5} />
          </div>
          <AlertDialogTitle className="text-lg font-semibold">
            Are you sure you want to sign out?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 flex-col gap-2">
          <AlertDialogAction onClick={onConfirm} className="w-full">
            Yes
          </AlertDialogAction>
          <AlertDialogCancel asChild>
            <Button variant="outline" className="w-full">No</Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
        <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 h-6 w-6 rounded-full"
            onClick={() => onOpenChange(false)}
        >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
        </Button>
      </AlertDialogContent>
    </AlertDialog>
  );
}
