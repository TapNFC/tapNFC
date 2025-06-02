import type { ReactNode } from 'react';

type SidebarSectionProps = {
  title: string;
  children: ReactNode;
};

export function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <div className="h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent" />
      </div>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
}
