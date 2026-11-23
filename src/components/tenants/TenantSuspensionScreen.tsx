'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  PauseCircle,
  PlayCircle,
  CheckCircle2,
  Clock,
  RotateCcw,
  Users,
  Search,
  Filter,
  Eye,
  MoreVertical,
  Plus,
  Building2,
  GraduationCap,
  Laptop,
  ShoppingCart,
  Calendar,
  Layers,
  AlertTriangle,
  RefreshCw,
  Hourglass,
  History,
  Check,
  X,
  FileText,
  ShieldAlert,
  ArrowRight,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { INITIAL_SUSPENSION_TENANTS, SuspensionTenantRecord } from './tenantData';

// Types for Requests & History
export interface SuspensionRequestItem {
  id: string;
  requestId: string;
  tenantId: string;
  tenantName: string;
  product: string;
  productIcon: 'education' | 'it' | 'retail' | 'real-estate' | 'people';
  reason: string;
  requestedBy: string;
  requestedOn: string;
  priority: 'Critical' | 'High' | 'Normal';
  status: 'Pending Approval' | 'Approved' | 'Rejected';
  arr: string;
  usersCount: number;
}

export interface ReactivationRequestItem {
  id: string;
  requestId: string;
  tenantId: string;
  tenantName: string;
  product: string;
  productIcon: 'education' | 'it' | 'retail' | 'real-estate' | 'people';
  suspensionReason: string;
  clearanceRef: string;
  requestedBy: string;
  requestedOn: string;
  status: 'Ready to Reactivate' | 'Under Review' | 'Reactivated' | 'Rejected';
  plan: string;
}

export interface SuspensionHistoryItem {
  id: string;
  dateTime: string;
  tenantName: string;
  product: string;
  productIcon: 'education' | 'it' | 'retail' | 'real-estate' | 'people';
  eventType: 'Suspension' | 'Reactivation';
  reason: string;
  initiatedBy: string;
  approvedBy: string;
  downtime: string;
  status: 'Enforced' | 'Resolved';
}

const INITIAL_SUSPENSION_REQUESTS: SuspensionRequestItem[] = [
  {
    id: 'sreq-1',
    requestId: 'REQ-SUS-0101',
    tenantId: 'CUST-RE-0004',
    tenantName: 'Shree Properties',
    product: 'Real Estate',
    productIcon: 'real-estate',
    reason: 'Subscription payment overdue for more than 45 days',
    requestedBy: 'Finance Ops (Billing Alert)',
    requestedOn: '18 Nov 2026, 09:30 AM',
    priority: 'High',
    status: 'Pending Approval',
    arr: '₹8,40,000',
    usersCount: 85,
  },
  {
    id: 'sreq-2',
    requestId: 'REQ-SUS-0102',
    tenantId: 'CUST-RET-0003',
    tenantName: 'City Retail Mart',
    product: 'Retail',
    productIcon: 'retail',
    reason: 'API rate limit breach & unusual database load spikes',
    requestedBy: 'SecOps Automated Bot',
    requestedOn: '17 Nov 2026, 02:15 PM',
    priority: 'Critical',
    status: 'Pending Approval',
    arr: '₹6,00,000',
    usersCount: 60,
  },
  {
    id: 'sreq-3',
    requestId: 'REQ-SUS-0103',
    tenantId: 'CUST-LOG-0008',
    tenantName: 'Apex Logistics Ltd',
    product: 'People',
    productIcon: 'people',
    reason: 'Customer requested seasonal operational pause for Q4',
    requestedBy: 'Ananya Sharma (Account Exec)',
    requestedOn: '16 Nov 2026, 11:40 AM',
    priority: 'Normal',
    status: 'Pending Approval',
    arr: '₹14,20,000',
    usersCount: 140,
  },
];

