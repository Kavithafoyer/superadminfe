'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { ProductCategoryScreen } from '@/components/products/ProductCategoryScreen';

export default function ProductCategoryEditPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : 'pcat-edu';

  return (
    <div className="w-full">
      <ProductCategoryScreen initialMode="edit_category" initialCategoryId={id} />
    </div>
  );
}
