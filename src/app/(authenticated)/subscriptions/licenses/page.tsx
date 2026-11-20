import { redirect } from 'next/navigation';

export default function SubscriptionsLicensesRedirectPage() {
  redirect('/products/license-entitlements');
}
