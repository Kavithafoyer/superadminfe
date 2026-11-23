'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { ProductMasterScreen } from '@/components/products/ProductMasterScreen';

export default function ProductMasterEditPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : 'prd-edu';

  return (
    <div className="w-full">
      <ProductMasterScreen initialMode="edit_product" initialProductId={id} />
    </div>
  );
}
