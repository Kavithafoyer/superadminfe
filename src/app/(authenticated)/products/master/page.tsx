'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductMasterScreen } from '@/components/products/ProductMasterScreen';

export default function ProductMasterPage() {
  const searchParams = useSearchParams();
  const queryTab = searchParams.get('tab') as 'details' | 'editions' | 'features' | 'plans' | null;

  return (
    <div className="w-full">
      <ProductMasterScreen initialTab={queryTab || 'details'} />
    </div>
  );
}
