'use client';

import React, { use } from 'react';
import { SubscriptionPlanOverviewScreen } from '@/components/subscriptions/SubscriptionPlanOverviewScreen';

export default function SubscriptionsViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  return <SubscriptionPlanOverviewScreen planId={unwrappedParams?.id || 'professional'} />;
}
