'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { DesignTypeDialog } from '@/components/design-editor/components/dialogs/DesignTypeDialog';

type NewDesignClientProps = {
  locale: string;
};

export function NewDesignClient({ locale }: NewDesignClientProps) {
  const router = useRouter();
  const [designTypeDialogOpen, setDesignTypeDialogOpen] = useState(true);

  // If dialog is closed without selection, redirect back to designs page
  const handleOpenChange = (open: boolean) => {
    setDesignTypeDialogOpen(open);
    if (!open) {
      router.push(`/${locale}/design`);
    }
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="text-xl font-medium">Preparing design options...</div>
          <div className="mt-2 text-sm text-gray-500">Please select a design type</div>
        </div>
      </div>

      {/* Design Type Dialog */}
      <DesignTypeDialog
        open={designTypeDialogOpen}
        onOpenChange={handleOpenChange}
        locale={locale}
      />
    </>
  );
}
