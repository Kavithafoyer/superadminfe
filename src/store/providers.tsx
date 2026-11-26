'use client';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { baseApi } from '@/service/baseApi';
import { compatibilityChangeKey, compatibilityTags, pricingChangeKey, pricingTags } from '@/service/compatibilitySync';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const refreshMarketplace = (event: StorageEvent) => {
      if (event.key === compatibilityChangeKey && event.newValue) {
        store.dispatch(baseApi.util.invalidateTags([...compatibilityTags]));
      }
      if (event.key === pricingChangeKey && event.newValue) {
        store.dispatch(baseApi.util.invalidateTags([...pricingTags]));
      }
    };
    window.addEventListener('storage', refreshMarketplace);
    return () => window.removeEventListener('storage', refreshMarketplace);
  }, []);

  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}
