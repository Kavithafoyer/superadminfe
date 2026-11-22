'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Plus,
  Search,
  Download,
  SlidersHorizontal,
  ChevronDown,
  Edit2,
  MoreVertical,
  Eye,
  Trash2,
  Users,
  HardDrive,
  Globe,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  ShieldCheck,
  Server,
  Layers,
  Sparkles,
  Mail,
  Phone,
  Calendar,
  Lock,
  PauseCircle,
  PlayCircle,
  ExternalLink,
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
import { ProductBadgeIcon } from '@/components/products/ProductIcons';

export interface TenantMasterItem {
  id: string;
  code: string;
  name: string;
  product: string;
  plan: string;
  subdomain: string;
  activeUsers: number;
  totalSeats: number;
  storageGb: number;
  status: 'Active' | 'Onboarding' | 'Trial' | 'Suspended';
  since: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  country: string;
  industry: string;
  cloudProvider: string;
  region: string;
  dedicatedDb: boolean;
  customSsl: boolean;
  autoSuspension: boolean;
  assignedModules: string[];
}

const INITIAL_TENANTS: TenantMasterItem[] = [
  {
    id: 't-1',
    code: 'TEN-00481',
    name: 'Euro Textiles Pvt Ltd',
    product: 'Pegatto CRM',
    plan: 'Professional',
    subdomain: 'eurotextiles.pegatto.app',
    activeUsers: 22,
    totalSeats: 25,
    storageGb: 50,
    status: 'Active',
    since: '01 Oct 2025',
    adminName: 'Vikram Patel',
    adminEmail: 'admin@eurotextiles.com',
    adminPhone: '+91 98765 43210',
    country: 'India (IST UTC+5:30)',
    industry: 'Textiles & Manufacturing',
    cloudProvider: 'AWS (Amazon Web Services)',
    region: 'ap-south-1 (Mumbai)',
    dedicatedDb: true,
    customSsl: true,
    autoSuspension: true,
    assignedModules: ['Lead Management', 'Deals & Pipeline', 'WhatsApp Integration', 'Reports & Analytics'],
  },
  {
    id: 't-2',
    code: 'TEN-EDU-0045',
    name: 'BrightSchool Pvt. Ltd.',
    product: 'Pegatto Education',
    plan: 'Professional',
    subdomain: 'brightschool.pegatto.app',
    activeUsers: 94,
    totalSeats: 100,
    storageGb: 100,
    status: 'Active',
    since: '15 Dec 2025',
    adminName: 'Sanjay Sharma',
    adminEmail: 'principal@brightschool.edu',
    adminPhone: '+91 98111 22334',
    country: 'India (IST UTC+5:30)',
    industry: 'Education & Academics',
    cloudProvider: 'AWS (Amazon Web Services)',
    region: 'ap-south-1 (Mumbai)',
    dedicatedDb: true,
    customSsl: true,
    autoSuspension: true,
    assignedModules: ['Student Information', 'Fee & Invoicing', 'Attendance', 'Parent Portal', 'Report Cards'],
  },
  {
    id: 't-3',
    code: 'TEN-IT-0033',
    name: 'CoreTech Solutions',
    product: 'Pegatto IT',
    plan: 'Professional',
    subdomain: 'coretech.pegatto.app',
    activeUsers: 48,
    totalSeats: 50,
    storageGb: 50,
    status: 'Active',
    since: '05 Jan 2026',
    adminName: 'Anil Deshmukh',
    adminEmail: 'it.ops@coretech.io',
    adminPhone: '+91 94220 88776',
    country: 'India (IST UTC+5:30)',
    industry: 'Information Technology',
    cloudProvider: 'Google Cloud Platform (GCP)',
    region: 'asia-south1 (Mumbai)',
    dedicatedDb: false,
    customSsl: true,
    autoSuspension: true,
    assignedModules: ['IT Ticketing', 'Asset Management', 'SLA Monitoring', 'Knowledgebase'],
  },
  {
    id: 't-4',
    code: 'TEN-RTL-0045',
    name: 'RetailMart India',
    product: 'Pegatto Retail',
    plan: 'Business',
    subdomain: 'retailmart.pegatto.app',
    activeUsers: 65,
    totalSeats: 75,
    storageGb: 75,
    status: 'Active',
    since: '15 Jan 2026',
    adminName: 'Meera Kapoor',
    adminEmail: 'admin@retailmart.in',
    adminPhone: '+91 99887 76655',
    country: 'India (IST UTC+5:30)',
    industry: 'Retail & FMCG',
    cloudProvider: 'AWS (Amazon Web Services)',
    region: 'ap-south-1 (Mumbai)',
    dedicatedDb: true,
    customSsl: true,
    autoSuspension: false,
    assignedModules: ['POS Integration', 'Inventory Sync', 'Loyalty Rewards', 'Multi-Store Analytics'],
  },
  {
    id: 't-5',
    code: 'TEN-PEO-0067',
    name: 'PeopleFirst HR',
    product: 'Pegatto People',
    plan: 'Standard',
    subdomain: 'peoplefirst.pegatto.app',
    activeUsers: 18,
    totalSeats: 25,
    storageGb: 25,
    status: 'Trial',
    since: '10 Dec 2025',
    adminName: 'Rohan Verma',
    adminEmail: 'rohan@peoplefirst.org',
    adminPhone: '+91 97654 32109',
    country: 'India (IST UTC+5:30)',
    industry: 'HR Services & Staffing',
    cloudProvider: 'Microsoft Azure',
    region: 'Central India (Pune)',
    dedicatedDb: false,
    customSsl: false,
    autoSuspension: true,
    assignedModules: ['Employee Directory', 'Leave Management', 'Payroll Run'],
  },
  {
    id: 't-6',
    code: 'TEN-CRM-0078',
    name: 'SalesEdge LLP',
    product: 'Pegatto CRM',
    plan: 'Standard',
    subdomain: 'salesedge.pegatto.app',
    activeUsers: 8,
    totalSeats: 10,
    storageGb: 15,
    status: 'Onboarding',
    since: '20 Dec 2025',
    adminName: 'Priya Nambiar',
    adminEmail: 'priya@salesedge.com',
    adminPhone: '+91 98450 11223',
    country: 'India (IST UTC+5:30)',
    industry: 'Real Estate & Consulting',
    cloudProvider: 'AWS (Amazon Web Services)',
    region: 'ap-south-1 (Mumbai)',
    dedicatedDb: false,
    customSsl: false,
    autoSuspension: true,
    assignedModules: ['Contact Management', 'Lead Pipeline'],
  },
  {
    id: 't-7',
    code: 'TEN-REA-0089',
    name: 'RealSpace Builders',
    product: 'Pegatto Real Estate',
    plan: 'Enterprise',
    subdomain: 'realspace.pegatto.app',
    activeUsers: 68,
    totalSeats: 100,
    storageGb: 150,
    status: 'Active',
    since: '01 Oct 2025',
    adminName: 'Harish Goel',
    adminEmail: 'h.goel@realspace.com',
    adminPhone: '+91 98100 44556',
    country: 'India (IST UTC+5:30)',
    industry: 'Real Estate & Construction',
    cloudProvider: 'AWS (Amazon Web Services)',
    region: 'ap-south-1 (Mumbai)',
    dedicatedDb: true,
    customSsl: true,
    autoSuspension: false,
    assignedModules: ['Property Inventory', 'Site Visits', 'Broker Commissions', 'Escrow & Invoicing'],
  },
  {
    id: 't-8',
    code: 'TEN-RTL-0012',
    name: 'TrendRetail Stores',
    product: 'Pegatto Retail',
    plan: 'Professional',
    subdomain: 'trendretail.pegatto.app',
    activeUsers: 14,
    totalSeats: 20,
    storageGb: 30,
    status: 'Suspended',
    since: '01 Apr 2025',
    adminName: 'Kunal Singhania',
    adminEmail: 'kunal@trendretail.com',
    adminPhone: '+91 98223 99887',
    country: 'India (IST UTC+5:30)',
    industry: 'Fashion & Apparel',
    cloudProvider: 'AWS (Amazon Web Services)',
    region: 'ap-south-1 (Mumbai)',
    dedicatedDb: false,
    customSsl: false,
    autoSuspension: true,
    assignedModules: ['POS Billing', 'Inventory'],
  },
];

