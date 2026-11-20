'use client';

import React from 'react';
import { ProductMasterCreateScreen } from '@/components/products/ProductMasterCreateScreen';

export default function ProductMasterCreatePage() {
  return (
    <div className="w-full">
      <ProductMasterCreateScreen mode="create" />
    </div>
  );
}
