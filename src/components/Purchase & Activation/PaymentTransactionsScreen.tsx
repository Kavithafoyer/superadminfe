'use client';

import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  IndianRupee,
  RefreshCw,
  XCircle,
  TrendingUp,
  Search,
  Download,
  LayoutGrid,
  Eye,
  MoreVertical,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Receipt,
  Layers,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PurchaseActivationTabs } from './PurchaseActivationTabs';
import { INITIAL_PAYMENT_TXNS } from './purchaseActivationData';
import { PaymentTxnRecord } from './purchaseActivationTypes';
import { getProductBadgeStyle, getStatusBadgeStyle, formatINR } from './purchaseActivationUtils';

export function PaymentTransactionsScreen() {
  const [transactions, setTransactions] = useState<PaymentTxnRecord[]>(INITIAL_PAYMENT_TXNS);
  const [selectedTxn, setSelectedTxn] = useState<PaymentTxnRecord>(INITIAL_PAYMENT_TXNS[0]);
  const [selectedIds, setSelectedIds] = useState<string[]>([INITIAL_PAYMENT_TXNS[0].id]);

  // Sub-tabs: All Transactions (1,248), Successful (1,186), Failed (14), Refunded (32), Pending (16)
  const [statusSubTab, setStatusSubTab] = useState('All Transactions');

  // Filters
  const [productFilter, setProductFilter] = useState('All Products');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [methodFilter, setMethodFilter] = useState('All Methods');
  const [tenantFilter, setTenantFilter] = useState('All Tenants');
  const [dateRange, setDateRange] = useState('01 Oct 2026 – 19 Nov 2026');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTxns = useMemo(() => {
    return transactions.filter((item) => {
      // Sub-tab filter
      if (statusSubTab === 'Successful' && item.status !== 'Success') return false;
      if (statusSubTab === 'Failed' && item.status !== 'Failed') return false;
      if (statusSubTab === 'Refunded' && item.status !== 'Refunded') return false;
      if (statusSubTab === 'Pending' && item.status !== 'Pending') return false;

      const matchesSearch =
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customerTenant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.productPlan.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesProduct = productFilter === 'All Products' || item.productPlan.includes(productFilter);
      const matchesMethod = methodFilter === 'All Methods' || item.paymentMethod.includes(methodFilter);
      const matchesTenant = tenantFilter === 'All Tenants' || item.customerTenant === tenantFilter;

      return matchesSearch && matchesProduct && matchesMethod && matchesTenant;
    });
  }, [transactions, statusSubTab, searchQuery, productFilter, methodFilter, tenantFilter]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredTxns.map((t) => t.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    const item = transactions.find((t) => t.id === id);
    if (item) setSelectedTxn(item);
  };

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 max-w-[1700px] mx-auto w-full">
      {/* 1. Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <span>Purchase & Activation</span>
            <span className="text-slate-400">&rsaquo;</span>
            <span className="text-slate-800 dark:text-slate-200 font-bold">Payment Transactions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Payment Transactions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Track and manage all payments, refunds and transaction details across products, plans and add-ons.
          </p>
        </div>

        <Button
          onClick={() => toast.success('Transactions exported to CSV')}
          className="bg-[#6222cc] hover:bg-[#5219b0] text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <Download className="h-4 w-4 stroke-[2.5]" />
          <span>Export Transactions</span>
        </Button>
      </div>

      {/* 2. Top Metric Cards (5 Cards matching Image) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3.5 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="w-12 h-12 flex items-center justify-center bg-[#f3e8ff] dark:bg-purple-950/60 text-[#8b5cf6] rounded-xl shrink-0">
            <Layers className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Transactions</p>
            <p className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-0.5">1,248</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3.5 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="w-12 h-12 flex items-center justify-center bg-[#dcfce7] dark:bg-emerald-950/60 text-[#16a34a] rounded-xl shrink-0">
            <IndianRupee className="h-6 w-6 stroke-[2.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Received</p>
            <p className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-0.5">₹4,86,400</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3.5 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="w-12 h-12 flex items-center justify-center bg-[#ffedd5] dark:bg-amber-950/60 text-[#ea580c] rounded-xl shrink-0">
            <RefreshCw className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Refunded</p>
            <p className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-0.5">₹12,900</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3.5 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="w-12 h-12 flex items-center justify-center bg-[#fee2e2] dark:bg-rose-950/60 text-[#ef4444] rounded-xl shrink-0">
            <XCircle className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Failed</p>
            <p className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-0.5">14</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3.5 flex items-center gap-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="w-12 h-12 flex items-center justify-center bg-[#f3e8ff] dark:bg-purple-950/60 text-[#8b5cf6] rounded-xl shrink-0">
            <TrendingUp className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Net Revenue</p>
            <p className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-0.5">₹4,73,500</p>
          </div>
        </div>
      </div>

      {/* 3. Horizontal Sub-Menus / Tabs */}
      <PurchaseActivationTabs activeTab="Payment Transactions" />

      {/* 3.1 Status Sub-tabs matching Image */}
      <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold px-1">
        {[
          { label: 'All Transactions (1,248)', key: 'All Transactions' },
          { label: 'Successful (1,186)', key: 'Successful' },
          { label: 'Failed (14)', key: 'Failed' },
          { label: 'Refunded (32)', key: 'Refunded' },
          { label: 'Pending (16)', key: 'Pending' },
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
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Transaction Type</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-800 dark:text-slate-200 shadow-2xs font-medium cursor-pointer"
          >
            <option value="All Types">All Types</option>
            <option value="Payment">Payment</option>
            <option value="Refund">Refund</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[125px]">
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Payment Method</span>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-800 dark:text-slate-200 shadow-2xs font-medium cursor-pointer"
          >
            <option value="All Methods">All Methods</option>
            <option value="Razorpay">Razorpay</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Net Banking">Net Banking</option>
            <option value="UPI">UPI</option>
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
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Date Range</span>
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
              setTypeFilter('All Types');
              setMethodFilter('All Methods');
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
            placeholder="Search by transaction ID, order ID, customer, or amount..."
            className="pl-9 text-xs h-9 bg-white dark:bg-slate-900 rounded-lg border-slate-200 dark:border-slate-800 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            variant="outline"
            onClick={() => toast.success('Exporting transactions')}
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
                        selectedIds.length > 0 && selectedIds.length === filteredTxns.length
                      }
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-[#6222cc] focus:ring-[#6222cc] cursor-pointer"
                    />
                  </th>
                  <th className="p-3.5 font-bold">Transaction ID</th>
                  <th className="p-3.5 font-bold">Order ID</th>
                  <th className="p-3.5 font-bold">Customer / Tenant</th>
                  <th className="p-3.5 font-bold">Product / Plan</th>
                  <th className="p-3.5 font-bold">Amount (₹)</th>
                  <th className="p-3.5 font-bold">Payment Method</th>
                  <th className="p-3.5 font-bold">Status</th>
                  <th className="p-3.5 font-bold">Date & Time</th>
                  <th className="p-3.5 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredTxns.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-slate-400">
                      No transactions found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredTxns.map((txn) => {
                    const isSelected = selectedTxn?.id === txn.id;
                    const isChecked = selectedIds.includes(txn.id);
                    const prodName = txn.productPlan.split('–')[0]?.trim() || txn.productPlan;

                    return (
                      <tr
                        key={txn.id}
                        onClick={() => setSelectedTxn(txn)}
                        className={cn(
                          'hover:bg-purple-50/30 dark:hover:bg-purple-950/20 transition-colors cursor-pointer',
                          isSelected && 'bg-[#f6f2fe] dark:bg-purple-950/40'
                        )}
                      >
                        <td
                          className="p-3.5 text-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSelect(txn.id);
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleSelect(txn.id)}
                            className="rounded border-slate-300 text-[#6222cc] focus:ring-[#6222cc] cursor-pointer"
                          />
                        </td>
                        <td className="p-3.5 font-bold text-[#6222cc] underline underline-offset-2">
                          {txn.id}
                        </td>
                        <td className="p-3.5 font-medium text-slate-700 dark:text-slate-300">
                          {txn.orderId}
                        </td>
                        <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-100">
                          {txn.customerTenant}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={cn(
                              'inline-block px-3 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap',
                              getProductBadgeStyle(prodName)
                            )}
                          >
                            {txn.productPlan}
                          </span>
                        </td>
                        <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">
                          {txn.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3.5 text-slate-700 dark:text-slate-300 font-normal">
                          {txn.paymentMethod}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={cn(
                              'inline-block px-3 py-0.5 rounded-full text-[11px] font-semibold',
                              getStatusBadgeStyle(txn.status)
                            )}
                          >
                            {txn.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-700 dark:text-slate-300 whitespace-nowrap font-normal">
                          {txn.dateTime}
                        </td>
                        <td className="p-3.5 text-center">
                          <div
                            className="flex items-center justify-center gap-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => setSelectedTxn(txn)}
                              title="View Details"
                              className="p-1 rounded-md text-slate-500 hover:text-[#6222cc] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => toast.info(`Action menu for ${txn.id}`)}
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
              Showing 1-8 of 1,248 transactions
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
              Transaction Details
            </h3>
            <span className="bg-[#16a34a] text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-2xs">
              {selectedTxn.status}
            </span>
          </div>

          {/* Subheader */}
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="w-9 h-9 rounded-lg bg-[#f3e8ff] dark:bg-purple-950/60 text-[#8b5cf6] flex items-center justify-center shrink-0">
              <Receipt className="h-4 w-4 stroke-[2.5]" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                {selectedTxn.id}
              </p>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Order ID: {selectedTxn.orderId}
              </p>
            </div>
          </div>

          {/* Key-Value Details */}
          <div className="space-y-1.5 text-xs">
            <div className="grid grid-cols-12 gap-1 py-0.5">
              <span className="col-span-5 text-slate-600 dark:text-slate-400 font-medium">Customer / Tenant</span>
              <span className="col-span-7 font-semibold text-slate-900 dark:text-slate-100">
                : {selectedTxn.customerTenant}
              </span>
            </div>
            <div className="grid grid-cols-12 gap-1 py-0.5">
              <span className="col-span-5 text-slate-600 dark:text-slate-400 font-medium">Product</span>
              <span className="col-span-7 font-semibold text-slate-900 dark:text-slate-100">
                : {selectedTxn.productPlan.split('–')[0]?.trim()}
              </span>
            </div>
            <div className="grid grid-cols-12 gap-1 py-0.5">
              <span className="col-span-5 text-slate-600 dark:text-slate-400 font-medium">Plan / Edition</span>
              <span className="col-span-7 font-semibold text-slate-900 dark:text-slate-100">
                : {selectedTxn.productPlan.split('–')[1]?.trim() || 'Professional'}
              </span>
            </div>
            <div className="grid grid-cols-12 gap-1 py-0.5">
              <span className="col-span-5 text-slate-600 dark:text-slate-400 font-medium">Amount</span>
              <span className="col-span-7 font-bold text-slate-900 dark:text-slate-100">
                : {formatINR(selectedTxn.amount)}
              </span>
            </div>
            <div className="grid grid-cols-12 gap-1 py-0.5">
              <span className="col-span-5 text-slate-600 dark:text-slate-400 font-medium">Payment Method</span>
              <span className="col-span-7 font-semibold text-slate-900 dark:text-slate-100">
                : {selectedTxn.paymentMethod}
              </span>
            </div>
            <div className="grid grid-cols-12 gap-1 py-0.5">
              <span className="col-span-5 text-slate-600 dark:text-slate-400 font-medium">Transaction Date</span>
              <span className="col-span-7 font-semibold text-slate-900 dark:text-slate-100">
                : {selectedTxn.dateTime}
              </span>
            </div>
            <div className="grid grid-cols-12 gap-1 py-0.5">
              <span className="col-span-5 text-slate-600 dark:text-slate-400 font-medium">Status</span>
              <span className="col-span-7 font-semibold text-[#16a34a]">
                : {selectedTxn.status}
              </span>
            </div>
            <div className="grid grid-cols-12 gap-1 py-0.5">
              <span className="col-span-5 text-slate-600 dark:text-slate-400 font-medium">Payment Ref. No.</span>
              <span className="col-span-7 font-mono font-bold text-slate-900 dark:text-slate-100">
                : {selectedTxn.paymentRefNo}
              </span>
            </div>
            <div className="grid grid-cols-12 gap-1 py-0.5">
              <span className="col-span-5 text-slate-600 dark:text-slate-400 font-medium">Invoice</span>
              <button
                type="button"
                onClick={() => toast.success(`Downloading invoice ${selectedTxn.invoiceNo}`)}
                className="col-span-7 text-left font-semibold text-[#6222cc] hover:underline cursor-pointer"
              >
                : {selectedTxn.invoiceNo} (Download)
              </button>
            </div>
          </div>

          {/* Payment Timeline */}
          <div className="bg-[#f8f5fe] dark:bg-purple-950/20 rounded-xl p-3.5 border border-purple-100/80 dark:border-purple-900/40 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Payment Timeline
            </h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-[#16a34a] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Payment Initiated</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">19 Nov 2026, 10:18 AM</p>
                </div>
              </div>
              <div className="w-0.5 h-3 bg-[#16a34a] ml-2 -my-1" />

              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-[#16a34a] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Payment Successful</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">19 Nov 2026, 10:20 AM</p>
                </div>
              </div>
              <div className="w-0.5 h-3 bg-[#16a34a] ml-2 -my-1" />

              <div className="bg-[#dcfce7] dark:bg-emerald-950/50 border border-emerald-200/80 rounded-lg px-2.5 py-1.5 flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#16a34a] text-white flex items-center justify-center shrink-0">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">License Activated</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">19 Nov 2026, 10:21 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentTransactionsScreen;