const INITIAL_REACTIVATION_REQUESTS: ReactivationRequestItem[] = [
  {
    id: 'rreq-1',
    requestId: 'REQ-REC-0201',
    tenantId: 'CUST-EDU-0001',
    tenantName: 'Bright Future School',
    product: 'Education',
    productIcon: 'education',
    suspensionReason: 'Temporary billing reconciliation pause',
    clearanceRef: 'TXN-9842100 (₹12,00,000 Verified)',
    requestedBy: 'Finance / Accounts Desk',
    requestedOn: '18 Nov 2026, 10:15 AM',
    status: 'Ready to Reactivate',
    plan: 'Professional',
  },
  {
    id: 'rreq-2',
    requestId: 'REQ-REC-0202',
    tenantId: 'CUST-IT-0002',
    tenantName: 'NextGen IT Solutions',
    product: 'IT',
    productIcon: 'it',
    suspensionReason: 'Security configuration audit pending',
    clearanceRef: 'Clean Security Audit Certificate #4412',
    requestedBy: 'Anita Sharma (VP Operations)',
    requestedOn: '17 Nov 2026, 04:30 PM',
    status: 'Ready to Reactivate',
    plan: 'Professional',
  },
];

const INITIAL_SUSPENSION_HISTORY: SuspensionHistoryItem[] = [
  {
    id: 'hist-1',
    dateTime: '18 Nov 2026, 02:40 PM',
    tenantName: 'NextGen IT Solutions',
    product: 'IT',
    productIcon: 'it',
    eventType: 'Suspension',
    reason: 'Terms of Service Investigation',
    initiatedBy: 'SecOps Sentinel',
    approvedBy: 'SuperAdmin (N. R. Patnaik)',
    downtime: 'Ongoing (3 days)',
    status: 'Enforced',
  },
  {
    id: 'hist-2',
    dateTime: '15 Nov 2026, 11:20 AM',
    tenantName: 'Bright Future School',
    product: 'Education',
    productIcon: 'education',
    eventType: 'Reactivation',
    reason: 'Annual Contract Invoice Payment Cleared',
    initiatedBy: 'Billing Portal',
    approvedBy: 'Ananya Sharma (VP Accounts)',
    downtime: '12 Days Suspended',
    status: 'Resolved',
  },
  {
    id: 'hist-3',
    dateTime: '02 Nov 2026, 04:15 PM',
    tenantName: 'Shree Properties',
    product: 'Real Estate',
    productIcon: 'real-estate',
    eventType: 'Suspension',
    reason: 'Subscription Payment Overdue > 30 Days',
    initiatedBy: 'Auto-Billing Scheduler',
    approvedBy: 'SuperAdmin',
    downtime: '8 Days Suspended',
    status: 'Enforced',
  },
  {
    id: 'hist-4',
    dateTime: '28 Oct 2026, 09:30 AM',
    tenantName: 'City Retail Mart',
    product: 'Retail',
    productIcon: 'retail',
    eventType: 'Reactivation',
    reason: 'Plan Upgrade & License Renewal Completed',
    initiatedBy: 'Sales Desk',
    approvedBy: 'SuperAdmin',
    downtime: '4 Days Suspended',
    status: 'Resolved',
  },
  {
    id: 'hist-5',
    dateTime: '14 Oct 2026, 06:10 PM',
    tenantName: 'PeopleFirst Services',
    product: 'People',
    productIcon: 'people',
    eventType: 'Suspension',
    reason: 'Multi-factor Authentication Failure Threshold',
    initiatedBy: 'Firewall Sentinel',
    approvedBy: 'Auto-Clear Rule',
    downtime: '2 Hours (Auto-cleared)',
    status: 'Resolved',
  },
];

