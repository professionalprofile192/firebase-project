
import { cookies } from 'next/headers';
import { getAccounts, getRecentTransactions, getNotifications } from '../actions';
import { Dashboard } from '@/components/dashboard/dashboard';

async function getDashboardData() {
    const cookieStore = cookies();
    const userProfileCookie = cookieStore.get('userProfile');

    if (!userProfileCookie || !userProfileCookie.value) {
        return { userProfile: null, accounts: [], transactions: [], notifications: [] };
    }

    try {
        const userProfile = JSON.parse(userProfileCookie.value);

        const accountsData = await getAccounts(userProfile.userid, userProfile.CIF_NO);
        const accounts = accountsData.opstatus === 0 ? accountsData.payments : [];

        let transactions = [];
        if (accounts.length > 0) {
            const recentTransactionsData = await getRecentTransactions(accounts[0].ACCT_NO);
            if (recentTransactionsData.opstatus === 0) {
                transactions = recentTransactionsData.payments.slice(0, 3);
            }
        }
        
        const notificationData = await getNotifications(userProfile.userid);
        const notifications = notificationData.opstatus === 0 ? notificationData.ApprovalMatrix : [];

        return { userProfile, accounts, transactions, notifications };
    } catch (error) {
        console.error("Failed to parse user profile or fetch data", error);
        // If parsing fails, it's likely a bad cookie, so we clear it.
        cookies().delete('userProfile');
        return { userProfile: null, accounts: [], transactions: [], notifications: [] };
    }
}


export default async function DashboardPage() {
  const { userProfile, accounts, transactions, notifications } = await getDashboardData();

  return (
    <Dashboard
        initialUserProfile={userProfile}
        initialAccounts={accounts}
        initialTransactions={transactions}
        initialNotifications={notifications}
    />
  );
}
