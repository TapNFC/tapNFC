import { FileText } from 'lucide-react';

type StatusIndicatorProps = {
  currentTemplateName?: string;
};

export function StatusIndicator({ currentTemplateName }: StatusIndicatorProps) {
  return (
    <div className="flex items-center space-x-2 text-sm ">

      {currentTemplateName && (
        <div className="flex items-center space-x-1">
          <FileText className="size-3" />
          <span className="w-40 truncate text-xs">
            Template:
            {currentTemplateName}
          </span>
        </div>
      )}
    </div>
  );
}
