'use client';

import React from 'react';
import { TenantMasterListScreen } from '@/components/tenants/TenantMasterListScreen';

export default function TenantCreatePage() {
  return (
    <div className="w-full">
      <TenantMasterListScreen initialMode="create" />
    </div>
  );
}
