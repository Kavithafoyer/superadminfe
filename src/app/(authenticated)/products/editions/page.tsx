'use client';

import React, { Suspense } from 'react';
import { ProductEditionsScreen } from '@/components/products/ProductEditionsScreen';

export default function EditionsPage() {
  return (
    <div className="w-full">
      <Suspense fallback={null}>
        <ProductEditionsScreen />
      </Suspense>
    </div>
  );
}
