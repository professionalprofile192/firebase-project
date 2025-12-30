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
      {/* Scrollable container */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-[1200px]"> {/* Table width large enough for all columns */}
          <Table className="w-full table-auto">
            <TableHeader>
              <TableRow className="bg-gray-200">
                <TableHead className="px-4 py-2">File Reference Number</TableHead>
                <TableHead className="px-4 py-2">File Name</TableHead>
                <TableHead className="px-4 py-2">Upload Date</TableHead>
                <TableHead className="px-4 py-2">Status</TableHead>
                <TableHead className="px-4 py-2">Account Number</TableHead>
                <TableHead className="px-4 py-2">Account Name</TableHead>
                <TableHead className="px-4 py-2">Uploaded By</TableHead>
                <TableHead className="px-4 py-2">File Type</TableHead>
                <TableHead className="px-4 py-2">Comment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data.map((file) => (
                  <TableRow key={file.fileReferenceNumber} className="hover:bg-gray-50 transition">
                    <TableCell className="px-4 py-2">{file.fileReferenceNumber}</TableCell>
                    <TableCell className="font-medium px-4 py-2">{file.fileName}</TableCell>
                    <TableCell className="px-4 py-2">{format(new Date(file.uploadDate), 'dd/MM/yyyy h:mm a')}</TableCell>
                    <TableCell className="px-4 py-2">
                      <Badge
                        variant={getStatusVariant(file.status) as any}
                        className={cn({
                          'bg-green-100 text-green-800': file.status === '1',
                          'bg-red-100 text-red-800': file.status === '0',
                          'bg-yellow-100 text-yellow-800':
                            file.status !== '1' && file.status !== '0',
                        })}
                      >
                        {getStatusLabel(file.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-2">{file.accountNumber}</TableCell>
                    <TableCell className="px-4 py-2">{file.accountName}</TableCell>
                    <TableCell className="px-4 py-2">{file.uploadedBy}</TableCell>
                    <TableCell className="px-4 py-2">{file.fileType}</TableCell>
                    <TableCell className="px-4 py-2">{file.comment}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No Record Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
  
  
  
  
}
