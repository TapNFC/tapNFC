import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CustomersClient } from '@/components/customers/customers-client';

export const metadata: Metadata = {
  title: 'Customer Profiles',
  description: 'Manage customer profiles with unique QR codes',
};

export default function CustomersPage() {
  return (
    <Suspense fallback={(
      <div className="flex h-64 w-full items-center justify-center">
        <div className="flex flex-col items-center space-y-2">
          <div className="text-center">
            <div className="size-8 animate-spin rounded-full border-y-2 border-emerald-500"></div>
          </div>
          <div className="text-sm text-slate-500">Loading customer data...</div>
        </div>
      </div>
    )}
    >
      <CustomersClient />
    </Suspense>
  );
}
