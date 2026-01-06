import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

export const DeleteConfirmPopup = ({ isOpen, onClose, onConfirm, title }: any) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 border-t-4 border-red-500">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Confirm Delete</h2>
                <p className="text-gray-600 mb-6">
                    Are you sure you want to delete <span className="font-semibold">{title}</span>? This action cannot be undone.
                </p>
                
                <div className="flex gap-3">
                    <button 
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all"
                    >
                        No, Cancel
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-md transition-all"
                    >
                        Yes, Delete
                    </button>
                </div>
            </div>
        </div>
    );
};