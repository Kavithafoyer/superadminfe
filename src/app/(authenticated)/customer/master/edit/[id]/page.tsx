'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { CustomerMasterScreen } from '@/components/customer/CustomerMasterScreen';

export default function CustomerMasterEditPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : 'cust-1';

  return (
    <div className="w-full">
      <CustomerMasterScreen initialMode="edit_customer" initialCustomerId={id} />
    </div>
  );
}
