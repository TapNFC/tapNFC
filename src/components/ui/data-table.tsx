'use client';

import { MoreHorizontal, Search } from 'lucide-react';
import { nanoid } from 'nanoid';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export type Column<T = any> = {
  accessorKey: string;
  header: string;
  cell?: ({ row }: { row: { getValue: (key: string) => any; original: T } }) => React.ReactNode;
};

export type RowAction<T = any> = {
  label: string;
  onClick: (row: T) => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive';
};

export type BulkAction<T = any> = {
  label: string;
  onClick: (rows: T[]) => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive';
};

export type DataTableProps<T = any> = {
  columns: Column<T>[];
  data: T[];
  enableSearch?: boolean;
  enableRowSelection?: boolean;
  searchPlaceholder?: string;
  actions?: RowAction<T>[];
  bulkActions?: BulkAction<T>[];
  className?: string;
};

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  enableSearch = false,
  enableRowSelection = false,
  searchPlaceholder = 'Search...',
  actions = [],
  bulkActions = [],
  className,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set());

  // Filter data based on search query
  const filteredData = React.useMemo(() => {
    if (!searchQuery) {
      return data;
    }

    return data.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    );
  }, [data, searchQuery]);

  // Handle row selection
  const handleRowSelect = (rowId: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(rowId);
    } else {
      newSelected.delete(rowId);
    }
    setSelectedRows(newSelected);
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = filteredData.map((_, index) => index.toString());
      setSelectedRows(new Set(allIds));
    } else {
      setSelectedRows(new Set());
    }
  };

  const isAllSelected = selectedRows.size === filteredData.length && filteredData.length > 0;
  const isIndeterminate = selectedRows.size > 0 && selectedRows.size < filteredData.length;

  // Get selected row data
  const selectedRowData = React.useMemo(() => {
    return Array.from(selectedRows)
      .map(id => filteredData[Number.parseInt(id)])
      .filter((row): row is T => row !== undefined);
  }, [selectedRows, filteredData]);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header with search and bulk actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {enableSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-64 pl-10"
              />
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        {enableRowSelection && selectedRows.size > 0 && bulkActions.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {selectedRows.size}
              {' '}
              selected
            </span>
            {bulkActions.map((action, index) => (
              <Button
                key={`bulk-action-${index}`}
                variant={action.variant === 'destructive' ? 'danger' : 'secondary'}
                size="sm"
                onClick={() => action.onClick(selectedRowData)}
                leftIcon={action.icon}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {enableRowSelection && (
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) {
                        el.indeterminate = isIndeterminate;
                      }
                    }}
                    onChange={e => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </TableHead>
              )}
              {columns.map(column => (
                <TableHead key={column.accessorKey}>
                  {column.header}
                </TableHead>
              ))}
              {actions.length > 0 && (
                <TableHead className="w-12">
                  <span className="sr-only">Actions</span>
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0
              ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length + (enableRowSelection ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
                      className="h-24 text-center"
                    >
                      No results found.
                    </TableCell>
                  </TableRow>
                )
              : (
                  filteredData.map((row, index) => {
                    const rowId = index.toString();
                    const isSelected = selectedRows.has(rowId);

                    return (
                      <TableRow key={rowId} data-state={isSelected ? 'selected' : undefined}>
                        {enableRowSelection && (
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={e => handleRowSelect(rowId, e.target.checked)}
                              className="rounded border-gray-300"
                            />
                          </TableCell>
                        )}
                        {columns.map(column => (
                          <TableCell key={column.accessorKey}>
                            {column.cell
                              ? (
                                  column.cell({
                                    row: {
                                      getValue: (key: string) => row[key],
                                      original: row,
                                    },
                                  })
                                )
                              : (
                                  row[column.accessorKey]
                                )}
                          </TableCell>
                        ))}
                        {actions.length > 0 && (
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="size-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {actions.map(action => (
                                  <DropdownMenuItem
                                    key={nanoid()}
                                    onClick={() => action.onClick(row)}
                                    className={cn(
                                      action.variant === 'destructive' && 'text-red-600',
                                    )}
                                  >
                                    {action.icon && (
                                      <span className="mr-2">{action.icon}</span>
                                    )}
                                    {action.label}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })
                )}
          </TableBody>
        </Table>
      </div>

      {/* Footer with pagination info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Showing
          {' '}
          {filteredData.length}
          {' '}
          of
          {' '}
          {data.length}
          {' '}
          results
        </div>
      </div>
    </div>
  );
}
