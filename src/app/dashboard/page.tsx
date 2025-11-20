import { Header } from '@/components/dashboard/header';
import { NetWorth } from '@/components/dashboard/net-worth';
import { MyAccounts } from '@/components/dashboard/my-accounts';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { Notifications } from '@/components/dashboard/notifications';
import { ChartCard } from '@/components/dashboard/chart-card';

export default function DashboardPage() {
  return (
    <div className="flex h-screen w-full flex-col bg-muted/40 overflow-hidden">
      <Header />
      <main className="flex-1 flex flex-col p-4 sm:px-6 sm:py-4 gap-4">
        <div className="flex-1 grid gap-4 lg:grid-cols-4">
          <div className="lg:col-span-1 flex flex-col gap-4">
            <NetWorth />
            <Notifications />
          </div>
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="flex-1 grid md:grid-cols-2 gap-4">
                <MyAccounts />
                <RecentTransactions />
            </div>
             <div className="flex-1 grid grid-cols-1">
                <ChartCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
