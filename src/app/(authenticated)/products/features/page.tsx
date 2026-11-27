import { redirect } from 'next/navigation';

export default async function FeatureMasterPage({ searchParams }: {
  searchParams: Promise<{ product?: string | string[]; mode?: string | string[]; module?: string | string[] }>;
}) {
  const { product, mode, module: moduleId } = await searchParams;
  const params = new URLSearchParams({ tab: 'features' });
  if (typeof product === 'string') params.set('product', product);
  if (typeof moduleId === 'string') params.set('module', moduleId);
  if (mode === 'add') params.set('mode', mode);
  redirect('/products/features-modules?' + params.toString());
}
