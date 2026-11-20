'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { TenantCreateScreen } from '@/components/tenants/TenantCreateScreen';

export default function TenantEditPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : 'TEN-00481';

  return (
    <div className="w-full">
      <TenantCreateScreen mode="edit" tenantId={id} />
    </div>
  );
}
