'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CustomerOverviewScreen } from '@/components/customer/CustomerOverviewScreen';
import { Loader2 } from 'lucide-react';

function CustomerOverviewContent() {
  const searchParams = useSearchParams();
  const customerId = searchParams.get('id') || searchParams.get('customerId') || undefined;
  return <CustomerOverviewScreen customerId={customerId} />;
}

export default function CustomerOverviewPage() {
  return (
    <div className="w-full">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin text-[#6366f1]" />
            <p className="text-sm font-medium">Loading customer overview...</p>
          </div>
        }
      >
        <CustomerOverviewContent />
      </Suspense>
    </div>
  );
}
