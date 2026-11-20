import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import { login, logout, rehydrateAuth } from './authSlice';

export type useAuthStoreType = RootState['auth'] & {
  login: () => void;
  logout: () => void;
  rehydrateAuth: () => void;
};

export function useAuthStore(): useAuthStoreType;
export function useAuthStore<T>(selector: (state: useAuthStoreType) => T): T;
export function useAuthStore<T>(selector?: (state: useAuthStoreType) => T): any {
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);

  const actions = {
    login: () => dispatch(login()),
    logout: () => dispatch(logout()),
    rehydrateAuth: () => dispatch(rehydrateAuth()),
  };

  const combined = {
    ...authState,
    ...actions,
  };

  if (selector) {
    return selector(combined);
  }

  return combined;
}
