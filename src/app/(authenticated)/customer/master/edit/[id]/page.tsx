'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { CustomerCreateScreen } from '@/components/customer/CustomerCreateScreen';

export default function CustomerMasterEditPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : 'CUST-8812';

  return (
    <div className="w-full">
      <CustomerCreateScreen mode="edit" customerId={id} />
    </div>
  );
}
