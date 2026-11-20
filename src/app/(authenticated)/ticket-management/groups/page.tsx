'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useParams, useSearchParams } from 'next/navigation';
import {
  Users,
  Plus,
  Search,
  RefreshCw,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Shield,
  Ticket,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Save,
  Tag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { toast } from 'sonner';
import {
  useGetTicketGroupsListQuery,
  useCreateTicketGroupMutation,
  useUpdateTicketGroupMutation,
  useDeleteTicketGroupMutation,
  useGetTicketRelatedLookupsQuery,
  useGetCRMUsersListQuery,
  TicketGroupRecord,
} from '@/service/api/superAdminService';

const AVAILABLE_TAGS = ['Support', 'Operations', 'Tier 1', 'Tier 2', 'Tier 3', 'Escalation', 'Security', 'Billing'];

export default function TicketManagementGroupsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();

  const isCreateRoute = pathname?.endsWith('/create') || searchParams.get('mode') === 'create' || searchParams.get('action') === 'create';
  const isEditRoute = pathname?.includes('/edit') || searchParams.get('mode') === 'edit' || searchParams.get('action') === 'edit';
  const routeEditId = (params?.id as string) || (pathname?.includes('/edit/') ? pathname.split('/edit/')[1]?.split('/')[0]?.split('?')[0] : undefined);

  const { data: groups = [], isLoading, refetch, isFetching } = useGetTicketGroupsListQuery();
  const { data: lookups = [] } = useGetTicketRelatedLookupsQuery();
  const { data: crmUsers = [] } = useGetCRMUsersListQuery();

  const [createTicketGroup, { isLoading: isCreating }] = useCreateTicketGroupMutation();
  const [updateTicketGroup, { isLoading: isUpdating }] = useUpdateTicketGroupMutation();
  const [deleteTicketGroup, { isLoading: isDeleting }] = useDeleteTicketGroupMutation();

  // Full-page view mode: 'list' | 'create' | 'edit' (Route-driven to preserve on refresh)
  const [internalViewMode, setInternalViewMode] = useState<'list' | 'create' | 'edit'>('list');
  const viewMode: 'list' | 'create' | 'edit' = isCreateRoute ? 'create' : (isEditRoute ? 'edit' : internalViewMode);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals & Selection
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<TicketGroupRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  // Form State - strictly empty strings initial state, no static prefilled fallbacks
  const [formData, setFormData] = useState({
    Related_to: '',
    Members: [] as string[],
    allow: false,
    selectedTags: [] as string[],
    notes: '',
  });

  // Filter groups
  const filteredGroups = useMemo(() => {
    return groups.filter((g) => {
      const term = searchTerm.toLowerCase();
      const matchRelated = (g.Related_to || g.TicketRelatesto || '').toLowerCase().includes(term);
      const matchMembers = (g.Members || []).some((m) => m.toLowerCase().includes(term));
      return matchRelated || matchMembers;
    });
  }, [groups, searchTerm]);

  // Pagination (no rows per page selector)
  const totalItems = filteredGroups.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const paginatedGroups = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredGroups.slice(start, start + itemsPerPage);
  }, [filteredGroups, currentPage]);

  // Auto-populate formData when directly visiting or refreshing on an edit page (/ticket-management/groups/edit/:id)
  useEffect(() => {
    if (isEditRoute && routeEditId && groups.length > 0) {
      const group = groups.find((g: any) => String(g.id) === String(routeEditId));
      if (group && (!editingGroup || String(editingGroup.id) !== String(group.id))) {
        setEditingGroup(group);
        setFormData({
          Related_to: group.Related_to || group.TicketRelatesto || '',
          Members: Array.isArray(group.Members) ? [...group.Members] : [],
          allow: Boolean(group.allow),
          selectedTags: [],
          notes: '',
        });
      }
    }
  }, [isEditRoute, routeEditId, groups, editingGroup]);

  const handleOpenCreate = () => {
    setEditingGroup(null);
    setFormData({
      Related_to: '',
      Members: [],
      allow: false,
      selectedTags: [],
      notes: '',
    });
    setInternalViewMode('create');
    router.push('/ticket-management/groups/create');
  };

  const handleOpenEdit = (group: TicketGroupRecord) => {
    setEditingGroup(group);
    setFormData({
      Related_to: group.Related_to || group.TicketRelatesto || '',
      Members: Array.isArray(group.Members) ? [...group.Members] : [],
      allow: Boolean(group.allow),
      selectedTags: [],
      notes: '',
    });
    setInternalViewMode('edit');
    router.push(`/ticket-management/groups/edit/${group.id}`);
  };

  const handleBackToList = () => {
    setInternalViewMode('list');
    router.push('/ticket-management/groups');
  };

  const handleToggleMember = (userName: string) => {
    setFormData((prev) => {
      const exists = prev.Members.includes(userName);
      return {
        ...prev,
        Members: exists
          ? prev.Members.filter((m) => m !== userName)
          : [...prev.Members, userName],
      };
    });
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter(item => item !== tag)
        : [...prev.selectedTags, tag]
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.Related_to.trim()) {
      toast.error('Ticket Related To category is required');
      return;
    }
    if (formData.Members.length === 0) {
      toast.error('Please assign at least one member to this group');
      return;
    }

    try {
      if (viewMode === 'edit' && editingGroup) {
        await updateTicketGroup({
          id: editingGroup.id,
          Related_to: formData.Related_to.trim(),
          TicketRelatesto: formData.Related_to.trim(),
          Members: formData.Members,
          allow: formData.allow,
        }).unwrap();
        toast.success('Ticket management group updated successfully');
      } else {
        await createTicketGroup({
          Related_to: formData.Related_to.trim(),
          TicketRelatesto: formData.Related_to.trim(),
          Members: formData.Members,
          allow: formData.allow,
        }).unwrap();
        toast.success('Ticket management group created successfully');
      }
      handleBackToList();
      refetch();
    } catch {
      toast.error('Failed to save ticket group');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await deleteTicketGroup({ id: deletingId }).unwrap();
      toast.success('Ticket group deleted successfully');
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
      refetch();
    } catch {
      toast.error('Failed to delete ticket group');
    }
  };

  // ----------------------------------------------------------------------
  // FULL-PAGE CREATE / EDIT VIEW (CBS PEGATTO FORMAT, NO POPUPS)
  // ----------------------------------------------------------------------
  if (viewMode === 'create' || viewMode === 'edit') {
    const isEdit = viewMode === 'edit';
    return (
      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Top Header Bar matching CBS Pegatto */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-border/50">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleBackToList}
              className="h-9 w-9 rounded-full border border-border bg-background hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                <span className="hover:underline cursor-pointer" onClick={handleBackToList}>
                  Ticket Management
                </span>
                <span>/</span>
                <span className="text-foreground">
                  {isEdit ? 'Edit Group Mapping' : 'Create Group Mapping'}
                </span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground mt-0.5">
                {isEdit ? `Edit Ticket Group: ${formData.Related_to || 'Selected Group'}` : 'Create Ticket Management Group'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              type="button"
              variant="outline"
              onClick={handleBackToList}
              disabled={isCreating || isUpdating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating || isUpdating}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-5"
            >
              <Save className="h-4 w-4" />
              {isCreating || isUpdating ? 'Saving...' : isEdit ? 'Save Changes' : 'Save Group'}
            </Button>
          </div>
        </div>

        {/* Two-Column CBS Pegatto Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Card 1: CATEGORY SPECIFICATIONS */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  ROUTING CATEGORY SPECIFICATIONS
                </h3>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="Related_to" className="text-xs font-semibold uppercase tracking-wider">
                    TICKET RELATED TO CATEGORY <span className="text-rose-500">*</span>
                  </Label>
                  <select
                    id="Related_to"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.Related_to}
                    onChange={(e) => setFormData({ ...formData, Related_to: e.target.value })}
                    required
                  >
                    <option value="">Select Related Category</option>
                    {lookups.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="Billing & Invoicing">Billing & Invoicing</option>
                    <option value="Storage Master">Storage Master</option>
                    <option value="Role & Permissions">Role & Permissions</option>
                    <option value="System Preference">System Preference</option>
                    <option value="Instance Provisioning">Instance Provisioning</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="allowToggle"
                    checked={formData.allow}
                    onChange={(e) => setFormData({ ...formData, allow: e.target.checked })}
                    className="rounded border-input text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <Label htmlFor="allowToggle" className="cursor-pointer font-medium text-sm">
                    Enable auto-routing to group members on new ticket creation
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: ASSIGNED MEMBERS */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  ASSIGNED TEAM MEMBERS <span className="text-rose-500">*</span>
                </h3>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <p className="text-xs text-muted-foreground">
                  Select which staff or specialists receive tickets filed under this category:
                </p>
                <div className="border border-input rounded-md p-3 max-h-60 overflow-y-auto space-y-2 bg-background">
                  {crmUsers.map((user) => {
                    const isSelected = formData.Members.includes(user.name);
                    return (
                      <label
                        key={user.id}
                        className="flex items-center gap-2.5 text-sm cursor-pointer p-2 hover:bg-muted/40 rounded transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleMember(user.name)}
                          className="rounded border-input text-blue-600 focus:ring-blue-500 h-4 w-4"
                        />
                        <span className={isSelected ? 'font-medium text-foreground' : 'text-muted-foreground'}>
                          {user.name}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Card 1: SUMMARY */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  GROUP SUMMARY
                </h3>
              </CardHeader>
              <CardContent className="p-5 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-semibold text-foreground">{formData.Related_to || 'None'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Assigned Count:</span>
                  <span className="font-semibold text-foreground">{formData.Members.length} Members</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Auto-routing:</span>
                  <span className={`font-semibold ${formData.allow ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {formData.allow ? 'Active' : 'Disabled'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: TAGS */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  TAGS SELECTOR
                </h3>
              </CardHeader>
              <CardContent className="p-5">
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_TAGS.map((tag) => {
                    const active = formData.selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-colors ${
                          active
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-background border-border text-foreground hover:bg-muted'
                        }`}
                      >
                        {active && '✓ '}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Card 3: ROUTING POLICY NOTES */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  ROUTING POLICY NOTES
                </h3>
              </CardHeader>
              <CardContent className="p-5">
                <Textarea
                  placeholder="Operational routing instructions or escalation procedures..."
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    );
  }

  // ----------------------------------------------------------------------
  // DEFAULT TABLE LIST VIEW
  // ----------------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              Ticket Management Group
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Configure routing groups and assign team members responsible for handling specific ticket categories
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading || isFetching}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
            onClick={handleOpenCreate}
          >
            <Plus className="h-4 w-4" />
            Add Group Mapping
          </Button>
        </div>
      </div>

      {/* Navigation sub-tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2 text-sm font-medium">
        <Link
          href="/ticket-management/tickets"
          className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground"
        >
          Ticket Created List
        </Link>
        <Link
          href="/ticket-management/groups"
          className="px-3 py-1.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
        >
          Ticket Management Group
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search category or assigned member..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9"
          />
        </div>
      </div>

      {/* Groups Table */}
      <div className="bg-card border border-border rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold text-xs">
              <tr>
                <th className="py-3 px-4">TICKET CATEGORY</th>
                <th className="py-3 px-4">ASSIGNED MEMBERS</th>
                <th className="py-3 px-4">AUTO-ROUTING</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
                      Loading groups...
                    </div>
                  </td>
                </tr>
              ) : paginatedGroups.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-muted-foreground">
                    No ticket management groups found.
                  </td>
                </tr>
              ) : (
                paginatedGroups.map((group) => {
                  const relatedCategory = group.Related_to || group.TicketRelatesto || 'Uncategorized';
                  const members = Array.isArray(group.Members) ? group.Members : [];

                  return (
                    <tr key={group.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-3 px-4 font-semibold text-foreground flex items-center gap-2">
                        <Ticket className="h-4 w-4 text-blue-600 shrink-0" />
                        <span>{relatedCategory}</span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1.5 max-w-md">
                          {members.length === 0 ? (
                            <span className="text-xs text-muted-foreground italic">No members assigned</span>
                          ) : (
                            members.map((m, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="bg-background text-foreground text-xs"
                              >
                                {m}
                              </Badge>
                            ))
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {group.allow ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-4 w-4" />
                            Enabled
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                            Disabled
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(group)}
                            className="h-8 w-8 text-muted-foreground hover:text-blue-600"
                            title="Edit Group"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setDeletingId(group.id);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="h-8 w-8 text-muted-foreground hover:text-rose-600"
                            title="Delete Group"
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

        {/* Clean Footer Pagination without rows per page selector */}
        <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>
            Showing <span className="font-medium text-foreground">{totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to{' '}
            <span className="font-medium text-foreground">
              {Math.min(currentPage * itemsPerPage, totalItems)}
            </span>{' '}
            of <span className="font-medium text-foreground">{totalItems}</span> entries
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

      {/* Delete Dialog */}
      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        title="Delete Ticket Group"
        description="Are you sure you want to delete this ticket routing group? Support tickets in this category will not be auto-routed."
      />
    </div>
  );
}
