'use client';

import React, { useState, useMemo } from 'react';
import {
  Users,
  Shield,
  Plus,
  Search,
  RefreshCw,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { toast } from 'sonner';
import {
  useGetRolesListQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetPermissionsListQuery,
  useGetUserAdminListQuery,
  useCreateUserAdminMutation,
  useUpdateUserAdminMutation,
  useDeleteUserAdminMutation,
  RoleRecord,
  UserAdminRecord,
} from '@/service/api/superAdminService';

export default function RolesAndUsersPage() {
  const [activeTab, setActiveTab] = useState<'roles' | 'users'>('roles');

  // Roles Queries & Mutations
  const {
    data: roles = [],
    isLoading: isLoadingRoles,
    refetch: refetchRoles,
    isFetching: isFetchingRoles,
  } = useGetRolesListQuery();
  const { data: permissionsList = [] } = useGetPermissionsListQuery();
  const [createRole, { isLoading: isCreatingRole }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdatingRole }] = useUpdateRoleMutation();
  const [deleteRole, { isLoading: isDeletingRole }] = useDeleteRoleMutation();

  // Users Queries & Mutations
  const {
    data: users = [],
    isLoading: isLoadingUsers,
    refetch: refetchUsers,
    isFetching: isFetchingUsers,
  } = useGetUserAdminListQuery();
  const [createUserAdmin, { isLoading: isCreatingUser }] = useCreateUserAdminMutation();
  const [updateUserAdmin, { isLoading: isUpdatingUser }] = useUpdateUserAdminMutation();
  const [deleteUserAdmin, { isLoading: isDeletingUser }] = useDeleteUserAdminMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Role Form Modals
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleRecord | null>(null);
  const [roleFormData, setRoleFormData] = useState({
    Role_Name: '',
    Role_Description: '',
    permissions: [] as string[],
  });

  // User Form Modals
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAdminRecord | null>(null);
  const [userFormData, setUserFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    role: '',
    password: '',
    is_active: true,
  });

  // Delete State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingType, setDeletingType] = useState<'role' | 'user'>('role');
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  // Filtered Roles
  const filteredRoles = useMemo(() => {
    return roles.filter((r) => {
      const s = searchTerm.toLowerCase();
      return (
        (r.Role_Name || '').toLowerCase().includes(s) ||
        (r.Role_Description || '').toLowerCase().includes(s) ||
        (r.Role_Id || '').toLowerCase().includes(s)
      );
    });
  }, [roles, searchTerm]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const s = searchTerm.toLowerCase();
      const fullName = `${u.first_name || ''} ${u.last_name || ''}`.toLowerCase();
      return (
        (u.username || '').toLowerCase().includes(s) ||
        fullName.includes(s) ||
        (u.email || '').toLowerCase().includes(s) ||
        (u.role || u.Role_Name || '').toLowerCase().includes(s)
      );
    });
  }, [users, searchTerm]);

  // Pagination calculation
  const totalItems = activeTab === 'roles' ? filteredRoles.length : filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  const paginatedRoles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRoles.slice(start, start + itemsPerPage);
  }, [filteredRoles, currentPage]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  // Open Create Role Modal - strictly blank initial state
  const handleOpenCreateRole = () => {
    setEditingRole(null);
    setRoleFormData({
      Role_Name: '',
      Role_Description: '',
      permissions: [],
    });
    setIsRoleModalOpen(true);
  };

  const handleOpenEditRole = (r: RoleRecord) => {
    setEditingRole(r);
    setRoleFormData({
      Role_Name: r.Role_Name || '',
      Role_Description: r.Role_Description || '',
      permissions: Array.isArray(r.permissions) ? [...r.permissions] : [],
    });
    setIsRoleModalOpen(true);
  };

  const handleTogglePermission = (code: string) => {
    setRoleFormData((prev) => {
      const exists = prev.permissions.includes(code);
      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter((p) => p !== code)
          : [...prev.permissions, code],
      };
    });
  };

  const handleRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleFormData.Role_Name.trim()) {
      toast.error('Role Name is required');
      return;
    }

    try {
      if (editingRole) {
        await updateRole({
          id: editingRole.id,
          Role_Id: editingRole.Role_Id,
          Role_Name: roleFormData.Role_Name.trim(),
          Role_Description: roleFormData.Role_Description.trim(),
          permissions: roleFormData.permissions,
        }).unwrap();
        toast.success('Role updated successfully');
      } else {
        await createRole({
          Role_Name: roleFormData.Role_Name.trim(),
          Role_Description: roleFormData.Role_Description.trim(),
          permissions: roleFormData.permissions,
        }).unwrap();
        toast.success('Role created successfully');
      }
      setIsRoleModalOpen(false);
      refetchRoles();
    } catch {
      toast.error('Failed to save role');
    }
  };

  // Open Create User Modal - strictly blank initial state
  const handleOpenCreateUser = () => {
    setEditingUser(null);
    setUserFormData({
      username: '',
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      role: roles.length > 0 ? roles[0].Role_Name : '',
      password: '',
      is_active: true,
    });
    setIsUserModalOpen(true);
  };

  const handleOpenEditUser = (u: UserAdminRecord) => {
    setEditingUser(u);
    setUserFormData({
      username: u.username || '',
      first_name: u.first_name || '',
      last_name: u.last_name || '',
      email: u.email || '',
      phone_number: u.phone_number || '',
      role: u.role || u.Role_Name || '',
      password: '',
      is_active: u.is_active !== false,
    });
    setIsUserModalOpen(true);
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userFormData.username.trim()) {
      toast.error('Username is required');
      return;
    }
    if (!userFormData.email.trim()) {
      toast.error('Email address is required');
      return;
    }
    if (!editingUser && !userFormData.password.trim()) {
      toast.error('Password is required for new user creation');
      return;
    }

    try {
      if (editingUser) {
        await updateUserAdmin({
          id: editingUser.id,
          username: userFormData.username.trim(),
          first_name: userFormData.first_name.trim(),
          last_name: userFormData.last_name.trim(),
          email: userFormData.email.trim(),
          phone_number: userFormData.phone_number.trim(),
          role: userFormData.role,
          Role_Name: userFormData.role,
          is_active: userFormData.is_active,
        }).unwrap();
        toast.success('User updated successfully');
      } else {
        await createUserAdmin({
          username: userFormData.username.trim(),
          first_name: userFormData.first_name.trim(),
          last_name: userFormData.last_name.trim(),
          email: userFormData.email.trim(),
          phone_number: userFormData.phone_number.trim(),
          role: userFormData.role,
          Role_Name: userFormData.role,
          password: userFormData.password.trim(),
          is_active: userFormData.is_active,
        }).unwrap();
        toast.success('User created & invited successfully');
      }
      setIsUserModalOpen(false);
      refetchUsers();
    } catch {
      toast.error('Failed to save user account');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      if (deletingType === 'role') {
        await deleteRole({ id: deletingId }).unwrap();
        toast.success('Role deleted successfully');
        refetchRoles();
      } else {
        await deleteUserAdmin({ id: deletingId }).unwrap();
        toast.success('User deleted successfully');
        refetchUsers();
      }
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
    } catch {
      toast.error(`Failed to delete ${deletingType}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              Roles and Users
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            RBAC security management: Define administrative roles, assign permission policies, and invite staff users
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (activeTab === 'roles') refetchRoles();
              else refetchUsers();
            }}
            disabled={isLoadingRoles || isLoadingUsers || isFetchingRoles || isFetchingUsers}
            className="gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetchingRoles || isFetchingUsers ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>

          {activeTab === 'roles' ? (
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
              onClick={handleOpenCreateRole}
            >
              <Plus className="h-4 w-4" />
              Create Role
            </Button>
          ) : (
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
              onClick={handleOpenCreateUser}
            >
              <UserPlus className="h-4 w-4" />
              Invite User
            </Button>
          )}
        </div>
      </div>

      {/* Tab Switcher & Search Bar */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button
            variant={activeTab === 'roles' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setActiveTab('roles');
              setCurrentPage(1);
            }}
            className={`gap-2 ${activeTab === 'roles' ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}`}
          >
            <Shield className="h-4 w-4" />
            Roles & Permissions ({roles.length})
          </Button>
          <Button
            variant={activeTab === 'users' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setActiveTab('users');
              setCurrentPage(1);
            }}
            className={`gap-2 ${activeTab === 'users' ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}`}
          >
            <Users className="h-4 w-4" />
            Administrative Users ({users.length})
          </Button>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={
              activeTab === 'roles' ? 'Search roles or description...' : 'Search by name, email, or role...'
            }
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9"
          />
        </div>
      </div>

      {/* ROLES TAB */}
      {activeTab === 'roles' && (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/40 border-b border-border text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                <tr>
                  <th className="py-3 px-4">Role Identifier</th>
                  <th className="py-3 px-4">Role Name</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Assigned Users</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoadingRoles ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                      <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-600" />
                      Loading roles matrix...
                    </td>
                  </tr>
                ) : paginatedRoles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                      No roles found matching criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedRoles.map((r) => (
                    <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4 font-mono text-xs font-semibold text-blue-600">
                        {r.Role_Id || `ROL-00${r.id}`}
                      </td>
                      <td className="py-3 px-4 font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-blue-600" />
                          <span>{r.Role_Name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground max-w-sm truncate">
                        {r.Role_Description || '—'}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary" className="text-xs font-normal">
                          {r.user_count || 1} User{r.user_count !== 1 ? 's' : ''}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {r.Created_Date || '2026-01-10'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditRole(r)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-blue-600"
                            title="Edit Role"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setDeletingType('role');
                              setDeletingId(r.id);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-600"
                            title="Delete Role"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Clean Pagination Footer without rows per page selector */}
          <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <div>
              Showing <span className="font-semibold text-foreground">{startIndex}</span> to{' '}
              <span className="font-semibold text-foreground">{endIndex}</span> of{' '}
              <span className="font-semibold text-foreground">{totalItems}</span> entries
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 px-2.5"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-xs font-medium px-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-8 px-2.5"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/40 border-b border-border text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Phone Number</th>
                  <th className="py-3 px-4">Assigned Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoadingUsers ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                      <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-600" />
                      Loading staff users...
                    </td>
                  </tr>
                ) : paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                      No administrative users found matching criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((u) => {
                    const fullName = `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.username;
                    return (
                      <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-medium text-foreground">{fullName}</div>
                          <div className="text-xs text-muted-foreground font-mono">@{u.username}</div>
                        </td>
                        <td className="py-3 px-4 text-xs text-foreground font-mono">{u.email}</td>
                        <td className="py-3 px-4 text-xs text-muted-foreground">
                          {u.phone_number || '—'}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant="secondary"
                            className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-medium"
                          >
                            {u.role || u.Role_Name || 'Staff'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          {u.is_active !== false ? (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium">
                              <XCircle className="h-3.5 w-3.5" />
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenEditUser(u)}
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-blue-600"
                              title="Edit User"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setDeletingType('user');
                                setDeletingId(u.id);
                                setIsDeleteDialogOpen(true);
                              }}
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-600"
                              title="Delete User"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Clean Pagination Footer without rows per page selector */}
          <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <div>
              Showing <span className="font-semibold text-foreground">{startIndex}</span> to{' '}
              <span className="font-semibold text-foreground">{endIndex}</span> of{' '}
              <span className="font-semibold text-foreground">{totalItems}</span> entries
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 px-2.5"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-xs font-medium px-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-8 px-2.5"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Role Add / Edit Modal - Blank Initial State */}
      <Dialog open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              {editingRole ? 'Edit Security Role' : 'Create Security Role'}
            </DialogTitle>
            <DialogDescription>
              Assign role title, scope description, and system functional privileges
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRoleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="Role_Name">
                Role Name <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="Role_Name"
                placeholder="e.g. Operations Manager"
                value={roleFormData.Role_Name}
                onChange={(e) => setRoleFormData({ ...roleFormData, Role_Name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="Role_Description">Role Description</Label>
              <textarea
                id="Role_Description"
                rows={3}
                placeholder="Responsibilities and authorized departments for this role"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={roleFormData.Role_Description}
                onChange={(e) =>
                  setRoleFormData({ ...roleFormData, Role_Description: e.target.value })
                }
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-border">
              <Label className="block font-semibold">Granted Permissions</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border border-input rounded-md p-3 max-h-48 overflow-y-auto bg-background">
                {permissionsList.map((perm) => {
                  const isChecked = roleFormData.permissions.includes(perm.code);
                  return (
                    <label
                      key={perm.id}
                      className="flex items-center gap-2 text-xs p-1.5 hover:bg-muted/40 rounded cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleTogglePermission(perm.code)}
                        className="rounded border-input text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                      />
                      <span className={isChecked ? 'font-medium text-foreground' : 'text-muted-foreground'}>
                        {perm.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRoleModalOpen(false)}
                disabled={isCreatingRole || isUpdatingRole}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isCreatingRole || isUpdatingRole}
              >
                {isCreatingRole || isUpdatingRole
                  ? 'Saving...'
                  : editingRole
                  ? 'Update Role'
                  : 'Create Role'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* User Add / Edit Modal - Blank Initial State */}
      <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-blue-600" />
              {editingUser ? 'Edit User Account' : 'Invite Administrative User'}
            </DialogTitle>
            <DialogDescription>
              Configure platform login credentials and assign security role
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUserSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="username">
                  Username <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="username"
                  placeholder="e.g. jsmith"
                  value={userFormData.username}
                  onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">
                  Email Address <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jsmith@company.com"
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  placeholder="John"
                  value={userFormData.first_name}
                  onChange={(e) => setUserFormData({ ...userFormData, first_name: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  placeholder="Smith"
                  value={userFormData.last_name}
                  onChange={(e) => setUserFormData({ ...userFormData, last_name: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  placeholder="+1 555-0199"
                  value={userFormData.phone_number}
                  onChange={(e) => setUserFormData({ ...userFormData, phone_number: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="userRole">
                  Assigned Security Role <span className="text-rose-500">*</span>
                </Label>
                <select
                  id="userRole"
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={userFormData.role}
                  onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                  required
                >
                  <option value="">Select Role</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.Role_Name}>
                      {r.Role_Name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="userPassword">
                  {editingUser ? 'Reset Password (optional)' : 'Initial Password'} {!editingUser && <span className="text-rose-500">*</span>}
                </Label>
                <Input
                  id="userPassword"
                  type="password"
                  placeholder={editingUser ? 'Leave blank to preserve password' : 'Enter initial password'}
                  value={userFormData.password}
                  onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                  required={!editingUser}
                />
              </div>

              <div className="flex items-center gap-2 pt-2 md:col-span-2">
                <input
                  type="checkbox"
                  id="userActive"
                  checked={userFormData.is_active}
                  onChange={(e) => setUserFormData({ ...userFormData, is_active: e.target.checked })}
                  className="rounded border-input text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <Label htmlFor="userActive" className="cursor-pointer text-sm font-normal">
                  Account is active and authorized to log in
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsUserModalOpen(false)}
                disabled={isCreatingUser || isUpdatingUser}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isCreatingUser || isUpdatingUser}
              >
                {isCreatingUser || isUpdatingUser
                  ? 'Saving...'
                  : editingUser
                  ? 'Update User'
                  : 'Invite User'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeletingRole || isDeletingUser}
        title={deletingType === 'role' ? 'Delete Security Role' : 'Delete User Account'}
        description={`Are you sure you want to delete this ${deletingType}? This action cannot be undone.`}
      />
    </div>
  );
}
