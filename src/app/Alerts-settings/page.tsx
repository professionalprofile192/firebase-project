import AlertSettingsContent from '@/components/AlertSettingsContent/AlertSettingsContent';
import { Suspense } from 'react';

import DashboardPageLoader from '@/components/Loader/Loader'; 

export default async function AlertSettingsPage() {
  return (
    <Suspense fallback={<DashboardPageLoader />}>
      <AlertSettingsContent />
    </Suspense>
  );
}