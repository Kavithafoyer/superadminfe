'use client';

import React from 'react';
import { CustomerMasterScreen } from '@/components/customer/CustomerMasterScreen';

export default function RenewalsExpiryPage() {
  return (
    <div className="w-full">
      {/* Opens Customer Master directly in Renewals & Billing subtab mode */}
      <CustomerMasterScreen initialSubTab="Renewals & Billing" />
    </div>
  );
}
