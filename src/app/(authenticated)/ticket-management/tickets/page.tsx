'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useParams, useSearchParams } from 'next/navigation';
import {
  Ticket as TicketIcon,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Shield,
  Clock,
  User,
  Users,
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
  useGetTicketsListQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
  useGetTicketRelatedLookupsQuery,
  useGetCRMUsersListQuery,
  TicketRecord,
} from '@/service/api/superAdminService';

const AVAILABLE_TAGS = ['Bug', 'Feature', 'Customer Facing', 'Billing', 'Urgent', 'Infrastructure', 'Security', 'Escalation'];

export default function TicketCreatedListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();

  const isCreateRoute = pathname?.endsWith('/create') || searchParams.get('mode') === 'create' || searchParams.get('action') === 'create';
  const isEditRoute = pathname?.includes('/edit') || searchParams.get('mode') === 'edit' || searchParams.get('action') === 'edit';
  const routeEditId = (params?.id as string) || (pathname?.includes('/edit/') ? pathname.split('/edit/')[1]?.split('/')[0]?.split('?')[0] : undefined);

  const { data: tickets = [], isLoading, refetch, isFetching } = useGetTicketsListQuery();
  const { data: lookups = [] } = useGetTicketRelatedLookupsQuery();
  const { data: crmUsers = [] } = useGetCRMUsersListQuery();

  const [createTicket, { isLoading: isCreating }] = useCreateTicketMutation();
  const [updateTicket, { isLoading: isUpdating }] = useUpdateTicketMutation();
  const [deleteTicket, { isLoading: isDeleting }] = useDeleteTicketMutation();

  // Full-page view mode: 'list' | 'create' | 'edit' (Route-driven to preserve on refresh)
  const [internalViewMode, setInternalViewMode] = useState<'list' | 'create' | 'edit'>('list');
  const viewMode: 'list' | 'create' | 'edit' = isCreateRoute ? 'create' : (isEditRoute ? 'edit' : internalViewMode);

  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // View / Delete Dialogs
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<TicketRecord | null>(null);
  const [viewingTicket, setViewingTicket] = useState<TicketRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  // Form State - strictly blank initial values (NO static prefilled fallback)
  const initialForm = {
    Ticket_No: '',
    Ticket_Name: '',
    TicketRelatesto: '',
    Severity: 'Normal',
    Ticket_Status: 'New',
    Assign_To: '',
    DeadlineDate: '',
    Details: '',
    selectedTags: [] as string[],
    internalNotes: '',
  };

  const [formData, setFormData] = useState(initialForm);

  // Filtering
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const s = searchTerm.toLowerCase();
      const matchSearch =
        (t.Ticket_No || '').toLowerCase().includes(s) ||
        (t.Ticket_Name || '').toLowerCase().includes(s) ||
        (t.TicketRelatesto || t.Related_Module || '').toLowerCase().includes(s) ||
        (t.Details || t.Ticket_Description || '').toLowerCase().includes(s) ||
        (Array.isArray(t.Members) ? t.Members.join(' ') : String(t.Members || '')).toLowerCase().includes(s);

      const sev = (t.Severity || '').toLowerCase();
      const matchSeverity = severityFilter === 'all' || sev === severityFilter.toLowerCase();

      const st = (t.Ticket_Status || t.Status || '').toLowerCase();
      const matchStatus = statusFilter === 'all' || st === statusFilter.toLowerCase();

      return matchSearch && matchSeverity && matchStatus;
    });
  }, [tickets, searchTerm, severityFilter, statusFilter]);

  // Clean Pagination (NO rows per page)
  const totalItems = filteredTickets.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTickets.slice(start, start + itemsPerPage);
  }, [filteredTickets, currentPage]);

  // Auto-populate formData when directly visiting or refreshing on an edit page (/ticket-management/tickets/edit/:id)
  useEffect(() => {
    if (isEditRoute && routeEditId && tickets.length > 0) {
      const t = tickets.find((tk: any) => String(tk.id) === String(routeEditId) || String(tk.Ticket_No) === String(routeEditId));
      if (t && (!editingTicket || String(editingTicket.id) !== String(t.id))) {
        setEditingTicket(t);
        const memberStr = Array.isArray(t.Members) ? t.Members.join(', ') : t.Members || '';
        setFormData({
          Ticket_No: t.Ticket_No || '',
          Ticket_Name: t.Ticket_Name || '',
          TicketRelatesto: t.TicketRelatesto || t.Related_Module || '',
          Severity: t.Severity || 'Normal',
          Ticket_Status: t.Ticket_Status || t.Status || 'New',
          Assign_To: memberStr,
          DeadlineDate: t.DeadlineDate ? t.DeadlineDate.split('T')[0] : '',
          Details: t.Details || t.Ticket_Description || '',
          selectedTags: [],
          internalNotes: '',
        });
      }
    }
  }, [isEditRoute, routeEditId, tickets, editingTicket]);

  const handleOpenCreate = () => {
    setEditingTicket(null);
    setFormData(initialForm);
    setInternalViewMode('create');
    router.push('/ticket-management/tickets/create');
  };

  const handleOpenEdit = (t: TicketRecord) => {
    setEditingTicket(t);
    const memberStr = Array.isArray(t.Members) ? t.Members.join(', ') : t.Members || '';
    setFormData({
      Ticket_No: t.Ticket_No || '',
      Ticket_Name: t.Ticket_Name || '',
      TicketRelatesto: t.TicketRelatesto || t.Related_Module || '',
      Severity: t.Severity || 'Normal',
      Ticket_Status: t.Ticket_Status || t.Status || 'New',
      Assign_To: memberStr,
      DeadlineDate: t.DeadlineDate ? t.DeadlineDate.split('T')[0] : '',
      Details: t.Details || t.Ticket_Description || '',
      selectedTags: [],
      internalNotes: '',
    });
    setInternalViewMode('edit');
    router.push(`/ticket-management/tickets/edit/${t.id}`);
  };

  const handleBackToList = () => {
    setInternalViewMode('list');
    router.push('/ticket-management/tickets');
  };

  const handleOpenView = (t: TicketRecord) => {
    setViewingTicket(t);
    setIsViewOpen(true);
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
    if (!formData.Ticket_Name.trim()) {
      toast.error('Ticket Title / Subject is required');
      return;
    }

    try {
      const payload: Partial<TicketRecord> = {
        Ticket_No: formData.Ticket_No.trim() || undefined,
        Ticket_Name: formData.Ticket_Name.trim(),
        TicketRelatesto: formData.TicketRelatesto,
        Related_Module: formData.TicketRelatesto,
        Severity: formData.Severity,
        Ticket_Status: formData.Ticket_Status,
        Status: formData.Ticket_Status,
        Members: formData.Assign_To ? [formData.Assign_To] : [],
        DeadlineDate: formData.DeadlineDate || undefined,
        Details: formData.Details.trim(),
        Ticket_Description: formData.Details.trim(),
      };

      if (viewMode === 'edit' && editingTicket) {
        await updateTicket({
          id: editingTicket.id,
          ...payload,
        }).unwrap();
        toast.success('Ticket updated successfully');
      } else {
        await createTicket(payload).unwrap();
        toast.success('Ticket created successfully');
      }
      handleBackToList();
      refetch();
    } catch {
      toast.error('Failed to save ticket');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await deleteTicket({ id: deletingId }).unwrap();
      toast.success('Ticket deleted successfully');
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
      refetch();
    } catch {
      toast.error('Failed to delete ticket');
    }
  };

  const getSeverityBadge = (s?: string) => {
    switch (s?.toLowerCase()) {
      case 'critical':
        return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
      case 'major':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'minor':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'normal':
      default:
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    }
  };

  const getStatusBadge = (st?: string) => {
    switch (st?.toLowerCase()) {
      case 'resolved':
      case 'closed':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'in progress':
        return 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20';
      case 'open':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'new':
      default:
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
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
                  {isEdit ? 'Edit Ticket' : 'Create New Ticket'}
                </span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground mt-0.5">
                {isEdit ? `Edit Ticket: ${formData.Ticket_Name || 'Selected Ticket'}` : 'Create Support Ticket'}
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
              {isCreating || isUpdating ? 'Saving...' : isEdit ? 'Save Changes' : 'Save Ticket'}
            </Button>
          </div>
        </div>

        {/* Two-Column CBS Pegatto Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Card 1: TICKET INFORMATION */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  TICKET INFORMATION
                </h3>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="Ticket_Name" className="text-xs font-semibold uppercase tracking-wider">
                      TICKET TITLE / SUBJECT <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="Ticket_Name"
                      placeholder="Brief summary of the issue or request..."
                      value={formData.Ticket_Name}
                      onChange={(e) => setFormData({ ...formData, Ticket_Name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="TicketRelatesto" className="text-xs font-semibold uppercase tracking-wider">
                      TICKET RELATED TO <span className="text-rose-500">*</span>
                    </Label>
                    <select
                      id="TicketRelatesto"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={formData.TicketRelatesto}
                      onChange={(e) => setFormData({ ...formData, TicketRelatesto: e.target.value })}
                      required
                    >
                      <option value="">Select Category</option>
                      {lookups.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option value="Billing & Invoicing">Billing & Invoicing</option>
                      <option value="Storage Master">Storage Master</option>
                      <option value="Role & Permissions">Role & Permissions</option>
                      <option value="System Preference">System Preference</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Severity" className="text-xs font-semibold uppercase tracking-wider">
                      SEVERITY
                    </Label>
                    <select
                      id="Severity"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={formData.Severity}
                      onChange={(e) => setFormData({ ...formData, Severity: e.target.value })}
                    >
                      <option value="Normal">Normal</option>
                      <option value="Minor">Minor</option>
                      <option value="Major">Major</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Ticket_Status" className="text-xs font-semibold uppercase tracking-wider">
                      TICKET STATUS
                    </Label>
                    <select
                      id="Ticket_Status"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={formData.Ticket_Status}
                      onChange={(e) => setFormData({ ...formData, Ticket_Status: e.target.value })}
                    >
                      <option value="New">New</option>
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="DeadlineDate" className="text-xs font-semibold uppercase tracking-wider">
                      DEADLINE / DUE DATE
                    </Label>
                    <Input
                      id="DeadlineDate"
                      type="date"
                      value={formData.DeadlineDate}
                      onChange={(e) => setFormData({ ...formData, DeadlineDate: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: DETAILS & ISSUE DESCRIPTION */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  INCIDENT DETAILS & DESCRIPTION
                </h3>
              </CardHeader>
              <CardContent className="p-6">
                <Textarea
                  id="Details"
                  rows={4}
                  placeholder="Provide comprehensive details about this incident, steps to reproduce, or requirements..."
                  value={formData.Details}
                  onChange={(e) => setFormData({ ...formData, Details: e.target.value })}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Card 1: ASSIGNMENT & ROUTING */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  ASSIGNMENT & ROUTING
                </h3>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="Assign_To" className="text-xs font-semibold uppercase tracking-wider">
                    ASSIGN TO STAFF
                  </Label>
                  <select
                    id="Assign_To"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.Assign_To}
                    onChange={(e) => setFormData({ ...formData, Assign_To: e.target.value })}
                  >
                    <option value="">Unassigned</option>
                    {crmUsers.map((u: any) => (
                      <option key={u.id} value={u.name || u.email || u.username || String(u.id)}>
                        {u.name || u.email || u.username || String(u.id)}
                      </option>
                    ))}
                    <option value="Admin Support Team">Admin Support Team</option>
                    <option value="Technical Operations">Technical Operations</option>
                    <option value="Billing Specialist">Billing Specialist</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="Ticket_No" className="text-xs font-semibold uppercase tracking-wider">
                    MANUAL TICKET NUMBER (OPTIONAL)
                  </Label>
                  <Input
                    id="Ticket_No"
                    placeholder="Auto-generated if blank"
                    value={formData.Ticket_No}
                    onChange={(e) => setFormData({ ...formData, Ticket_No: e.target.value })}
                  />
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

            {/* Card 3: INTERNAL NOTES */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  INTERNAL NOTES
                </h3>
              </CardHeader>
              <CardContent className="p-5">
                <Textarea
                  placeholder="Private internal notes regarding customer impact, resolution timeline..."
                  rows={3}
                  value={formData.internalNotes}
                  onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
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
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <TicketIcon className="h-6 w-6 text-blue-600" />
              Ticket Management
            </h1>
            <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
              {totalItems} Tickets
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Track customer incidents, service inquiries, and internal support escalations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-9 gap-1.5"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            size="sm"
            onClick={handleOpenCreate}
            className="h-9 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            <Plus className="h-4 w-4" />
            Create Ticket
          </Button>
        </div>
      </div>

      {/* Navigation sub-tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2 text-sm font-medium">
        <Link
          href="/ticket-management/tickets"
          className="px-3 py-1.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
        >
          Ticket Created List
        </Link>
        <Link
          href="/ticket-management/groups"
          className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground"
        >
          Ticket Management Group
        </Link>
      </div>

      {/* Filters and Search Bar */}
      <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ticket #, subject, assignee, or category..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 h-9"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={severityFilter}
              onChange={(e) => {
                setSeverityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 px-3 rounded-md border border-input bg-background text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="major">Major</option>
              <option value="minor">Minor</option>
              <option value="normal">Normal</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 px-3 rounded-md border border-input bg-background text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="open">Open</option>
              <option value="in progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold text-xs">
              <tr>
                <th className="py-3 px-4">TICKET DETAILS</th>
                <th className="py-3 px-4">CATEGORY</th>
                <th className="py-3 px-4">SEVERITY</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">ASSIGNED STAFF</th>
                <th className="py-3 px-4">DEADLINE</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
                      Loading tickets...
                    </div>
                  </td>
                </tr>
              ) : paginatedTickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-muted-foreground">
                    <p className="font-medium text-foreground">No tickets found</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Try adjusting your search criteria or create a new support ticket.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedTickets.map((t) => {
                  const ticketNo = t.Ticket_No || `TCK-${t.id}`;
                  const ticketName = t.Ticket_Name || 'Untitled Ticket';
                  const category = t.TicketRelatesto || t.Related_Module || 'General';
                  const status = t.Ticket_Status || t.Status || 'New';
                  const severity = t.Severity || 'Normal';
                  const members = Array.isArray(t.Members)
                    ? t.Members.join(', ')
                    : t.Members || 'Unassigned';

                  return (
                    <tr
                      key={t.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-foreground flex items-center gap-2">
                          <TicketIcon className="h-4 w-4 text-blue-600 shrink-0" />
                          <span>{ticketName}</span>
                        </div>
                        <span className="text-[11px] font-mono text-blue-600 font-medium">
                          {ticketNo}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-muted text-foreground">
                          {category}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <Badge variant="outline" className={getSeverityBadge(severity)}>
                          {severity}
                        </Badge>
                      </td>

                      <td className="py-3 px-4">
                        <Badge variant="outline" className={getStatusBadge(status)}>
                          {status}
                        </Badge>
                      </td>

                      <td className="py-3 px-4 text-xs text-foreground">
                        <div className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{members}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{t.DeadlineDate ? t.DeadlineDate.split('T')[0] : '—'}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenView(t)}
                            className="h-8 w-8 text-muted-foreground hover:text-blue-600"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(t)}
                            className="h-8 w-8 text-muted-foreground hover:text-blue-600"
                            title="Edit Ticket"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setDeletingId(t.id);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="h-8 w-8 text-muted-foreground hover:text-rose-600"
                            title="Delete Ticket"
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

        {/* Footer Pagination strictly without rows-per-page */}
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
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-8 px-2.5 gap-1 text-xs"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous
            </Button>
            <span className="font-medium text-foreground px-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 px-2.5 gap-1 text-xs"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* View Ticket Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              Ticket Details
            </DialogTitle>
            <DialogDescription>Full incident report and routing information</DialogDescription>
          </DialogHeader>

          {viewingTicket && (
            <div className="space-y-4 py-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="font-mono text-xs text-blue-600 border-blue-500/20">
                    {viewingTicket.Ticket_No || `TCK-${viewingTicket.id}`}
                  </Badge>
                  <Badge variant="outline" className={getSeverityBadge(viewingTicket.Severity)}>
                    {viewingTicket.Severity}
                  </Badge>
                  <Badge variant="outline" className={getStatusBadge(viewingTicket.Ticket_Status || viewingTicket.Status)}>
                    {viewingTicket.Ticket_Status || viewingTicket.Status}
                  </Badge>
                </div>
                <h3 className="text-base font-bold text-foreground">
                  {viewingTicket.Ticket_Name}
                </h3>
              </div>

              {(viewingTicket.Details || viewingTicket.Ticket_Description) && (
                <div className="bg-muted/40 p-3 rounded-lg border border-border">
                  <span className="text-xs font-semibold text-muted-foreground uppercase block mb-1">
                    Details & Issue Description
                  </span>
                  <p className="text-sm text-foreground whitespace-pre-wrap">
                    {viewingTicket.Details || viewingTicket.Ticket_Description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground block">Related Category</span>
                  <span className="font-medium text-foreground">
                    {viewingTicket.TicketRelatesto || viewingTicket.Related_Module || 'General'}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Assigned Staff</span>
                  <span className="font-medium text-foreground">
                    {Array.isArray(viewingTicket.Members)
                      ? viewingTicket.Members.join(', ')
                      : viewingTicket.Members || 'Unassigned'}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Created Date</span>
                  <span className="font-medium text-foreground">
                    {viewingTicket.Created_Date || '—'}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Deadline / Due Date</span>
                  <span className="font-medium text-foreground">
                    {viewingTicket.DeadlineDate ? viewingTicket.DeadlineDate.split('T')[0] : '—'}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        loading={isDeleting}
        title="Delete Support Ticket"
        description="Are you sure you want to permanently delete this support ticket? This action cannot be reversed."
      />
    </div>
  );
}
