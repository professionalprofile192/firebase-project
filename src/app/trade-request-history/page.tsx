'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { getTradeRequestHistory } from '../actions';
import { TradeRequestHistoryTable } from '@/components/trade-request-history/trade-request-history-table';

export type TradeHistoryItem = {
    file_refid: string;
    product_type: string;
    request_type: string;
    file_name: string;
    currency: string;
    status: string;
};

export default function TradeRequestHistoryPage() {
    const [history, setHistory] = useState<TradeHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchHistory() {
            try {
                // Fetch initial data from mock service
                const userProfileCookie = document.cookie.split('; ').find(row => row.startsWith('userProfile='));
                const userId = userProfileCookie ? JSON.parse(decodeURIComponent(userProfileCookie.split('=')[1])).userid : '6747741730';

                const historyData = await getTradeRequestHistory(userId);
                let serverHistory: TradeHistoryItem[] = [];
                
                if (historyData.opstatus === 0 && historyData.records) {
                    serverHistory = historyData.records.map((record: any) => {
                        const childData = JSON.parse(record.children)[0];
                        const extraData = JSON.parse(childData.extra3);
                        
                        return {
                            file_refid: record.file_refid,
                            product_type: record.product_type,
                            request_type: childData.file_type,
                            file_name: childData.file_name,
                            currency: extraData.Currency,
                            status: record.extra1
                        };
                    });
                }
                
                // Get newly submitted items from session storage
                const sessionHistoryString = sessionStorage.getItem('tradeRequestHistory');
                const sessionHistory: TradeHistoryItem[] = sessionHistoryString ? JSON.parse(sessionHistoryString) : [];
                
                // Combine and set the history, showing newest items first
                setHistory([...sessionHistory, ...serverHistory]);

            } catch (error) {
                console.error("Failed to parse user profile or fetch trade history", error);
                setHistory([]);
            } finally {
                setLoading(false);
            }
        }

        fetchHistory();
    }, []);

    if (loading) {
        return (
            <DashboardLayout>
                <main className="flex-1 p-4 sm:px-6 sm:py-4 flex flex-col gap-6">
                    <h1 className="text-2xl font-semibold">Trade Request History</h1>
                    <p>Loading history...</p>
                </main>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <main className="flex-1 p-4 sm:px-6 sm:py-4 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Trade Request History</h1>
                </div>
                <TradeRequestHistoryTable data={history} />
            </main>
        </DashboardLayout>
    );
}
