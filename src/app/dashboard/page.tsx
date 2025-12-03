
import { cookies } from 'next/headers';
import { getAccounts, getRecentTransactions, getApprovalHistory, getPendingApprovals } from '../actions';
import { Dashboard } from '@/components/dashboard/dashboard';
import { Suspense } from 'react';

async function DashboardData() {
    const cookieStore = cookies();
    const userProfileCookie = cookieStore.get('userProfile');

    let userProfile = null;
    let accounts = [];
    let transactions = [];
    let notifications = [];

    if (userProfileCookie?.value) {
        try {
            userProfile = JSON.parse(userProfileCookie.value);

            const accountsData = await getAccounts(userProfile.userid, userProfile.CIF_NO);
            accounts = accountsData.opstatus === 0 ? accountsData.payments : [];

            if (accounts.length > 0) {
                const recentTransactionsData = await getRecentTransactions(accounts[0].ACCT_NO);
                if (recentTransactionsData.opstatus === 0) {
                    transactions = recentTransactionsData.payments;
                }
            }
            
            const [historyData, pendingData] = await Promise.all([
                getApprovalHistory(userProfile.userid),
                getPendingApprovals(userProfile.userid)
            ]);

            const historyNotifications = historyData.opstatus === 0 ? historyData.ApprovalMatrix : [];
            const pendingNotifications = pendingData.opstatus === 0 ? pendingData.ApprovalMatrix : [];

            notifications = [...historyNotifications, ...pendingNotifications]
                .sort((a, b) => new Date(b.assignedDate || b.lastModifiedAt).getTime() - new Date(a.assignedDate || a.lastModifiedAt).getTime());


        } catch (error) {
            console.error("Failed to parse user profile or fetch data", error);
            cookies().delete('userProfile');
            userProfile = null;
            accounts = [];
            transactions = [];
            notifications = [];
        }
    }

    return (
        <Dashboard
            initialUserProfile={userProfile}
            initialAccounts={accounts}
            initialTransactions={transactions.slice(0,3)}
            initialNotifications={notifications}
        />
    );
}


export default async function DashboardPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DashboardData />
        </Suspense>
    );
}
