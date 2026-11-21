import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserProfile {
  id?: string | number;
  name: string;
  username?: string;
  email: string;
  avatarUrl: string;
  jobTitle: string;
  role: string;
  phone: string;
  location: string;
  workspace: string;
  workspaceRole: string;
  bio: string;
  organizationId?: number;
}

interface LayoutState {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  density: 'compact' | 'comfortable';
  sidebarStyle: 'full' | 'collapsed';
  isSidebarOpen: boolean;
  isRightPanelOpen: boolean;
  user: UserProfile;
  selectedAcademicYear: string;
  selectedChild: any | null;
  childrenList: any[];
}

const getInitialState = (): LayoutState => {
  let mode: 'light' | 'dark' | 'system' = 'light';
  let primaryColor = '#6222cc';
  let density: 'compact' | 'comfortable' = 'comfortable';
  let sidebarStyle: 'full' | 'collapsed' = 'full';
  let isSidebarOpen = true;
  let isRightPanelOpen = false;
  let selectedChild: any = null;
  let childrenList: any[] = [];

  if (typeof window !== 'undefined') {
    try {
      const persisted = localStorage.getItem('theme-storage');
      if (persisted) {
        const parsed = JSON.parse(persisted);
        if (parsed && parsed.state) {
          if (parsed.state.mode) mode = parsed.state.mode;
          if (parsed.state.primaryColor) {
            primaryColor = (parsed.state.primaryColor === '#6366f1' || parsed.state.primaryColor === '#4f46e5' || parsed.state.primaryColor === '#0565FD' || parsed.state.primaryColor === '#1574fe')
              ? '#6222cc'
              : parsed.state.primaryColor;
          }
          if (parsed.state.density) density = parsed.state.density;
          if (parsed.state.sidebarStyle) sidebarStyle = parsed.state.sidebarStyle;
          if (typeof parsed.state.isSidebarOpen === 'boolean') isSidebarOpen = parsed.state.isSidebarOpen;
          if (typeof parsed.state.isRightPanelOpen === 'boolean') isRightPanelOpen = parsed.state.isRightPanelOpen;
        }
      }
      const savedChild = localStorage.getItem('selectedChild');
      if (savedChild) selectedChild = JSON.parse(savedChild);
      const savedList = localStorage.getItem('childrenList');
      if (savedList) childrenList = JSON.parse(savedList);
    } catch (e) {
      console.error(e);
    }
  }

  const user: UserProfile = (typeof window !== 'undefined' && localStorage.getItem('userData'))
    ? JSON.parse(localStorage.getItem('userData')!)
    : {
      name: 'Admin User',
      email: 'admin@example.com',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      jobTitle: 'System Administrator',
      role: 'Administrator',
      phone: '+1 (555) 019-2834',
      location: 'San Francisco, CA',
      workspace: 'main-workspace',
      workspaceRole: 'Owner',
      bio: 'System Administrator and Lead Architect.',
    };

  let selectedAcademicYear = '';
  if (typeof window !== 'undefined') {
    selectedAcademicYear = localStorage.getItem('selectedAcademicYear') || '';
  }

  return {
    mode,
    primaryColor,
    density,
    sidebarStyle,
    isSidebarOpen,
    isRightPanelOpen,
    user,
    selectedAcademicYear,
    selectedChild,
    childrenList,
  };
};

const saveToLocalStorage = (state: LayoutState) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('theme-storage', JSON.stringify({
        state: {
          mode: state.mode,
          primaryColor: state.primaryColor,
          density: state.density,
          sidebarStyle: state.sidebarStyle,
          isSidebarOpen: state.isSidebarOpen,
          isRightPanelOpen: state.isRightPanelOpen,
        }
      }));
    } catch (e) {
      console.error(e);
    }
  }
};

const layoutSlice = createSlice({
  name: 'layout',
  initialState: getInitialState(),
  reducers: {
    setMode: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.mode = action.payload;
      saveToLocalStorage(state);
    },
    setPrimaryColor: (state, action: PayloadAction<string>) => {
      state.primaryColor = action.payload;
      saveToLocalStorage(state);
    },
    setDensity: (state, action: PayloadAction<'compact' | 'comfortable'>) => {
      state.density = action.payload;
      saveToLocalStorage(state);
    },
    setSidebarStyle: (state, action: PayloadAction<'full' | 'collapsed'>) => {
      state.sidebarStyle = action.payload;
      saveToLocalStorage(state);
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
      saveToLocalStorage(state);
    },
    toggleRightPanel: (state) => {
      state.isRightPanelOpen = !state.isRightPanelOpen;
      saveToLocalStorage(state);
    },
    setUserRole: (state, action: PayloadAction<string>) => {
      state.user.role = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('userData', JSON.stringify(state.user));
      }
    },
    updateUserProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      state.user = { ...state.user, ...action.payload };
      if (typeof window !== 'undefined') {
        localStorage.setItem('userData', JSON.stringify(state.user));
      }
    },
    setSelectedAcademicYear: (state, action: PayloadAction<string>) => {
      state.selectedAcademicYear = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('selectedAcademicYear', action.payload);
      }
    },
    setSelectedChild: (state, action: PayloadAction<any | null>) => {
      state.selectedChild = action.payload;
      if (typeof window !== 'undefined') {
        if (action.payload) {
          localStorage.setItem('selectedChild', JSON.stringify(action.payload));
        } else {
          localStorage.removeItem('selectedChild');
        }
      }
    },
    setChildrenList: (state, action: PayloadAction<any[]>) => {
      state.childrenList = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('childrenList', JSON.stringify(action.payload));
      }
    },
  },
});

export const {
  setMode,
  setPrimaryColor,
  setDensity,
  setSidebarStyle,
  toggleSidebar,
  toggleRightPanel,
  setUserRole,
  updateUserProfile,
  setSelectedAcademicYear,
  setSelectedChild,
  setChildrenList,
} = layoutSlice.actions;

export default layoutSlice.reducer;
