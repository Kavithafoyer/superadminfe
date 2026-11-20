'use client';

import React from 'react';
import { TenantManagementScreen } from '@/components/tenants/TenantManagementScreen';

export default function TenantSettingsPage() {
  return (
    <div className="w-full">
      <TenantManagementScreen initialTab="settings" />
    </div>
  );
}
