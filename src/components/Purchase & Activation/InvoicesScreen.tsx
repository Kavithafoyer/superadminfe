'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Check,
  Clock,
  XCircle,
  Coins,
  Search,
  Download,
  LayoutGrid,
  Eye,
  Mail,
  MoreVertical,
  Plus,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PurchaseActivationTabs } from './PurchaseActivationTabs';
import { INITIAL_INVOICES } from './purchaseActivationData';
import { InvoiceRecord } from './purchaseActivationTypes';
import { getProductBadgeStyle, getStatusBadgeStyle, formatINR } from './purchaseActivationUtils';
import { CreateInvoiceModal } from './CreateInvoiceModal';

export function InvoicesScreen() {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(INITIAL_INVOICES);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord>(INITIAL_INVOICES[0]);
  const [selectedIds, setSelectedIds] = useState<string[]>([INITIAL_INVOICES[0].id]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sub-tabs: All Invoices (1,248), Paid (1,186), Pending (32), Overdue (14), Draft (6), Cancelled (10)
  const [statusSubTab, setStatusSubTab] = useState('All Invoices');

  // Filters
  const [productFilter, setProductFilter] = useState('All Products');
  const [planFilter, setPlanFilter] = useState('All Plans');
  const [tenantFilter, setTenantFilter] = useState('All Tenants');
  const [dateRange, setDateRange] = useState('01 Oct 2026 – 19 Nov 2026');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInvoices = useMemo(() => {
    return invoices.filter((item) => {
      // Sub-tab filter
      if (statusSubTab === 'Paid' && item.status !== 'Paid') return false;
      if (statusSubTab === 'Pending' && item.status !== 'Pending') return false;
      if (statusSubTab === 'Overdue' && item.status !== 'Overdue') return false;
      if (statusSubTab === 'Draft' && item.status !== 'Draft') return false;
      if (statusSubTab === 'Cancelled' && item.status !== 'Cancelled') return false;

      const matchesSearch =
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customerTenant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.productPlan.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesProduct = productFilter === 'All Products' || item.productPlan.includes(productFilter);
      const matchesPlan = planFilter === 'All Plans' || item.productPlan.includes(planFilter);
      const matchesTenant = tenantFilter === 'All Tenants' || item.customerTenant === tenantFilter;

      return matchesSearch && matchesProduct && matchesPlan && matchesTenant;
    });
  }, [invoices, statusSubTab, searchQuery, productFilter, planFilter, tenantFilter]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredInvoices.map((inv) => inv.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    const item = invoices.find((inv) => inv.id === id);
    if (item) setSelectedInvoice(item);
  };

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 max-w-[1700px] mx-auto w-full">
      {/* 1. Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <span>Purchase & Activation</span>
            <span className="text-slate-400">&rsaquo;</span>
            <span className="text-slate-800 dark:text-slate-200 font-bold">Invoices</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Invoices
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Create, view and manage customer invoices for subscriptions, add-ons and other charges.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#6222cc] hover:bg-[#5219b0] text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Create Invoice</span>
        </Button>
      </div>

      {/* 2. Top Metric Cards (5 Cards matching Image) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3.5 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="w-12 h-12 flex items-center justify-center bg-[#f3e8ff] dark:bg-purple-950/60 text-[#8b5cf6] rounded-xl shrink-0">
            <FileText className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Invoices</p>
            <p className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-0.5">1,248</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3.5 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="w-12 h-12 flex items-center justify-center bg-[#dcfce7] dark:bg-emerald-950/60 text-[#16a34a] rounded-xl shrink-0">
            <Check className="h-6 w-6 stroke-[3]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Paid</p>
            <p className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-0.5">1,186</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3.5 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="w-12 h-12 flex items-center justify-center bg-[#ffedd5] dark:bg-amber-950/60 text-[#ea580c] rounded-xl shrink-0">
            <Clock className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pending</p>
            <p className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-0.5">32</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3.5 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="w-12 h-12 flex items-center justify-center bg-[#fee2e2] dark:bg-rose-950/60 text-[#ef4444] rounded-xl shrink-0">
            <XCircle className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Overdue</p>
            <p className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-0.5">14</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3.5 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="w-12 h-12 flex items-center justify-center bg-[#f3e8ff] dark:bg-purple-950/60 text-[#8b5cf6] rounded-xl shrink-0">
            <Coins className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Invoiced Amount</p>
            <p className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-0.5">₹4,86,400</p>
          </div>
        </div>
      </div>

      {/* 3. Horizontal Sub-Menus / Tabs */}
      <PurchaseActivationTabs activeTab="Invoices" />

      {/* 3.1 Status Sub-tabs matching Image */}
      <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold px-1">
        {[
          { label: 'All Invoices (1,248)', key: 'All Invoices' },
          { label: 'Paid (1,186)', key: 'Paid' },
          { label: 'Pending (32)', key: 'Pending' },
          { label: 'Overdue (14)', key: 'Overdue' },
          { label: 'Draft (6)', key: 'Draft' },
          { label: 'Cancelled (10)', key: 'Cancelled' },
        ].map((tab) => {
          const isActive = statusSubTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusSubTab(tab.key)}
              className={cn(
                'pb-2.5 transition-colors relative cursor-pointer',
                isActive
                  ? 'text-[#6222cc] dark:text-[#a78bfa] font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              )}
            >
              <span>{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#6222cc] dark:bg-[#a78bfa] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* 4. Filters Bar */}
      <div className="flex flex-wrap items-end gap-3 text-xs">
        <div className="flex flex-col gap-1 min-w-[125px]">
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Product</span>
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-800 dark:text-slate-200 shadow-2xs font-medium cursor-pointer"
          >
            <option value="All Products">All Products</option>
            <option value="Pegatto CRM">Pegatto CRM</option>
            <option value="Pegatto Education">Pegatto Education</option>
            <option value="Pegatto IT">Pegatto IT</option>
            <option value="Pegatto People">Pegatto People</option>
            <option value="Pegatto Retail">Pegatto Retail</option>
            <option value="Pegatto Real Estate">Pegatto Real Estate</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[110px]">
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Plan / Edition</span>
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-800 dark:text-slate-200 shadow-2xs font-medium cursor-pointer"
          >
            <option value="All Plans">All Plans</option>
            <option value="Standard">Standard</option>
            <option value="Professional">Professional</option>
            <option value="Enterprise">Enterprise</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[125px]">
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Tenant / Customer</span>
          <select
            value={tenantFilter}
            onChange={(e) => setTenantFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-800 dark:text-slate-200 shadow-2xs font-medium cursor-pointer"
          >
            <option value="All Tenants">All Tenants</option>
            <option value="Euro Textiles">Euro Textiles</option>
            <option value="Sunrise School">Sunrise School</option>
            <option value="Prodian Infotech">Prodian Infotech</option>
            <option value="Apex Solutions">Apex Solutions</option>
            <option value="Indra Store">Indra Store</option>
            <option value="City Builders">City Builders</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[180px]">
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Invoice Period</span>
          <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 bg-white dark:bg-slate-800 text-xs shadow-2xs">
            <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent border-none outline-hidden text-xs text-slate-800 dark:text-slate-200 font-medium w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5 ml-auto">
          <button
            type="button"
            onClick={() => {
              setProductFilter('All Products');
              setPlanFilter('All Plans');
              setTenantFilter('All Tenants');
              setDateRange('01 Oct 2026 – 19 Nov 2026');
              setSearchQuery('');
              toast.info('Filters have been reset');
            }}
            className="text-xs font-semibold text-[#6222cc] hover:underline px-2 cursor-pointer pb-1"
          >
            Reset
          </button>
          <Button
            onClick={() => toast.success('Filters applied')}
            className="bg-[#6222cc] hover:bg-[#5219b0] text-white font-semibold text-xs px-5 py-2 rounded-lg shadow-xs cursor-pointer"
          >
            Apply
          </Button>
        </div>
      </div>

      {/* 5. Search Bar & Export Tools */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by invoice No., customer, tenant or amount..."
            className="pl-9 text-xs h-9 bg-white dark:bg-slate-900 rounded-lg border-slate-200 dark:border-slate-800 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            variant="outline"
            onClick={() => toast.success('Exporting invoices')}
            className="text-xs h-9 px-3.5 gap-1.5 text-[#6222cc] border-purple-200 dark:border-purple-900/60 bg-white dark:bg-slate-900 font-semibold shadow-2xs hover:bg-purple-50/50 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-[#6222cc]" />
            <span>Export</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.info('Customize columns modal')}
            className="text-xs h-9 px-3.5 gap-1.5 text-[#6222cc] border-purple-200 dark:border-purple-900/60 bg-white dark:bg-slate-900 font-semibold shadow-2xs hover:bg-purple-50/50 cursor-pointer"
          >
            <LayoutGrid className="h-3.5 w-3.5 text-[#6222cc]" />
            <span>Columns</span>
          </Button>
        </div>
      </div>

      {/* 6. Main Content Area: Table + Right Side Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Table Column (8 cols on large) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.length > 0 && selectedIds.length === filteredInvoices.length
                      }
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-[#6222cc] focus:ring-[#6222cc] cursor-pointer"
                    />
                  </th>
                  <th className="p-3.5 font-bold">Invoice No.</th>
                  <th className="p-3.5 font-bold">Customer / Tenant</th>
                  <th className="p-3.5 font-bold">Product / Plan</th>
                  <th className="p-3.5 font-bold">Invoice Date</th>
                  <th className="p-3.5 font-bold">Due Date</th>
                  <th className="p-3.5 font-bold">Amount (₹)</th>
                  <th className="p-3.5 font-bold">Status</th>
                  <th className="p-3.5 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-slate-400">
                      No invoices found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv) => {
                    const isSelected = selectedInvoice?.id === inv.id;
                    const isChecked = selectedIds.includes(inv.id);
                    const prodName = inv.productPlan.split('–')[0]?.trim() || inv.productPlan;

                    return (
                      <tr
                        key={inv.id}
                        onClick={() => setSelectedInvoice(inv)}
                        className={cn(
                          'hover:bg-purple-50/30 dark:hover:bg-purple-950/20 transition-colors cursor-pointer',
                          isSelected && 'bg-[#f6f2fe] dark:bg-purple-950/40'
                        )}
                      >
                        <td
                          className="p-3.5 text-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSelect(inv.id);
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleSelect(inv.id)}
                            className="rounded border-slate-300 text-[#6222cc] focus:ring-[#6222cc] cursor-pointer"
                          />
                        </td>
                        <td className="p-3.5 font-bold text-[#6222cc] underline underline-offset-2">
                          {inv.id}
                        </td>
                        <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-100">
                          {inv.customerTenant}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={cn(
                              'inline-block px-3 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap',
                              getProductBadgeStyle(prodName)
                            )}
                          >
                            {inv.productPlan}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-700 dark:text-slate-300 whitespace-nowrap font-normal">
                          {inv.invoiceDate}
                        </td>
                        <td className="p-3.5 text-slate-700 dark:text-slate-300 whitespace-nowrap font-normal">
                          {inv.dueDate}
                        </td>
                        <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">
                          {inv.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={cn(
                              'inline-block px-3 py-0.5 rounded-full text-[11px] font-semibold',
                              getStatusBadgeStyle(inv.status)
                            )}
                          >
                            {inv.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          <div
                            className="flex items-center justify-center gap-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => setSelectedInvoice(inv)}
                              title="View Details"
                              className="p-1 rounded-md text-slate-500 hover:text-[#6222cc] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => toast.success(`Downloading ${inv.id}`)}
                              title="Download"
                              className="p-1 rounded-md text-slate-500 hover:text-[#6222cc] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                              <Download className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => toast.info(`Action menu for ${inv.id}`)}
                              className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-3.5 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 gap-3">
            <div className="font-medium text-slate-600 dark:text-slate-400">
              Showing 1-8 of 1,248 invoices
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span>Rows per page:</span>
                <select className="border border-slate-200 dark:border-slate-700 rounded-md px-1.5 py-0.5 text-xs bg-white dark:bg-slate-800 cursor-pointer">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center bg-[#6222cc] text-white shadow-xs"
                >
                  1
                </button>
                <button
                  type="button"
                  className="w-6 h-6 rounded-md font-medium text-xs flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  2
                </button>
                <button
                  type="button"
                  className="w-6 h-6 rounded-md font-medium text-xs flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  3
                </button>
                <button
                  type="button"
                  className="w-6 h-6 rounded-md font-medium text-xs flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  4
                </button>
                <button
                  type="button"
                  className="w-6 h-6 rounded-md font-medium text-xs flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  5
                </button>
                <button
                  type="button"
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                >
                  <ChevronsRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Details Panel */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-4 flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-1">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Invoice Details
            </h3>
            <span className="bg-[#16a34a] text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-2xs">
              {selectedInvoice.status}
            </span>
          </div>

          {/* Subheader */}
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="w-9 h-9 rounded-lg bg-[#f3e8ff] dark:bg-purple-950/60 text-[#8b5cf6] flex items-center justify-center shrink-0">
              <FileText className="h-4 w-4 stroke-[2.5]" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                {selectedInvoice.id}
              </p>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {selectedInvoice.customerTenant} &rsaquo; {selectedInvoice.productPlan}
              </p>
            </div>
          </div>

          {/* Key-Value Details */}
          <div className="space-y-1.5 text-xs">
            <div className="grid grid-cols-12 gap-1 py-0.5">
              <span className="col-span-5 text-slate-600 dark:text-slate-400 font-medium">Invoice Date</span>
              <span className="col-span-7 font-semibold text-slate-900 dark:text-slate-100">
                : {selectedInvoice.invoiceDate}
              </span>
            </div>
            <div className="grid grid-cols-12 gap-1 py-0.5">
              <span className="col-span-5 text-slate-600 dark:text-slate-400 font-medium">Due Date</span>
              <span className="col-span-7 font-semibold text-slate-900 dark:text-slate-100">
                : {selectedInvoice.dueDate}
              </span>
            </div>
            <div className="grid grid-cols-12 gap-1 py-0.5">
              <span className="col-span-5 text-slate-600 dark:text-slate-400 font-medium">Amount (Excl. Tax)</span>
              <span className="col-span-7 font-semibold text-slate-900 dark:text-slate-100">
                : {formatINR(selectedInvoice.amountExclTax)}
              </span>
            </div>
            <div className="grid grid-cols-12 gap-1 py-0.5">
              <span className="col-span-5 text-slate-600 dark:text-slate-400 font-medium">GST (18%)</span>
              <span className="col-span-7 font-semibold text-slate-900 dark:text-slate-100">
                : {formatINR(selectedInvoice.gst18)}
              </span>
            </div>
            <div className="grid grid-cols-12 gap-1 py-0.5 font-bold text-xs">
              <span className="col-span-5 text-slate-900 dark:text-slate-100">Total Amount</span>
              <span className="col-span-7 text-slate-900 dark:text-slate-100">
                : {formatINR(selectedInvoice.amount)}
              </span>
            </div>
          </div>

          {/* Payment Information */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">
              Payment Information
            </h4>
            <div className="grid grid-cols-12 gap-1 py-0.5">
              <span className="col-span-5 text-slate-600 dark:text-slate-400 font-medium">Payment Status</span>
              <span className="col-span-7 font-semibold text-[#16a34a]">
                : {selectedInvoice.paymentInfo?.status || selectedInvoice.status}
              </span>
            </div>
            <div className="grid grid-cols-12 gap-1 py-0.5">
              <span className="col-span-5 text-slate-600 dark:text-slate-400 font-medium">Payment Date</span>
              <span className="col-span-7 font-semibold text-slate-900 dark:text-slate-100">
                : {selectedInvoice.paymentInfo?.date || '19 Nov 2026, 10:20 AM'}
              </span>
            </div>
            <div className="grid grid-cols-12 gap-1 py-0.5">
              <span className="col-span-5 text-slate-600 dark:text-slate-400 font-medium">Payment Method</span>
              <span className="col-span-7 font-semibold text-slate-900 dark:text-slate-100">
                : {selectedInvoice.paymentInfo?.method || 'Razorpay (UPI)'}
              </span>
            </div>
            <div className="grid grid-cols-12 gap-1 py-0.5">
              <span className="col-span-5 text-slate-600 dark:text-slate-400 font-medium">Transaction ID</span>
              <span className="col-span-7 font-mono font-bold text-slate-900 dark:text-slate-100">
                : {selectedInvoice.paymentInfo?.transactionId || 'RZP8FZ7K9A2'}
              </span>
            </div>
          </div>

          {/* Invoice Timeline */}
          <div className="bg-[#f8f5fe] dark:bg-purple-950/20 rounded-xl p-3.5 border border-purple-100/80 dark:border-purple-900/40 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Invoice Timeline
            </h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-[#16a34a] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Invoice Created</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">19 Nov 2026, 10:18 AM</p>
                </div>
              </div>
              <div className="w-0.5 h-3 bg-[#16a34a] ml-2 -my-1" />

              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-[#16a34a] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Payment Received</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">19 Nov 2026, 10:20 AM</p>
                </div>
              </div>
              <div className="w-0.5 h-3 bg-[#16a34a] ml-2 -my-1" />

              <div className="bg-[#dcfce7] dark:bg-emerald-950/50 border border-emerald-200/80 rounded-lg px-2.5 py-1.5 flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#16a34a] text-white flex items-center justify-center shrink-0">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Invoice Closed</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">19 Nov 2026, 10:21 AM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons (Row of 3 buttons matching Image) */}
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info(`Viewing PDF for ${selectedInvoice.id}`)}
              className="text-xs border-purple-200 text-[#6222cc] hover:bg-purple-50 font-semibold flex items-center gap-1.5 justify-center cursor-pointer shadow-2xs"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>View PDF</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success(`Downloading ${selectedInvoice.id}`)}
              className="text-xs border-purple-200 text-[#6222cc] hover:bg-purple-50 font-semibold flex items-center gap-1.5 justify-center cursor-pointer shadow-2xs"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success(`Invoice emailed to ${selectedInvoice.customerTenant}`)}
              className="text-xs border-purple-200 text-[#6222cc] hover:bg-purple-50 font-semibold flex items-center gap-1.5 justify-center cursor-pointer shadow-2xs"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>Send</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <CreateInvoiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(newInv) => {
          setInvoices((prev) => [newInv, ...prev]);
          setSelectedInvoice(newInv);
        }}
      />
    </div>
  );
}

export default InvoicesScreen;
