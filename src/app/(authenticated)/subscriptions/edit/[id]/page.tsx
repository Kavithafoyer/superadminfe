'use client';

import React, { use } from 'react';
import { SubscriptionPlanCreateScreen } from '@/components/subscriptions/SubscriptionPlanCreateScreen';

export default function SubscriptionsEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  return <SubscriptionPlanCreateScreen mode="edit" planId={unwrappedParams?.id || 'professional'} />;
}
