import { ChevronDown, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type ExportButtonProps = {
  onExport: (format?: string) => void;
};

export function ExportButton({ onExport }: ExportButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700">
          <Download className="size-4" />
          <span>Export</span>
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onExport('png')}>
          Export as PNG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onExport('jpg')}>
          Export as JPG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onExport('svg')}>
          Export as SVG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onExport('pdf')}>
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
