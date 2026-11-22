'use client';

import React from 'react';
import { ProductPricingScreen } from '@/components/products/ProductPricingScreen';

export default function ProductPricingRouteCreatePage() {
  return (
    <div className="w-full">
      <ProductPricingScreen initialMode="create" />
    </div>
  );
}

