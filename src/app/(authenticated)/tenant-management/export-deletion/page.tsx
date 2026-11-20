'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { TenantManagementScreen } from '@/components/tenants/TenantManagementScreen';
import { TenantRetentionPolicyScreen } from '@/components/tenants/TenantRetentionPolicyScreen';

function TenantExportDeletionContent() {
  const searchParams = useSearchParams();
  const tab = searchParams?.get('tab');

  if (tab === 'policy' || tab === 'data-retention' || tab === 'retention') {
    return <TenantRetentionPolicyScreen />;
  }

  return <TenantManagementScreen initialTab="export-deletion" />;
}

export default function TenantExportDeletionPage() {
  return (
    <div className="w-full">
      <Suspense fallback={<div className="p-4 text-xs text-slate-500">Loading...</div>}>
        <TenantExportDeletionContent />
      </Suspense>
    </div>
  );
}
