'use client';

import React, { useState } from 'react';
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
  },
];

export function TenantMasterListScreen() {
  const router = useRouter();

  const [tenants, setTenants] = useState<TenantMasterItem[]>(INITIAL_TENANTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProduct, setFilterProduct] = useState('All Products');
  const [filterStatus, setFilterStatus] = useState('All Statuses');

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tenantToDelete, setTenantToDelete] = useState<TenantMasterItem | null>(null);

  const filteredTenants = tenants.filter((t) => {
    if (filterProduct !== 'All Products' && t.product !== filterProduct) return false;
    if (filterStatus !== 'All Statuses' && t.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCode = t.code.toLowerCase().includes(q);
      const matchName = t.name.toLowerCase().includes(q);
      const matchSub = t.subdomain.toLowerCase().includes(q);
      if (!matchCode && !matchName && !matchSub) return false;
    }
    return true;
  });

  const handleOpenDelete = (item: TenantMasterItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(null);
    setTenantToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (tenantToDelete) {
      setTenants((prev) => prev.filter((t) => t.id !== tenantToDelete.id));
      toast.success(`Tenant "${tenantToDelete.name}" (${tenantToDelete.code}) deleted successfully`);
      setDeleteModalOpen(false);
      setTenantToDelete(null);
    }
  };

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
            className="h-9 gap-1.5 text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            Export
          </Button>
          <Button
            onClick={() => router.push('/tenant-management/create')}
            className="h-9 gap-1.5 bg-[#5046e5] hover:bg-[#4338ca] text-white text-xs font-semibold shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Tenant
          </Button>
        </div>
      </div>

      {/* 2. FILTER BAR (MATCHING REFERENCE IMAGE 2) */}
      <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
          <Input
            placeholder="Search by Code, Name, Subdomain..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-8 text-xs bg-white border-slate-200 rounded-lg"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Product:</span>
            <div className="relative">
              <select
                value={filterProduct}
                onChange={(e) => setFilterProduct(e.target.value)}
                className="h-8 pl-2.5 pr-7 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-[#5046e5] cursor-pointer"
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
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Status:</span>
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="h-8 pl-2.5 pr-7 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-[#5046e5] cursor-pointer"
              >
                <option>All Statuses</option>
                <option>Active</option>
                <option>Onboarding</option>
                <option>Trial</option>
                <option>Suspended</option>
              </select>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. TABLE CONTAINER (MATCHING REFERENCE IMAGE 2) */}
      <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-xs">
        <div className="p-3.5 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900 tracking-tight">Active Tenants</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-[#5046e5] border border-indigo-100">
              {filteredTenants.length} Tenants
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Showing registered tenant deployment instances
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Tenant / Company</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Plan</th>
                <th className="py-3 px-4">Subdomain</th>
                <th className="py-3 px-4">Users / Seats</th>
                <th className="py-3 px-4">Storage</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTenants.map((t) => {
                const isMenuOpen = activeMenuId === t.id;

                return (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    onClick={() => router.push(`/tenant-management/view/${t.id}`)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#5046e5] whitespace-nowrap">
                      {t.code}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      {t.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                      {t.product}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-[#5046e5] border border-indigo-100">
                        {t.plan}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {t.subdomain}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-800">
                          {t.activeUsers}/{t.totalSeats}
                        </span>
                        <span className="text-[10px] text-slate-400">seats</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {t.storageGb} GB
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold',
                          t.status === 'Active' &&
                            'bg-emerald-50 text-emerald-700 border border-emerald-200',
                          t.status === 'Trial' &&
                            'bg-blue-50 text-blue-700 border border-blue-200',
                          t.status === 'Onboarding' &&
                            'bg-indigo-50 text-indigo-700 border border-indigo-200',
                          t.status === 'Suspended' &&
                            'bg-rose-50 text-rose-700 border border-rose-200'
                        )}
                      >
                        <span
                          className={cn(
                            'h-1.5 w-1.5 rounded-full',
                            t.status === 'Active' && 'bg-emerald-500',
                            t.status === 'Trial' && 'bg-blue-500',
                            t.status === 'Onboarding' && 'bg-indigo-500',
                            t.status === 'Suspended' && 'bg-rose-500'
                          )}
                        />
                        {t.status}
                      </span>
                    </td>
                    <td
                      className="py-3.5 px-4 text-right whitespace-nowrap relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => setActiveMenuId(isMenuOpen ? null : t.id)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {isMenuOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setActiveMenuId(null)}
                          />
                          <div className="absolute right-4 top-10 z-50 w-36 bg-white rounded-lg border border-slate-200 shadow-md py-1 text-xs">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                router.push(`/tenant-management/view/${t.id}`);
                              }}
                              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5 text-slate-500" />
                              <span>Overview</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                router.push(`/tenant-management/edit/${t.id}`);
                              }}
                              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                            >
                              <Edit2 className="h-3.5 w-3.5 text-slate-500" />
                              <span>Edit</span>
                            </button>
                            <div className="border-t border-slate-100 my-0.5" />
                            <button
                              type="button"
                              onClick={(e) => handleOpenDelete(t, e)}
                              className="w-full px-3 py-1.5 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-rose-600" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-slate-50/75 border-t border-slate-200 px-4 py-2.5 flex items-center justify-between text-xs text-slate-500">
          <div>Showing 1-{filteredTenants.length} of {tenants.length} tenants</div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span>Rows per page:</span>
              <select className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs text-slate-700">
                <option>10</option>
                <option>25</option>
              </select>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400">
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="px-2 py-0.5 bg-[#5046e5] text-white rounded text-xs font-semibold">
                1
              </span>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400">
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRM DELETE MODAL */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="h-10 w-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-2">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <DialogTitle className="text-base font-bold text-slate-900">
              Delete Tenant Environment
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 mt-1">
              Are you sure you want to permanently delete{' '}
              <strong className="text-slate-800">
                {tenantToDelete?.name} ({tenantToDelete?.code})
              </strong>
              ? This action will de-provision their cloud databases, subdomain bindings, and user accounts.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeleteModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirmDelete}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
            >
              Delete Tenant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
