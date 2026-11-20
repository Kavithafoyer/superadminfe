import { useStore } from '@/store/useStore';

/**
 * Hook to check role-based permissions in the template.
 * By default in this template, all standard admin/dashboard permissions return true.
 * Customize according to your upcoming project requirements.
 */
export function usePermission() {
  const { user } = useStore();
  const userRole = (user?.role || 'Admin').toLowerCase();

  const isAdmin = userRole === 'admin' || userRole === 'administrator' || userRole === 'owner';

  return {
    isLoaded: true,
    userRole,
    isAdmin,
    canViewDashboard: true,
    canViewAdminDashboard: true,
    canViewTables: true,
    canViewForms: true,
    canEdit: isAdmin,
    canDelete: isAdmin,
    hasPermission: (_permissionName: string) => true,
  };
}
