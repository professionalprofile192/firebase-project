import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
  import { FileQuestion } from 'lucide-react';
  
  export function ChartCard() {
    return (
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Credit</span>
              </div>
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm">Debit</span>
              </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-4/5 text-muted-foreground">
          <FileQuestion className="h-12 w-12" />
          <p className="mt-2 text-sm">No Records Found</p>
        </CardContent>
      </Card>
    );
  }
  