
import { cookies } from 'next/headers';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { getTradeRequestHistory } from '../actions';
import { TradeRequestHistoryTable } from '@/components/trade-request-history/trade-request-history-table';
import { Button } from '@/components/ui/button';

export type TradeHistoryItem = {
    file_refid: string;
    product_type: string;
    request_type: string;
    file_name: string;
    currency: string;
    status: string;
};

async function getHistoryData() {
    const cookieStore = cookies();
    const userProfileCookie = cookieStore.get('userProfile');
    
    if (!userProfileCookie?.value) {
        return { userProfile: null, history: [] };
    }

    try {
        // Assuming the user ID is different for this service, using a hardcoded one for now
        const userProfile = { userid: '6747741730' }; 
        const historyData = await getTradeRequestHistory(userProfile.userid);
        
        if (historyData.opstatus === 0 && historyData.records) {
            const processedHistory: TradeHistoryItem[] = historyData.records.map((record: any) => {
                const childData = JSON.parse(record.children)[0];
                const extraData = JSON.parse(childData.extra3);
                
                return {
                    file_refid: record.file_refid,
                    product_type: record.product_type,
                    request_type: childData.file_type,
                    file_name: childData.file_name,
                    currency: extraData.Currency,
                    status: record.extra1
                }
            });
            return { userProfile, history: processedHistory };
        }
        
        return { userProfile, history: [] };

    } catch (error) {
        console.error("Failed to parse user profile or fetch trade history", error);
        return { userProfile: null, history: [] };
    }
}


export default async function TradeRequestHistoryPage() {
    const { history } = await getHistoryData();

    return (
        <DashboardLayout>
            <main className="flex-1 p-4 sm:px-6 sm:py-4 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Trade Request History</h1>
                    <Button>Trade Request History</Button>
                </div>
                <TradeRequestHistoryTable data={history} />
            </main>
        </DashboardLayout>
    );
}

