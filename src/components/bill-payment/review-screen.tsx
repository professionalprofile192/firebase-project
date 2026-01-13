'use client';

import React from 'react';
import { Header } from '@/components/dashboard/header';
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
  formdata?: any; // Naya prop payment details ke liye
  onBack: () => void;
  onContinue: () => void;
  onCancel: () => void;
  isOtpOpen: boolean;
  setIsOtpOpen: (open: boolean) => void;
  onOtpConfirm: (otp: string) => void;
}

export default function ReviewScreen({ 
  data, 
  formdata, 
  onBack, 
  onContinue, 
  onCancel, 
  isOtpOpen, 
  setIsOtpOpen, 
  onOtpConfirm 
}: ReviewScreenProps) {
  
  const isPaymentMode = formdata?.mode === 'PAYMENT';
  
  // Agar payment mode hai toh formdata ke payees dikhao, warna default data (Add Payee)
  const displayItems = (isPaymentMode && Array.isArray(formdata?.payees)) 
    ? formdata.payees 
    : [data];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-end">
          <h1 className="text-2xl font-medium text-slate-800">
            Please review the following transaction details.
          </h1>
          {/* Payment mode mein "Paying from" header dikhayenge */}
          {isPaymentMode && formdata?.fromAccount && (
            <div className="text-right pb-1">
               <span className="text-[10px] text-slate-400 uppercase font-bold block">Paying from</span>
               <span className="text-sm font-bold text-[#0070BA] uppercase">
                 {formdata.fromAccount.accountTitle}
               </span>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {displayItems.map((item: any, index: number) => (
            <Card key={index} className="overflow-hidden border-none shadow-sm">
              <div className="bg-[#0070BA] p-4 flex items-center gap-4 text-white">
                <div className="bg-[#005a96] p-2 rounded-md">
                  <CreditCard className="w-6 h-6" />
                </div>veri
                <div>
                  <h2 className="text-lg font-semibold">Review Details</h2>
                  <p className="text-sm opacity-90">UBL</p>
                </div>
              </div>

              <div className="p-8 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                  <DetailRow label="Biller Type" value={item.billerType || item.categoryName} />
                  <DetailRow label="Biller Institution" value={item.billerInstitution || item?.rawNotes?.instVal} />
                  <DetailRow label="Consumer/Account Number" value={item.consumerNumber || item.consumerNo} />
                  <DetailRow label="Consumer Name" value={item.consumerName} />
            
                  {/* Payment Fields (Only for Payment Mode) */}
                  {isPaymentMode && (
                <>
                  {/* Amount with Currency */}
                  <DetailRow 
                    label="Amount" 
                    value={`${item.currency || 'PKR'} ${item.amountDue || item.payableAmount}`} 
                    highlight 
                  />
                  
                  {/* Due Date */}
                  <DetailRow label="Due Date" value={item.dueDate || 'N/A'} />

                  {/* Status (e.g., Unpaid/Paid) */}
                  <DetailRow 
                    label="Bill Status" 
                    value={item.status || 'N/A'} 
                    // Status ko color dene ke liye aap highlight logic modify kar sakte hain ya simple rakhein
                  />

                  {/* Biller Institution from rawNotes */}
                  <DetailRow 
                    label="Biller Institution" 
                    value={item?.rawNotes?.instVal || item?.billerInstitution || item?.companyName} 
                  />
                </>
              )}

              {!isPaymentMode && (
                    <DetailRow 
                      label="Payee Nickname" 
                      value={item.payeeNickname || item.payeeNickName} 
                    />
                  )}
                  <DetailRow label="Category" value={item.category || item.categoryName} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-end gap-4 pt-4 pb-12">
          <Button variant="secondary" onClick={onBack} className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-8">
            Back
          </Button>
          <Button variant="outline" onClick={onCancel} className="border-slate-200 text-slate-700 px-8">
            Cancel
          </Button>
          <Button onClick={onContinue} className="bg-[#0070BA] hover:bg-[#005a96] text-white px-10">
            {isPaymentMode ? 'Confirm & Pay' : 'Continue'}
          </Button>
        </div>
      </main>

      <OtpDialog open={isOtpOpen} onOpenChange={setIsOtpOpen} onConfirm={onOtpConfirm} />
    </div>
  );
}

function DetailRow({ label, value, highlight = false }: { label: string; value: any; highlight?: boolean }) {
  return (
    <div className="flex flex-col space-y-1">
      <span className="text-sm text-slate-400">{label}</span>
      <span className={`text-md font-medium ${highlight ? 'text-xl font-bold text-[#0070BA]' : 'text-slate-700'}`}>
        {value || '---'}
      </span>
    </div>
  );
}