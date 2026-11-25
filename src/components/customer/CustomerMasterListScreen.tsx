'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Plus,
  Search,
  Download,
  SlidersHorizontal,
  ChevronDown,
  Edit2,
  Eye,
  Trash2,
  Building2,
  DollarSign,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ArrowLeft,
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

export interface CustomerMasterItem {
  id: string;
  customerId: string;
  name: string;
  industry: string;
  contactPerson: string;
  email: string;
  product: string;
  plan: string;
  arr: string;
  status: 'Active' | 'Expiring' | 'Prospect';
  since: string;
}

const INITIAL_CUSTOMERS: CustomerMasterItem[] = [
  {
    id: 'cust-1',
    customerId: 'CUST-8812',
    name: 'Euro Textiles Pvt Ltd',
    industry: 'Textiles & Manufacturing',
    contactPerson: 'Vikram Patel',
    email: 'vikram@eurotextiles.com',
    product: 'Pegatto CRM',
    plan: 'Professional',
    arr: '₹49,99,000',
    status: 'Active',
    since: '01 Oct 2025',
  },
  {
    id: 'cust-2',
    customerId: 'CUST-EDU-0001',
    name: 'Bright Future School',
    industry: 'Education',
    contactPerson: 'Mr. Ramesh Kumar',
    email: 'ramesh@bfsschool.edu.in',
    product: 'Pegatto Education',
    plan: 'Professional',
    arr: '₹12,00,000',
    status: 'Active',
    since: '01 Mar 2024',
  },
  {
    id: 'cust-3',
    customerId: 'CUST-IT-0002',
    name: 'TechFlow Solutions',
    industry: 'Information Technology',
    contactPerson: 'Ms. Priya Sharma',
    email: 'priya@techflow.io',
    product: 'Pegatto IT',
    plan: 'Enterprise',
    arr: '₹24,50,000',
    status: 'Active',
    since: '15 Jan 2024',
  },
  {
    id: 'cust-4',
    customerId: 'CUST-RET-0003',
    name: 'Metro Retail Mart',
    industry: 'Retail & Supermarkets',
    contactPerson: 'Mr. Rajesh Verma',
    email: 'rajesh@metroretail.com',
    product: 'Pegatto Retail',
    plan: 'Business',
    arr: '₹8,40,000',
    status: 'Expiring',
    since: '10 Nov 2024',
  },
  {
    id: 'cust-5',
    customerId: 'CUST-PEO-0004',
    name: 'Global Workforce Corp',
    industry: 'HRMS & Staffing',
    contactPerson: 'Mr. Sunil Nair',
    email: 'sunil@globalworkforce.com',
    product: 'Pegatto People',
    plan: 'Standard',
    arr: '₹4,80,000',
    status: 'Active',
    since: '05 May 2025',
  },
  {
    id: 'cust-6',
    customerId: 'CUST-REA-0005',
    name: 'Apex Infrastructure Ltd',
    industry: 'Real Estate & Properties',
    contactPerson: 'Mrs. Deepa Menon',
    email: 'deepa@apexinfras.com',
    product: 'Pegatto Real Estate',
    plan: 'Enterprise',
    arr: '₹18,00,000',
    status: 'Active',
    since: '20 Jul 2024',
  },
];

