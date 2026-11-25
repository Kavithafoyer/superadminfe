'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useParams, useSearchParams } from 'next/navigation';
import {
  UserMinus,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Globe,
  Calendar,
  Users,
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
  useGetCancelPlanListQuery,
  useCreateCancelPlanMutation,
  useDeleteCancelPlanMutation,
  useGetSubscriptionsListQuery,
  CancelPlanRecord,
} from '@/service/api/superAdminService';

const AVAILABLE_TAGS = ['Non-payment', 'Competitor Switch', 'Downsizing', 'Product Fit', 'Churn Risk', 'Executive Escalation'];

export default function CancelPlanPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();

  const isCreateRoute = pathname?.endsWith('/create') || searchParams.get('mode') === 'create' || searchParams.get('action') === 'create';

  const { data: cancelRequests = [], isLoading, refetch, isFetching } = useGetCancelPlanListQuery();
  const { data: subscriptions = [], refetch: refetchSubscriptions } = useGetSubscriptionsListQuery(undefined, { refetchOnMountOrArgChange: true });
  const [createCancelPlan, { isLoading: isCreating }] = useCreateCancelPlanMutation();
  const [deleteCancelPlan, { isLoading: isDeleting }] = useDeleteCancelPlanMutation();

  // Full-page view mode: 'list' | 'create' (Route-driven to preserve on refresh)
  const [internalViewMode, setInternalViewMode] = useState<'list' | 'create' | 'edit'>('list');
  const viewMode: 'list' | 'create' | 'edit' = isCreateRoute ? 'create' : internalViewMode;

  // Re-fetch master data immediately when entering Create mode
  useEffect(() => {
    if (viewMode === 'create') {
      refetchSubscriptions();
    }
  }, [viewMode, refetchSubscriptions]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<CancelPlanRecord | any>(null);

  // Form State strictly starting with EMPTY values (no static dummy values)
  const initialFormState = {
    Customer_Name: '',
    Domain_Name: '',
    Plan_Name: '',
    Noofusers: '',
    ExpireDate: '',
    EffectiveCancelDate: '',
    Reason: '',
    selectedTags: [] as string[],
    notes: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleOpenCreate = () => {
    setSelectedRecord(null);
    setFormData(initialFormState);
    setFormErrors({});
    setInternalViewMode('create');
    router.push('/customer/cancel-plan/create');
  };

  const handleBackToList = () => {
    setInternalViewMode('list');
    router.push('/customer/cancel-plan');
  };

  const handleOpenView = (rec: any) => {
    setSelectedRecord(rec);
    setIsViewOpen(true);
  };

  const handleOpenDelete = (rec: any) => {
    setSelectedRecord(rec);
    setIsDeleteOpen(true);
  };

  const toggleTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter((t) => t !== tag)
        : [...prev.selectedTags, tag],
    }));
  };

  // Select subscription to auto-fill
  const handleSelectSubscription = (subId: string) => {
    const sub = subscriptions.find((s: any) => String(s.id) === subId || s.Subscription_Id === subId || s.subscription_id === subId);
    if (sub) {
      setFormData((prev) => ({
        ...prev,
        Customer_Name: sub.Customer_Name || sub.customer_name || '',
        Plan_Name: sub.Plan_Name || sub.plan_name || '',
        Domain_Name: `${(sub.Customer_Name || sub.customer_name || 'client').toLowerCase().replace(/\s+/g, '')}.crmfarm.app`,
        Noofusers: String(sub.No_Of_Users || sub.no_of_users || '10'),
        ExpireDate: sub.end_date || '',
      }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.Customer_Name.trim()) errors.Customer_Name = 'Customer name is required';
    if (!formData.Domain_Name.trim()) errors.Domain_Name = 'Domain name is required';
    if (!formData.Plan_Name.trim()) errors.Plan_Name = 'Plan name is required';
    if (!formData.Noofusers) errors.Noofusers = 'User count is required';
    if (!formData.ExpireDate) errors.ExpireDate = 'Expiry date is required';
    if (!formData.EffectiveCancelDate) errors.EffectiveCancelDate = 'Effective cancel date is required';
    if (!formData.Reason.trim()) errors.Reason = 'Cancellation reason is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload: Partial<CancelPlanRecord> = {
        Customer_Name: formData.Customer_Name,
        CustomerName: formData.Customer_Name,
        Domain_Name: formData.Domain_Name,
        DomainName: formData.Domain_Name,
        Plan_Name: formData.Plan_Name,
        PlanName: formData.Plan_Name,
        Noofusers: parseInt(formData.Noofusers) || 1,
        No_Of_Users: parseInt(formData.Noofusers) || 1,
        ExpireDate: formData.ExpireDate,
        EffectiveCancelDate: formData.EffectiveCancelDate,
        Reason: formData.Reason,
        Status: 'Pending Termination',
      };

      await createCancelPlan(payload).unwrap();
      toast.success('Cancellation request submitted successfully');
      handleBackToList();
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to submit cancellation request');
    }
  };

  const handleDeleteRecord = async () => {
    if (!selectedRecord) return;
    try {
      await deleteCancelPlan({ id: selectedRecord.id }).unwrap();
      toast.success('Cancellation record deleted successfully');
      setIsDeleteOpen(false);
      refetch();
    } catch {
      toast.error('Failed to delete cancellation record');
    }
  };

  const filteredRecords = useMemo(() => {
    return cancelRequests.filter((rec: any) => {
      const cName = rec.Customer_Name || rec.CustomerName || '';
      const dName = rec.Domain_Name || rec.DomainName || '';
      const pName = rec.Plan_Name || rec.PlanName || '';

      return (
        cName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [cancelRequests, searchTerm]);

  const totalRecords = filteredRecords.length;
  const totalPages = Math.ceil(totalRecords / itemsPerPage) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(start, start + itemsPerPage);
  }, [filteredRecords, currentPage, itemsPerPage]);

  // ----------------------------------------------------------------------
  // FULL-PAGE CREATE VIEW (CBS PEGATTO FORMAT, NO POPUPS)
  // ----------------------------------------------------------------------
  if (viewMode === 'create') {
    return (
      <form onSubmit={handleSubmitForm} className="space-y-6">
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
                  Customer Management
                </span>
                <span>/</span>
                <span className="text-foreground">
                  New Cancellation Request
                </span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground mt-0.5">
                Submit Subscription Cancellation Request
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              type="button"
              variant="outline"
              onClick={handleBackToList}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating}
              className="bg-rose-600 hover:bg-rose-700 text-white gap-2 px-5"
            >
              <Save className="h-4 w-4" />
              {isCreating ? 'Submitting...' : 'Confirm Cancellation'}
            </Button>
          </div>
        </div>

        {/* Two-Column CBS Pegatto Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Card 1: TENANT & DOMAIN SPECIFICATIONS */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  TENANT & DOMAIN SPECIFICATIONS
                </h3>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wider">
                    CHOOSE ACTIVE SUBSCRIPTION (OPTIONAL HELPER)
                  </Label>
                  <select
                    onChange={(e) => handleSelectSubscription(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="">-- Choose Subscription to Auto-fill --</option>
                    {subscriptions.map((s: any) => (
                      <option key={s.id} value={s.id}>
                        {s.Subscription_Id || s.subscription_id || `#SUB-${s.id}`} - {s.Customer_Name || s.customer_name || s.Plan_Name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="Customer_Name" className="text-xs font-semibold uppercase tracking-wider">
                      CUSTOMER / TENANT NAME <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="Customer_Name"
                      placeholder="Customer Name"
                      value={formData.Customer_Name}
                      onChange={(e) => setFormData({ ...formData, Customer_Name: e.target.value })}
                      className={formErrors.Customer_Name ? 'border-rose-500' : ''}
                      required
                    />
                    {formErrors.Customer_Name && (
                      <p className="text-xs text-rose-500">{formErrors.Customer_Name}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Domain_Name" className="text-xs font-semibold uppercase tracking-wider">
                      DOMAIN NAME <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="Domain_Name"
                      placeholder="e.g. client.crmfarm.app"
                      value={formData.Domain_Name}
                      onChange={(e) => setFormData({ ...formData, Domain_Name: e.target.value })}
                      className={formErrors.Domain_Name ? 'border-rose-500' : ''}
                      required
                    />
                    {formErrors.Domain_Name && (
                      <p className="text-xs text-rose-500">{formErrors.Domain_Name}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Plan_Name" className="text-xs font-semibold uppercase tracking-wider">
                      PLAN SPECIFICATION <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="Plan_Name"
                      placeholder="Plan Name"
                      value={formData.Plan_Name}
                      onChange={(e) => setFormData({ ...formData, Plan_Name: e.target.value })}
                      className={formErrors.Plan_Name ? 'border-rose-500' : ''}
                      required
                    />
                    {formErrors.Plan_Name && (
                      <p className="text-xs text-rose-500">{formErrors.Plan_Name}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="Noofusers" className="text-xs font-semibold uppercase tracking-wider">
                      SEATS IMPACTED <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="Noofusers"
                      type="number"
                      placeholder="e.g. 10"
                      value={formData.Noofusers}
                      onChange={(e) => setFormData({ ...formData, Noofusers: e.target.value })}
                      className={formErrors.Noofusers ? 'border-rose-500' : ''}
                      required
                    />
                    {formErrors.Noofusers && (
                      <p className="text-xs text-rose-500">{formErrors.Noofusers}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: DATES & REASON */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  CANCELLATION DATES & CHURN REASON
                </h3>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="ExpireDate" className="text-xs font-semibold uppercase tracking-wider">
                      EXPIRY DATE <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="ExpireDate"
                      type="date"
                      value={formData.ExpireDate}
                      onChange={(e) => setFormData({ ...formData, ExpireDate: e.target.value })}
                      className={formErrors.ExpireDate ? 'border-rose-500' : ''}
                      required
                    />
                    {formErrors.ExpireDate && (
                      <p className="text-xs text-rose-500">{formErrors.ExpireDate}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="EffectiveCancelDate" className="text-xs font-semibold uppercase tracking-wider">
                      EFFECTIVE CANCEL DATE <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="EffectiveCancelDate"
                      type="date"
                      value={formData.EffectiveCancelDate}
                      onChange={(e) => setFormData({ ...formData, EffectiveCancelDate: e.target.value })}
                      className={formErrors.EffectiveCancelDate ? 'border-rose-500' : ''}
                      required
                    />
                    {formErrors.EffectiveCancelDate && (
                      <p className="text-xs text-rose-500">{formErrors.EffectiveCancelDate}</p>
                    )}
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="Reason" className="text-xs font-semibold uppercase tracking-wider">
                      REASON FOR CANCELLATION <span className="text-rose-500">*</span>
                    </Label>
                    <Textarea
                      id="Reason"
                      rows={3}
                      placeholder="Explain why client is cancelling service, competitor switches, or pricing objections..."
                      value={formData.Reason}
                      onChange={(e) => setFormData({ ...formData, Reason: e.target.value })}
                      className={formErrors.Reason ? 'border-rose-500' : ''}
                      required
                    />
                    {formErrors.Reason && (
                      <p className="text-xs text-rose-500">{formErrors.Reason}</p>
                    )}
                  </div>
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
                  CANCELLATION SUMMARY
                </h3>
              </CardHeader>
              <CardContent className="p-5 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Customer:</span>
                  <span className="font-semibold text-foreground truncate max-w-[150px]">
                    {formData.Customer_Name || 'None'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Domain:</span>
                  <span className="font-mono text-rose-600 font-semibold">{formData.Domain_Name || '—'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Seats:</span>
                  <span className="font-semibold text-foreground">{formData.Noofusers || '0'} Seats</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-semibold text-rose-600">Pending Termination</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: TAGS */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  CHURN TAGS SELECTOR
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
                            ? 'bg-rose-600 border-rose-600 text-white'
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

            {/* Card 3: NOTES */}
            <Card className="border-border shadow-xs">
              <CardHeader className="py-3.5 px-6 border-b border-border/60">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  RETENTION ATTEMPT NOTES
                </h3>
              </CardHeader>
              <CardContent className="p-5">
                <Textarea
                  placeholder="Record customer retention offers made, counter-proposals, or exit survey feedback..."
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
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            title="Go Back"
            className="h-10 w-10 rounded-xl border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shrink-0 cursor-pointer shadow-xs"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <UserMinus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                Plan Cancellation Requests
              </h1>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Review client offboarding requests, record churn reasons, and schedule tenant de-provisioning
            </p>
          </div>
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
            className="bg-rose-600 hover:bg-rose-700 text-white gap-2"
            onClick={handleOpenCreate}
          >
            <Plus className="h-4 w-4" />
            Submit Cancellation
          </Button>
        </div>
      </div>

      {/* Navigation sub-tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2 text-sm font-medium">
        <Link
          href="/customer/additional-license"
          className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground"
        >
          Additional Licenses
        </Link>
        <Link
          href="/customer/additional-storage"
          className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground"
        >
          Additional Storage
        </Link>
        <Link
          href="/customer/addon-subscription"
          className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground"
        >
          Addon Subscriptions
        </Link>
        <Link
          href="/customer/renewal-due"
          className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground"
        >
          Renewals Due
        </Link>
        <Link
          href="/customer/cancel-plan"
          className="px-3 py-1.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
        >
          Cancellation Requests
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer, domain, or plan..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold text-xs">
              <tr>
                <th className="py-3 px-4">CUSTOMER TENANT</th>
                <th className="py-3 px-4">DOMAIN</th>
                <th className="py-3 px-4">PLAN</th>
                <th className="py-3 px-4">SEATS</th>
                <th className="py-3 px-4">EFFECTIVE DATE</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
                      Loading cancellation requests...
                    </div>
                  </td>
                </tr>
              ) : paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-muted-foreground">
                    No cancellation requests found.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((rec: any) => {
                  const cName = rec.Customer_Name || rec.CustomerName || 'Tenant';
                  const dName = rec.Domain_Name || rec.DomainName || 'crmfarm.app';
                  const pName = rec.Plan_Name || rec.PlanName || 'Standard';
                  const seats = rec.Noofusers || rec.No_Of_Users || '—';
                  const effDate = rec.EffectiveCancelDate ? rec.EffectiveCancelDate.split('T')[0] : '—';
                  const status = rec.Status || 'Pending Termination';

                  return (
                    <tr key={rec.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-3 px-4 font-semibold text-foreground">
                        {cName}
                      </td>

                      <td className="py-3 px-4 font-mono text-xs text-muted-foreground">
                        {dName}
                      </td>

                      <td className="py-3 px-4">
                        <Badge variant="outline">{pName}</Badge>
                      </td>

                      <td className="py-3 px-4 text-muted-foreground">
                        {seats} Users
                      </td>

                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{effDate}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-500/20">
                          {status}
                        </Badge>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenView(rec)}
                            className="h-8 w-8 text-muted-foreground hover:text-blue-600"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDelete(rec)}
                            className="h-8 w-8 text-muted-foreground hover:text-rose-600"
                            title="Delete Request"
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

        {/* Clean Footer Pagination without rows per page dropdown */}
        <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>
            Showing <span className="font-medium text-foreground">{totalRecords > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to{' '}
            <span className="font-medium text-foreground">
              {Math.min(currentPage * itemsPerPage, totalRecords)}
            </span>{' '}
            of <span className="font-medium text-foreground">{totalRecords}</span> entries
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

      {/* VIEW MODAL */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cancellation Details</DialogTitle>
            <DialogDescription>
              Details for cancellation request
            </DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-3 py-2 text-xs">
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Customer:</span>
                <span className="font-semibold text-foreground">
                  {selectedRecord.Customer_Name || selectedRecord.CustomerName}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Domain:</span>
                <span className="font-mono text-foreground">
                  {selectedRecord.Domain_Name || selectedRecord.DomainName}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Plan:</span>
                <span>{selectedRecord.Plan_Name || selectedRecord.PlanName}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Effective Date:</span>
                <span>{selectedRecord.EffectiveCancelDate ? selectedRecord.EffectiveCancelDate.split('T')[0] : '—'}</span>
              </div>
              <div className="py-1">
                <span className="text-muted-foreground block mb-1">Reason:</span>
                <p className="p-2 rounded bg-muted/40 text-foreground font-medium">
                  {selectedRecord.Reason || 'No reason specified'}
                </p>
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

      {/* DELETE DIALOG */}
      <ConfirmDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDeleteRecord}
        isDeleting={isDeleting}
        title="Delete Cancellation Request"
        description="Are you sure you want to delete this cancellation request?"
      />
    </div>
  );
}
