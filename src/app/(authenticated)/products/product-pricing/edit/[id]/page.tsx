'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { ProductPricingScreen } from '@/components/products/ProductPricingScreen';

export default function ProductPricingRouteEditPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : undefined;

  return (
    <div className="w-full">
      <ProductPricingScreen initialMode="edit" initialPricingId={id} />
    </div>
  );
}

