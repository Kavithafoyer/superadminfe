'use client';

import React from 'react';
import { ProductMasterScreen } from '@/components/products/ProductMasterScreen';

export default function PlansPricingPage() {
  return (
    <div className="w-full">
      <ProductMasterScreen initialTab="plans" />
    </div>
  );
}
