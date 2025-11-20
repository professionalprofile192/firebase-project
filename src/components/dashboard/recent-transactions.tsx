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
  
  const transactions = [
    {
      date: '19',
      month: 'Nov',
      description: 'CASH WITHDRAWAL - AT...',
      id: '5917336308',
      type: 'Debit',
      amount: 'Rs. 5,000.00',
    },
    {
      date: '18',
      month: 'Nov',
      description: 'CASH WITHDRAWAL - AT...',
      id: '5914830496',
      type: 'Debit',
      amount: 'Rs. 5,000.00',
    },
    {
      date: '17',
      month: 'Nov',
      description: 'CASH WITHDRAWAL - AT...',
      id: '5911804812',
      type: 'Debit',
      amount: 'Rs. 3,000.00',
    },
  ];
  
  export function RecentTransactions() {
    return (
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Select defaultValue="060510224211">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select Account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="060510224211">060510224211</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {transactions.map((tx, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <div className="text-sm text-muted-foreground">{tx.month}</div>
                <div className="text-lg font-bold">{tx.date}</div>
              </div>
              <div className="flex-1 border-l-2 border-destructive pl-4">
                <p className="font-semibold">{tx.description}</p>
                <p className="text-sm text-muted-foreground">
                  {tx.id}
                </p>
                <p className="text-sm text-muted-foreground">
                  {tx.type}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-primary">{tx.amount}</p>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="justify-center">
          <Button variant="link">See all</Button>
        </CardFooter>
      </Card>
    );
  }
  