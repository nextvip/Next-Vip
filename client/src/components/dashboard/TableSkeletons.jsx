import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

function Skeleton({ className }) {
  return <div className={cn("animate-shimmer rounded-md", className)} />;
}

export function VideoTableSkeleton({ rows = 4 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow key={index} className="hover:bg-transparent">
          <TableCell>
            <Skeleton className="h-14 w-24 rounded-lg" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-44 max-w-full mb-2" />
            <Skeleton className="h-3 w-28 max-w-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-16 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export function PublicationTableSkeleton({ rows = 4 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow key={index} className="hover:bg-transparent">
          <TableCell>
            <Skeleton className="h-4 w-40 max-w-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-20 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-12" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
