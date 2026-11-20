'use client';

import React from 'react';
import { TenantCreateScreen } from '@/components/tenants/TenantCreateScreen';

export default function TenantCreatePage() {
  return (
    <div className="w-full">
      <TenantCreateScreen mode="create" />
    </div>
  );
}
