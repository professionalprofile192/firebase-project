'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { BulkFile } from '@/app/bulk-import/page';
import { Badge } from '../ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface BulkFileHistoryTableProps {
  data: BulkFile[];
}

export function BulkFileHistoryTable({ data }: BulkFileHistoryTableProps) {

  const getStatusVariant = (status: string) => {
    switch(status) {
      case '1': return 'success';
      case '0': return 'destructive';
      default: return 'secondary';
    }
  }

  const getStatusLabel = (status: string) => {
    switch(status) {
      case '1': return 'Success';
      case '0': return 'Failed';
      default: return 'In Progress';
    }
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm mt-4">
      <Table>
        <TableHeader>
          <TableRow style={{ backgroundColor: '#ECECEC8C' }}>
            <TableHead>File Name</TableHead>
            <TableHead>Upload Date</TableHead>
            <TableHead>Reference Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Comment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((file) => (
              <TableRow key={file.fileReferenceNumber}>
                <TableCell className="font-medium">{file.fileName}</TableCell>
                <TableCell>{format(new Date(file.uploadDate), 'dd/MM/yyyy h:mm a')}</TableCell>
                <TableCell>{file.fileReferenceNumber}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(file.status) as any} className={cn({
                    'bg-green-100 text-green-800': file.status === '1',
                    'bg-red-100 text-red-800': file.status === '0',
                    'bg-yellow-100 text-yellow-800': file.status !== '1' && file.status !== '0',
                  })}>
                    {getStatusLabel(file.status)}
                  </Badge>
                </TableCell>
                <TableCell>{file.comment}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No Record Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
