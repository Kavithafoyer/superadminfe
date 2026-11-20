'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  Coins,
  Search,
  Download,
  SlidersHorizontal,
  Eye,
  MoreVertical,
  Plus,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Receipt,
  Mail,
  Check,
  Edit2,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PurchaseActivationTabs } from './PurchaseActivationTabs';
import { INITIAL_INVOICES } from './purchaseActivationData';
import { InvoiceRecord } from './purchaseActivationTypes';
import { getStatusBadgeStyle, formatINR } from './purchaseActivationUtils';
import { CreateInvoiceModal } from './CreateInvoiceModal';

export function InvoicesScreen() {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(INITIAL_INVOICES);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord>(INITIAL_INVOICES[0]);
  const [selectedIds, setSelectedIds] = useState<string[]>([INITIAL_INVOICES[0].id]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Sub-status tabs
  const [statusSubTab, setStatusSubTab] = useState<string>('All Invoices');

  // Filters
  const [productFilter, setProductFilter] = useState('All Products');
  const [planFilter, setPlanFilter] = useState('All Plans');
  const [tenantFilter, setTenantFilter] = useState('All Tenants');
  const [invoicePeriod, setInvoicePeriod] = useState('01 Oct 2026 - 19 Nov 2026');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInvoices = useMemo(() => {
    return invoices.filter((item) => {
      const matchesSearch =
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customerTenant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.productPlan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.amount.toString().includes(searchQuery);

      const matchesProduct =
        productFilter === 'All Products' || item.productPlan.includes(productFilter.replace('Pegatto ', ''));
      const matchesTenant = tenantFilter === 'All Tenants' || item.customerTenant === tenantFilter;
      const matchesPlan = planFilter === 'All Plans' || item.productPlan.includes(planFilter);

      let matchesSubTab = true;
      if (statusSubTab === 'Paid') matchesSubTab = item.status === 'Paid';
      else if (statusSubTab === 'Pending') matchesSubTab = item.status === 'Pending';
      else if (statusSubTab === 'Overdue') matchesSubTab = item.status === 'Overdue';
      else if (statusSubTab === 'Draft') matchesSubTab = item.status === 'Draft';
      else if (statusSubTab === 'Cancelled') matchesSubTab = item.status === 'Cancelled';

      return matchesSearch && matchesProduct && matchesTenant && matchesPlan && matchesSubTab;
    });
  }, [invoices, searchQuery, productFilter, tenantFilter, planFilter, statusSubTab]);

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

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Invoice No,Customer,Product/Plan,Invoice Date,Due Date,Amount,Status']
        .concat(
          filteredInvoices.map(
            (inv) =>
              `${inv.id},"${inv.customerTenant}","${inv.productPlan}",${inv.invoiceDate},${inv.dueDate},${inv.amount},${inv.status}`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'invoices_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Invoices exported to CSV');
  };

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 max-w-[1700px] mx-auto w-full">
      {/* 1. Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <span>Purchase & Activation</span>
            <span>&rsaquo;</span>
            <span className="text-slate-900 dark:text-slate-200 font-semibold">Invoices</span>
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
          className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Create Invoice</span>
        </Button>
      </div>

      {/* 2. Top Metric Cards (5 Cards matching Image 3) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 flex items-center gap-3.5 shadow-xs">
          <div className="p-3 bg-purple-50 dark:bg-purple-950/50 text-[#7c3aed] rounded-xl shrink-0">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Invoices</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">1,248</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 flex items-center gap-3.5 shadow-xs">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-xl shrink-0">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Paid</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">1,186</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 flex items-center gap-3.5 shadow-xs">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/50 text-amber-600 rounded-xl shrink-0">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pending</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">32</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 flex items-center gap-3.5 shadow-xs">
          <div className="p-3 bg-rose-50 dark:bg-rose-950/50 text-rose-600 rounded-xl shrink-0">
            <XCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Overdue</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">14</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 flex items-center gap-3.5 shadow-xs">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 text-[#7c3aed] rounded-xl shrink-0">
            <Coins className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Invoiced Amount</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">₹4,86,400</p>
          </div>
        </div>
      </div>

      {/* 3. Horizontal Sub-Menus / Tabs */}
      <PurchaseActivationTabs activeTab="Invoices" />

      {/* 3.1 Status Sub-tabs (All Invoices 1248, Paid 1186, Pending 32, Overdue 14, Draft 6, Cancelled 10) */}
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
                'pb-2.5 transition-colors cursor-pointer relative',
                isActive
                  ? 'text-[#7c3aed] dark:text-purple-400 font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              )}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7c3aed] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* 4. Filters Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-3.5 shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex flex-col gap-1 min-w-[130px]">
          <span className="text-[11px] font-semibold text-slate-500">Product</span>
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-slate-800 dark:text-slate-200"
          >
            <option value="All Products">All Products</option>
            <option value="CRM">Pegatto CRM</option>
            <option value="Education">Pegatto Education</option>
            <option value="IT">Pegatto IT</option>
            <option value="People">Pegatto People</option>
            <option value="Retail">Pegatto Retail</option>
            <option value="Real Estate">Pegatto Real Estate</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[120px]">
          <span className="text-[11px] font-semibold text-slate-500">Plan / Edition</span>
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-slate-800 dark:text-slate-200"
          >
            <option value="All Plans">All Plans</option>
            <option value="Standard">Standard</option>
            <option value="Professional">Professional</option>
            <option value="Enterprise">Enterprise</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[130px]">
          <span className="text-[11px] font-semibold text-slate-500">Tenant / Customer</span>
          <select
            value={tenantFilter}
            onChange={(e) => setTenantFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-slate-800 dark:text-slate-200"
          >
            <option value="All Tenants">All Tenants</option>
            <option value="Euro Textiles">Euro Textiles</option>
            <option value="Sunrise School">Sunrise School</option>
            <option value="Prodian Infotech">Prodian Infotech</option>
            <option value="Apex Solutions">Apex Solutions</option>
            <option value="Indra Store">Indra Store</option>
            <option value="City Builders">City Builders</option>
            <option value="Style Union">Style Union</option>
            <option value="Delta Academy">Delta Academy</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[180px]">
          <span className="text-[11px] font-semibold text-slate-500">Invoice Period</span>
          <div className="flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs bg-white dark:bg-slate-800">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={invoicePeriod}
              onChange={(e) => setInvoicePeriod(e.target.value)}
              className="bg-transparent border-none outline-hidden text-xs text-slate-800 dark:text-slate-200 w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto pt-4">
          <button
            type="button"
            onClick={() => {
              setProductFilter('All Products');
              setPlanFilter('All Plans');
              setTenantFilter('All Tenants');
              setInvoicePeriod('01 Oct 2026 - 19 Nov 2026');
              setSearchQuery('');
              toast.info('Filters reset');
            }}
            className="text-xs font-semibold text-[#7c3aed] hover:underline px-2 cursor-pointer"
          >
            Reset
          </button>
          <Button
            onClick={() => toast.success('Filters applied')}
            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-medium text-xs px-4 py-1.5 rounded-lg shadow-xs cursor-pointer"
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
            className="pl-9 text-xs h-9 bg-white dark:bg-slate-900 rounded-lg border-slate-200 dark:border-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            variant="outline"
            onClick={handleExport}
            className="text-xs h-9 px-3 gap-1.5 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.info('Customize columns modal')}
            className="text-xs h-9 px-3 gap-1.5 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 cursor-pointer"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Columns</span>
          </Button>
        </div>
      </div>

      {/* 6. Main Content Area: Table + Right Side Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Table Column */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.length > 0 && selectedIds.length === filteredInvoices.length
                      }
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
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
                {filteredInvoices.map((inv) => {
                  const isSelected = selectedInvoice?.id === inv.id;
                  const isChecked = selectedIds.includes(inv.id);

                  return (
                    <tr
                      key={inv.id}
                      onClick={() => setSelectedInvoice(inv)}
                      className={cn(
                        'hover:bg-purple-50/40 dark:hover:bg-purple-950/20 transition-colors cursor-pointer',
                        isSelected && 'bg-purple-50/60 dark:bg-purple-950/30'
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
                          className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                      </td>
                      <td className="p-3.5 font-semibold text-[#7c3aed] underline underline-offset-2">
                        {inv.id}
                      </td>
                      <td className="p-3.5 font-medium text-slate-900 dark:text-slate-100">
                        {inv.customerTenant}
                      </td>
                      <td className="p-3.5 text-slate-700 dark:text-slate-300">
                        {inv.productPlan}
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {inv.invoiceDate}
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {inv.dueDate}
                      </td>
                      <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-100">
                        {formatINR(inv.amount)}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={cn(
                            'inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border',
                            getStatusBadgeStyle(inv.status)
                          )}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-center relative">
                        <div
                          className="flex items-center justify-center gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => setSelectedInvoice(inv)}
                            title="View"
                            className="p-1.5 rounded-md text-slate-400 hover:text-[#7c3aed] hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => toast.success(`Downloading invoice ${inv.id}`)}
                            title="Download PDF"
                            className="p-1.5 rounded-md text-slate-400 hover:text-[#7c3aed] hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors cursor-pointer"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <div className="relative">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuId(openMenuId === inv.id ? null : inv.id);
                              }}
                              title="More Actions"
                              className={cn(
                                'p-1.5 rounded-md transition-colors cursor-pointer',
                                openMenuId === inv.id
                                  ? 'bg-purple-100 text-[#7c3aed] dark:bg-purple-950'
                                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                              )}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>

                            {openMenuId === inv.id && (
                              <div
                                className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 text-left animate-in fade-in zoom-in-95 duration-100"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    setSelectedInvoice(inv);
                                  }}
                                  className="w-full px-3 py-2 text-xs flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-[#7c3aed] transition-colors cursor-pointer"
                                >
                                  <Eye className="h-3.5 w-3.5 text-slate-400" />
                                  <span>Overview</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    toast.info(`Edit invoice items for ${inv.id}`);
                                  }}
                                  className="w-full px-3 py-2 text-xs flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-[#7c3aed] transition-colors cursor-pointer"
                                >
                                  <Edit2 className="h-3.5 w-3.5 text-slate-400" />
                                  <span>Edit Invoice</span>
                                </button>
                                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    setInvoices((prev) => prev.filter((i) => i.id !== inv.id));
                                    toast.success(`Invoice ${inv.id} cancelled/deleted`);
                                  }}
                                  className="w-full px-3 py-2 text-xs flex items-center gap-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer font-medium"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  <span>Cancel / Delete</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-3.5 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 gap-3">
            <div>Showing 1-8 of 1,248 invoices</div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span>Rows per page:</span>
                <select className="border border-slate-200 dark:border-slate-700 rounded-md px-1.5 py-0.5 text-xs bg-white dark:bg-slate-800">
                  <option value="10">10</option>
                  <option value="25">25</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button type="button" className="p-1 rounded-md text-slate-400 hover:text-slate-600">
                  <ChevronsLeft className="h-4 w-4" />
                </button>
                <button type="button" className="p-1 rounded-md text-slate-400 hover:text-slate-600">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded-md font-semibold text-xs flex items-center justify-center bg-[#7c3aed] text-white"
                >
                  1
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded-md font-medium text-xs flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                >
                  2
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded-md font-medium text-xs flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                >
                  3
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded-md font-medium text-xs flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                >
                  4
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded-md font-medium text-xs flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                >
                  5
                </button>
                <button type="button" className="p-1 rounded-md text-slate-400 hover:text-slate-600">
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button type="button" className="p-1 rounded-md text-slate-400 hover:text-slate-600">
                  <ChevronsRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Details Panel matching Image 3 */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 flex flex-col gap-4">
          {/* Header Card */}
          <div className="bg-purple-50/70 dark:bg-slate-800/60 rounded-xl p-3.5 border border-purple-100 dark:border-slate-700/80 flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/60 text-[#7c3aed] rounded-lg">
                <Receipt className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {selectedInvoice.id}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedInvoice.customerTenant} &rsaquo; {selectedInvoice.productPlan}
                </p>
              </div>
            </div>
            <span
              className={cn(
                'px-2.5 py-0.5 rounded-full text-xs font-semibold border',
                getStatusBadgeStyle(selectedInvoice.status)
              )}
            >
              {selectedInvoice.status}
            </span>
          </div>

          {/* Key-Value Details */}
          <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Invoice Date</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                : {selectedInvoice.invoiceDate}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Due Date</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                : {selectedInvoice.dueDate}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Amount (Excl. Tax)</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                : {formatINR(selectedInvoice.amountExclTax)}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">GST (18%)</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                : {formatINR(selectedInvoice.gst18)}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 font-bold text-sm">
              <span className="text-slate-900 dark:text-slate-100">Total Amount</span>
              <span className="text-[#7c3aed] dark:text-purple-400">
                : {formatINR(selectedInvoice.amount)}
              </span>
            </div>
          </div>

          {/* Payment Information */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">
              Payment Information
            </h4>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-500">Payment Status</span>
              <span className="font-semibold text-emerald-600">
                : {selectedInvoice.paymentInfo?.status || selectedInvoice.status}
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-500">Payment Date</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                : {selectedInvoice.paymentInfo?.date || '19 Nov 2026, 10:20 AM'}
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-500">Payment Method</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                : {selectedInvoice.paymentInfo?.method || 'Razorpay (UPI)'}
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-500">Transaction ID</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                : {selectedInvoice.paymentInfo?.transactionId || 'RZP8FZ7K9A2'}
              </span>
            </div>
          </div>

          {/* Invoice Timeline matching Image 3 */}
          <div className="bg-purple-50/50 dark:bg-slate-800/40 rounded-xl p-3.5 border border-purple-100/80 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Invoice Timeline
            </h4>
            <div className="space-y-3 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-500">
              {selectedInvoice.timeline.map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-6 top-0.5 bg-emerald-500 text-white rounded-full p-0.5">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {step.title}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{step.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons matching Image 3 */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info(`Viewing PDF for ${selectedInvoice.id}`)}
              className="text-xs border-purple-200 text-[#7c3aed] hover:bg-purple-50 flex items-center gap-1 justify-center"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>View PDF</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success(`Downloading ${selectedInvoice.id}`)}
              className="text-xs border-purple-200 text-[#7c3aed] hover:bg-purple-50 flex items-center gap-1 justify-center"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success(`Invoice emailed to ${selectedInvoice.customerTenant}`)}
              className="text-xs border-purple-200 text-[#7c3aed] hover:bg-purple-50 flex items-center gap-1 justify-center"
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
