
import Dashboard from '@/components/dashboard/dashboard';
import DashboardPageLoader from '@/components/Loader/Loader';
import { Suspense } from 'react';

export default async function DashboardPage() {
    return (
        
        <Suspense fallback={<DashboardPageLoader />}>
            <Dashboard />
        </Suspense>
    );
}
