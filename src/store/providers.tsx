'use client';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { baseApi } from '@/service/baseApi';
import { compatibilityChangeKey, compatibilityTags } from '@/service/compatibilitySync';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const refreshCompatibility = (event: StorageEvent) => {
      if (event.key === compatibilityChangeKey && event.newValue) {
        store.dispatch(baseApi.util.invalidateTags([...compatibilityTags]));
      }
    };
    window.addEventListener('storage', refreshCompatibility);
    return () => window.removeEventListener('storage', refreshCompatibility);
  }, []);

  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}
