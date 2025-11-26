import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { DESIGN_EDITOR_CONFIG } from '@/components/design-editor/constants';
import { createAppServerClient } from '@/utils/supabase/server-app';

type DesignLayoutProps = {
  children: ReactNode;
};

export default async function DesignLayout({ children }: DesignLayoutProps) {
  const supabase = createAppServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/sign-in');
  }
  return (
    <div className={DESIGN_EDITOR_CONFIG.BACKGROUND_CLASSES.LAYOUT}>
      {/* Elegant background pattern */}
      <div className={DESIGN_EDITOR_CONFIG.BACKGROUND_CLASSES.PATTERN}></div>

      {/* Subtle animated orbs */}
      <div className={DESIGN_EDITOR_CONFIG.BACKGROUND_CLASSES.ORB_1}></div>
      <div className={DESIGN_EDITOR_CONFIG.BACKGROUND_CLASSES.ORB_2}></div>

      {/* Content with relative positioning */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
