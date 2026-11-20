'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { ProductMasterOverviewScreen } from '@/components/products/ProductMasterOverviewScreen';

export default function ProductMasterViewPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : 'prd-crm';

  return (
    <div className="w-full">
      <ProductMasterOverviewScreen productId={id} />
    </div>
  );
}
