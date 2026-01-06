import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface CustomPopupProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  title: string;
  message: string;
  referenceNo?: string;
}

export const CustomPopup = ({ isOpen, onClose, type, title, message, referenceNo }: CustomPopupProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 text-center">
          {/* Icon based on type */}
          <div className="flex justify-center mb-4">
            {type === 'success' ? (
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            ) : (
              <AlertCircle className="h-12 w-12 text-destructive" />
            )}
          </div>

          {/* Heading */}
          <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
          
          {/* Message / Sub-heading */}
          <p className="text-gray-600 mb-4">{message}</p>

          {/* Reference Number Section (Only for success) */}
          {referenceNo && (
            <div className="bg-muted p-3 rounded-md mb-6">
              <span className="text-xs uppercase text-muted-foreground font-semibold block mb-1">
                Reference Number
              </span>
              <span className="text-lg font-mono font-bold tracking-wider text-primary">
                {referenceNo}
              </span>
            </div>
          )}

          {/* Action Button */}
          <Button 
            onClick={onClose} 
            className="w-full font-semibold py-2"
            variant={type === 'error' ? 'destructive' : 'default'}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};
