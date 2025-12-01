

import { cookies } from 'next/headers';
import { getAccounts, getBulkFiles } from '../actions';
import { BulkImportClientPage } from '@/components/bulk-import/bulk-import-client-page';
import { Suspense } from 'react';

export type BulkFile = {
    fileName: string;
    uploadDate: string;
    fileReferenceNumber: string;
    status: string;
    comment: string;
};

async function getBulkImportData() {
    const cookieStore = cookies();
    const userProfileCookie = cookieStore.get('userProfile');

    if (!userProfileCookie?.value) {
        return { userProfile: null, accounts: [], bulkFiles: [] };
    }

    try {
        const userProfile = JSON.parse(userProfileCookie.value);

        const accountsData = await getAccounts(userProfile.userid, userProfile.CIF_NO);
        const accounts = accountsData.opstatus === 0 ? accountsData.payments : [];
        
        const bulkFilesData = await getBulkFiles(userProfile.userid);
        const bulkFiles = bulkFilesData.opstatus === 0 ? bulkFilesData.NDC_BulkPayments : [];

        return { userProfile, accounts, bulkFiles };
    } catch (error) {
        console.error("Failed to parse user profile or fetch data for bulk import", error);
        return { userProfile: null, accounts: [], bulkFiles: [] };
    }
}


export default async function BulkImportPage() {
  const { accounts, bulkFiles } = await getBulkImportData();

  return (
    <Suspense fallback={<div>Loading...</div>}>
        <BulkImportClientPage
            initialAccounts={accounts}
            initialBulkFiles={bulkFiles}
        />
    </Suspense>
  );
}
