'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface OtpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (otp: string) => void;
}

export function OtpDialog({ open, onOpenChange, onConfirm }: OtpDialogProps) {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [showResend, setShowResend] = useState(false);

  useEffect(() => {
    if (open) {
      setTimer(60);
      setShowResend(false);
      setOtp('');
    }
  }, [open]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setShowResend(true);
    }
  }, [timer]);

  const handleConfirm = () => {
    onConfirm(otp);
  };

  const handleResend = () => {
    setTimer(60);
    setShowResend(false);
    // Add logic to resend OTP here
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Validate OTP</DialogTitle>
          <DialogDescription>
            Please enter the OTP sent to your registered email or mobile number.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label htmlFor="otp" className="text-sm font-medium">OTP</label>
            <Input
              id="otp"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
              maxLength={6}
              className="mt-1"
            />
          </div>
          <div className="flex justify-end items-center h-8">
            {showResend ? (
              <Button variant="link" onClick={handleResend} className="p-0 h-auto">
                Resend OTP
              </Button>
            ) : (
              <span className="text-sm text-muted-foreground bg-gray-100 px-3 py-1 rounded-full">
                {formatTime(timer)}
              </span>
            )}
          </div>
          <Button onClick={handleConfirm} className="w-full" disabled={otp.length !== 6}>
            Confirm
          </Button>
        </div>
        <DialogClose asChild>
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 h-6 w-6 rounded-full">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
            </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
