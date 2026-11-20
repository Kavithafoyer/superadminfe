'use client';

import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Pencil,
  Trash2,
  Columns,
  Check,
  X,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { INITIAL_COMPATIBILITY_MATRIX } from '../mockData';
import { CompatibilityMatrixRow, CompatibilityStatus } from '../types';

export function ProductCompatibilityScreen() {
  const [matrix, setMatrix] = useState<CompatibilityMatrixRow[]>(INITIAL_COMPATIBILITY_MATRIX);
  const [selectedRowId, setSelectedRowId] = useState<string>(INITIAL_COMPATIBILITY_MATRIX[0]?.id || '');
  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'rules' | 'conflicts' | 'versions'>('matrix');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([INITIAL_COMPATIBILITY_MATRIX[0]?.id || '']);
  const [activeMenuRowId, setActiveMenuRowId] = useState<string | null>(null);

  // Form Rule State
  const selectedRow = useMemo(() => {
    return matrix.find((r) => r.id === selectedRowId) || matrix[0];
  }, [matrix, selectedRowId]);

  const [ruleType, setRuleType] = useState<'Compatible' | 'Dependency' | 'Incompatible'>('Compatible');
  const [requiredModule, setRequiredModule] = useState('Pegatto CRM v2.4+');
  const [versionCondition, setVersionCondition] = useState('>= v2.0.0');
  const [ruleDescription, setRuleDescription] = useState('Requires CRM Enterprise contact intelligence module enabled.');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectRow = (item: CompatibilityMatrixRow) => {
    setSelectedRowId(item.id);
    setSelectedRowIds([item.id]);
    setActiveMenuRowId(null);
  };

  const handleSaveRule = () => {
    showToast(`Compatibility rule for ${selectedRow?.addonName} updated successfully!`);
  };

  const filteredMatrix = useMemo(() => {
    return matrix.filter((item) => {
      const q = searchQuery.toLowerCase();
      return (
        item.addonName.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    });
  }, [matrix, searchQuery]);

  const totalPages = Math.ceil(filteredMatrix.length / rowsPerPage) || 1;
  const paginatedMatrix = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredMatrix.slice(start, start + rowsPerPage);
  }, [filteredMatrix, currentPage, rowsPerPage]);

  const renderStatusIcon = (status?: CompatibilityStatus) => {
    switch (status) {
      case 'compatible':
        return (
          <span className="inline-flex items-center gap-1 text-emerald-600 font-medium justify-center">
            <CheckCircle2 className="h-4 w-4" />
          </span>
        );
      case 'dependency':
        return (
          <span className="inline-flex items-center gap-1 text-amber-600 font-medium justify-center">
            <AlertTriangle className="h-4 w-4" />
          </span>
        );
      case 'incompatible':
        return (
          <span className="inline-flex items-center gap-1 text-rose-600 font-medium justify-center">
            <X className="h-4 w-4" />
          </span>
        );
      default:
        return <span className="text-slate-400">-</span>;
    }
  };

  return (
    <div className="w-full space-y-5 pb-12">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-medium animate-in fade-in slide-in-from-top-2">
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
            <span className="text-purple-600 dark:text-purple-400 font-medium">Product Compatibility</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Product Compatibility
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure compatibility matrices, dependency requirements and collision rules across products.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => showToast('Opening Rule Wizard...')}
            className="h-9 px-4 text-xs font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Compatibility Rule</span>
          </button>
        </div>
      </div>

      {/* 5 KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3.5 rounded-xl shadow-xs">
          <p className="text-[11px] text-slate-500 font-medium">Compatible Pairs</p>
          <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">42</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3.5 rounded-xl shadow-xs">
          <p className="text-[11px] text-slate-500 font-medium">Requires Dependency</p>
          <p className="text-xl font-bold text-amber-600 mt-1">14</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3.5 rounded-xl shadow-xs">
          <p className="text-[11px] text-slate-500 font-medium">Version Incompatible</p>
          <p className="text-xl font-bold text-rose-600 mt-1">3</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3.5 rounded-xl shadow-xs">
          <p className="text-[11px] text-slate-500 font-medium">Direct Conflicts</p>
          <p className="text-xl font-bold text-rose-700 mt-1">2</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3.5 rounded-xl shadow-xs">
          <p className="text-[11px] text-slate-500 font-medium">Pending Review</p>
          <p className="text-xl font-bold text-purple-600 mt-1">1</p>
        </div>
      </div>

      {/* Subtabs */}
      <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-800 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveSubTab('matrix')}
          className={`pb-2.5 transition-colors relative ${
            activeSubTab === 'matrix' ? 'text-purple-600 font-semibold' : 'text-slate-500'
          }`}
        >
          Compatibility Matrix
          {activeSubTab === 'matrix' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('rules')}
          className={`pb-2.5 transition-colors relative ${
            activeSubTab === 'rules' ? 'text-purple-600 font-semibold' : 'text-slate-500'
          }`}
        >
          Rules & Dependencies
          {activeSubTab === 'rules' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('conflicts')}
          className={`pb-2.5 transition-colors relative ${
            activeSubTab === 'conflicts' ? 'text-purple-600 font-semibold' : 'text-slate-500'
          }`}
        >
          Conflicts
          {activeSubTab === 'conflicts' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('versions')}
          className={`pb-2.5 transition-colors relative ${
            activeSubTab === 'versions' ? 'text-purple-600 font-semibold' : 'text-slate-500'
          }`}
        >
          Version Compatibility
          {activeSubTab === 'versions' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />
          )}
        </button>
      </div>

      {/* 2-COLUMN SPLIT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: Compatibility Matrix Table */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
          {/* Table Header toolbar */}
          <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Compatibility Matrix
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
                  placeholder="Search add-on..."
                  className="h-8 pl-8 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => showToast('Exporting Matrix...')}
                className="h-8 px-2.5 text-xs text-slate-600 border-slate-200 dark:border-slate-700"
              >
                <FileDown className="h-3.5 w-3.5 mr-1" />
                Export
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-b border-slate-200/80 dark:border-slate-800 font-medium">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Add-on Name</th>
                  <th className="py-2.5 px-3 font-semibold text-center">CRM Suite</th>
                  <th className="py-2.5 px-3 font-semibold text-center">HRM Suite</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Finance Suite</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Billing Suite</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedMatrix.map((item) => {
                  const isSelected = selectedRowId === item.id;

                  return (
                    <tr
                      key={item.id}
                      onClick={() => handleSelectRow(item)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-purple-50/60 dark:bg-purple-950/30'
                          : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-3 px-3">
                        <span className="font-semibold text-purple-600 dark:text-purple-400 block hover:underline">
                          {item.addonName}
                        </span>
                        <span className="text-slate-500 text-[11px]">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {renderStatusIcon(item.matrix.crm)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {renderStatusIcon(item.matrix.education)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {renderStatusIcon(item.matrix.it)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {renderStatusIcon(item.matrix.people)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleSelectRow(item)}
                          className="p-1 rounded text-slate-400 hover:text-purple-600"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <div>
              Showing {filteredMatrix.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}-
              {Math.min(currentPage * rowsPerPage, filteredMatrix.length)} of {filteredMatrix.length} items
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1 rounded hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1 rounded hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Compatibility Rule Details Card */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
          {/* Card Top Title & Status */}
          <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Compatibility Rule Details
              </h2>
              <p className="text-[11px] text-purple-600 font-medium">
                Target Add-on: {selectedRow?.addonName}
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700">
              Rule Active
            </span>
          </div>

          {/* Form Content */}
          <div className="p-4 space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                Compatibility Type
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="compatType"
                    checked={ruleType === 'Compatible'}
                    onChange={() => setRuleType('Compatible')}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span>Fully Compatible (Plug-and-Play)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="compatType"
                    checked={ruleType === 'Dependency'}
                    onChange={() => setRuleType('Dependency')}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span>Conditional Dependency (Requires Core Suite or Add-on)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="compatType"
                    checked={ruleType === 'Incompatible'}
                    onChange={() => setRuleType('Incompatible')}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span>Incompatible / Collision (Mutual Exclusion)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Required Prerequisite Suite
              </label>
              <select
                value={requiredModule}
                onChange={(e) => setRequiredModule(e.target.value)}
                className="w-full h-8 px-2.5 rounded-lg border border-slate-200 text-xs bg-white dark:bg-slate-900"
              >
                <option>Pegatto CRM v2.4+</option>
                <option>Pegatto Education Cloud</option>
                <option>Pegatto Financial Accounting</option>
                <option>Qintra Core Engine</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Version Condition Rule
              </label>
              <Input
                value={versionCondition}
                onChange={(e) => setVersionCondition(e.target.value)}
                className="h-8 text-xs font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Rule Explanation / User Advisory
              </label>
              <textarea
                rows={3}
                value={ruleDescription}
                onChange={(e) => setRuleDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white dark:bg-slate-900 focus:ring-1 focus:ring-purple-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Card Footer Actions */}
          <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 bg-slate-50/50 dark:bg-slate-800/20">
            <Button variant="outline" type="button" className="h-8 px-3 text-xs border-slate-200">
              Reset
            </Button>
            <Button
              type="button"
              onClick={handleSaveRule}
              className="h-8 px-4 text-xs font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-xs"
            >
              Save Rule
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
