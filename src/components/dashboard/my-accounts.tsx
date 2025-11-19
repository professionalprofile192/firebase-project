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
  
  export function MyAccounts() {
    return (
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>My Accounts</CardTitle>
            <Select defaultValue="saving">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select Account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="saving">Saving Accounts</SelectItem>
                <SelectItem value="current">Current Accounts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center py-3 border-b">
              <div>
                  <p className="font-semibold">060510224211</p>
                  <p className="text-sm text-muted-foreground">NAWAZ ALI</p>
              </div>
              <p className="font-semibold text-primary">Rs. 1,512,627.50</p>
          </div>
        </CardContent>
        <CardFooter>
            <div className="flex justify-between items-center w-full">
                <p className="font-semibold">Total</p>
                <p className="font-semibold text-primary">Rs. 1,512,627.00</p>
            </div>
        </CardFooter>
      </Card>
    );
  }
  