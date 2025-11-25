'use client';

import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, X, Facebook, Twitter, Linkedin, Phone, Globe } from 'lucide-react';

interface ContactUsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SocialIcon = ({ href, icon: Icon }: { href: string; icon: React.ElementType }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary">
        <Icon className="h-6 w-6" />
    </a>
);


export function ContactUsDialog({
  open,
  onOpenChange,
}: ContactUsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm p-8 text-center font-body">
            <div className="flex justify-center mb-4">
                <div className="bg-blue-100 rounded-full p-3">
                    <Mail className="h-8 w-8 text-primary" />
                </div>
            </div>
            
            <div className="space-y-4 text-gray-600">
                <div>
                    <p className="text-sm">UBL Helpline</p>
                    <a href="tel:021111825888" className="text-lg font-semibold text-primary hover:underline">021 111 825 888</a>
                </div>
                <div>
                    <p className="text-sm">Website</p>
                    <a href="https://www.ubldigital.com" target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-primary hover:underline">ubldigital.com</a>
                </div>
                <div>
                    <p className="text-sm">Email</p>
                    <a href="mailto:customer.services@ubl.com.pk" className="text-lg font-semibold text-primary hover:underline">customer.services@ubl.com.pk</a>
                </div>
                <div>
                    <p className="text-sm">Mailing Address</p>
                    <p className="text-base font-semibold text-gray-800">
                        Customer Care, 1st Floor UBL warehouse building, Mai Kolachi road, Karachi, Pakistan.
                    </p>
                </div>
                 <div>
                    <p className="text-sm">Social Media</p>
                    <div className="flex justify-center gap-6 mt-2">
                        <SocialIcon href="https://facebook.com/UBLUnitedBankLtd" icon={Facebook} />
                        <SocialIcon href="https://twitter.com/ubldigital" icon={Twitter} />
                        <SocialIcon href="https://linkedin.com/company/ubl" icon={Linkedin} />
                    </div>
                </div>
            </div>
      </DialogContent>
    </Dialog>
  );
}
