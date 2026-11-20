'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { CustomerOverviewScreen } from '@/components/customer/CustomerOverviewScreen';

export default function CustomerMasterViewPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : 'CUST-8812';

  return (
    <div className="w-full">
      <CustomerOverviewScreen customerId={id} />
    </div>
  );
}
