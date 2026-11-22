'use client';

import React from 'react';
import { ProductMasterScreen } from '@/components/products/ProductMasterScreen';

export default function ProductMasterCreatePage() {
  return (
    <div className="w-full">
      <ProductMasterScreen initialMode="add_product" />
    </div>
  );
}
