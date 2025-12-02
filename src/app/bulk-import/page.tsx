

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

async function BulkImportData() {
    const cookieStore = cookies();
    const userProfileCookie = cookieStore.get('userProfile');

    let userProfile = null;
    let accounts = [];
    let bulkFiles = [];

    if (userProfileCookie?.value) {
        try {
            userProfile = JSON.parse(userProfileCookie.value);

            const accountsData = await getAccounts(userProfile.userid, userProfile.CIF_NO);
            accounts = accountsData.opstatus === 0 ? accountsData.payments : [];
            
            const bulkFilesData = await getBulkFiles(userProfile.userid);
            bulkFiles = bulkFilesData.opstatus === 0 ? bulkFilesData.NDC_BulkPayments : [];

        } catch (error) {
            console.error("Failed to parse user profile or fetch data for bulk import", error);
            userProfile = null;
            accounts = [];
            bulkFiles = [];
        }
    }

    return (
        <BulkImportClientPage
            initialAccounts={accounts}
            initialBulkFiles={bulkFiles}
        />
    );
}


export default async function BulkImportPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <BulkImportData />
    </Suspense>
  );
}
