'use client';

import React from 'react';
import { CustomerMasterScreen } from '@/components/customer/CustomerMasterScreen';

export default function CustomerMasterCreatePage() {
  return (
    <div className="w-full">
      <CustomerMasterScreen initialMode="add_customer" />
    </div>
  );
}
