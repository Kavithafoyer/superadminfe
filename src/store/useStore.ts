import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import {
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
} from './layoutSlice';

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

export type useStoreType = RootState['layout'] & {
  setMode: (mode: 'light' | 'dark' | 'system') => void;
  setPrimaryColor: (color: string) => void;
  setDensity: (density: 'compact' | 'comfortable') => void;
  setSidebarStyle: (style: 'full' | 'collapsed') => void;
  toggleSidebar: () => void;
  toggleRightPanel: () => void;
  setUserRole: (role: string) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  setSelectedAcademicYear: (year: string) => void;
  setSelectedChild: (child: any | null) => void;
  setChildrenList: (children: any[]) => void;
};

export function useStore(): useStoreType;
export function useStore<T>(selector: (state: useStoreType) => T): T;
export function useStore<T>(selector?: (state: useStoreType) => T): any {
  const dispatch = useDispatch();
  const layoutState = useSelector((state: RootState) => state.layout);

  const actions = {
    setMode: (mode: any) => dispatch(setMode(mode)),
    setPrimaryColor: (color: any) => dispatch(setPrimaryColor(color)),
    setDensity: (density: any) => dispatch(setDensity(density)),
    setSidebarStyle: (style: any) => dispatch(setSidebarStyle(style)),
    toggleSidebar: () => dispatch(toggleSidebar()),
    toggleRightPanel: () => dispatch(toggleRightPanel()),
    setUserRole: (role: any) => dispatch(setUserRole(role)),
    updateUserProfile: (profile: any) => dispatch(updateUserProfile(profile)),
    setSelectedAcademicYear: (year: any) => dispatch(setSelectedAcademicYear(year)),
    setSelectedChild: (child: any) => dispatch(setSelectedChild(child)),
    setChildrenList: (children: any[]) => dispatch(setChildrenList(children)),
  };

  const combined = {
    ...layoutState,
    ...actions,
  };

  if (selector) {
    return selector(combined);
  }

  return combined;
}
