'use client';

import { NetWorth } from '@/components/dashboard/net-worth';
import { MyAccounts } from '@/components/dashboard/my-accounts';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { Notifications } from '@/components/dashboard/notifications';
import { ChartCard } from '@/components/dashboard/chart-card';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

/* ================= TYPES ================= */
type Account = {
  responseCode: string;
  ACCT_STATUS: string;
  ACCT_TITLE: string;
  ACCT_NO: string;
  IBAN_CODE: string;
  DEPOSIT_TYPE: string;
  ACCT_TYPE: string;
  LEDGER_BAL: string;
  AVAIL_BAL: string;
};

export type Transaction = {
  CRDR: 'C' | 'D';
  seqno: string;
  instNo?: string;
  tranAmt: string;
  tranDate: string;
  particulars: string;
  runBal: string;
};

type Notification = {
  lastModifiedAt?: string;
  assignedDate?: string;
  status: string;
  featureActionId: string;
  referenceNo: string;
};

/* ================= DASHBOARD ================= */
export default function Dashboard() {
  const router = useRouter();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* ================= API INIT (ONCE) ================= */
  useEffect(() => {
    const initDashboard = async () => {
      try {
        setLoading(true);

        const profileStr = sessionStorage.getItem("userProfile");
        const claimsToken = sessionStorage.getItem("claimsToken");

        if (!profileStr || !claimsToken) {
          router.push("/login");
          return;
        }

        const profile = JSON.parse(profileStr);
        setUserProfile(profile);

        const token = claimsToken || "";
        const kuid = profile?.user_attributes?.UserName;
        const customerId = profile?.user_attributes?.customer_id;
        const userId = profile?.userid;

        /* ================= USER ATTRIBUTES ================= */
        const sessionRes = await fetch("/api/user-attributes", {
          method: "GET",
          credentials: "include",
          headers: {
            "x-kony-authorization": token,
            "x-kony-requestid": crypto.randomUUID(),
          },
        });
        const sessionData = await sessionRes.json();
        console.log("SESSION ATTRIBUTES:", sessionData);

        /* ================= SECURITY ATTRIBUTES ================= */
        const secRes = await fetch("/api/security-attributes", {
          method: "GET",
          credentials: "include",
          headers: {
            "x-kony-authorization": token,
            "x-kony-requestid": crypto.randomUUID(),
          },
        });
        const secData = await secRes.json();
        const sessionToken = secData?.session_token;
        sessionStorage.setItem("sessionToken", sessionToken);
        console.log("SECURITY ATTRIBUTES:", secData);

        /* ================= USERS API ================= */
        const usersRes = await fetch("/api/users", {
          method: "GET",
          credentials: "include",
          headers: {
            "x-kony-authorization": token,
            "x-kony-api-version": "1.0",
            "x-kony-requestid": crypto.randomUUID(),
            "x-kony-deviceid": crypto.randomUUID(),
          },
        });
        const usersData = await usersRes.json();
        console.log("USERS API:", usersData);

        /* ================= FETCH ACCOUNTS ================= */
        const accRes = await fetch("/api/fetch-accounts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customer_id: customerId, token, kuid }),
        });
        const accData = await accRes.json();
        sessionStorage.setItem("accounts", JSON.stringify(accData?.payments || []));
        setAccounts(accData?.payments || []);

        const accountNumber = accData?.payments?.[0]?.ACCT_NO;
        if (!accountNumber) console.warn("No account found");

        /* ================= USER GROUP ================= */
        const groupRes = await fetch("/api/get-user-group", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userID: customerId, token, kuid }),
        });
        const groupData = await groupRes.json();
        const groupId = groupData?.LoginServices?.[0]?.Group_id;
        sessionStorage.setItem("groupId", groupId);

        /* ================= ACCOUNT DETAILS ================= */
        const accDetailRes = await fetch("/api/get-account-details-retail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, kuid, accountNumber }),
        });
        const accountDetails = await accDetailRes.json();

        /* ================= ACCOUNT STATEMENT ================= */
        // const stmtRes = await fetch("/api/account-statement", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ token, kuid, accountNumber }),
        // });
        // const stmtData = await stmtRes.json();

        /* ================= APPROVALS ================= */
        const approvalsRes = await fetch("/api/fetch-all-user-approvals", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            kuid,
            userId,
            limit: "10",
            offset: "0",
            sortBy: "modifydate",
            sortOrder: "desc",
          }),
        });
        const approvalsData = await approvalsRes.json();
        sessionStorage.setItem("approvals", JSON.stringify(approvalsData));
        setNotifications(approvalsData);

        /* ================= RECENT TRANSACTIONS ================= */
        const branchCode = accountDetails?.Accounts?.[0]?.branchCode;
        if (branchCode) {
          const txRes = await fetch("/api/recent-transactions", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token,
              kuid,
              accountNumber,
              branchCode,
              tranCount: "10",
              channel: "DCPRTL",
            }),
          });

          const txData = await txRes.json();
          const txArray = typeof txData?.payments === "string"
            ? JSON.parse(txData.payments)
            : txData?.payments || [];

          sessionStorage.setItem("allTransactions", JSON.stringify(txArray));
          sessionStorage.setItem("recentTransactions", JSON.stringify(txArray.slice(0, 3)));

          setAllTransactions(txArray);
          setRecentTransactions(txArray.slice(0, 3));
        }

        /* ================= PAYEE LIST ================= */
        // const payeeRes = await fetch("/api/get-payee-list", {
        //   method: "POST",
        //   credentials: "include",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({
        //     token,
        //     kuid,
        //     payload: {
        //       offset: 0,
        //       limit: 10,
        //       sortBy: "createdOn",
        //       order: "desc",
        //       payeeId: profile?.userid,
        //       searchString: "",
        //     },
        //   }),
        // });
        // const payeeData = await payeeRes.json();

      } catch (err) {
        console.error("DASHBOARD INIT ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    initDashboard();
  }, [router]);

  /* ================= ACCOUNT SWITCH ================= */
  const fetchTransactionsForAccount = useCallback((acctNo: string) => {
    const allTx = JSON.parse(sessionStorage.getItem('allTransactions') || '[]');
    const filtered = allTx.filter((tx: any) => tx.ACCT_NO === acctNo);

    setRecentTransactions(filtered.slice(0, 3));
    setAllTransactions(filtered);
  }, []);
// Loader Component
const DashboardLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-full">
      <div className="w-16 h-16 border-4 border-t-primary border-gray-300 rounded-full animate-spin"></div>
      <p className="text-lg font-medium text-gray-700"></p>
    </div>
  );
};
//=================================================

  if (loading || !userProfile) {
    return (
      <DashboardLayout>
        <main className="flex-1 flex items-center justify-center">
          <DashboardLoader />
        </main>
      </DashboardLayout>
    );
  }

  /* ================= UI ================= */
  return (
    <DashboardLayout>
      <main className="flex-1 flex flex-col p-4 gap-4 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="flex flex-col gap-4">
            <NetWorth accounts={accounts} userProfile={userProfile} />
            <Notifications initialNotifications={notifications} />
          </div>

          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MyAccounts accounts={accounts} />
              <RecentTransactions
                transactions={recentTransactions}
                accounts={accounts}
                onAccountChange={fetchTransactionsForAccount}
              />
            </div>

            <ChartCard transactions={allTransactions} accounts={accounts} />
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
