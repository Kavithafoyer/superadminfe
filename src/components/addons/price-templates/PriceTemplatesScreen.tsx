'use client';

import React, { useState, useMemo } from 'react';
import {
  Layers,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Coins,
  FileDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Pencil,
  Trash2,
  Columns,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { INITIAL_PRICE_TEMPLATES } from '../mockData';
import { PriceTemplateRecord, TemplateTier } from '../types';

export function PriceTemplatesScreen() {
  const [templates, setTemplates] = useState<PriceTemplateRecord[]>(INITIAL_PRICE_TEMPLATES);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(INITIAL_PRICE_TEMPLATES[0]?.id || '');
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'tiers' | 'discounts' | 'applicability'>('basic');
  const [activeSubTab, setActiveSubTab] = useState<'pricing' | 'templates' | 'bulk' | 'history'>('templates');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([INITIAL_PRICE_TEMPLATES[0]?.id || '']);
  const [activeMenuRowId, setActiveMenuRowId] = useState<string | null>(null);

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<PriceTemplateRecord | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const selectedTemplate = useMemo(() => {
    return templates.find((t) => t.id === selectedTemplateId) || templates[0];
  }, [templates, selectedTemplateId]);

  const [formData, setFormData] = useState<PriceTemplateRecord>(
    selectedTemplate || {
      id: 'pt-1',
      code: 'PT-001',
      name: 'Standard SaaS',
      type: 'Subscription',
      billingCycle: 'Monthly',
      currency: 'INR (₹)',
      tiersCount: 3,
      appliedAddonsCount: 12,
      status: 'Active',
      description: 'Standard monthly pricing with 3 tiers (Basic, Pro, Enterprise).',
      tiers: [
        { tierName: 'Basic', price: 499, userLimit: 'Up to 5', storage: '5 GB', features: 'Core features' },
        { tierName: 'Pro', price: 999, userLimit: 'Up to 25', storage: '50 GB', features: 'Advanced features' },
        { tierName: 'Enterprise', price: 1999, userLimit: 'Up to 100', storage: '250 GB', features: 'All features + Support' },
      ],
      showTemplateForNewAddons: true,
      allowCustomizationAtAddonLevel: true,
    }
  );

  const handleSelectTemplate = (item: PriceTemplateRecord) => {
    setIsCreatingNew(false);
    setSelectedTemplateId(item.id);
    setSelectedRowIds([item.id]);
    setFormData({ ...item });
    setActiveMenuRowId(null);
  };

  const handleStartCreateNew = () => {
    setIsCreatingNew(true);
    const newId = `pt-${Date.now()}`;
    const blank: PriceTemplateRecord = {
      id: newId,
      code: 'PT-CUSTOM',
      name: 'New Custom Template',
      type: 'Subscription',
      billingCycle: 'Monthly',
      currency: 'INR (₹)',
      tiersCount: 2,
      appliedAddonsCount: 0,
      status: 'Active',
      description: 'Custom pricing template specification.',
      tiers: [
        { tierName: 'Starter', price: 599, userLimit: 'Up to 10', storage: '10 GB', features: 'Essential tools' },
        { tierName: 'Growth', price: 1299, userLimit: 'Up to 50', storage: '50 GB', features: 'Full access' },
      ],
      showTemplateForNewAddons: true,
      allowCustomizationAtAddonLevel: true,
    };
    setFormData(blank);
  };

  const handleSaveForm = (asDraft = false) => {
    const targetStatus = asDraft ? 'Draft' : formData.status || 'Active';
    const recordToSave: PriceTemplateRecord = {
      ...formData,
      status: targetStatus,
      code: formData.code.trim() || `PT-${Date.now().toString().slice(-4)}`,
      name: formData.name.trim() || 'Untitled Template',
    };

    if (isCreatingNew) {
      setTemplates((prev) => [recordToSave, ...prev]);
      setIsCreatingNew(false);
      setSelectedTemplateId(recordToSave.id);
      setSelectedRowIds([recordToSave.id]);
      showToast(`Template "${recordToSave.name}" created!`);
    } else {
      setTemplates((prev) =>
        prev.map((item) => (item.id === recordToSave.id ? recordToSave : item))
      );
      showToast(`Template "${recordToSave.name}" updated!`);
    }
  };

  const handleDeletePrompt = (item: PriceTemplateRecord) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
    setActiveMenuRowId(null);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    const remaining = templates.filter((item) => item.id !== itemToDelete.id);
    setTemplates(remaining);
    if (selectedTemplateId === itemToDelete.id) {
      if (remaining.length > 0) {
        setSelectedTemplateId(remaining[0].id);
        setSelectedRowIds([remaining[0].id]);
        setFormData({ ...remaining[0] });
      }
    }
    setDeleteDialogOpen(false);
    showToast(`Template deleted.`);
    setItemToDelete(null);
  };

  const filteredTemplates = useMemo(() => {
    return templates.filter((item) => {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    });
  }, [templates, searchQuery]);

  const totalPages = Math.ceil(filteredTemplates.length / rowsPerPage) || 1;
  const paginatedTemplates = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredTemplates.slice(start, start + rowsPerPage);
  }, [filteredTemplates, currentPage, rowsPerPage]);

  const totalCount = templates.length;
  const activeCount = templates.filter((t) => t.status === 'Active').length;
  const draftCount = templates.filter((t) => t.status === 'Draft').length;
  const inactiveCount = templates.filter((t) => t.status === 'Inactive').length;

  const handleToggleSelectAll = () => {
    if (selectedRowIds.length === paginatedTemplates.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(paginatedTemplates.map((t) => t.id));
    }
  };

  const handleToggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full space-y-5 pb-12">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2 bg-[#6222cc] text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-medium animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Add-on Marketplace</span>
            <span>&gt;</span>
            <span className="text-[#6222cc] dark:text-purple-300 font-medium">Price Templates</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Price Templates
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Create reusable price templates that can be assigned to multiple add-ons.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleStartCreateNew}
            className="h-9 px-4 text-xs font-medium bg-[#6222cc] hover:bg-[#521cb0] text-white rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Template</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Templates</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{totalCount}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-[#6222cc] dark:text-purple-300">
            <Layers className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Templates</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{activeCount || 6}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Draft Templates</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{draftCount || 1}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Inactive</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{inactiveCount || 1}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
            <Coins className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Subtabs */}
      <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-800 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveSubTab('pricing')}
          className={`pb-2.5 transition-colors relative ${
            activeSubTab === 'pricing' ? 'text-[#6222cc] font-semibold' : 'text-slate-500'
          }`}
        >
          Add-on Pricing
          {activeSubTab === 'pricing' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6222cc] rounded-full" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('templates')}
          className={`pb-2.5 transition-colors relative ${
            activeSubTab === 'templates' ? 'text-[#6222cc] font-semibold' : 'text-slate-500'
          }`}
        >
          Price Templates
          {activeSubTab === 'templates' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6222cc] rounded-full" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('bulk')}
          className={`pb-2.5 transition-colors relative ${
            activeSubTab === 'bulk' ? 'text-[#6222cc] font-semibold' : 'text-slate-500'
          }`}
        >
          Bulk Update
          {activeSubTab === 'bulk' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6222cc] rounded-full" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('history')}
          className={`pb-2.5 transition-colors relative ${
            activeSubTab === 'history' ? 'text-[#6222cc] font-semibold' : 'text-slate-500'
          }`}
        >
          Price History
          {activeSubTab === 'history' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6222cc] rounded-full" />
          )}
        </button>
      </div>

      {/* 2-COLUMN SPLIT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: Table List */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
          {/* Table Header toolbar */}
          <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Templates ({filteredTemplates.length})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-48 sm:w-56">
                <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search templates..."
                  className="h-8 pl-8 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => showToast('Exporting Templates...')}
                className="h-8 px-2.5 text-xs text-slate-600 border-slate-200 dark:border-slate-700"
              >
                <FileDown className="h-3.5 w-3.5 mr-1" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2.5 text-xs text-slate-600 border-slate-200 dark:border-slate-700"
              >
                <Columns className="h-3.5 w-3.5 mr-1" />
                Columns
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-b border-slate-200/80 dark:border-slate-800 font-medium">
                <tr>
                  <th className="py-2.5 px-3 w-8">
                    <input
                      type="checkbox"
                      checked={
                        paginatedTemplates.length > 0 &&
                        selectedRowIds.length === paginatedTemplates.length
                      }
                      onChange={handleToggleSelectAll}
                      className="rounded border-slate-300 accent-[#6222cc] text-[#6222cc] focus:ring-[#6222cc] focus:border-[#6222cc] cursor-pointer"
                    />
                  </th>
                  <th className="py-2.5 px-3 font-semibold">Template Code</th>
                  <th className="py-2.5 px-3 font-semibold">Template Name</th>
                  <th className="py-2.5 px-3 font-semibold">Pricing Model</th>
                  <th className="py-2.5 px-3 font-semibold">Billing Cycle</th>
                  <th className="py-2.5 px-3 font-semibold">Applied Add-ons</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedTemplates.map((item) => {
                  const isSelected = selectedTemplateId === item.id && !isCreatingNew;
                  const isChecked = selectedRowIds.includes(item.id);

                  return (
                    <tr
                      key={item.id}
                      onClick={() => handleSelectTemplate(item)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-purple-50/60 dark:bg-purple-950/30'
                          : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-3 px-3" onClick={(e) => handleToggleRow(item.id, e)}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="rounded border-slate-300 accent-[#6222cc] text-[#6222cc] focus:ring-[#6222cc] focus:border-[#6222cc] cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-3 font-semibold text-[#6222cc] dark:text-purple-300 hover:underline">
                        {item.code}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-900 dark:text-slate-100">
                        {item.name}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                        {item.type}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                        {item.billingCycle}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                        {item.appliedAddonsCount} add-ons
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            item.status === 'Active'
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                              : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div
                          className="flex items-center justify-end gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => handleSelectTemplate(item)}
                            className="p-1 rounded text-slate-400 hover:text-[#6222cc] hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Edit Template"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                setActiveMenuRowId(
                                  activeMenuRowId === item.id ? null : item.id
                                )
                              }
                              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <MoreVertical className="h-3.5 w-3.5" />
                            </button>
                            {activeMenuRowId === item.id && (
                              <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg z-30 py-1 text-xs">
                                <button
                                  type="button"
                                  onClick={() => handleSelectTemplate(item)}
                                  className="w-full text-left px-3 py-1.5 hover:bg-purple-50 dark:hover:bg-purple-950/50 text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
                                >
                                  <Pencil className="h-3 w-3 text-[#6222cc]" />
                                  Edit Record
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeletePrompt(item)}
                                  className="w-full text-left px-3 py-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-600 flex items-center gap-1.5"
                                >
                                  <Trash2 className="h-3 w-3 text-rose-500" />
                                  Delete
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

          {/* Pagination */}
          <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              Showing {filteredTemplates.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}-
              {Math.min(currentPage * rowsPerPage, filteredTemplates.length)} of {filteredTemplates.length} templates
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                >
                  &laquo;
                </button>
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`h-6 w-6 rounded text-xs font-medium flex items-center justify-center ${
                      currentPage === idx + 1
                        ? 'bg-[#6222cc] text-white'
                        : 'text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                >
                  &raquo;
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Create / Edit Price Template */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
          {/* Card Top Title & Status */}
          <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {isCreatingNew ? 'Create Price Template' : 'Create / Edit Price Template'}
              </h2>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                formData.status === 'Active'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
              }`}
            >
              {formData.status}
            </span>
          </div>

          {/* Sub-tabs */}
          <div className="flex items-center gap-4 px-4 pt-3 border-b border-slate-200/80 dark:border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('basic')}
              className={`pb-2 transition-colors relative ${
                activeTab === 'basic' ? 'text-[#6222cc] font-semibold' : 'text-slate-500'
              }`}
            >
              Basic Details
              {activeTab === 'basic' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6222cc] rounded-full" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tiers')}
              className={`pb-2 transition-colors relative ${
                activeTab === 'tiers' ? 'text-[#6222cc] font-semibold' : 'text-slate-500'
              }`}
            >
              Tiered Pricing
              {activeTab === 'tiers' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6222cc] rounded-full" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('discounts')}
              className={`pb-2 transition-colors relative ${
                activeTab === 'discounts' ? 'text-[#6222cc] font-semibold' : 'text-slate-500'
              }`}
            >
              Discounts
              {activeTab === 'discounts' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6222cc] rounded-full" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('applicability')}
              className={`pb-2 transition-colors relative ${
                activeTab === 'applicability' ? 'text-[#6222cc] font-semibold' : 'text-slate-500'
              }`}
            >
              Applicability
              {activeTab === 'applicability' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6222cc] rounded-full" />
              )}
            </button>
          </div>

          {/* Form Content */}
          <div className="p-4 space-y-4 text-xs">
            {activeTab === 'basic' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Template Code <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className="h-8 text-xs font-mono font-semibold uppercase"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Template Name <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Pricing Model
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as 'Subscription' | 'Usage' | 'Hybrid' })}
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900"
                    >
                      <option>Subscription</option>
                      <option>Usage</option>
                      <option>Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Billing Cycle
                    </label>
                    <select
                      value={formData.billingCycle}
                      onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value as 'Monthly' | 'Annual' })}
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900"
                    >
                      <option>Monthly</option>
                      <option>Annual</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Currency
                    </label>
                    <Input
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="h-8 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Draft' | 'Inactive' })}
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900"
                    >
                      <option>Active</option>
                      <option>Draft</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900 focus:ring-1 focus:ring-[#6222cc] focus:outline-none"
                  />
                </div>
              </>
            )}

            {activeTab === 'tiers' && (
              <div className="space-y-3">
                <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Configured Plan Tiers
                </span>
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 border-b">
                      <tr>
                        <th className="py-2 px-2.5">Tier</th>
                        <th className="py-2 px-2.5">Limit</th>
                        <th className="py-2 px-2.5">Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {formData.tiers?.map((t, idx) => (
                        <tr key={idx}>
                          <td className="py-2 px-2.5 font-medium">{t.tierName}</td>
                          <td className="py-2 px-2.5 text-slate-600">{t.userLimit}</td>
                          <td className="py-2 px-2.5 font-semibold text-[#6222cc]">₹{t.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'discounts' && (
              <div className="space-y-3">
                <div className="p-3 rounded-lg border border-purple-100 bg-purple-50/50 text-purple-900 space-y-1">
                  <span className="font-semibold block">Template Volume Discount</span>
                  <p className="text-[11px] text-purple-700">
                    Tenants using this template automatically receive 15% discount on quarterly renewals.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'applicability' && (
              <div className="space-y-3">
                <span className="font-semibold text-slate-700 block">
                  Applied Add-ons ({formData.appliedAddonsCount})
                </span>
                <p className="text-slate-500 text-xs">
                  This template is actively inherited by AI Lead Scoring, AI Sales Prediction, and 2 other add-ons.
                </p>
              </div>
            )}
          </div>

          {/* Card Footer Actions */}
          <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 bg-slate-50/50 dark:bg-slate-800/20">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                if (selectedTemplate) {
                  setFormData({ ...selectedTemplate });
                  setIsCreatingNew(false);
                }
              }}
              className="h-8 px-3 text-xs border-slate-200"
            >
              Cancel
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => handleSaveForm(true)}
                className="h-8 px-3 text-xs border-slate-200 hover:bg-slate-100 text-slate-700"
              >
                Save as Draft
              </Button>
              <Button
                type="button"
                onClick={() => handleSaveForm(false)}
                className="h-8 px-4 text-xs font-medium bg-[#6222cc] hover:bg-[#521cb0] text-white rounded-lg shadow-xs"
              >
                {isCreatingNew ? 'Create Template' : 'Update Template'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Price Template"
        description={`Are you sure you want to delete price template "${itemToDelete?.name}" (${itemToDelete?.code})?`}
      />
    </div>
  );
}
