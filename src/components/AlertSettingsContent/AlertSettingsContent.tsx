'use client';

import { Header } from '@/components/dashboard/header';
import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/logout';
import { LogoutDialog } from '@/components/dashboard/logout-dialog'; 
import { ChevronDown, ChevronUp, Bell } from 'lucide-react';

export default function AlertSettingsPage() {
    const router = useRouter();
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [isDcpOpen, setIsDcpOpen] = useState(true);

    // Logout Functionality
    const confirmLogout = useCallback(async () => {
        await logout();
        router.push('/');
    }, [router]);

    // Dummy data from your screenshots
    const dcpAlertsList = [
        "DCP CASH OVER COUNTER", 
        "DCP BULK FILE UPLOAD", 
        "DCP FX CASES",
        "DCP Approvals Requests", 
        "DCP CORPORATE BANKERS CHEQUE C",
        "DCP TRANSFER", 
        "DCP PAYMENT", 
        "DCP RTGS", 
        "DCP CCC MANAGMENT"
    ];

    const transactionItems = [
        "Add COC Beneficiary",
        "COC Payment Cancellation",
        "Bulk COC Payment",
        "COC Payment Single"
    ];

    return (
        <div className="flex min-h-screen w-full flex-col bg-slate-50">
            {/* 1. Header Section */}
            <Header />

            {/* 2. Main Page Content */}
            <main className="flex-1 p-4 md:p-8">
                <div className="mx-auto max-w-6xl">
                    <h2 className="text-gray-400 text-[11px] font-bold mb-4 uppercase tracking-wider">Settings</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                        
                        {/* Left Sidebar: Categories */}
                        <div className="md:col-span-4 lg:col-span-3">
                            <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-3 bg-slate-50 border-b text-[10px] font-bold text-slate-500 uppercase">
                                    Setting
                                </div>
                                
                                {/* DCP Alerts Header */}
                                <button 
                                    onClick={() => setIsDcpOpen(!isDcpOpen)}
                                    className="w-full flex items-center justify-between p-4 text-sky-700 hover:bg-slate-50 transition-colors border-b border-slate-100"
                                >
                                    <div className="flex items-center gap-3">
                                        <Bell className="h-4 w-4 text-sky-500" />
                                        <span className="font-bold text-sm">DCP Alerts</span>
                                    </div>
                                    {isDcpOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </button>

                                {/* DCP Alerts List (Expandable) */}
                                {isDcpOpen && (
                                    <div className="bg-white">
                                        {dcpAlertsList.map((item, index) => (
                                            <div 
                                                key={index} 
                                                className={`p-4 text-[11px] font-bold border-b last:border-0 cursor-pointer pl-12 transition-all
                                                ${item === "DCP Approvals Requests" 
                                                    ? "border-l-[3px] border-l-sky-600 bg-slate-50 text-sky-700" 
                                                    : "text-slate-500 hover:bg-slate-50 hover:text-sky-700"}`}
                                            >
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Section: Detailed View */}
                        <div className="md:col-span-8 lg:col-span-9 space-y-4">
                            <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
                                {/* Panel Header */}
                                <div className="p-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
                                    <h3 className="text-sm font-bold text-slate-600">Transactions and Payments</h3>
                                    <button className="text-sky-600 text-xs font-bold hover:underline">
                                        Edit
                                    </button>
                                </div>

                                {/* List Items */}
                                <div className="divide-y divide-slate-100">
                                    {transactionItems.map((item, index) => (
                                        <div key={index} className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer group transition-colors">
                                            <span className="text-[13px] font-semibold text-slate-700">{item}</span>
                                            <ChevronDown className="h-4 w-4 text-sky-600 group-hover:translate-y-0.5 transition-transform" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Info Note Section */}
                            <div className="bg-sky-50/70 border border-sky-100 p-4 rounded-sm">
                                <p className="text-[13px] text-slate-700">
                                    <span className="font-bold">Note:</span> You will be notified through your selected channel preferences.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            {/* 3. Dialogs */}
            <LogoutDialog 
                open={showLogoutDialog} 
                onOpenChange={setShowLogoutDialog} 
                onConfirm={confirmLogout} 
            />
        </div>
    );
}