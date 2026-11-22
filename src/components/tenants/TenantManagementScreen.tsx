'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Users,
  Settings,
  Database,
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  Search,
  Filter,
  Eye,
  Check,
  X,
  Clock,
  ArrowRight,
  Sparkles,
  Rocket,
  Upload,
  Download,
  Trash2,
  RotateCcw,
  RefreshCw,
  Edit2,
  MoreVertical,
  GraduationCap,
  Laptop,
  ShoppingCart,
  Calendar,
  Layers,
  Shield,
  Hourglass,
  Pause,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Mail,
  Phone,
  User,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  INITIAL_PENDING_TENANTS,
  INITIAL_TENANTS_LIFECYCLE,
  INITIAL_EXPORT_HISTORY,
  PendingTenant,
  TenantRecord,
  ExportHistoryRecord,
} from './tenantData';
import { TenantRetentionPolicyScreen } from './TenantRetentionPolicyScreen';

export interface TenantManagementScreenProps {
  initialTab?: 'registration' | 'onboarding' | 'lifecycle' | 'export-deletion' | 'settings';
  initialSubTab?: string;
}

export function TenantManagementScreen({ initialTab = 'onboarding', initialSubTab }: TenantManagementScreenProps) {
  const router = useRouter();

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<
    'registration' | 'onboarding' | 'lifecycle' | 'export-deletion' | 'settings'
  >(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabClick = (key: 'registration' | 'onboarding' | 'lifecycle' | 'export-deletion' | 'settings') => {
    setActiveTab(key);
    router.push(`/tenant-management/${key}`);
  };

  // Shared Data States
  const [pendingTenants, setPendingTenants] = useState<PendingTenant[]>(INITIAL_PENDING_TENANTS);
  const [selectedPendingTenantId, setSelectedPendingTenantId] = useState<string>('pt-1');
  const [tenantsLifecycle, setTenantsLifecycle] = useState<TenantRecord[]>(INITIAL_TENANTS_LIFECYCLE);
  const [exportHistory, setExportHistory] = useState<ExportHistoryRecord[]>(INITIAL_EXPORT_HISTORY);

  // Filters & Sub-Tabs
  const [selectedProductFilter, setSelectedProductFilter] = useState('Pegatto Education');
  const [selectedEditionFilter, setSelectedEditionFilter] = useState('Standard');
  const [searchPending, setSearchPending] = useState('');
  const [searchLifecycle, setSearchLifecycle] = useState('');

  // Export & Deletion Sub-Tab (Image 3 vs 4)
  const [exportSubTab, setExportSubTab] = useState<'export' | 'deletion' | 'history' | 'data-retention' | 'policy'>(
    (initialSubTab as any) || 'deletion'
  );

  React.useEffect(() => {
    if (initialSubTab) {
      setExportSubTab(initialSubTab as any);
    }
  }, [initialSubTab]);

  // Export form state (Image 4)
  const [exportTenant, setExportTenant] = useState('Bright Future School');
  const [exportFormat, setExportFormat] = useState('ZIP (CSV + JSON + Attachments)');
  const [exportScope, setExportScope] = useState('All Data (Recommended)');

  // Deletion form state (Image 4)
  const [deleteTenant, setDeleteTenant] = useState('NextGen IT Solutions');
  const [deletionType, setDeletionType] = useState<'soft' | 'permanent'>('soft');
  const [deleteReason, setDeleteReason] = useState('Client requested permanent deletion after contract closure.');
  const [confirmDelete, setConfirmDelete] = useState(true);
  const [deleteScopeAll, setDeleteScopeAll] = useState(true);
  const [deleteScopeItems, setDeleteScopeItems] = useState({
    users: false,
    business: false,
    docs: false,
    config: false,
    audit: false,
  });

  // Selected Pending Tenant object
  const selectedPendingTenant =
    pendingTenants.find((t) => t.id === selectedPendingTenantId) || pendingTenants[0];

  // Product Icon Helper
  const renderProductIcon = (icon: string) => {
    switch (icon) {
      case 'education':
        return <GraduationCap className="h-4 w-4 text-purple-600" />;
      case 'it':
        return <Laptop className="h-4 w-4 text-blue-600" />;
      case 'retail':
        return <ShoppingCart className="h-4 w-4 text-rose-600" />;
      case 'real-estate':
        return <Building2 className="h-4 w-4 text-[#1574fe]" />;
      case 'people':
      default:
        return <Users className="h-4 w-4 text-purple-600" />;
    }
  };

  // Actions
  const handleApproveTenant = (id: string, name: string) => {
    setPendingTenants((prev) => prev.filter((t) => t.id !== id));
    toast.success(`${name} has been approved and moved to Onboarding!`);
  };

  const handleRejectTenant = (id: string, name: string) => {
    setPendingTenants((prev) => prev.filter((t) => t.id !== id));
    toast.error(`${name} registration has been rejected.`);
  };

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-8">
      {/* ==============================================================
          SCREEN 1: APPROVAL & ONBOARDING (Image 1)
         ============================================================== */}
      {activeTab === 'onboarding' && (
        <div className="space-y-4">
          {/* Header Bar matching Image 1 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-0.5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl shadow-xs">
                <Settings className="h-7 w-7 text-[#1574fe]" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Approval & Onboarding
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Review, approve and onboard new tenants to Pegatto
                </p>
              </div>
            </div>

            {/* Top Right Controls */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs shadow-xs">
                <span className="text-slate-400 font-medium">Product</span>
                <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <GraduationCap className="h-4 w-4 text-[#1574fe]" />
                  <select
                    value={selectedProductFilter}
                    onChange={(e) => setSelectedProductFilter(e.target.value)}
                    className="bg-transparent border-none outline-hidden cursor-pointer"
                  >
                    <option value="Pegatto Education">Pegatto Education</option>
                    <option value="Pegatto IT">Pegatto IT</option>
                    <option value="Pegatto Retail">Pegatto Retail</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs shadow-xs">
                <span className="text-slate-400 font-medium">Edition</span>
                <select
                  value={selectedEditionFilter}
                  onChange={(e) => setSelectedEditionFilter(e.target.value)}
                  className="bg-transparent border-none outline-hidden font-semibold text-slate-800 cursor-pointer"
                >
                  <option value="Standard">Standard</option>
                  <option value="Core (Free)">Core (Free)</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>

              <Button
                onClick={() => toast.success('Onboarding wizard launched')}
                className="bg-[#1574fe] hover:bg-[#0d62e0] text-white font-medium text-xs sm:text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Onboard Tenant</span>
              </Button>
            </div>
          </div>

          {/* 5 KPI Metric Cards matching Image 1 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 flex items-center gap-3">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Pending Approvals</p>
                <p className="text-2xl font-bold text-slate-900 mt-0.5">12</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-500">Approved</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xl font-bold text-slate-900">286</span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                    ↑ +8%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">In Onboarding</p>
                <p className="text-2xl font-bold text-slate-900 mt-0.5">18</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 flex items-center gap-3">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Onboarded (30 Days)</p>
                <p className="text-2xl font-bold text-slate-900 mt-0.5">142</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 flex items-center gap-3 col-span-2 sm:col-span-1">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Avg. Onboarding Time</p>
                <p className="text-2xl font-bold text-slate-900 mt-0.5">1.8 Days</p>
              </div>
            </div>
          </div>

          {/* Flow Diagram: Approval & Onboarding Flow */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Layers className="h-4.5 w-4.5 text-[#1574fe]" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Approval & Onboarding Flow</h3>
                <p className="text-xs text-slate-500">From registration to go-live in a few simple steps</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-200/60 overflow-x-auto">
              <div className="flex items-center justify-between min-w-[850px] gap-2">
                {[
                  {
                    step: '1. Registration',
                    sub: '(Tenant Request)',
                    icon: FileText,
                    bg: 'bg-purple-50/80 border-purple-200 text-purple-900',
                    iconColor: 'text-purple-600',
                  },
                  {
                    step: '2. Verification',
                    sub: '(Business & Contact Check)',
                    icon: Search,
                    bg: 'bg-blue-50/80 border-blue-200 text-blue-900',
                    iconColor: 'text-blue-600',
                  },
                  {
                    step: '3. Approval',
                    sub: '(Admin Review)',
                    icon: CheckCircle2,
                    bg: 'bg-purple-50/80 border-purple-200 text-purple-900',
                    iconColor: 'text-purple-600',
                  },
                  {
                    step: '4. Tenant Setup',
                    sub: '(Create Tenant, Assign Product & Plan)',
                    icon: Settings,
                    bg: 'bg-blue-50/80 border-blue-200 text-blue-900',
                    iconColor: 'text-blue-600',
                  },
                  {
                    step: '5. Onboarding',
                    sub: '(Configuration, Users, Training)',
                    icon: GraduationCap,
                    bg: 'bg-purple-50/80 border-purple-200 text-purple-900',
                    iconColor: 'text-purple-600',
                  },
                  {
                    step: '6. Go-Live',
                    sub: '(Activate & Notify)',
                    icon: Rocket,
                    bg: 'bg-emerald-50/80 border-emerald-200 text-emerald-900',
                    iconColor: 'text-emerald-600',
                  },
                ].map((s, idx, arr) => {
                  const SIcon = s.icon;
                  return (
                    <React.Fragment key={s.step}>
                      <div
                        className={cn(
                          'flex-1 p-3 rounded-xl border text-center shadow-xs space-y-1',
                          s.bg
                        )}
                      >
                        <SIcon className={cn('h-5 w-5 mx-auto', s.iconColor)} />
                        <p className="text-xs font-bold leading-tight">{s.step}</p>
                        <p className="text-[10px] opacity-80 leading-tight">{s.sub}</p>
                      </div>
                      {idx < arr.length - 1 && (
                        <ArrowRight className="h-4 w-4 text-slate-400 shrink-0" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Grid: Pending Approvals (Table) + Onboarding Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left 8 cols: Pending Approvals (12) Table */}
            <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FileText className="h-4.5 w-4.5 text-[#1574fe]" />
                  <h3 className="text-sm font-bold text-slate-900">Pending Approvals (12)</h3>
                </div>

                <div className="flex items-center gap-2 max-w-sm ml-auto">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <Input
                      value={searchPending}
                      onChange={(e) => setSearchPending(e.target.value)}
                      placeholder="Search by organization, email..."
                      className="pl-8 pr-3 py-1 text-xs h-8 bg-white border-slate-200 rounded-lg placeholder:text-slate-400"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 px-2.5 text-xs bg-white border-slate-200 hover:bg-slate-50 text-slate-700 gap-1 rounded-lg"
                  >
                    <Filter className="h-3 w-3 text-[#1574fe]" />
                    <span>Filters</span>
                  </Button>
                </div>
              </div>

              {/* Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
                      <th className="py-2.5 px-3 w-8 text-center">
                        <input type="checkbox" className="rounded border-slate-300" />
                      </th>
                      <th className="py-2.5 px-2 w-8 text-center">#</th>
                      <th className="py-2.5 px-3">Organization Name</th>
                      <th className="py-2.5 px-3">Product</th>
                      <th className="py-2.5 px-3">Plan</th>
                      <th className="py-2.5 px-3">Requested On</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 text-center w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pendingTenants.map((pt, idx) => (
                      <tr
                        key={pt.id}
                        onClick={() => setSelectedPendingTenantId(pt.id)}
                        className={cn(
                          'hover:bg-slate-50/80 transition-colors cursor-pointer',
                          selectedPendingTenantId === pt.id ? 'bg-blue-50/40' : ''
                        )}
                      >
                        <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" className="rounded border-slate-300" />
                        </td>
                        <td className="py-2.5 px-2 text-center text-slate-500 font-semibold text-[11px]">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{pt.name}</td>
                        <td className="py-2.5 px-3 text-slate-700">
                          <div className="flex items-center gap-1.5">
                            {renderProductIcon(pt.productIcon)}
                            <span>{pt.product}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">{pt.plan}</td>
                        <td className="py-2.5 px-3 text-slate-600 text-[11px]">{pt.requestedOn}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            {pt.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => toast.info(`Viewing details of ${pt.name}`)}
                              className="p-1 text-slate-500 hover:text-[#1574fe]"
                              title="View"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApproveTenant(pt.id, pt.name)}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                              title="Approve"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRejectTenant(pt.id, pt.name)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded"
                              title="Reject"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right 4 cols: Onboarding Progress */}
            <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Rocket className="h-4.5 w-4.5 text-[#1574fe]" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Onboarding Progress</h3>
                  <p className="text-[11px] text-slate-500">Track onboarding status for approved tenants</p>
                </div>
              </div>

              {/* Selected Tenant Summary & Donut Gauge */}
              <div className="p-3 border border-slate-200/70 rounded-xl bg-slate-50/50 flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                    <Building2 className="h-4 w-4 text-[#1574fe]" />
                    <span>Bright Future School</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Product: Pegatto Education | Plan: Standard
                  </p>
                </div>

                {/* Donut Gauge 60% */}
                <div className="relative w-16 h-16 shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-200"
                      strokeWidth="3.8"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-500"
                      strokeDasharray="60, 100"
                      strokeWidth="3.8"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-extrabold text-slate-900 leading-none">60%</span>
                    <span className="text-[7px] text-slate-500 font-medium">Completed</span>
                  </div>
                </div>
              </div>

              {/* Vertical Progress Timeline */}
              <div className="space-y-2 text-xs">
                {[
                  { text: 'Tenant Created', done: true },
                  { text: 'Product & Plan Assigned', done: true },
                  { text: 'Initial Configuration', done: true },
                  { text: 'User Creation & Training (In Progress)', inProgress: true },
                  { text: 'Data Setup (Optional)', pending: true },
                  { text: 'Go-Live & Activation', pending: true },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      'p-2 rounded-lg flex items-center gap-2.5 transition-all',
                      item.inProgress
                        ? 'bg-purple-50 text-purple-900 font-bold border border-purple-200'
                        : item.done
                        ? 'text-slate-800 font-medium'
                        : 'text-slate-400'
                    )}
                  >
                    {item.done && <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />}
                    {item.inProgress && (
                      <span className="w-4 h-4 rounded-full border-2 border-purple-600 flex items-center justify-center shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                      </span>
                    )}
                    {item.pending && (
                      <span className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
                    )}
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          SCREEN 2: TENANT REGISTRATION & APPROVAL (Image 2)
         ============================================================== */}
      {activeTab === 'registration' && (
        <div className="space-y-4">
          {/* Header Bar matching Image 2 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-0.5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-50 border border-purple-100 rounded-xl shadow-xs">
                <Users className="h-7 w-7 text-[#6366f1]" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Tenant Registration &amp; Approval
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Register new tenants, review details, approve and activate
                </p>
              </div>
            </div>

            <Button
              type="button"
              onClick={() => toast.success('Add Tenant Manually modal')}
              className="bg-[#6366f1] hover:bg-[#5046e5] text-white font-semibold text-xs sm:text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Tenant Manually</span>
            </Button>
          </div>

          {/* 4 Metric Cards matching Image 2 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 flex items-center gap-3">
              <div className="p-2.5 bg-purple-50 text-[#6366f1] rounded-xl shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">New Registrations</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xl font-bold text-slate-900">12</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ede9fe] text-[#6d28d9]">
                    Pending Approval
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Approved Tenants</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xl font-bold text-slate-900">286</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                    ↑ +8%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Active Tenants</p>
                <p className="text-2xl font-bold text-slate-900 mt-0.5">274</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 flex items-center gap-3">
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl shrink-0">
                <XCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Rejected / On Hold</p>
                <p className="text-2xl font-bold text-slate-900 mt-0.5">4</p>
              </div>
            </div>
          </div>

          {/* Registration Flow & Sources matching Image 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Left 8 cols: Registration Flow */}
            <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Layers className="h-4.5 w-4.5 text-[#6366f1]" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Registration Flow</h3>
                  <p className="text-xs text-slate-500">How a tenant gets onboarded</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-200/60 overflow-x-auto">
                <div className="flex items-center justify-between min-w-[650px] gap-2">
                  {[
                    { step: '1. Register', sub: '(Online Form)', icon: FileText, color: 'text-[#6366f1]' },
                    { step: '2. Verify', sub: 'Email / Mobile', icon: Mail, color: 'text-blue-500' },
                    { step: '3. Admin', sub: 'Review', icon: Search, color: 'text-[#6366f1]' },
                    { step: '4. Approve', sub: 'or Reject', icon: CheckCircle2, color: 'text-emerald-700', isHighlighted: true },
                    { step: '5. Tenant', sub: 'Activated (Access & Setup)', icon: Building2, color: 'text-blue-600' },
                  ].map((s, idx, arr) => {
                    const SIcon = s.icon;
                    return (
                      <React.Fragment key={s.step}>
                        <div
                          className={cn(
                            'flex-1 p-2.5 rounded-xl border text-center shadow-2xs space-y-1',
                            s.isHighlighted
                              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-800'
                              : 'bg-white border-slate-200'
                          )}
                        >
                          <SIcon className={cn('h-4 w-4 mx-auto', s.color)} />
                          <p className="text-xs font-bold text-slate-900">{s.step}</p>
                          <p className="text-[10px] text-slate-500">{s.sub}</p>
                        </div>
                        {idx < arr.length - 1 && (
                          <ArrowRight className="h-4 w-4 text-[#6366f1]/60 shrink-0" />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right 4 cols: Registration Sources */}
            <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Zap className="h-4.5 w-4.5 text-[#6366f1]" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Registration Sources</h3>
                </div>
              </div>

              <div className="space-y-2.5 pt-1 text-xs">
                {[
                  { label: 'pegatto.in (Customer Sign-up)', checked: true },
                  { label: 'Partner Portal (Partner Onboarding)', checked: true },
                  { label: 'Referral / Invite Link', checked: true },
                  { label: 'Manual Registration (by Admin)', checked: false },
                ].map((src, i) => (
                  <label key={i} className="flex items-center gap-2 text-slate-800 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={src.checked}
                      className="rounded border-slate-300 text-[#6366f1] focus:ring-[#6366f1] h-4 w-4 accent-[#6366f1]"
                    />
                    <span>{src.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Pending Tenant Approvals + Tenant Details (Selected) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left 7 cols: Table */}
            <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Clock className="h-4.5 w-4.5 text-[#6366f1]" />
                  <h3 className="text-sm font-bold text-slate-900">Pending Tenant Approvals (12)</h3>
                </div>

                <div className="flex items-center gap-2 max-w-xs ml-auto">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <Input
                      value={searchPending}
                      onChange={(e) => setSearchPending(e.target.value)}
                      placeholder="Search tenant..."
                      className="pl-8 pr-3 py-1 text-xs h-8 bg-white border-slate-200 rounded-lg placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-[#6366f1]"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 px-2.5 text-xs bg-white border-slate-200 hover:bg-purple-50 text-[#6366f1] hover:border-purple-200 gap-1 rounded-lg font-semibold"
                  >
                    <Filter className="h-3 w-3 text-[#6366f1]" />
                    <span>Filters</span>
                  </Button>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
                      <th className="py-2.5 px-3 w-8 text-center">
                        <input type="checkbox" className="rounded border-slate-300 accent-[#6366f1]" />
                      </th>
                      <th className="py-2.5 px-2 w-8 text-center">#</th>
                      <th className="py-2.5 px-3">Organization / Tenant Name</th>
                      <th className="py-2.5 px-3">Product</th>
                      <th className="py-2.5 px-3">Requested On</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 text-center w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pendingTenants.map((pt, idx) => (
                      <tr
                        key={pt.id}
                        onClick={() => setSelectedPendingTenantId(pt.id)}
                        className={cn(
                          'hover:bg-slate-50/80 transition-colors cursor-pointer',
                          selectedPendingTenantId === pt.id ? 'bg-purple-50/40' : ''
                        )}
                      >
                        <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" className="rounded border-slate-300 accent-[#6366f1]" />
                        </td>
                        <td className="py-2.5 px-2 text-center text-slate-500 font-semibold text-[11px]">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{pt.name}</td>
                        <td className="py-2.5 px-3 text-slate-700">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#ede9fe] text-[#6d28d9]">
                            {renderProductIcon(pt.productIcon)}
                            <span>{pt.product}</span>
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 text-[11px]">{pt.requestedOn}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#fef3c7] text-[#b45309]">
                            {pt.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedPendingTenantId(pt.id)}
                              className="p-1 text-[#6366f1] hover:bg-purple-50 rounded"
                              title="View"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApproveTenant(pt.id, pt.name)}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                              title="Approve"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRejectTenant(pt.id, pt.name)}
                              className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                              title="Reject"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right 5 cols: Tenant Details (Selected) */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Building2 className="h-4.5 w-4.5 text-[#6366f1]" />
                <h3 className="text-sm font-bold text-slate-900">Tenant Details (Selected)</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500 font-medium">Organization Name</span>
                  <span className="col-span-2 font-bold text-slate-900">{selectedPendingTenant.name}</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500 font-medium">Contact Person</span>
                  <span className="col-span-2 text-slate-800 font-semibold">{selectedPendingTenant.contactPerson}</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500 font-medium">Email</span>
                  <span className="col-span-2 text-[#6366f1] font-medium">{selectedPendingTenant.email}</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500 font-medium">Mobile</span>
                  <span className="col-span-2 text-slate-800">{selectedPendingTenant.mobile}</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500 font-medium">Product (Edition)</span>
                  <span className="col-span-2 font-semibold text-slate-900">
                    Pegatto {selectedPendingTenant.product} ({selectedPendingTenant.plan})
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500 font-medium">Expected Users</span>
                  <span className="col-span-2 text-slate-800 font-bold">{selectedPendingTenant.expectedUsers}</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500 font-medium">Registered On</span>
                  <span className="col-span-2 text-slate-600">{selectedPendingTenant.requestedOn}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleApproveTenant(selectedPendingTenant.id, selectedPendingTenant.name)}
                  className="flex-1 h-8.5 text-xs font-semibold text-emerald-700 bg-emerald-50/60 border-emerald-300 hover:bg-emerald-100 gap-1 rounded-lg"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Approve</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleRejectTenant(selectedPendingTenant.id, selectedPendingTenant.name)}
                  className="flex-1 h-8.5 text-xs font-semibold text-rose-700 bg-rose-50/60 border-rose-300 hover:bg-rose-100 gap-1 rounded-lg"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Reject</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => toast.info('Full details view')}
                  className="flex-1 h-8.5 text-xs font-semibold text-[#6366f1] bg-purple-50/60 border-purple-200 hover:bg-purple-100 gap-1 rounded-lg"
                >
                  <Eye className="h-3.5 w-3.5 text-[#6366f1]" />
                  <span>View &amp; Edit</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          SCREEN 3: TENANT STATUS & LIFECYCLE (Image 5)
         ============================================================== */}
      {activeTab === 'lifecycle' && (
        <div className="space-y-4">
          {/* Header Bar matching Image 5 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-0.5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl shadow-xs">
                <Building2 className="h-7 w-7 text-[#1574fe]" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Tenant Status & Lifecycle
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Track, manage and control the complete tenant lifecycle from registration to offboarding
                </p>
              </div>
            </div>

            {/* Top Right Controls */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs shadow-xs">
                <span className="text-slate-400 font-medium">Product</span>
                <select className="bg-transparent border-none outline-hidden font-semibold text-slate-800 cursor-pointer">
                  <option value="All Products">All Products</option>
                  <option value="Education">Education</option>
                  <option value="IT">IT</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs shadow-xs">
                <span className="text-slate-400 font-medium">Plan</span>
                <select className="bg-transparent border-none outline-hidden font-semibold text-slate-800 cursor-pointer">
                  <option value="All Plans">All Plans</option>
                  <option value="Standard">Standard</option>
                  <option value="Professional">Professional</option>
                </select>
              </div>

              <Button
                onClick={() => toast.success('Register Tenant modal')}
                className="bg-[#1574fe] hover:bg-[#0d62e0] text-white font-medium text-xs sm:text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Register Tenant</span>
              </Button>
            </div>
          </div>

          {/* 6 Metric Cards matching Image 5 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-3.5 flex items-center gap-2.5">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-xl shrink-0">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-500">Total Tenants</p>
                <p className="text-xl font-bold text-slate-900">286</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-3.5 flex items-center gap-2.5">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-semibold text-slate-500">Active</p>
                <div className="flex items-center gap-1">
                  <span className="text-xl font-bold text-slate-900">274</span>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1 rounded-full">
                    ↑ +8%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-3.5 flex items-center gap-2.5">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                <Hourglass className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-500">Trial</p>
                <p className="text-xl font-bold text-slate-900">18</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-3.5 flex items-center gap-2.5">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-xl shrink-0">
                <Settings className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-500">Onboarding</p>
                <p className="text-xl font-bold text-slate-900">12</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-3.5 flex items-center gap-2.5">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl shrink-0">
                <Pause className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-500">Suspended</p>
                <p className="text-xl font-bold text-slate-900">4</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-3.5 flex items-center gap-2.5">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-xl shrink-0">
                <XCircle className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-500">Terminated</p>
                <p className="text-xl font-bold text-slate-900">2</p>
              </div>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200/80">
            {['Tenant Lifecycle', 'Tenant List', 'Lifecycle History', 'Plan & Subscription', 'Renewals & Expiry'].map(
              (t, i) => (
                <button
                  key={t}
                  type="button"
                  className={cn(
                    'px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap',
                    i === 0
                      ? 'bg-[#1574fe] text-white shadow-xs font-bold'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                  )}
                >
                  {t}
                </button>
              )
            )}
          </div>

          {/* Tenant Lifecycle (End-to-End) Flow Canvas matching Image 5 */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <RefreshCw className="h-4.5 w-4.5 text-[#1574fe]" />
              <h3 className="text-sm font-bold text-slate-900">Tenant Lifecycle (End-to-End)</h3>
            </div>

            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200/60 overflow-x-auto">
              <div className="flex items-center justify-between min-w-[900px] gap-3">
                {/* 5 Main Flow Steps */}
                {[
                  { step: '1. Registration', sub: '(Tenant Request)', icon: FileText, color: 'purple' },
                  { step: '2. Approval', sub: '(Admin Review)', icon: CheckCircle2, color: 'blue' },
                  { step: '3. Provisioning', sub: '(Create Tenant, Assign Plan)', icon: Layers, color: 'purple' },
                  { step: '4. Onboarding', sub: '(Configuration, Users, Training)', icon: Users, color: 'blue' },
                  { step: '5. Active', sub: '(Live & In Use)', icon: CheckCircle2, color: 'emerald' },
                ].map((s, idx, arr) => {
                  const SIcon = s.icon;
                  return (
                    <React.Fragment key={s.step}>
                      <div className="flex-1 p-3 rounded-xl border border-slate-200 bg-white text-center shadow-2xs space-y-1">
                        <SIcon className="h-5 w-5 text-[#1574fe] mx-auto" />
                        <p className="text-xs font-bold text-slate-900 leading-tight">{s.step}</p>
                        <p className="text-[10px] text-slate-500 leading-tight">{s.sub}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-400 shrink-0" />
                    </React.Fragment>
                  );
                })}

                {/* 3 State Branches */}
                <div className="flex flex-col gap-1.5 shrink-0 pl-1 border-l border-dashed border-slate-300">
                  <div className="px-2.5 py-1 rounded-lg border border-blue-200 bg-blue-50/80 flex items-center gap-1.5 text-[11px] font-semibold text-blue-900">
                    <Hourglass className="h-3 w-3 text-blue-600 shrink-0" />
                    <span>Trial (Time-bound)</span>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg border border-amber-200 bg-amber-50/80 flex items-center gap-1.5 text-[11px] font-semibold text-amber-900">
                    <Pause className="h-3 w-3 text-amber-600 shrink-0" />
                    <span>Suspended (Temporarily Disabled)</span>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg border border-rose-200 bg-rose-50/80 flex items-center gap-1.5 text-[11px] font-semibold text-rose-900">
                    <XCircle className="h-3 w-3 text-rose-600 shrink-0" />
                    <span>Terminated (Deactivated & Archived)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Tenants (286) Table + Lifecycle Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left 9 cols: Tenants Table */}
            <div className="lg:col-span-9 bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4.5 w-4.5 text-[#1574fe]" />
                  <h3 className="text-sm font-bold text-slate-900">Tenants (286)</h3>
                </div>

                <div className="flex items-center gap-2 max-w-sm ml-auto">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <Input
                      value={searchLifecycle}
                      onChange={(e) => setSearchLifecycle(e.target.value)}
                      placeholder="Search by tenant name, domain, or ID..."
                      className="pl-8 pr-3 py-1 text-xs h-8 bg-white border-slate-200 rounded-lg placeholder:text-slate-400"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 px-2.5 text-xs bg-white border-slate-200 hover:bg-slate-50 text-slate-700 gap-1 rounded-lg"
                  >
                    <Filter className="h-3 w-3 text-[#1574fe]" />
                    <span>Filters</span>
                  </Button>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
                      <th className="py-2.5 px-3 w-8 text-center">
                        <input type="checkbox" className="rounded border-slate-300" />
                      </th>
                      <th className="py-2.5 px-2 w-8 text-center">#</th>
                      <th className="py-2.5 px-3">Tenant Name</th>
                      <th className="py-2.5 px-3">Product</th>
                      <th className="py-2.5 px-3">Plan</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3">Since</th>
                      <th className="py-2.5 px-3">Next Renewal</th>
                      <th className="py-2.5 px-3 text-center">Lifecycle</th>
                      <th className="py-2.5 px-3 text-center w-20">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tenantsLifecycle.map((t, idx) => (
                      <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 text-center">
                          <input type="checkbox" className="rounded border-slate-300" />
                        </td>
                        <td className="py-2.5 px-2 text-center text-slate-500 font-semibold text-[11px]">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{t.name}</td>
                        <td className="py-2.5 px-3 text-slate-700">
                          <div className="flex items-center gap-1.5">
                            {renderProductIcon(t.productIcon)}
                            <span>{t.product}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">{t.plan}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={cn(
                              'inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold',
                              t.status === 'Active'
                                ? 'bg-emerald-100 text-emerald-700'
                                : t.status === 'Onboarding'
                                ? 'bg-purple-100 text-purple-700'
                                : t.status === 'Trial'
                                ? 'bg-blue-100 text-blue-700'
                                : t.status === 'Suspended'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-700'
                            )}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 text-[11px]">{t.since}</td>
                        <td className="py-2.5 px-3 text-slate-600 text-[11px]">{t.nextRenewal}</td>
                        <td className="py-2.5 px-3 text-center">
                          {/* Dot chain */}
                          <div className="flex items-center justify-center gap-1">
                            {[1, 2, 3, 4].map((dot) => (
                              <span
                                key={dot}
                                className={cn(
                                  'w-2 h-2 rounded-full',
                                  dot <= t.lifecycleStage
                                    ? t.status === 'Active'
                                      ? 'bg-emerald-500'
                                      : t.status === 'Onboarding'
                                      ? 'bg-purple-500'
                                      : t.status === 'Trial'
                                      ? 'bg-blue-500'
                                      : t.status === 'Suspended'
                                      ? 'bg-amber-500'
                                      : 'bg-rose-500'
                                    : 'bg-slate-200'
                                )}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => router.push('/customer/overview')}
                              className="p-1 text-slate-500 hover:text-[#1574fe]"
                              title="View"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => toast.info(`Editing ${t.name}`)}
                              className="p-1 text-slate-500 hover:text-[#1574fe]"
                              title="Edit"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => toast.info(`More options for ${t.name}`)}
                              className="p-1 text-slate-400 hover:text-slate-700"
                              title="More"
                            >
                              <MoreVertical className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right 3 cols: Lifecycle Actions */}
            <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Settings className="h-4.5 w-4.5 text-[#1574fe]" />
                <h3 className="text-sm font-bold text-slate-900">Lifecycle Actions</h3>
              </div>

              <div className="space-y-2">
                {[
                  { label: 'Change Status', icon: RefreshCw },
                  { label: 'Extend Trial', icon: Calendar },
                  { label: 'Upgrade / Downgrade Plan', icon: Layers },
                  { label: 'Suspend Tenant', icon: Pause },
                  { label: 'Terminate Tenant', icon: XCircle },
                  { label: 'View Lifecycle History', icon: Clock },
                ].map((act) => {
                  const AIcon = act.icon;
                  return (
                    <Button
                      key={act.label}
                      type="button"
                      variant="outline"
                      onClick={() => toast.info(`${act.label} action triggered`)}
                      className="w-full h-8.5 text-xs font-semibold border-slate-200 hover:bg-slate-50 text-slate-800 justify-start gap-2 rounded-lg"
                    >
                      <AIcon className="h-3.5 w-3.5 text-[#1574fe]" />
                      <span>{act.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          SCREEN 4: TENANT DATA EXPORT & DELETION (Images 3 & 4)
         ============================================================== */}
      {activeTab === 'export-deletion' && (
        <div className="space-y-4">
          {/* Header Bar matching Images 3 & 4 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-0.5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-50 border border-purple-100 rounded-xl shadow-xs">
                <Database className="h-7 w-7 text-[#6366f1]" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Tenant Data Export &amp; Deletion
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Export tenant data for backup, migration or compliance, and securely delete tenant data when required
                </p>
              </div>
            </div>
          </div>

          {/* 4 Metric Cards matching Images 3 & 4 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex items-center gap-3">
              <div className="p-2.5 bg-purple-50 text-[#6366f1] rounded-xl shrink-0">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Total Tenants</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-0.5">286</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                <Upload className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Total Exports</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-0.5">68</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex items-center gap-3">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl shrink-0">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Total Deletions</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-0.5">12</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Retention Policy</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-0.5">5 Years</p>
              </div>
            </div>
          </div>

          {/* Sub Navigation Tabs Bar matching Image 1 */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { key: 'export', label: 'Data Export', icon: Download },
              { key: 'deletion', label: 'Data Deletion', icon: Trash2 },
              { key: 'history', label: 'Export & Deletion History', icon: Clock },
              { key: 'policy', label: 'Retention & Policy', icon: Shield },
            ].map((st) => {
              const SIcon = st.icon;
              const isSelected = exportSubTab === st.key;
              return (
                <button
                  key={st.key}
                  type="button"
                  onClick={() => {
                    setExportSubTab(st.key as any);
                    router.push(`/tenant-management/export-deletion?tab=${st.key}`);
                  }}
                  className={cn(
                    'px-4 py-2 text-xs md:text-sm font-semibold rounded-xl flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer',
                    isSelected
                      ? 'bg-[#6366f1] text-white shadow-xs font-bold'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs'
                  )}
                >
                  <SIcon className={cn('h-4 w-4', isSelected ? 'text-white' : 'text-slate-700')} />
                  <span>{st.label}</span>
                </button>
              );
            })}
          </div>

          {/* VIEW A1: Data Export Form */}
          {exportSubTab === 'export' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Top-Left 8 cols: Export Tenant Data Form */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <Download className="h-4.5 w-4.5 text-[#6366f1]" />
                    <h3 className="text-sm font-bold text-slate-900">Export Tenant Data</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="text-slate-700 font-semibold block mb-1">
                        Select Tenant <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={exportTenant}
                        onChange={(e) => setExportTenant(e.target.value)}
                        className="w-full h-8.5 px-2.5 border border-slate-200 rounded-lg bg-white text-slate-800 outline-hidden font-medium"
                      >
                        <option value="Bright Future School">Bright Future School</option>
                        <option value="NextGen IT Solutions">NextGen IT Solutions</option>
                        <option value="City Retail Mart">City Retail Mart</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-700 font-semibold block mb-1">
                        Data Format <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={exportFormat}
                        onChange={(e) => setExportFormat(e.target.value)}
                        className="w-full h-8.5 px-2.5 border border-slate-200 rounded-lg bg-white text-slate-800 outline-hidden font-medium"
                      >
                        <option value="ZIP (CSV + JSON + Attachments)">ZIP (CSV + JSON + Attachments)</option>
                        <option value="JSON Only">JSON Only</option>
                        <option value="CSV Flat Tables">CSV Flat Tables</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-700 font-semibold block mb-1">
                        Data Scope <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={exportScope}
                        onChange={(e) => setExportScope(e.target.value)}
                        className="w-full h-8.5 px-2.5 border border-slate-200 rounded-lg bg-white text-slate-800 outline-hidden font-medium"
                      >
                        <option value="All Data (Recommended)">All Data (Recommended)</option>
                        <option value="Business Data Only">Business Data Only</option>
                        <option value="User & Role Manifests">User & Role Manifests</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-700 font-semibold block mb-1">Date Range</label>
                      <Input
                        defaultValue="01 Jan 2025 – 15 Nov 2026"
                        className="h-8.5 text-xs bg-white border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="p-2.5 bg-purple-50/70 border border-purple-200 rounded-lg text-xs text-purple-900 flex items-center gap-2">
                    <Database className="h-4 w-4 text-[#6366f1] shrink-0" />
                    <span>The export will include master data, transactions, documents and configuration settings.</span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => toast.info('Export settings reset')}
                      className="h-8.5 px-4 text-xs bg-white border-slate-200"
                    >
                      Reset
                    </Button>
                    <Button
                      type="button"
                      onClick={() => toast.success(`Export job queued for ${exportTenant}!`)}
                      className="h-8.5 px-4 text-xs font-semibold bg-[#6366f1] hover:bg-[#5046e5] text-white gap-1.5 rounded-lg"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Export Data</span>
                    </Button>
                  </div>
                </div>

                {/* Top-Right 4 cols: Export Progress (72%) */}
                <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3.5">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <RefreshCw className="h-4.5 w-4.5 text-[#6366f1] animate-spin" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Export Progress</h3>
                      <p className="text-xs text-slate-500">Exporting: {exportTenant}</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-700">Progress</span>
                      <span className="text-[#6366f1]">72%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div className="bg-[#6366f1] h-full rounded-full transition-all duration-500" style={{ width: '72%' }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                    <span>Records: <strong className="text-slate-900">1,248,360</strong></span>
                    <span>Size: <strong className="text-slate-900">2.4 GB</strong></span>
                  </div>

                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Estimated time: ~ 3 minutes</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW A2: Data Deletion Form (Exact Match with Image media_1795282323413_111e096f.jpg) */}
          {exportSubTab === 'deletion' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start font-sans">
              {/* Left Column: Delete Tenant Data Form (6 cols) */}
              <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Trash2 className="h-5 w-5 text-[#6366f1]" />
                  <h3 className="text-sm font-bold text-slate-900">Delete Tenant Data</h3>
                </div>

                <div className="space-y-3.5 text-xs">
                  {/* Select Tenant */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Select Tenant <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="h-4 w-4 text-[#6366f1] absolute left-3 top-2.5" />
                      <select
                        value={deleteTenant}
                        onChange={(e) => setDeleteTenant(e.target.value)}
                        className="w-full h-9 pl-9 pr-8 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-900 outline-none cursor-pointer appearance-none"
                      >
                        <option value="NextGen IT Solutions">NextGen IT Solutions</option>
                        <option value="Bright Future School">Bright Future School</option>
                        <option value="City Retail Mart">City Retail Mart</option>
                        <option value="Shree Properties">Shree Properties</option>
                        <option value="PeopleFirst Services">PeopleFirst Services</option>
                      </select>
                      <ChevronDown className="h-4 w-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Deletion Type */}
                  <div className="space-y-1.5 pt-0.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Deletion Type <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      <label
                        onClick={() => setDeletionType('soft')}
                        className="flex items-start gap-2.5 cursor-pointer"
                      >
                        <div className="pt-0.5">
                          <div
                            className={cn(
                              'w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all',
                              deletionType === 'soft'
                                ? 'border-[#6366f1]'
                                : 'border-slate-300'
                            )}
                          >
                            {deletionType === 'soft' && (
                              <div className="w-2 h-2 rounded-full bg-[#6366f1]" />
                            )}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900">
                            Soft Delete (Recommended)
                          </span>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                            Disables tenant access and retains data for the retention period (e.g., 5 years).
                          </p>
                        </div>
                      </label>

                      <label
                        onClick={() => setDeletionType('permanent')}
                        className="flex items-start gap-2.5 cursor-pointer pt-1"
                      >
                        <div className="pt-0.5">
                          <div
                            className={cn(
                              'w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all',
                              deletionType === 'permanent'
                                ? 'border-[#6366f1]'
                                : 'border-slate-300'
                            )}
                          >
                            {deletionType === 'permanent' && (
                              <div className="w-2 h-2 rounded-full bg-[#6366f1]" />
                            )}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900">
                            Permanent Delete
                          </span>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                            Permanently and irreversibly removes all tenant data (not recoverable).
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Data Scope */}
                  <div className="space-y-1.5 pt-0.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Data Scope <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-1.5 pl-0.5 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-900">
                        <input
                          type="checkbox"
                          checked={deleteScopeAll}
                          onChange={(e) => {
                            setDeleteScopeAll(e.target.checked);
                            if (e.target.checked) {
                              setDeleteScopeItems({
                                users: false,
                                business: false,
                                docs: false,
                                config: false,
                                audit: false,
                              });
                            }
                          }}
                          className="rounded border-slate-300 text-[#6366f1] focus:ring-[#6366f1] h-4 w-4"
                        />
                        <span>All Tenant Data</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium pl-2">
                        <input
                          type="checkbox"
                          checked={deleteScopeItems.users || deleteScopeAll}
                          disabled={deleteScopeAll}
                          onChange={(e) =>
                            setDeleteScopeItems({ ...deleteScopeItems, users: e.target.checked })
                          }
                          className="rounded border-slate-300 text-[#6366f1] focus:ring-[#6366f1] h-3.5 w-3.5"
                        />
                        <span>Users &amp; Roles (42)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium pl-2">
                        <input
                          type="checkbox"
                          checked={deleteScopeItems.business || deleteScopeAll}
                          disabled={deleteScopeAll}
                          onChange={(e) =>
                            setDeleteScopeItems({ ...deleteScopeItems, business: e.target.checked })
                          }
                          className="rounded border-slate-300 text-[#6366f1] focus:ring-[#6366f1] h-3.5 w-3.5"
                        />
                        <span>Business Data (Leads, Deals, Projects etc.) (1,248,360)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium pl-2">
                        <input
                          type="checkbox"
                          checked={deleteScopeItems.docs || deleteScopeAll}
                          disabled={deleteScopeAll}
                          onChange={(e) =>
                            setDeleteScopeItems({ ...deleteScopeItems, docs: e.target.checked })
                          }
                          className="rounded border-slate-300 text-[#6366f1] focus:ring-[#6366f1] h-3.5 w-3.5"
                        />
                        <span>Documents &amp; Attachments (2.4 GB)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium pl-2">
                        <input
                          type="checkbox"
                          checked={deleteScopeItems.config || deleteScopeAll}
                          disabled={deleteScopeAll}
                          onChange={(e) =>
                            setDeleteScopeItems({ ...deleteScopeItems, config: e.target.checked })
                          }
                          className="rounded border-slate-300 text-[#6366f1] focus:ring-[#6366f1] h-3.5 w-3.5"
                        />
                        <span>Configurations &amp; Settings</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium pl-2">
                        <input
                          type="checkbox"
                          checked={deleteScopeItems.audit || deleteScopeAll}
                          disabled={deleteScopeAll}
                          onChange={(e) =>
                            setDeleteScopeItems({ ...deleteScopeItems, audit: e.target.checked })
                          }
                          className="rounded border-slate-300 text-[#6366f1] focus:ring-[#6366f1] h-3.5 w-3.5"
                        />
                        <span>Audit Logs</span>
                      </label>
                    </div>
                  </div>

                  {/* Reason for Deletion */}
                  <div className="space-y-1 pt-0.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Reason for Deletion <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      value={deleteReason}
                      onChange={(e) => setDeleteReason(e.target.value)}
                      className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-[#6366f1] resize-none"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2.5 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => toast.info('Deletion action cancelled')}
                      className="h-9 px-5 text-xs font-semibold text-[#6366f1] border-purple-200 hover:bg-purple-50 rounded-lg cursor-pointer"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        toast.error(`Initiated tenant deletion for ${deleteTenant}`);
                      }}
                      className="h-9 px-4 text-xs font-semibold bg-[#dc2626] hover:bg-[#b91c1c] text-white gap-1.5 rounded-lg shadow-xs cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete Tenant Data</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Column: Deletion Preview & Policy/Lifecycle (6 cols) */}
              <div className="lg:col-span-6 space-y-4">
                {/* Top Card: Deletion Preview */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <Search className="h-4.5 w-4.5 text-[#6366f1]" />
                    <h3 className="text-sm font-bold text-slate-900">Deletion Preview</h3>
                  </div>

                  <div className="overflow-hidden border border-slate-100 rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
                          <th className="py-2.5 px-3 font-bold">Data Category</th>
                          <th className="py-2.5 px-3 font-bold text-right">Records</th>
                          <th className="py-2.5 px-3 font-bold text-right">Size</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        <tr className="hover:bg-slate-50/70">
                          <td className="py-2.5 px-3 flex items-center gap-2 text-slate-800">
                            <Users className="h-4 w-4 text-[#6366f1]" />
                            <span>Users &amp; Roles</span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-700">42</td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-700">0.3 MB</td>
                        </tr>
                        <tr className="hover:bg-slate-50/70">
                          <td className="py-2.5 px-3 flex items-center gap-2 text-slate-800">
                            <Database className="h-4 w-4 text-[#6366f1]" />
                            <span>Business Data (Leads, Deals, Projects etc.)</span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-700">1,248,360</td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-700">1.9 GB</td>
                        </tr>
                        <tr className="hover:bg-slate-50/70">
                          <td className="py-2.5 px-3 flex items-center gap-2 text-slate-800">
                            <FileText className="h-4 w-4 text-[#6366f1]" />
                            <span>Documents &amp; Attachments</span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-700">5,460</td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-700">2.4 GB</td>
                        </tr>
                        <tr className="hover:bg-slate-50/70">
                          <td className="py-2.5 px-3 flex items-center gap-2 text-slate-800">
                            <Settings className="h-4 w-4 text-[#6366f1]" />
                            <span>Configurations &amp; Settings</span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-700">120</td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-700">0.5 MB</td>
                        </tr>
                        <tr className="hover:bg-slate-50/70">
                          <td className="py-2.5 px-3 flex items-center gap-2 text-slate-800">
                            <Clock className="h-4 w-4 text-[#6366f1]" />
                            <span>Audit Logs</span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-700">18,230</td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-700">120 MB</td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr className="bg-[#f5f3ff] text-slate-900 font-bold border-t border-purple-200">
                          <td className="py-2.5 px-3">Total (All Data)</td>
                          <td className="py-2.5 px-3 text-right font-mono">1,271,752</td>
                          <td className="py-2.5 px-3 text-right font-mono text-purple-900">~2.4 GB</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Bottom Row: Deletion Policy & Deletion Lifecycle (2 cards side by side) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Card 1: Deletion Policy */}
                  <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4.5 space-y-3">
                    <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                      <Shield className="h-4 w-4 text-[#6366f1]" />
                      <h4 className="text-xs font-bold text-slate-900">Deletion Policy</h4>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-slate-700 leading-tight">Data is retained for 5 years (after soft delete).</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-slate-700 leading-tight">Permanent deletion is irreversible and cannot be undone.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-slate-700 leading-tight">A full deletion log is maintained for compliance (GDPR/DPDP).</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Deletion Lifecycle */}
                  <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4.5 space-y-3">
                    <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                      <Clock className="h-4 w-4 text-[#6366f1]" />
                      <h4 className="text-xs font-bold text-slate-900">Deletion Lifecycle</h4>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                          <span className="font-semibold text-slate-800">Request Submitted</span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-600">15 Nov 2026, 10:24 AM</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                          <span className="font-semibold text-slate-800">Approval (Super Admin)</span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-600">15 Nov 2026, 11:02 AM</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full border-2 border-[#6366f1] border-t-transparent animate-spin shrink-0" />
                          <span className="font-bold text-[#6366f1]">Deletion in Progress</span>
                        </div>
                        <span className="text-[11px] font-semibold text-[#6366f1]">In progress...</span>
                      </div>

                      <div className="flex items-center justify-between text-slate-400">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                          <span>Completed</span>
                        </div>
                        <span className="text-[11px] font-mono">—</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW B: Export & Deletion History Table (Image 3) */}
          {exportSubTab === 'history' && (
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Clock className="h-4.5 w-4.5 text-[#1574fe]" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Export & Deletion History</h3>
                  <p className="text-xs text-slate-500">
                    Track all tenant data export and deletion activities with status, details and downloadable logs.
                  </p>
                </div>
              </div>

              {/* Filters Bar matching Image 3 */}
              <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-50/70 border border-slate-200/70 rounded-xl text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-medium">Tenant</span>
                  <select className="h-8 px-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium outline-hidden">
                    <option value="All Tenants">All Tenants</option>
                    <option value="Bright Future School">Bright Future School</option>
                    <option value="NextGen IT Solutions">NextGen IT Solutions</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-medium">Action</span>
                  <select className="h-8 px-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium outline-hidden">
                    <option value="All">All (Export & Deletion)</option>
                    <option value="Export">Export Only</option>
                    <option value="Deletion">Deletion Only</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-medium">Status</span>
                  <select className="h-8 px-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium outline-hidden">
                    <option value="All Status">All Status</option>
                    <option value="Completed">Completed</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-medium">Date Range</span>
                  <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>01 Oct 2026 – 15 Nov 2026</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <Button
                    size="sm"
                    className="h-8 px-4 text-xs font-semibold bg-[#6366f1] hover:bg-[#5046e5] text-white rounded-lg shadow-xs cursor-pointer"
                  >
                    Apply
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-xs bg-white border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg cursor-pointer"
                  >
                    Reset
                  </Button>
                </div>
              </div>

              {/* History Records Table */}
              <div className="border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
                      <th className="py-2.5 px-3 w-8 text-center font-bold text-slate-900">#</th>
                      <th className="py-2.5 px-3 font-bold text-slate-900">Date &amp; Time ⇅</th>
                      <th className="py-2.5 px-3 font-bold text-slate-900">Tenant ⇅</th>
                      <th className="py-2.5 px-3 font-bold text-slate-900">Action ⇅</th>
                      <th className="py-2.5 px-3 font-bold text-slate-900">Data Scope</th>
                      <th className="py-2.5 px-3 font-bold text-slate-900">Initiated By</th>
                      <th className="py-2.5 px-3 font-bold text-slate-900">Status</th>
                      <th className="py-2.5 px-3 text-center font-bold text-slate-900">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {exportHistory.map((row, idx) => (
                      <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 text-center text-slate-500 font-semibold text-[11px]">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3 text-slate-700 font-mono text-[11px]">{row.dateTime}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{row.tenant}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold',
                              row.action === 'Export'
                                ? 'bg-[#ede9fe] text-[#6d28d9]'
                                : 'bg-[#fee2e2] text-[#b91c1c]'
                            )}
                          >
                            {row.action === 'Export' ? (
                              <Upload className="h-3 w-3" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                            <span>{row.action}</span>
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-700">{row.dataScope}</td>
                        <td className="py-2.5 px-3 text-slate-600">{row.initiatedBy}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold',
                              row.status === 'Completed'
                                ? 'bg-[#dcfce7] text-[#15803d]'
                                : 'bg-[#fee2e2] text-[#b91c1c]'
                            )}
                          >
                            {row.status === 'Completed' ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            ) : (
                              <XCircle className="h-3.5 w-3.5 text-rose-600" />
                            )}
                            <span>{row.status}</span>
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {row.status === 'Completed' && row.action === 'Export' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toast.success(`Downloading backup for ${row.tenant}`)}
                                className="h-6.5 text-[11px] px-2 bg-white border-purple-200 text-[#6366f1] hover:bg-purple-50 gap-1 rounded font-semibold cursor-pointer"
                              >
                                <Download className="h-3 w-3 text-[#6366f1]" />
                                <span>Download</span>
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toast.info(`Viewing execution log for ${row.id}`)}
                              className="h-6.5 text-[11px] px-2 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 gap-1 rounded font-medium cursor-pointer"
                            >
                              <FileText className="h-3 w-3 text-slate-500" />
                              <span>Log</span>
                            </Button>
                            {row.status === 'Failed' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toast.info(`Retrying export for ${row.tenant}`)}
                                className="h-6.5 text-[11px] px-2 bg-white border-purple-200 text-[#6366f1] hover:bg-purple-50 gap-1 rounded font-semibold cursor-pointer"
                              >
                                <RefreshCw className="h-3 w-3 text-[#6366f1]" />
                                <span>Retry</span>
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination matching Image 3 & 4 */}
              <div className="flex items-center justify-between pt-2 text-xs text-slate-600">
                <span>Showing 1 – 5 of 68 records</span>
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
                    14
                  </button>
                  <button type="button" className="p-1 border border-slate-200 rounded hover:bg-slate-50">
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW C: Retention & Policy (Image 1) */}
          {(exportSubTab === 'policy' || exportSubTab === 'data-retention') && (
            <TenantRetentionPolicyScreen />
          )}
        </div>
      )}

      {/* ==============================================================
          SCREEN 5: TENANT SETTINGS
         ============================================================== */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900">Tenant Operational Settings</h3>
          <p className="text-xs text-slate-500">
            Configure global quotas, isolation profiles, default domain configurations and tenant lifecycle thresholds.
          </p>
        </div>
      )}
    </div>
  );
}
