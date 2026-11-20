'use client';

import React from 'react';
import { ProductMasterScreen } from '@/components/products/ProductMasterScreen';

export default function EditionsPage() {
  return (
    <div className="w-full">
      <ProductMasterScreen initialTab="editions" />
    </div>
  );
}
