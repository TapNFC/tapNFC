'use client';

import { QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const EmptyState = ({ onClearSearch }: { onClearSearch: () => void }) => (
  <div className="py-12 text-center">
    <div className="mx-auto mb-4 flex size-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
      <QrCode className="size-8 text-gray-400" />
    </div>
    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
      No QR codes found
    </h3>
    <p className="mb-4 text-gray-600 dark:text-gray-400">
      Try adjusting your search query
    </p>
    <Button
      variant="outline"
      onClick={onClearSearch}
      className="shadow-sm transition-all hover:shadow"
    >
      Clear Search
    </Button>
  </div>
);
