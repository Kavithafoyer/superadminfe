export const compatibilityChangeKey = 'addon-compatibility-change';
export const compatibilityTags = ['AddonMaster', 'AddonProductCompatibility'] as const;

export async function broadcastCompatibilityChange(_: unknown, { queryFulfilled }: { queryFulfilled: PromiseLike<unknown> }) {
  try {
    await queryFulfilled;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(compatibilityChangeKey, `${Date.now()}:${Math.random()}`);
    }
  } catch {
    // Failed saves and unavailable browser storage do not need a cross-tab refresh.
  }
}
