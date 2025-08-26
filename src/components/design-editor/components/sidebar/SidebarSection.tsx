import type { ReactNode } from 'react';

type SidebarSectionProps = {
  title: string;
  children: ReactNode;
};

export function SidebarSection({ children }: SidebarSectionProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
}