export interface TenantMasterScreenProps {
  initialMode?: 'overview' | 'edit' | 'create';
  initialTenantId?: string;
}

export function TenantMasterListScreen({
  initialMode = 'overview',
  initialTenantId,
}: TenantMasterScreenProps = {}) {
  const router = useRouter();

  // Master tenants list
  const [tenants, setTenants] = useState<TenantMasterItem[]>(INITIAL_TENANTS);

  // Selected tenant
  const [selectedTenantId, setSelectedTenantId] = useState<string>(() => {
    if (initialTenantId) {
      const found = INITIAL_TENANTS.find((t) => t.id === initialTenantId || t.code === initialTenantId);
      if (found) return found.id;
    }
    return INITIAL_TENANTS[0].id;
  });

  // Drawer / Form state
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);
  const [drawerMode, setDrawerMode] = useState<'overview' | 'edit' | 'create'>(initialMode);
  const [activeSubTab, setActiveSubTab] = useState<'details' | 'subscription' | 'quotas' | 'modules'>('details');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProduct, setFilterProduct] = useState('All Products');
  const [filterStatus, setFilterStatus] = useState('All Statuses');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tenantToDelete, setTenantToDelete] = useState<TenantMasterItem | null>(null);

  // Active selected tenant
  const selectedTenant = useMemo(() => {
    return tenants.find((t) => t.id === selectedTenantId) || tenants[0];
  }, [tenants, selectedTenantId]);

  // Form State
  const [formData, setFormData] = useState<TenantMasterItem>(() => {
    if (initialMode === 'create') {
      return {
        id: `t-${Date.now()}`,
        code: `TEN-00${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        product: 'Pegatto CRM',
        plan: 'Professional',
        subdomain: '',
        activeUsers: 1,
        totalSeats: 10,
        storageGb: 20,
        status: 'Active',
        since: 'Today',
        adminName: '',
        adminEmail: '',
        adminPhone: '',
        country: 'India (IST UTC+5:30)',
        industry: 'Information Technology',
        cloudProvider: 'AWS (Amazon Web Services)',
        region: 'ap-south-1 (Mumbai)',
        dedicatedDb: false,
        customSsl: true,
        autoSuspension: true,
        assignedModules: ['Lead Management', 'Contact Management'],
      };
    }
    if (initialTenantId) {
      const found = INITIAL_TENANTS.find((t) => t.id === initialTenantId || t.code === initialTenantId);
      if (found) return { ...found };
    }
    return { ...INITIAL_TENANTS[0] };
  });

  // Keep form data synced when switching row in overview/edit mode
  const handleSelectTenant = (item: TenantMasterItem, mode: 'overview' | 'edit' = 'overview') => {
    setSelectedTenantId(item.id);
    setFormData({ ...item });
    setDrawerMode(mode);
    setIsDrawerOpen(true);
    setActiveSubTab('details');
  };

  // Open Create Mode in Right Panel
  const handleStartCreate = () => {
    const fresh: TenantMasterItem = {
      id: `t-${Date.now()}`,
      code: `TEN-00${Math.floor(100 + Math.random() * 900)}`,
      name: '',
      product: 'Pegatto CRM',
      plan: 'Professional',
      subdomain: '',
      activeUsers: 1,
      totalSeats: 15,
      storageGb: 25,
      status: 'Active',
      since: 'Today',
      adminName: '',
      adminEmail: '',
      adminPhone: '',
      country: 'India (IST UTC+5:30)',
      industry: 'Information Technology',
      cloudProvider: 'AWS (Amazon Web Services)',
      region: 'ap-south-1 (Mumbai)',
      dedicatedDb: false,
      customSsl: true,
      autoSuspension: true,
      assignedModules: ['Lead Management', 'Contact Management'],
    };
    setFormData(fresh);
    setDrawerMode('create');
    setIsDrawerOpen(true);
    setActiveSubTab('details');
  };

  // Save changes (Create or Update)
  const handleSaveTenant = () => {
    if (!formData.name.trim()) {
      toast.error('Please enter a Tenant Name');
      return;
    }
    if (!formData.adminEmail.trim()) {
      toast.error('Please enter the Primary Admin Email');
      return;
    }

    const finalSubdomain =
      formData.subdomain.trim() ||
      `${formData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.pegatto.app`;

    const updated: TenantMasterItem = {
      ...formData,
      subdomain: finalSubdomain,
    };

    if (drawerMode === 'create') {
      setTenants((prev) => [updated, ...prev]);
      setSelectedTenantId(updated.id);
      setFormData(updated);
      setDrawerMode('overview');
      toast.success(`Tenant organization "${updated.name}" created successfully!`);
    } else {
      setTenants((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setSelectedTenantId(updated.id);
      setFormData(updated);
      setDrawerMode('overview');
      toast.success(`Tenant organization "${updated.name}" updated successfully!`);
    }
  };

  // Delete Tenant
  const handleConfirmDelete = () => {
    if (tenantToDelete) {
      setTenants((prev) => prev.filter((t) => t.id !== tenantToDelete.id));
      toast.success(`Tenant "${tenantToDelete.name}" deleted successfully`);
      if (selectedTenantId === tenantToDelete.id) {
        const remaining = tenants.filter((t) => t.id !== tenantToDelete.id);
        if (remaining.length > 0) {
          setSelectedTenantId(remaining[0].id);
          setFormData({ ...remaining[0] });
        }
      }
      setDeleteModalOpen(false);
      setTenantToDelete(null);
    }
  };

  // Filtered tenants list
  const filteredTenants = useMemo(() => {
    return tenants.filter((t) => {
      if (filterProduct !== 'All Products' && t.product !== filterProduct) return false;
      if (filterStatus !== 'All Statuses' && t.status !== filterStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          t.code.toLowerCase().includes(q) ||
          t.name.toLowerCase().includes(q) ||
          t.subdomain.toLowerCase().includes(q) ||
          t.adminEmail.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [tenants, filterProduct, filterStatus, searchQuery]);

  return (
    <div className="w-full space-y-5 pb-12 font-sans text-slate-800 antialiased">
      {/* 1. BREADCRUMBS & TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <span
              className="hover:text-slate-800 cursor-pointer"
              onClick={() => router.push('/tenant-management/all')}
            >
              Tenant Management
            </span>
            <span className="text-slate-400">&gt;</span>
            <span className="text-slate-800 font-semibold">Tenants (All)</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Tenant Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor, provision, and control all tenant organizations, deployment instances, and seat quotas.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success('Tenant records exported to CSV')}
            className="h-9 gap-1.5 text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            Export
          </Button>

          {/* Add Tenant Button (Opens Form Directly in Side Panel) */}
          <Button
            onClick={handleStartCreate}
            className="h-9 gap-1.5 bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Tenant</span>
          </Button>
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-purple-50 text-[#6222cc] rounded-xl border border-purple-100/70 shrink-0">
            <Building2 className="h-5 w-5 stroke-[1.9]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Total Tenants</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{tenants.length + 278}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100/70 shrink-0">
            <CheckCircle2 className="h-5 w-5 stroke-[1.9]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Active Instances</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">264</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100/70 shrink-0">
            <Users className="h-5 w-5 stroke-[1.9]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Provisioned Seats</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">5,420</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100/70 shrink-0">
            <Clock className="h-5 w-5 stroke-[1.9]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Trials & Onboarding</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">14</h3>
          </div>
        </div>
      </div>

      {/* 3. TWO-COLUMN SPLIT LAYOUT (MATCHING PRODUCT MASTER STANDARD) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: TABLE CONTAINER (7 COLS WHEN DRAWER OPEN, 12 COLS WHEN CLOSED) */}
        <div className={cn(isDrawerOpen ? 'lg:col-span-7' : 'lg:col-span-12', 'space-y-3 transition-all')}>
          {/* Filter Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
              <Input
                placeholder="Search tenant name, code, domain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 text-xs bg-slate-50/60 border-slate-200 rounded-lg focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <select
                  value={filterProduct}
                  onChange={(e) => setFilterProduct(e.target.value)}
                  className="h-8 pl-2.5 pr-7 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-[#6222cc] cursor-pointer"
                >
                  <option>All Products</option>
                  <option>Pegatto CRM</option>
                  <option>Pegatto Education</option>
                  <option>Pegatto IT</option>
                  <option>Pegatto Retail</option>
                  <option>Pegatto People</option>
                  <option>Pegatto Real Estate</option>
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="h-8 pl-2.5 pr-7 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-[#6222cc] cursor-pointer"
                >
                  <option>All Statuses</option>
                  <option>Active</option>
                  <option>Onboarding</option>
                  <option>Trial</option>
                  <option>Suspended</option>
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
              </div>

              {(searchQuery || filterProduct !== 'All Products' || filterStatus !== 'All Statuses') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterProduct('All Products');
                    setFilterStatus('All Statuses');
                  }}
                  className="text-xs text-[#6222cc] font-semibold hover:underline cursor-pointer px-1"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-3 text-center w-10">#</th>
                    <th className="py-3 px-3">Tenant Details</th>
                    <th className="py-3 px-3">Product</th>
                    <th className="py-3 px-3">Plan</th>
                    <th className="py-3 px-3">Seats</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-center w-20">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTenants.map((t, idx) => {
                    const isSelected = selectedTenantId === t.id && isDrawerOpen;
                    return (
                      <tr
                        key={t.id}
                        onClick={() => handleSelectTenant(t, 'overview')}
                        className={cn(
                          'hover:bg-purple-50/40 transition-colors cursor-pointer group',
                          isSelected && 'bg-purple-50/60 font-medium'
                        )}
                      >
                        <td className="py-3 px-3 text-center text-slate-400 font-mono text-[11px]">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-[#6222cc] shrink-0 font-bold">
                              <Building2 className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 group-hover:text-[#6222cc] transition-colors truncate">
                                {t.name}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                                <span>{t.code}</span>
                                <span>&bull;</span>
                                <span className="truncate">{t.subdomain}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded text-[11px] border border-slate-200">
                            {t.product}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-600 font-semibold whitespace-nowrap">
                          {t.plan}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Users className="h-3 w-3 text-slate-400" />
                            <span className="font-semibold text-slate-800">{t.activeUsers}</span>
                            <span className="text-slate-400 text-[10px]">/ {t.totalSeats}</span>
                          </div>
                          <div className="w-16 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                            <div
                              className="h-full bg-[#6222cc] rounded-full"
                              style={{ width: `${Math.min(100, (t.activeUsers / t.totalSeats) * 100)}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold',
                              t.status === 'Active' && 'bg-[#dcfce7] text-[#15803d]',
                              t.status === 'Onboarding' && 'bg-[#e0e7ff] text-[#4338ca]',
                              t.status === 'Trial' && 'bg-purple-100 text-[#6222cc]',
                              t.status === 'Suspended' && 'bg-[#fee2e2] text-[#b91c1c]'
                            )}
                          >
                            <span
                              className={cn(
                                'h-1.5 w-1.5 rounded-full',
                                t.status === 'Active' && 'bg-[#15803d]',
                                t.status === 'Onboarding' && 'bg-[#4338ca]',
                                t.status === 'Trial' && 'bg-[#6222cc]',
                                t.status === 'Suspended' && 'bg-[#b91c1c]'
                              )}
                            />
                            {t.status}
                          </span>
                        </td>
                        <td
                          className="py-3 px-3 text-center whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleSelectTenant(t, 'edit')}
                              className="p-1 rounded text-slate-400 hover:text-[#6222cc] hover:bg-purple-50 transition-colors cursor-pointer"
                              title="Edit Tenant"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSelectTenant(t, 'overview')}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                              title="View Overview"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setTenantToDelete(t);
                                setDeleteModalOpen(true);
                              }}
                              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete Tenant"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="bg-slate-50/75 border-t border-slate-200 px-4 py-2.5 flex items-center justify-between text-xs text-slate-500">
              <div>
                Showing 1-{filteredTenants.length} of {tenants.length} tenants
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span>Rows:</span>
                  <select className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs text-slate-700">
                    <option>10</option>
                    <option>25</option>
                  </select>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400">
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </Button>
                  <span className="px-2 py-0.5 bg-[#6222cc] text-white rounded text-xs font-semibold">
                    1
                  </span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400">
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DEDICATED DRAWER / FORM PANEL (5 COLS) */}
        {isDrawerOpen && (
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-[#6222cc] shrink-0 font-bold">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm truncate">
                      {drawerMode === 'create'
                        ? 'Create New Tenant'
                        : drawerMode === 'edit'
                        ? `Edit: ${formData.name || 'Tenant'}`
                        : selectedTenant.name}
                    </h3>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono truncate">
                    {drawerMode === 'create' ? 'Provision Instance' : formData.code} &bull;{' '}
                    {formData.subdomain || 'pegatto.app'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={cn(
                    'px-2.5 py-0.5 rounded-full text-xs font-semibold',
                    (drawerMode === 'create' ? formData.status : formData.status) === 'Active'
                      ? 'bg-[#dcfce7] text-[#15803d]'
                      : formData.status === 'Onboarding'
                      ? 'bg-[#e0e7ff] text-[#4338ca]'
                      : formData.status === 'Trial'
                      ? 'bg-purple-100 text-[#6222cc]'
                      : 'bg-[#fee2e2] text-[#b91c1c]'
                  )}
                >
                  {drawerMode === 'create' ? 'Draft / New' : formData.status}
                </span>

                {drawerMode === 'overview' ? (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setDrawerMode('edit')}
                    className="h-7 text-xs bg-purple-50 hover:bg-purple-100 text-[#6222cc] border border-purple-200 font-semibold px-2.5 rounded-lg cursor-pointer"
                  >
                    <Edit2 className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDrawerMode('overview')}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                    title="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Pill Subtabs Bar (Matching Product Master) */}
            <div className="flex items-center gap-1.5 p-3 border-b border-slate-100 bg-slate-50/50 text-xs overflow-x-auto">
              {[
                { id: 'details', label: 'Tenant Details' },
                { id: 'subscription', label: 'Plan & Product' },
                { id: 'quotas', label: 'Seats & Quotas' },
                { id: 'modules', label: 'Modules & Policy' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveSubTab(tab.id as any)}
                  className={cn(
                    'px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap',
                    activeSubTab === tab.id
                      ? 'bg-[#6222cc] text-white shadow-2xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Drawer Body */}
            <div className="p-4 text-xs space-y-4">
              {/* MODE 1: OVERVIEW SUMMARY (WHEN IN VIEW/OVERVIEW MODE) */}
              {drawerMode === 'overview' && activeSubTab === 'details' && (
                <div className="space-y-3.5">
                  <div className="p-3.5 bg-gradient-to-r from-purple-50/70 to-indigo-50/50 rounded-xl border border-purple-100/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{selectedTenant.name}</span>
                      <span className="text-[11px] font-mono text-[#6222cc] font-semibold bg-white px-2 py-0.5 rounded border border-purple-100">
                        {selectedTenant.code}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-slate-400" />
                      <a
                        href={`https://${selectedTenant.subdomain}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#6222cc] hover:underline font-medium flex items-center gap-1"
                      >
                        {selectedTenant.subdomain}
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-purple-100/60 text-[11px]">
                      <div>
                        <span className="text-slate-400 block">Product &amp; Tier</span>
                        <span className="font-semibold text-slate-800">
                          {selectedTenant.product} &bull; {selectedTenant.plan}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Industry</span>
                        <span className="font-semibold text-slate-800">{selectedTenant.industry}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact & Hosting Specs */}
                  <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/40 space-y-2">
                    <div className="flex items-center justify-between py-1 border-b border-slate-100 text-xs">
                      <span className="text-slate-500 font-medium flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-slate-400" /> Primary Admin
                      </span>
                      <span className="font-semibold text-slate-800">{selectedTenant.adminName}</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-100 text-xs">
                      <span className="text-slate-500 font-medium flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-slate-400" /> Email
                      </span>
                      <span className="font-mono text-slate-800 font-medium">{selectedTenant.adminEmail}</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-100 text-xs">
                      <span className="text-slate-500 font-medium flex items-center gap-1.5">
                        <Server className="h-3.5 w-3.5 text-slate-400" /> Deployment Cloud
                      </span>
                      <span className="font-medium text-slate-800">{selectedTenant.cloudProvider} ({selectedTenant.region})</span>
                    </div>
                    <div className="flex items-center justify-between py-1 text-xs">
                      <span className="text-slate-500 font-medium flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" /> Tenant Since
                      </span>
                      <span className="font-semibold text-slate-800">{selectedTenant.since}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2.5 pt-2">
                    <Button
                      type="button"
                      onClick={() => setDrawerMode('edit')}
                      className="bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs h-9 rounded-xl font-semibold gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      <span>Edit Tenant</span>
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const newStatus = selectedTenant.status === 'Suspended' ? 'Active' : 'Suspended';
                        setTenants((prev) =>
                          prev.map((t) => (t.id === selectedTenant.id ? { ...t, status: newStatus } : t))
                        );
                        toast.success(`Tenant status changed to ${newStatus}`);
                      }}
                      className="bg-white hover:bg-slate-50 text-slate-700 border-slate-200 text-xs h-9 rounded-xl font-medium gap-1.5 shadow-2xs cursor-pointer"
                    >
                      {selectedTenant.status === 'Suspended' ? (
                        <>
                          <PlayCircle className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Reactivate</span>
                        </>
                      ) : (
                        <>
                          <PauseCircle className="h-3.5 w-3.5 text-rose-600" />
                          <span>Suspend</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* TAB 1: TENANT DETAILS FORM */}
              {(drawerMode !== 'overview' || activeSubTab !== 'details') && activeSubTab === 'details' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">
                        Tenant Name <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Acme Corp Pvt Ltd"
                        className="h-8 text-xs font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">
                        Tenant Code <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        placeholder="e.g. TEN-00481"
                        className="h-8 text-xs font-mono font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">
                        Subdomain URL <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        value={formData.subdomain}
                        onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
                        placeholder="acme.pegatto.app"
                        className="h-8 text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">
                        Status <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full h-8 px-2.5 rounded-lg border border-slate-200 text-xs bg-white font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6222cc]"
                      >
                        <option value="Active">Active</option>
                        <option value="Onboarding">Onboarding</option>
                        <option value="Trial">Trial</option>
                        <option value="Suspended">Suspended</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">
                        Primary Admin Name <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        value={formData.adminName}
                        onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                        placeholder="e.g. Vikram Patel"
                        className="h-8 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">
                        Admin Email <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        type="email"
                        value={formData.adminEmail}
                        onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                        placeholder="admin@company.com"
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Admin Phone</label>
                      <Input
                        value={formData.adminPhone}
                        onChange={(e) => setFormData({ ...formData, adminPhone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="h-8 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Industry</label>
                      <Input
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        placeholder="e.g. Manufacturing, Education"
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SUBSCRIPTION & PLAN FORM */}
              {activeSubTab === 'subscription' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">
                        Product Subscription <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.product}
                        onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                        className="w-full h-8 px-2.5 rounded-lg border border-slate-200 text-xs bg-white font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6222cc]"
                      >
                        <option value="Pegatto CRM">Pegatto CRM</option>
                        <option value="Pegatto Education">Pegatto Education</option>
                        <option value="Pegatto IT">Pegatto IT</option>
                        <option value="Pegatto Retail">Pegatto Retail</option>
                        <option value="Pegatto People">Pegatto People</option>
                        <option value="Pegatto Real Estate">Pegatto Real Estate</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">
                        Plan Edition <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.plan}
                        onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                        className="w-full h-8 px-2.5 rounded-lg border border-slate-200 text-xs bg-white font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6222cc]"
                      >
                        <option value="Professional">Professional Tier</option>
                        <option value="Standard">Standard Tier</option>
                        <option value="Business">Business Tier</option>
                        <option value="Enterprise">Enterprise Custom</option>
                        <option value="Free Core">Free Core</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Country &amp; Jurisdiction</label>
                    <Input
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="e.g. India (IST UTC+5:30)"
                      className="h-8 text-xs"
                    />
                  </div>

                  <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl space-y-1">
                    <span className="font-bold text-[#6222cc] text-xs">Self-Service Customer Portal</span>
                    <p className="text-[11px] text-purple-900 leading-relaxed">
                      Tenant administrators can invite team members and modify billing settings from their dedicated subdomain console.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: SEATS & QUOTAS FORM */}
              {activeSubTab === 'quotas' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">
                        Total User Seats <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        type="number"
                        value={formData.totalSeats}
                        onChange={(e) => setFormData({ ...formData, totalSeats: Number(e.target.value) || 1 })}
                        className="h-8 text-xs font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">
                        Storage Quota (GB) <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        type="number"
                        value={formData.storageGb}
                        onChange={(e) => setFormData({ ...formData, storageGb: Number(e.target.value) || 10 })}
                        className="h-8 text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Cloud Provider</label>
                      <select
                        value={formData.cloudProvider}
                        onChange={(e) => setFormData({ ...formData, cloudProvider: e.target.value })}
                        className="w-full h-8 px-2.5 rounded-lg border border-slate-200 text-xs bg-white font-medium text-slate-800"
                      >
                        <option value="AWS (Amazon Web Services)">AWS (Amazon Web Services)</option>
                        <option value="Google Cloud Platform (GCP)">Google Cloud Platform (GCP)</option>
                        <option value="Microsoft Azure">Microsoft Azure</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Cloud Region</label>
                      <Input
                        value={formData.region}
                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                        className="h-8 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-700 font-medium">Dedicated Database Instance</span>
                      <input
                        type="checkbox"
                        checked={formData.dedicatedDb}
                        onChange={(e) => setFormData({ ...formData, dedicatedDb: e.target.checked })}
                        className="rounded border-slate-300 accent-[#6222cc] text-[#6222cc] h-4 w-4 cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-700 font-medium">Auto-Suspension on Non-Payment</span>
                      <input
                        type="checkbox"
                        checked={formData.autoSuspension}
                        onChange={(e) => setFormData({ ...formData, autoSuspension: e.target.checked })}
                        className="rounded border-slate-300 accent-[#6222cc] text-[#6222cc] h-4 w-4 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: MODULES & ACCESS */}
              {activeSubTab === 'modules' && (
                <div className="space-y-3">
                  <div>
                    <h4 className="font-bold text-slate-900">Provisioned Modules &amp; Add-ons</h4>
                    <p className="text-[11px] text-slate-500">
                      Enable or restrict application capabilities for this tenant organization.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50/70 rounded-xl border border-slate-200">
                    {[
                      'Lead Management',
                      'Deals & Pipeline',
                      'WhatsApp Integration',
                      'Reports & Analytics',
                      'Fee & Invoicing',
                      'Student Information',
                      'Attendance (Biometric)',
                      'Custom Roles & RBAC',
                    ].map((mod) => {
                      const isChecked = formData.assignedModules?.includes(mod) ?? true;
                      return (
                        <label key={mod} className="flex items-center gap-2 text-[11px] text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const current = formData.assignedModules || [];
                              const updated = e.target.checked
                                ? [...current, mod]
                                : current.filter((m) => m !== mod);
                              setFormData({ ...formData, assignedModules: updated });
                            }}
                            className="rounded border-slate-300 accent-[#6222cc] text-[#6222cc] h-3.5 w-3.5 cursor-pointer"
                          />
                          <span>{mod}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ACTION FOOTER BUTTONS (WHEN CREATING OR EDITING) */}
              {drawerMode !== 'overview' && (
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDrawerMode('overview')}
                    className="text-xs h-8.5 px-3 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFormData({ ...formData, status: 'Onboarding' });
                        handleSaveTenant();
                      }}
                      className="text-xs h-8.5 px-3 rounded-lg border-purple-200 text-[#6222cc] hover:bg-purple-50 cursor-pointer font-medium"
                    >
                      Save Draft
                    </Button>

                    <Button
                      type="button"
                      onClick={handleSaveTenant}
                      className="bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs h-8.5 px-4 rounded-lg font-semibold shadow-xs cursor-pointer"
                    >
                      {drawerMode === 'create' ? 'Create Tenant' : 'Update Tenant'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CONFIRM DELETE MODAL */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Delete Tenant Organization
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Are you sure you want to delete {tenantToDelete?.name} ({tenantToDelete?.code})? This will suspend all user logins and purge instance data.
            </DialogDescription>
          </DialogHeader>

          <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-800">
            This action cannot be undone. All active user accounts and billing subscriptions will be terminated.
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmDelete}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
