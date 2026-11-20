'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { TenantOverviewScreen } from '@/components/tenants/TenantOverviewScreen';

export default function TenantViewPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : 'TEN-00481';

  return (
    <div className="w-full">
      <TenantOverviewScreen tenantId={id} />
    </div>
  );
}