export function CustomerMasterListScreen() {
  const router = useRouter();

  const [customers, setCustomers] = useState<CustomerMasterItem[]>(INITIAL_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('All Industries');
  const [filterStatus, setFilterStatus] = useState('All Statuses');

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<CustomerMasterItem | null>(null);

  const filteredCustomers = customers.filter((c) => {
    if (filterIndustry !== 'All Industries' && c.industry !== filterIndustry) return false;
    if (filterStatus !== 'All Statuses' && c.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCode = c.customerId.toLowerCase().includes(q);
      const matchName = c.name.toLowerCase().includes(q);
      const matchPerson = c.contactPerson.toLowerCase().includes(q);
      if (!matchCode && !matchName && !matchPerson) return false;
    }
    return true;
  });

  const handleOpenDelete = (item: CustomerMasterItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(null);
    setCustomerToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (customerToDelete) {
      setCustomers((prev) => prev.filter((c) => c.id !== customerToDelete.id));
      toast.success(`Customer "${customerToDelete.name}" (${customerToDelete.customerId}) deleted successfully`);
      setDeleteModalOpen(false);
      setCustomerToDelete(null);
    }
  };

  return (
    <div className="w-full space-y-5 pb-12 font-sans text-slate-800 antialiased">
      {/* 1. BREADCRUMBS & TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <span
              className="hover:text-slate-800 cursor-pointer"
              onClick={() => router.push('/customer/master')}
            >
              Customer Management
            </span>
            <span className="text-slate-400">&gt;</span>
            <span className="text-slate-800 font-semibold">Customer Master</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Customer Master
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage global client accounts, enterprise contracts, billing profiles, and relationship executives.
          </p>
        </div>
      </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success('Customer master exported to CSV')}
            className="h-9 gap-1.5 text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            Export
          </Button>
          <Button
            onClick={() => router.push('/customer/master/create')}
            className="h-9 gap-1.5 bg-[#1574fe] hover:bg-[#0d62e0] text-white text-xs font-semibold shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* 2. FILTER BAR (MATCHING REFERENCE IMAGE 2) */}
      <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
          <Input
            placeholder="Search by Customer ID, Name, Contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-8 text-xs bg-white border-slate-200 rounded-lg"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Industry:</span>
            <div className="relative">
              <select
                value={filterIndustry}
                onChange={(e) => setFilterIndustry(e.target.value)}
                className="h-8 pl-2.5 pr-7 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-[#1574fe] cursor-pointer"
              >
                <option>All Industries</option>
                <option>Textiles &amp; Manufacturing</option>
                <option>Education</option>
                <option>Information Technology</option>
                <option>Retail &amp; Supermarkets</option>
                <option>HRMS &amp; Staffing</option>
                <option>Real Estate &amp; Properties</option>
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
                className="h-8 pl-2.5 pr-7 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-[#1574fe] cursor-pointer"
              >
                <option>All Statuses</option>
                <option>Active</option>
                <option>Expiring</option>
                <option>Prospect</option>
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
            <span className="text-xs font-bold text-slate-900 tracking-tight">Customer Accounts</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-[#1574fe] border border-blue-100">
              {filteredCustomers.length} Accounts
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Showing verified client enterprise profiles
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Customer ID</th>
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Industry</th>
                <th className="py-3 px-4">Primary Contact</th>
                <th className="py-3 px-4">Product Suite</th>
                <th className="py-3 px-4">Plan</th>
                <th className="py-3 px-4">ARR (₹)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((c) => {
                const isMenuOpen = activeMenuId === c.id;

                return (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    onClick={() => router.push(`/customer/master/view/${c.id}`)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#1574fe] whitespace-nowrap">
                      {c.customerId}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      {c.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {c.industry}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                      {c.contactPerson}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-[#1574fe] border border-purple-100">
                        {c.product}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {c.plan}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      {c.arr}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold',
                          c.status === 'Active' &&
                            'bg-emerald-50 text-emerald-700 border border-emerald-200',
                          c.status === 'Expiring' &&
                            'bg-amber-50 text-amber-700 border border-amber-200',
                          c.status === 'Prospect' &&
                            'bg-blue-50 text-[#1574fe] border border-blue-200'
                        )}
                      >
                        <span
                          className={cn(
                            'h-1.5 w-1.5 rounded-full',
                            c.status === 'Active' && 'bg-emerald-500',
                            c.status === 'Expiring' && 'bg-amber-500',
                            c.status === 'Prospect' && 'bg-blue-500'
                          )}
                        />
                        {c.status}
                      </span>
                    </td>
                    <td
                      className="py-3.5 px-4 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => router.push(`/customer/master/view/${c.id}`)}
                          title="View Customer Overview"
                          className="p-1 rounded-md text-slate-400 hover:text-[#5046e5] hover:bg-purple-50 transition-colors cursor-pointer"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => router.push(`/customer/master/edit/${c.id}`)}
                          title="Edit Customer"
                          className="p-1 rounded-md text-slate-400 hover:text-[#5046e5] hover:bg-purple-50 transition-colors cursor-pointer"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleOpenDelete(c, e)}
                          title="Delete Customer"
                          className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
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
          <div>Showing 1-{filteredCustomers.length} of {customers.length} customer accounts</div>
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
              <span className="px-2 py-0.5 bg-[#1574fe] text-white rounded text-xs font-semibold">
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
              Delete Customer Account
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 mt-1">
              Are you sure you want to permanently delete{' '}
              <strong className="text-slate-800">
                {customerToDelete?.name} ({customerToDelete?.customerId})
              </strong>
              ? This action will archive all associated commercial contracts and invoicing records.
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
              Delete Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
