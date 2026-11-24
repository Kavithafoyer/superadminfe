import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
}

const getInitialState = (): AuthState => {
  if (typeof window !== 'undefined') {
    try {
      const hasToken = ['token', 'accesstoken', 'access_token'].some((key) => {
        const token = localStorage.getItem(key)?.trim();
        return Boolean(token && token !== 'null' && token !== 'undefined');
      });
      return { isAuthenticated: hasToken };
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
        state.isAuthenticated = getInitialState().isAuthenticated;
        if (state.isAuthenticated) {
          sessionStorage.setItem('auth-storage', JSON.stringify({ state: { isAuthenticated: true } }));
        } else {
          sessionStorage.removeItem('auth-storage');
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
