'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { ProductMasterCreateScreen } from '@/components/products/ProductMasterCreateScreen';

export default function ProductMasterEditPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : 'prd-crm';

  return (
    <div className="w-full">
      <ProductMasterCreateScreen mode="edit" productId={id} />
    </div>
  );
}
