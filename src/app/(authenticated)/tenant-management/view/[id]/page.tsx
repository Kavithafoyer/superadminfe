'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { TenantMasterListScreen } from '@/components/tenants/TenantMasterListScreen';

export default function TenantViewPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : undefined;

  return (
    <div className="w-full">
      <TenantMasterListScreen initialMode="overview" initialTenantId={id} />
    </div>
  );
}
