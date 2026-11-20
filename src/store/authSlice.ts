import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
}

const getInitialState = (): AuthState => {
  if (typeof window !== 'undefined') {
    try {
      // 1. Direct token check matching legacy superadminfe (localStorage.getItem("accesstoken"))
      const token = localStorage.getItem('token') || localStorage.getItem('accesstoken');
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (token && (isLoggedIn === 'true' || token.length > 5)) {
        return { isAuthenticated: true };
      }

      // 2. Persisted session check
      const persisted = sessionStorage.getItem('auth-storage');
      if (persisted) {
        const parsed = JSON.parse(persisted);
        if (parsed?.state?.isAuthenticated) {
          return { isAuthenticated: true };
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
  return { isAuthenticated: false };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    rehydrateAuth: (state) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token') || localStorage.getItem('accesstoken');
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (token && (isLoggedIn === 'true' || token.length > 5)) {
          state.isAuthenticated = true;
          sessionStorage.setItem('auth-storage', JSON.stringify({ state: { isAuthenticated: true } }));
        }
      }
    },
    login: (state) => {
      state.isAuthenticated = true;
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('auth-storage', JSON.stringify({ state: { isAuthenticated: true } }));
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('accesstoken');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refreshtoken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('session_id');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('designation');
        sessionStorage.removeItem('auth-storage');
      }
    },
  },
});

export const { login, logout, rehydrateAuth } = authSlice.actions;
export default authSlice.reducer;
