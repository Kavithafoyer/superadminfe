'use client';

import { skipToken } from '@reduxjs/toolkit/query';
import { useGetEditionProductsQuery } from '@/service/api/productEditionApi';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductMasterScreen } from '@/components/products/ProductMasterScreen';

function ProductMasterRoute() {
  const params = useSearchParams();
  const product = params.get('product') ?? undefined;
  const mode = params.get('mode') === 'add' ? 'add_product' : 'edit_product';
  const numericId = mode !== 'add_product' && product && /^\d+$/.test(product) ? product : undefined;
  const live = useGetEditionProductsQuery(numericId ? undefined : skipToken);
  const record = live.data?.find(item => String(item.id) === numericId);
  if (numericId && live.isLoading) return <p role="status">Loading the selected product...</p>;
  const selection = record?.Product_Code || record?.Product_Name || product;
  return <>
    {numericId && live.isError && <p role="alert" className="mb-3 text-sm text-destructive">Could not resolve the selected product. <button type="button" className="underline" onClick={() => void live.refetch()}>Retry</button></p>}
    <ProductMasterScreen key={mode + ':' + (selection ?? '')} initialMode={mode} initialProductId={selection} />
  </>;
}

export default function ProductMasterMainPage() {
  return <Suspense fallback={<p role="status">Loading products...</p>}><ProductMasterRoute /></Suspense>;
}
