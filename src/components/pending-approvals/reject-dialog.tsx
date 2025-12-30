
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (comment: string) => void;
}

export function RejectDialog({ open, onOpenChange, onConfirm }: RejectDialogProps) {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state
  const { toast } = useToast();

  const handleConfirm = () => {
    if (!comment.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please enter comment to process.',
      });
      return;
    }
    
    // onConfirm basically approvals-table ka 'handleConfirmReject' hai
    onConfirm(comment); 
    setComment('');
  };

  const handleClose = () => {
    setComment('');
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Reject Request</DialogTitle>
          <DialogDescription>
            Are you sure you want to reject the request?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="comment">Comment</Label>
          <Textarea
            id="comment"
            placeholder="Enter your comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mt-2"
          />
        </div>
        <DialogFooter className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={handleClose}>
            No
          </Button>
         <Button onClick={handleConfirm} disabled={isSubmitting}>
    {isSubmitting ? "Processing..." : "Yes"}
  </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
