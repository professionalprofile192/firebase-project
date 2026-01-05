'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { TradeRequestHistoryTable } from '@/components/trade-request-history/trade-request-history-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

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
    const [productTypeFilter, setProductTypeFilter] = useState('all');
    const [requestTypeFilter, setRequestTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

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
                
                // Get newly submitted items from local storage
                const localHistoryString = localStorage.getItem('tradeRequestHistory');
                const localHistory: TradeHistoryItem[] = localHistoryString ? JSON.parse(localHistoryString) : [];
                
                // Combine and set the history, showing newest items first
                setHistory([...localHistory, ...serverHistory]);

            } catch (error) {
                console.error("Failed to parse user profile or fetch trade history", error);
                setHistory([]);
            } finally {
                setLoading(false);
            }
        }

        fetchHistory();
    }, []);

    const productTypes = [...new Set(history.map(item => item.product_type))];
    const requestTypes = [...new Set(history.map(item => item.request_type))];
    const statuses = [...new Set(history.map(item => item.status))];

    const filteredHistory = history.filter(item => {
        return (
            (productTypeFilter === 'all' || item.product_type === productTypeFilter) &&
            (requestTypeFilter === 'all' || item.request_type === requestTypeFilter) &&
            (statusFilter === 'all' || item.status === statusFilter)
        );
    });

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
                <Card>
                    <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             <Select value={productTypeFilter} onValueChange={setProductTypeFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by Product Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Product Types</SelectItem>
                                    {productTypes.map(type => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                             <Select value={requestTypeFilter} onValueChange={setRequestTypeFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by Request Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Request Types</SelectItem>
                                    {requestTypes.map(type => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                             <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    {statuses.map(status => (
                                        <SelectItem key={status} value={status}>{status}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
                <TradeRequestHistoryTable data={filteredHistory} />
            </main>
        </DashboardLayout>
    );
}
