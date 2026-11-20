'use client';

import React from 'react';
import { TenantManagementScreen } from '@/components/tenants/TenantManagementScreen';

export default function TenantRegistrationPage() {
  return (
    <div className="w-full">
      <TenantManagementScreen initialTab="registration" />
    </div>
  );
}
