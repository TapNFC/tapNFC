import type { ReactNode } from 'react';

type PreviewLayoutProps = {
  children: ReactNode;
};

export default function PreviewLayout({ children }: PreviewLayoutProps) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
