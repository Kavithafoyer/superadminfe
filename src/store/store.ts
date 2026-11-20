import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import layoutReducer from './layoutSlice';
import { baseApi } from '@/service/baseApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    layout: layoutReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
