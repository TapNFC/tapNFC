import type { ReactNode } from 'react';

type DesignLayoutProps = {
  children: ReactNode;
};

export default function DesignLayout({ children }: DesignLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/80 to-indigo-100/90">
      {/* Elegant background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(99,102,241,0.15)_1px,transparent_0)] opacity-30 [background-size:20px_20px]"></div>

      {/* Subtle animated orbs */}
      <div className="absolute left-1/4 top-1/4 size-96 animate-pulse rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 size-80 animate-pulse rounded-full bg-gradient-to-r from-indigo-400/20 to-cyan-400/20 blur-3xl delay-1000"></div>

      {/* Content with relative positioning */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
