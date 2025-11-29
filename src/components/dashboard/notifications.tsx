
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
  
type Notification = {
    lastModifiedAt: string;
    status: string;
    featureActionId: string;
    referenceNo: string;
}
  
const featureActionToMessage: Record<string, string> = {
    "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE": "Inter-bank fund transfer request"
}

interface NotificationsProps {
    initialNotifications: Notification[];
}

export function Notifications({ initialNotifications }: NotificationsProps) {
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
    const [loading, setLoading] = useState(false);


    const getNotificationMessage = (notification: Notification) => {
        const baseMessage = featureActionToMessage[notification.featureActionId] || "A new request";
        if (notification.status === 'IN PROGRESS') {
            return `You have created a new ${baseMessage} approval request.`;
        }
        return `Your request for ${baseMessage} has been ${notification.status.toLowerCase()}.`;
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
                notifications.map((item) => (
                    <div key={item.referenceNo} className="flex items-start gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                        <div className="flex-1">
                            <p className="text-xs text-muted-foreground">{format(new Date(item.lastModifiedAt), "dd/MM/yyyy h:mm a")}</p>
                            <p className={cn("font-semibold", {
                                "text-green-500": item.status === "APPROVED",
                                "text-yellow-500": item.status === "IN PROGRESS",
                            })}>{item.status}</p>
                            <p className="text-sm">{getNotificationMessage(item)}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground self-center" />
                    </div>
                ))
            ) : (
                <div className="flex flex-col items-center justify-center pt-10 text-muted-foreground">
                    <FileQuestion className="h-12 w-12" />
                    <p className="mt-2 text-sm">No Notifications Found</p>
                </div>
            )}
            </CardContent>
        </ScrollArea>
         <CardFooter className="justify-center">
          <Button variant="link">See all</Button>
        </CardFooter>
      </Card>
    );
  }
  