export function TenantSuspensionScreen() {
  const router = useRouter();

  // Tabs: Tenant Directory, Suspension Requests, Reactivation Requests, Suspension History
  const [activeTab, setActiveTab] = useState<
    'list' | 'suspension-requests' | 'reactivation-requests' | 'history'
  >('list');

  // Tenants data state
  const [tenants, setTenants] = useState<SuspensionTenantRecord[]>(INITIAL_SUSPENSION_TENANTS);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('susp-2');

  // Requests state
  const [suspensionRequests, setSuspensionRequests] = useState<SuspensionRequestItem[]>(
    INITIAL_SUSPENSION_REQUESTS
  );
  const [reactivationRequests, setReactivationRequests] = useState<ReactivationRequestItem[]>(
    INITIAL_REACTIVATION_REQUESTS
  );
  const [historyList, setHistoryList] = useState<SuspensionHistoryItem[]>(INITIAL_SUSPENSION_HISTORY);

  // Filters for Tenant Directory
  const [searchTerm, setSearchTerm] = useState('');
  const [productFilter, setProductFilter] = useState('All Products');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // Filters for Requests & History
  const [requestSearch, setRequestSearch] = useState('');
  const [historySearch, setHistorySearch] = useState('');
  const [historyFilterType, setHistoryFilterType] = useState('All Events');

  // Modal states
  const [detailModalItem, setDetailModalItem] = useState<any>(null);
  const [proofModalItem, setProofModalItem] = useState<ReactivationRequestItem | null>(null);

  // Form states for manual suspend / reactivate
  const [suspendReason, setSuspendReason] = useState('Non-payment of subscription');
  const [effectiveDate, setEffectiveDate] = useState('2026-11-15');
  const [suspendDuration, setSuspendDuration] = useState<'until' | 'fixed'>('until');
  const [suspendRemarks, setSuspendRemarks] = useState('Subscription overdue for more than 30 days.');

  const [reactivationType, setReactivationType] = useState('Immediate Reactivation');
  const [reactivationPlan, setReactivationPlan] = useState('Standard (Current)');
  const [reactivationRemarks, setReactivationRemarks] = useState('Payment received. Tenant reactivated.');

  const selectedTenant = tenants.find((t) => t.id === selectedTenantId) || tenants[1];

  // Actions
  const handleSuspendTenant = () => {
    setTenants((prev) =>
      prev.map((t) =>
        t.id === selectedTenant.id
          ? {
              ...t,
              status: 'Suspended' as const,
              suspendedOn: '18 Nov 2026',
              suspensionReason: suspendReason,
            }
          : t
      )
    );
    toast.error(`Tenant ${selectedTenant.name} has been suspended.`);
  };

  const handleReactivateTenant = (tenantName?: string) => {
    const targetName = tenantName || selectedTenant.name;
    setTenants((prev) =>
      prev.map((t) =>
        t.name === targetName
          ? {
              ...t,
              status: 'Active' as const,
              suspendedOn: '—',
              suspensionReason: undefined,
            }
          : t
      )
    );
    toast.success(`Tenant ${targetName} has been successfully reactivated!`);
  };

  // Approve a pending suspension request
  const handleApproveSuspensionRequest = (req: SuspensionRequestItem) => {
    setSuspensionRequests((prev) => prev.filter((r) => r.id !== req.id));
    // Add to history
    setHistoryList((prev) => [
      {
        id: `hist-${Date.now()}`,
        dateTime: 'Just now',
        tenantName: req.tenantName,
        product: req.product,
        productIcon: req.productIcon,
        eventType: 'Suspension',
        reason: req.reason,
        initiatedBy: req.requestedBy,
        approvedBy: 'SuperAdmin (N. R. Patnaik)',
        downtime: 'Ongoing',
        status: 'Enforced',
      },
      ...prev,
    ]);
    toast.error(`Suspension approved for ${req.tenantName}`);
  };

  const handleRejectSuspensionRequest = (id: string, name: string) => {
    setSuspensionRequests((prev) => prev.filter((r) => r.id !== id));
    toast.info(`Suspension request rejected for ${name}`);
  };

  // Approve a pending reactivation request
  const handleApproveReactivationRequest = (req: ReactivationRequestItem) => {
    setReactivationRequests((prev) => prev.filter((r) => r.id !== req.id));
    handleReactivateTenant(req.tenantName);
    // Add to history
    setHistoryList((prev) => [
      {
        id: `hist-${Date.now()}`,
        dateTime: 'Just now',
        tenantName: req.tenantName,
        product: req.product,
        productIcon: req.productIcon,
        eventType: 'Reactivation',
        reason: `Clearance: ${req.clearanceRef}`,
        initiatedBy: req.requestedBy,
        approvedBy: 'SuperAdmin (N. R. Patnaik)',
        downtime: 'Restored',
        status: 'Resolved',
      },
      ...prev,
    ]);
  };

  const handleRejectReactivationRequest = (id: string, name: string) => {
    setReactivationRequests((prev) => prev.filter((r) => r.id !== id));
    toast.info(`Reactivation request rejected for ${name}`);
  };

  // Filtered lists
  const filteredTenants = useMemo(() => {
    return tenants.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.tenantId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All Status' || t.status === statusFilter;
      const matchesProduct = productFilter === 'All Products' || t.product === productFilter;
      return matchesSearch && matchesStatus && matchesProduct;
    });
  }, [tenants, searchTerm, statusFilter, productFilter]);

  const filteredSuspensionRequests = useMemo(() => {
    return suspensionRequests.filter((r) => {
      return (
        r.tenantName.toLowerCase().includes(requestSearch.toLowerCase()) ||
        r.requestId.toLowerCase().includes(requestSearch.toLowerCase()) ||
        r.reason.toLowerCase().includes(requestSearch.toLowerCase())
      );
    });
  }, [suspensionRequests, requestSearch]);

  const filteredHistory = useMemo(() => {
    return historyList.filter((h) => {
      const matchesSearch =
        h.tenantName.toLowerCase().includes(historySearch.toLowerCase()) ||
        h.reason.toLowerCase().includes(historySearch.toLowerCase());
      const matchesType =
        historyFilterType === 'All Events' ||
        (historyFilterType === 'Suspensions' && h.eventType === 'Suspension') ||
        (historyFilterType === 'Reactivations' && h.eventType === 'Reactivation');
      return matchesSearch && matchesType;
    });
  }, [historyList, historySearch, historyFilterType]);

  const renderProductIcon = (icon: string) => {
    switch (icon) {
      case 'education':
        return <GraduationCap className="h-4 w-4 text-[#6366f1]" />;
      case 'it':
        return <Laptop className="h-4 w-4 text-[#6366f1]" />;
      case 'retail':
        return <ShoppingCart className="h-4 w-4 text-[#6366f1]" />;
      case 'real-estate':
        return <Building2 className="h-4 w-4 text-[#6366f1]" />;
      default:
        return <Users className="h-4 w-4 text-[#6366f1]" />;
    }
  };

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-12 font-sans text-slate-800 antialiased">
      {/* ══════════════════════════════════════════════════════════════════════
          1. HEADER BAR
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-0.5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-[#6366f1] border border-purple-100 shadow-xs">
            <PauseCircle className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Tenant Suspension &amp; Reactivation
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Temporarily suspend tenant access, manage suspension &amp; reactivation requests, and audit lifecycle history
            </p>
          </div>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setActiveTab('history');
              toast.info('Viewing suspension history log');
            }}
            className="h-9 px-3 text-xs bg-white border-slate-200/90 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 rounded-lg font-medium cursor-pointer"
          >
            <History className="h-3.5 w-3.5 text-[#6366f1]" />
            <span>Audit Trail</span>
          </Button>

          <Button
            type="button"
            onClick={() => {
              setActiveTab('list');
              toast.info('Select a tenant below to initiate suspension or reactivation');
            }}
            className="bg-[#6366f1] hover:bg-[#5046e5] text-white font-semibold text-xs sm:text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Initiate Action</span>
          </Button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          2. 4 TOP KPI METRIC CARDS
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Metric 1: Active Tenants */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
            <CheckCircle2 className="h-5 w-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Active Tenants</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">274</div>
          </div>
        </div>

        {/* Metric 2: Suspended Tenants */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl shrink-0">
            <PauseCircle className="h-5 w-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Suspended Tenants</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">4</div>
          </div>
        </div>

        {/* Metric 3: Reactivation Requests */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex items-center gap-3">
          <div className="p-2.5 bg-purple-50 text-[#6366f1] rounded-xl shrink-0">
            <RotateCcw className="h-5 w-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Reactivation Requests</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{reactivationRequests.length}</div>
          </div>
        </div>

        {/* Metric 4: Pending Suspensions */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex items-center gap-3">
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl shrink-0">
            <Hourglass className="h-5 w-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Pending Suspensions</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{suspensionRequests.length}</div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          3. SUB-NAVIGATION TABS BAR
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { key: 'list', label: 'Tenant Directory', icon: Building2 },
          {
            key: 'suspension-requests',
            label: `Suspension Requests (${suspensionRequests.length})`,
            icon: Hourglass,
          },
          {
            key: 'reactivation-requests',
            label: `Reactivation Requests (${reactivationRequests.length})`,
            icon: RefreshCw,
          },
          { key: 'history', label: 'Suspension History', icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={cn(
                'px-4 py-2 text-xs md:text-sm font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap',
                isActive
                  ? 'bg-[#6366f1] text-white shadow-xs font-bold'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs'
              )}
            >
              <Icon className={cn('h-4 w-4', isActive ? 'text-white' : 'text-[#6366f1]')} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 1: TENANT DIRECTORY (MANUAL CONTROL VIEW)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs">
            <div className="flex flex-wrap items-center gap-2.5 flex-1">
              {/* Search Box */}
              <div className="relative min-w-[240px] flex-1 max-w-sm">
                <Search className="h-4 w-4 text-slate-400 absolute left-2.5 top-2.5" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by tenant name or code..."
                  className="pl-8 h-9 text-xs focus-visible:ring-1 focus-visible:ring-[#6366f1]"
                />
              </div>

              {/* Product Filter */}
              <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-slate-50/50">
                <span className="text-slate-500 font-medium">Product</span>
                <select
                  value={productFilter}
                  onChange={(e) => setProductFilter(e.target.value)}
                  className="bg-transparent font-semibold text-slate-800 border-none outline-none cursor-pointer text-xs"
                >
                  <option value="All Products">All Products</option>
                  <option value="Education">Education</option>
                  <option value="IT">IT</option>
                  <option value="Retail">Retail</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="People">People (HRMS)</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-slate-50/50">
                <span className="text-slate-500 font-medium">Status</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent font-semibold text-slate-800 border-none outline-none cursor-pointer text-xs"
                >
                  <option value="All Status">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* Left 7 cols: Tenant Table */}
            <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl shadow-xs p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[#6366f1]" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Tenants ({filteredTenants.length})
                  </h3>
                </div>
                <span className="text-xs text-slate-500">Click a row to manage</span>
              </div>

              <div className="border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
                      <th className="py-2.5 px-3 w-8 text-center font-bold text-slate-900">#</th>
                      <th className="py-2.5 px-3 font-bold text-slate-900">Tenant Name</th>
                      <th className="py-2.5 px-3 font-bold text-slate-900">Product</th>
                      <th className="py-2.5 px-3 font-bold text-slate-900">Plan</th>
                      <th className="py-2.5 px-3 text-center font-bold text-slate-900">Status</th>
                      <th className="py-2.5 px-3 text-center font-bold text-slate-900">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredTenants.map((t, idx) => (
                      <tr
                        key={t.id}
                        onClick={() => setSelectedTenantId(t.id)}
                        className={cn(
                          'hover:bg-slate-50/80 transition-colors cursor-pointer',
                          selectedTenantId === t.id ? 'bg-purple-50/50' : ''
                        )}
                      >
                        <td className="py-2.5 px-3 text-center text-slate-500 font-semibold text-[11px]">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">
                          <div>
                            <span>{t.name}</span>
                            <span className="block text-[10px] text-slate-400 font-mono font-normal">
                              {t.tenantId}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-slate-700">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#ede9fe] text-[#6d28d9]">
                            {renderProductIcon(t.productIcon)}
                            <span>{t.product}</span>
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-700 font-medium">{t.plan}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={cn(
                              'inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold',
                              t.status === 'Active'
                                ? 'bg-[#dcfce7] text-[#15803d]'
                                : 'bg-[#fef3c7] text-[#b45309]'
                            )}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTenantId(t.id);
                            }}
                            className="p-1 rounded-md text-[#6366f1] hover:bg-purple-50 transition-colors"
                            title="Select Tenant"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right 5 cols: Selected Tenant Details & Timeline */}
            <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl shadow-xs p-5 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Building2 className="h-4.5 w-4.5 text-[#6366f1]" />
                <h3 className="text-sm font-bold text-slate-900">Selected Tenant Overview</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500 font-medium">Tenant Name</span>
                  <span className="col-span-2 font-bold text-slate-900">{selectedTenant.name}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500 font-medium">Tenant ID</span>
                  <span className="col-span-2 font-mono text-slate-700">{selectedTenant.tenantId}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500 font-medium">Product &amp; Plan</span>
                  <span className="col-span-2 text-slate-800 font-semibold">
                    Pegatto {selectedTenant.product} ({selectedTenant.plan})
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500 font-medium">Status</span>
                  <span className="col-span-2">
                    <span
                      className={cn(
                        'inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold',
                        selectedTenant.status === 'Active'
                          ? 'bg-[#dcfce7] text-[#15803d]'
                          : 'bg-[#fef3c7] text-[#b45309]'
                      )}
                    >
                      {selectedTenant.status}
                    </span>
                  </span>
                </div>
                {selectedTenant.suspensionReason && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-slate-500 font-medium">Suspension Reason</span>
                    <span className="col-span-2 text-rose-700 font-medium">
                      {selectedTenant.suspensionReason}
                    </span>
                  </div>
                )}
              </div>

              {/* Lifecycle Timeline */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5 mb-2.5 text-xs font-bold text-slate-900">
                  <Clock className="h-3.5 w-3.5 text-[#6366f1]" />
                  <span>Lifecycle Audit Trail</span>
                </div>

                <div className="space-y-3 pl-1 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                      <span className="font-medium text-slate-700">Registered</span>
                    </div>
                    <span className="text-slate-500 text-[11px]">{selectedTenant.registeredDate}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                      <span className="font-medium text-slate-700">Activated</span>
                    </div>
                    <span className="text-slate-500 text-[11px]">{selectedTenant.activatedDate}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'h-4 w-4 rounded-full flex items-center justify-center font-bold text-[10px]',
                          selectedTenant.status === 'Suspended'
                            ? 'bg-amber-500 text-white'
                            : 'border-2 border-slate-300 text-slate-300'
                        )}
                      >
                        {selectedTenant.status === 'Suspended' ? '||' : ''}
                      </div>
                      <span className="font-medium text-slate-700">Suspended</span>
                    </div>
                    <span className="text-slate-500 text-[11px]">
                      {selectedTenant.status === 'Suspended' ? selectedTenant.suspendedOn : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions for Selected Tenant */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                {selectedTenant.status === 'Active' ? (
                  <Button
                    type="button"
                    onClick={handleSuspendTenant}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold h-9 rounded-xl shadow-xs cursor-pointer"
                  >
                    <PauseCircle className="h-4 w-4" />
                    <span>Suspend Access</span>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() => handleReactivateTenant()}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold h-9 rounded-xl shadow-xs cursor-pointer"
                  >
                    <PlayCircle className="h-4 w-4" />
                    <span>Reactivate Access</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 2: SUSPENSION REQUESTS VIEW
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'suspension-requests' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <Hourglass className="h-5 w-5 text-amber-500" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Pending Suspension Requests ({filteredSuspensionRequests.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Review and enforce tenant suspensions triggered by overdue billing alerts or security spikes.
                </p>
              </div>
            </div>

            <div className="relative min-w-[260px]">
              <Search className="h-4 w-4 text-slate-400 absolute left-2.5 top-2.5" />
              <Input
                value={requestSearch}
                onChange={(e) => setRequestSearch(e.target.value)}
                placeholder="Search by tenant name or reason..."
                className="pl-8 h-9 text-xs focus-visible:ring-1 focus-visible:ring-[#6366f1]"
              />
            </div>
          </div>

          <div className="border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
                  <th className="py-2.5 px-3 w-8 text-center font-bold text-slate-900">#</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900">Request ID</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900">Tenant Name</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900">Product</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900">Reason / Trigger</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900">Requested By</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900">Priority</th>
                  <th className="py-2.5 px-3 text-center font-bold text-slate-900">Status</th>
                  <th className="py-2.5 px-3 text-center w-36 font-bold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredSuspensionRequests.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-400">
                      No pending suspension requests found.
                    </td>
                  </tr>
                ) : (
                  filteredSuspensionRequests.map((req, idx) => (
                    <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3 text-center text-slate-500 font-semibold text-[11px]">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] font-semibold text-[#6366f1]">
                        {req.requestId}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        <span>{req.tenantName}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#ede9fe] text-[#6d28d9]">
                          {renderProductIcon(req.productIcon)}
                          <span>{req.product}</span>
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 max-w-xs">{req.reason}</td>
                      <td className="py-2.5 px-3 text-slate-600 text-[11px]">{req.requestedBy}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={cn(
                            'inline-block px-2 py-0.5 rounded text-[10px] font-bold',
                            req.priority === 'Critical' && 'bg-rose-100 text-rose-700',
                            req.priority === 'High' && 'bg-amber-100 text-amber-800',
                            req.priority === 'Normal' && 'bg-blue-100 text-blue-700'
                          )}
                        >
                          {req.priority}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#fef3c7] text-[#b45309]">
                          {req.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleApproveSuspensionRequest(req)}
                            className="h-7 px-2.5 text-[11px] bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg cursor-pointer"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectSuspensionRequest(req.id, req.tenantName)}
                            className="h-7 px-2 text-[11px] text-rose-600 border-rose-200 hover:bg-rose-50 rounded-lg cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 3: REACTIVATION REQUESTS VIEW
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'reactivation-requests' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <RefreshCw className="h-5 w-5 text-emerald-600" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Reactivation &amp; Restoration Requests ({reactivationRequests.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Approve access restoration for tenants who have completed billing clearance or compliance audits.
                </p>
              </div>
            </div>
          </div>

          <div className="border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
                  <th className="py-2.5 px-3 w-8 text-center font-bold text-slate-900">#</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900">Request ID</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900">Tenant Name</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900">Product</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900">Suspension Reason</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900">Clearance / Payment Proof</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900">Requested By</th>
                  <th className="py-2.5 px-3 text-center font-bold text-slate-900">Status</th>
                  <th className="py-2.5 px-3 text-center w-40 font-bold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {reactivationRequests.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-400">
                      No pending reactivation requests.
                    </td>
                  </tr>
                ) : (
                  reactivationRequests.map((req, idx) => (
                    <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3 text-center text-slate-500 font-semibold text-[11px]">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] font-semibold text-[#6366f1]">
                        {req.requestId}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        <span>{req.tenantName}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#ede9fe] text-[#6d28d9]">
                          {renderProductIcon(req.productIcon)}
                          <span>{req.product}</span>
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{req.suspensionReason}</td>
                      <td className="py-2.5 px-3">
                        <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#dcfce7] text-[#15803d]">
                          {req.clearanceRef}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 text-[11px]">{req.requestedBy}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                          {req.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleApproveReactivationRequest(req)}
                            className="h-7 px-2.5 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg cursor-pointer"
                          >
                            <PlayCircle className="h-3 w-3 mr-1" />
                            Reactivate
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectReactivationRequest(req.id, req.tenantName)}
                            className="h-7 px-2 text-[11px] text-rose-600 border-rose-200 hover:bg-rose-50 rounded-lg cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 4: SUSPENSION HISTORY AUDIT LOG
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <History className="h-5 w-5 text-[#6366f1]" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Suspension &amp; Lifecycle Audit Trail ({filteredHistory.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Detailed timeline of administrative suspension events, approval identities, and downtime durations.
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => toast.success('Exporting audit trail CSV...')}
              className="h-8.5 text-xs text-[#6366f1] border-purple-200 hover:bg-purple-50 gap-1.5 rounded-lg font-semibold"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-50/70 border border-slate-200/70 rounded-xl text-xs">
            <div className="relative min-w-[220px] flex-1 max-w-sm">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <Input
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                placeholder="Search history by tenant or reason..."
                className="pl-8 h-8 text-xs bg-white"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Event Type</span>
              <select
                value={historyFilterType}
                onChange={(e) => setHistoryFilterType(e.target.value)}
                className="h-8 px-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium outline-none cursor-pointer"
              >
                <option value="All Events">All Events</option>
                <option value="Suspensions">Suspensions Only</option>
                <option value="Reactivations">Reactivations Only</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Date Range</span>
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>01 Oct 2026 – 15 Nov 2026</span>
              </div>
            </div>
          </div>

          {/* History Records Table */}
          <div className="border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
                  <th className="py-2.5 px-3 w-8 text-center font-bold text-slate-900">#</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900">Date &amp; Time ⇅</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900">Tenant Name ⇅</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900">Product</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900">Event Type</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900">Reason / Trigger</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900">Initiated By</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900">Approved By</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900">Duration</th>
                  <th className="py-2.5 px-3 text-center font-bold text-slate-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredHistory.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 text-center text-slate-500 font-semibold text-[11px]">
                      {idx + 1}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 font-mono text-[11px] whitespace-nowrap">
                      {item.dateTime}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      {item.tenantName}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#ede9fe] text-[#6d28d9]">
                        {renderProductIcon(item.productIcon)}
                        <span>{item.product}</span>
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold',
                          item.eventType === 'Suspension'
                            ? 'bg-[#fee2e2] text-[#b91c1c]'
                            : 'bg-[#dcfce7] text-[#15803d]'
                        )}
                      >
                        {item.eventType === 'Suspension' ? (
                          <PauseCircle className="h-3 w-3" />
                        ) : (
                          <PlayCircle className="h-3 w-3" />
                        )}
                        <span>{item.eventType}</span>
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 max-w-xs">{item.reason}</td>
                    <td className="py-2.5 px-3 text-slate-600 text-[11px]">{item.initiatedBy}</td>
                    <td className="py-2.5 px-3 text-slate-600 text-[11px]">{item.approvedBy}</td>
                    <td className="py-2.5 px-3 text-slate-700 font-mono text-[11px]">
                      {item.downtime}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={cn(
                          'inline-block px-2 py-0.5 rounded text-[10px] font-bold',
                          item.status === 'Enforced'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        )}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-2 text-xs text-slate-600">
            <span>Showing 1 – {filteredHistory.length} of 48 records</span>
            <div className="flex items-center gap-1">
              <button type="button" className="p-1 border border-slate-200 rounded hover:bg-slate-50">
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button type="button" className="w-6 h-6 rounded bg-[#6366f1] text-white font-bold text-xs">
                1
              </button>
              <button type="button" className="w-6 h-6 rounded border border-slate-200 hover:bg-slate-50 text-xs">
                2
              </button>
              <button type="button" className="w-6 h-6 rounded border border-slate-200 hover:bg-slate-50 text-xs">
                3
              </button>
              <span className="px-1 text-slate-400">...</span>
              <button type="button" className="w-6 h-6 rounded border border-slate-200 hover:bg-slate-50 text-xs">
                10
              </button>
              <button type="button" className="p-1 border border-slate-200 rounded hover:bg-slate-50">
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
