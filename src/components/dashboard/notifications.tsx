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
  import { ChevronRight } from 'lucide-react';
  
  
  const notifications = [
      {
          date: "18/10/2025 3:49 AM",
          status: "APPROVED",
          message: "You request for INTER BANK ACCOUNT FUND TRANSFER CREATE has been approved.",
          statusColor: "text-green-500"
      },
      {
          date: "18/10/2025 1:19 AM",
          status: "IN PROGRESS",
          message: "You have created new INTER BANK ACCOUNT FUND TRANSFER CREATE approval request",
          statusColor: "text-yellow-500"
      },
      {
          date: "13/9/2025 4:45 AM",
          status: "APPROVED",
          message: "You request for INTER BANK ACCOUNT FUND TRANSFER CREATE has been approved.",
          statusColor: "text-green-500"
      }
  ]
  
  export function Notifications() {
    return (
      <Card className="h-full">
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
        <CardContent className="space-y-4">
          {notifications.map((item, index) => (
              <div key={index} className="flex items-start gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex-1">
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                      <p className={`font-semibold ${item.statusColor}`}>{item.status}</p>
                      <p className="text-sm">{item.message}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground self-center" />
              </div>
          ))}
        </CardContent>
         <CardFooter className="justify-center">
          <Button variant="link">See all</Button>
        </CardFooter>
      </Card>
    );
  }
  