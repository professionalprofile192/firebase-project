import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { TradeRequestForm } from '@/components/trade-request/trade-request-form';

export default function TradeRequestPage() {
  return (
    <DashboardLayout>
      <main className="flex-1 p-4 sm:px-6 sm:py-4 flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Trade Request</h1>
        <TradeRequestForm />
      </main>
    </DashboardLayout>
  );
}
