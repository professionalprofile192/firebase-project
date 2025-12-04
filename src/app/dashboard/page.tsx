
import { Dashboard } from '@/components/dashboard/dashboard';
import { Suspense } from 'react';

export default async function DashboardPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Dashboard />
        </Suspense>
    );
}
