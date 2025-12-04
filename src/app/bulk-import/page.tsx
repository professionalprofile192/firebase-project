
'use client';

import { BulkImportClientPage } from '@/components/bulk-import/bulk-import-client-page';
import { Suspense } from 'react';


export default function BulkImportPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <BulkImportClientPage />
    </Suspense>
  );
}
