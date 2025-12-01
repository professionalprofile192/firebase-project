
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { TradeHistoryItem } from '@/app/trade-request-history/page';
import { Card } from '../ui/card';

interface TradeRequestHistoryTableProps {
  data: TradeHistoryItem[];
}

export function TradeRequestHistoryTable({ data }: TradeRequestHistoryTableProps) {

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>File Reference Number</TableHead>
            <TableHead>Product Type</TableHead>
            <TableHead>Request Type</TableHead>
            <TableHead>File Name</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((item) => (
              <TableRow key={item.file_refid}>
                <TableCell>{item.file_refid}</TableCell>
                <TableCell>{item.product_type}</TableCell>
                <TableCell>{item.request_type}</TableCell>
                <TableCell>{item.file_name}</TableCell>
                <TableCell>{item.currency}</TableCell>
                <TableCell>{item.status}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No Record Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
