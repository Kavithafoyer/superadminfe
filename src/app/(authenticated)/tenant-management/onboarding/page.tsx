'use client';

import React from 'react';
import { TenantManagementScreen } from '@/components/tenants/TenantManagementScreen';

export default function TenantOnboardingPage() {
  return (
    <div className="w-full">
      <TenantManagementScreen initialTab="onboarding" />
    </div>
  );
}
