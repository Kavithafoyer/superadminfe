export const compatibilityChangeKey = 'addon-compatibility-change';
export const compatibilityTags = ['AddonMaster', 'AddonProductCompatibility'] as const;

export const pricingChangeKey = 'addon-pricing-change';
export const pricingTags = ['AddonMaster', 'AddonPricing', 'AddonPriceTemplates', 'AddonTieredPricing'] as const;

type MutationLifecycle = { queryFulfilled: PromiseLike<unknown> };

export function broadcastCompatibilityChange(_: unknown, lifecycle: MutationLifecycle) {
  return broadcastChange(compatibilityChangeKey, lifecycle);
}

export function broadcastPricingChange(_: unknown, lifecycle: MutationLifecycle) {
  return broadcastChange(pricingChangeKey, lifecycle);
}

async function broadcastChange(key: string, { queryFulfilled }: MutationLifecycle) {
  try {
    await queryFulfilled;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, `${Date.now()}:${Math.random()}`);
    }
  } catch {
    // Failed saves and unavailable browser storage do not need a cross-tab refresh.
  }
}
