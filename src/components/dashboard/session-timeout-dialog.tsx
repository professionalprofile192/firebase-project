
'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface SessionTimeoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExtend: () => void;
  onLogout: () => void;
}

export function SessionTimeoutDialog({
  open,
  onOpenChange,
  onExtend,
  onLogout,
}: SessionTimeoutDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader className="items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-500">
            <Clock className="h-8 w-8" strokeWidth={1.5} />
          </div>
          <AlertDialogTitle className="text-lg font-semibold">
            Session Will Expire Soon
          </AlertDialogTitle>
          <AlertDialogDescription>
            Your session is about to expire due to inactivity.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 flex-col-reverse sm:flex-row justify-center gap-2">
          <Button variant="outline" onClick={onLogout}>
            Logout
          </Button>
          <Button onClick={onExtend}>
            Extend Session
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
