import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDownCircle, ArrowUpCircle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';

export function NetWorth() {
  return (
    <Card className="h-full bg-gradient-to-br from-teal-400 to-green-500 text-white shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
            <p className="text-sm font-medium">Good afternoon!</p>
            <p className="text-sm">raast stp</p>
        </div>
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">PKR. 1,512,627.50</div>
        <p className="text-xs text-white/80">Total Net Worth</p>
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-2">
            <ArrowDownCircle className="h-6 w-6" />
            <div>
              <p className="text-lg font-semibold">PKR. 1,512,627.50</p>
              <p className="text-sm text-white/80">Assets</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ArrowUpCircle className="h-6 w-6" />
            <div>
              <p className="text-lg font-semibold">PKR. 0.00</p>
              <p className="text-sm text-white/80">Liabilities</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
