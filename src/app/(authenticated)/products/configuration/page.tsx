'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductConfigurationScreen } from '@/components/products/ProductConfigurationScreen';

export default function ProductConfigurationPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') as any;

  return (
    <div className="w-full">
      <ProductConfigurationScreen initialTab={tab || 'features'} />
    </div>
  );
}
