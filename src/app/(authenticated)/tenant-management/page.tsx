'use client';

import React from 'react';
import { TenantMasterListScreen } from '@/components/tenants/TenantMasterListScreen';

export default function TenantManagementRootPage() {
  return (
    <div className="w-full">
      <TenantMasterListScreen />
    </div>
  );
}
