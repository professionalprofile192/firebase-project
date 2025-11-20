import { Header } from '@/components/dashboard/header';
import { NetWorth } from '@/components/dashboard/net-worth';
import { MyAccounts } from '@/components/dashboard/my-accounts';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { Notifications } from '@/components/dashboard/notifications';
import { ChartCard } from '@/components/dashboard/chart-card';

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header />
      <main className="flex-1 space-y-4 p-4 sm:px-6 sm:py-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="col-span-1 lg:col-span-1">
            <div className="flex flex-col gap-4">
                <NetWorth />
                <Notifications />
            </div>
          </div>
          <div className="col-span-1 lg:col-span-3 grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MyAccounts />
                <RecentTransactions />
            </div>
             <div className="grid grid-cols-1">
                <ChartCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
