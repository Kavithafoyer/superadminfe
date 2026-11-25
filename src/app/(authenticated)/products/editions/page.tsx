'use client';

import React, { Suspense } from 'react';
import { ProductEditionsScreen } from '@/components/products/ProductEditionsScreen';

export default function EditionsPage() {
  return (
    <div className="w-full">
      <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading Editions...</div>}>
        <ProductEditionsScreen />
      </Suspense>
    </div>
  );
}
