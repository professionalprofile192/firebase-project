'use client';

import React from 'react';
import { Header } from '@/components/dashboard/header';
import { SessionTimeoutDialog } from '@/components/dashboard/session-timeout-dialog';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { OtpDialog } from '@/components/auth/otp-dialog';

interface ReviewScreenProps {
  data: {
    billerType: string;
    billerInstitution: string;
    consumerNumber: string;
    consumerName: string;
    payeeNickname: string;
    category: string;
  };
  onBack: () => void;
  onContinue: () => void;
  onCancel: () => void;
  isOtpOpen: boolean;
  setIsOtpOpen: (open: boolean) => void;
  onOtpConfirm: (otp: string) => void;
}

export default function ReviewScreen({ data, onBack, onContinue, onCancel ,isOtpOpen,setIsOtpOpen, onOtpConfirm}: ReviewScreenProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Title */}
        <h1 className="text-2xl font-medium text-slate-800">
          Please review the following transaction details.
        </h1>

        <Card className="overflow-hidden border-none shadow-sm">
          {/* Blue Header Section */}
          <div className="bg-[#0070BA] p-4 flex items-center gap-4 text-white">
            <div className="bg-[#005a96] p-2 rounded-md">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Review Details</h2>
              <p className="text-sm opacity-90">UBL</p>
            </div>
          </div>

          {/* Data Rows Section */}
          <div className="p-8 bg-white space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
              
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-slate-400">Biller Type</span>
                <span className="text-md font-medium text-slate-700">{data.billerType}</span>
              </div>

              <div className="flex flex-col space-y-1">
                <span className="text-sm text-slate-400">Biller Institution</span>
                <span className="text-md font-medium text-slate-700">{data.billerInstitution}</span>
              </div>

              <div className="flex flex-col space-y-1">
                <span className="text-sm text-slate-400">Consumer/Account Number</span>
                <span className="text-md font-medium text-slate-700">{data.consumerNumber}</span>
              </div>

              <div className="flex flex-col space-y-1">
                <span className="text-sm text-slate-400">Consumer Name</span>
                <span className="text-md font-medium text-slate-700">{data.consumerName}</span>
              </div>

              <div className="flex flex-col space-y-1">
                <span className="text-sm text-slate-400">Payee Nickname</span>
                <span className="text-md font-medium text-slate-700">{data.payeeNickname}</span>
              </div>

              <div className="flex flex-col space-y-1">
                <span className="text-sm text-slate-400">Category</span>
                <span className="text-md font-medium text-slate-700">{data.category}</span>
              </div>

            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <Button 
            variant="secondary" 
            onClick={onBack}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-8"
          >
            Back
          </Button>
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="border-slate-200 text-slate-700 px-8"
          >
            Cancel
          </Button>
          <Button 
            onClick={onContinue}
            className="bg-[#0070BA] hover:bg-[#005a96] text-white px-10"
          >
            Continue
          </Button>
        </div>
      </main>
      <OtpDialog 
        open={isOtpOpen} 
        onOpenChange={setIsOtpOpen} 
        onConfirm={onOtpConfirm} 
      />
    </div>
  );
}