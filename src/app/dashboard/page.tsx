
import { cookies } from 'next/headers';
import { getAccounts, getRecentTransactions, getNotifications } from '../actions';
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
                // Passing all transactions to the page now
                const recentTransactionsData = await getRecentTransactions(accounts[0].ACCT_NO);
                if (recentTransactionsData.opstatus === 0) {
                    transactions = recentTransactionsData.payments;
                }
            }
            
            const notificationData = await getNotifications(userProfile.userid);
            notifications = notificationData.opstatus === 0 ? notificationData.ApprovalMatrix : [];

        } catch (error) {
            console.error("Failed to parse user profile or fetch data", error);
            // If parsing fails, it's likely a bad cookie, so we clear it.
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
