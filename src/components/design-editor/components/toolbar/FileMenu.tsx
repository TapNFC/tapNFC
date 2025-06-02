import { ChevronDown, FolderOpen, QrCode, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type FileMenuProps = {
  onSaveTemplate: () => void;
  onLoadTemplate: () => void;
  onExport: () => void;
};

export function FileMenu({ onSaveTemplate, onLoadTemplate, onExport }: FileMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-1 text-slate-300 hover:bg-white/10 hover:text-white">
          <span className="font-medium">File</span>
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Template</DropdownMenuLabel>
        <DropdownMenuItem onClick={onSaveTemplate}>
          <Save className="mr-2 size-4" />
          Save as Template
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onLoadTemplate}>
          <FolderOpen className="mr-2 size-4" />
          Load Template
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onExport}>
          <QrCode className="mr-2 size-4" />
          Generate QR Code
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
