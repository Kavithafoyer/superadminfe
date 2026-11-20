'use client';

import React from 'react';
import { CustomerCreateScreen } from '@/components/customer/CustomerCreateScreen';

export default function CustomerMasterCreatePage() {
  return (
    <div className="w-full">
      <CustomerCreateScreen mode="create" />
    </div>
  );
}
