
'use client';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
  import { Button } from '../ui/button';
  import { ChevronRight, FileQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { useState } from 'react';
import { Skeleton } from '../ui/skeleton';
import { format } from 'date-fns';
import Link from 'next/link';
  
type Notification = {
    lastModifiedAt?: string;
    assignedDate?: string;
    status: string;
    featureActionId: string;
    referenceNo: string;
}
  
const featureActionToMessage: Record<string, string> = {
    "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE": "Inter-bank fund transfer request",
    "INTRA_BANK_FUND_TRANSFER_CREATE_RECEPIENT": "Intra-bank fund transfer recepient creation",
    "BILL_PAY_CREATE_PAYEES": "Bill payment payee creation",
    "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT": "Inter-bank fund transfer recepient creation",
    "RAAST_TRANSACTION_CREATE": "RAAST transaction",
}

interface NotificationsProps {
    initialNotifications: Notification[];
}

export function Notifications({ initialNotifications }: NotificationsProps) {
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
    const [loading, setLoading] = useState(false);


    const getNotificationMessage = (notification: Notification) => {
        const baseMessage = featureActionToMessage[notification.featureActionId] || "A new request";
        const status = notification.status || 'IN PROGRESS';
        if (status === 'IN PROGRESS') {
            return `You have a new ${baseMessage} for approval.`;
        }
        return `Your request for ${baseMessage} has been ${status.toLowerCase()}.`;
    }

    return (
      <Card className="h-[280px] flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Notifications</CardTitle>
            <Select defaultValue="requests">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="requests">Requests</SelectItem>
                <SelectItem value="alerts">Alerts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <ScrollArea className="flex-1">
            <CardContent className="space-y-4">
            {loading ? (
                <div className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
            ) : notifications.length > 0 ? (
                notifications.slice(0, 5).map((item) => {
                    const date = item.assignedDate || item.lastModifiedAt;
                    if (!date) return null;
                    const status = item.status || 'IN PROGRESS';

                    return (
                        <div key={item.referenceNo} className="flex items-start gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground">{format(new Date(date), "dd/MM/yyyy h:mm a")}</p>
                                <p className={cn("font-semibold", {
                                    "text-green-500": status === "APPROVED",
                                    "text-red-500": status === "REJECTED",
                                    "text-yellow-500": status === "IN PROGRESS",
                                })}>{status}</p>
                                <p className="text-sm">{getNotificationMessage(item)}</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground self-center" />
                        </div>
                    )
                })
            ) : (
                <div className="flex flex-col items-center justify-center pt-10 text-muted-foreground">
                    <FileQuestion className="h-12 w-12" />
                    <p className="mt-2 text-sm">No Notifications Found</p>
                </div>
            )}
            </CardContent>
        </ScrollArea>
         <CardFooter className="justify-center">
          <Link href="/pending-approvals">
            <Button variant="link">See all</Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }
  
