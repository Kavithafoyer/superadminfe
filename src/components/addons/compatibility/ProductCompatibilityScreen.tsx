'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Layers,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Link2,
  FileDown,
  Check,
  X,
  GraduationCap,
  Code,
  Users,
  ShoppingCart,
  Building2,
  Shield,
  Pencil,
  Trash2,
  ChevronDown,
  Sparkles,
  Puzzle,
  RotateCcw,
  SlidersHorizontal,
  Info,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { INITIAL_COMPATIBILITY_MATRIX } from '../mockData';
import { CompatibilityMatrixRow, CompatibilityStatus } from '../types';

export function ProductCompatibilityScreen() {
  const router = useRouter();

  // Active top tab
  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'rules' | 'conflicts' | 'versions'>('matrix');

  // Matrix State
  const [matrix, setMatrix] = useState<CompatibilityMatrixRow[]>(INITIAL_COMPATIBILITY_MATRIX);
  const [selectedRowId, setSelectedRowId] = useState<string>(INITIAL_COMPATIBILITY_MATRIX[0]?.id || '');

  // Filter Bar state
  const [filterProduct, setFilterProduct] = useState('All Products');
  const [filterEdition, setFilterEdition] = useState('All Editions');
  const [filterCategory, setFilterCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newRuleForm, setNewRuleForm] = useState({
    addonName: '',
    category: 'AI & Automation',
    applicableProducts: ['Education', 'IT', 'CRM'],
    compatibilityType: 'Compatible' as CompatibilityMatrixRow['compatibilityType'],
    dependencies: ['AI CRM Assistant'],
    versionConstraint: true,
    minVersion: 'v2.0.0',
    maxVersion: 'v3.9.9',
    ruleDescription: 'Standard compatibility requirement.',
  });

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Selected Row
  const selectedRow = useMemo(() => {
    return matrix.find((r) => r.id === selectedRowId) || matrix[0];
  }, [matrix, selectedRowId]);

  // Form Rule State in Right Panel
  const [ruleForm, setRuleForm] = useState<{
    applicableProducts: string[];
    compatibilityType: 'Compatible' | 'Not Compatible' | 'Requires Dependency';
    dependencies: string[];
    versionConstraint: boolean;
    minVersion: string;
    maxVersion: string;
    ruleDescription: string;
  }>({
    applicableProducts: selectedRow?.applicableProducts || ['Education', 'IT', 'People', 'Retail', 'Real Estate', 'CRM'],
    compatibilityType: (selectedRow?.compatibilityType as any) || 'Compatible',
    dependencies: selectedRow?.dependencies || ['AI CRM Assistant', 'Data Analytics'],
    versionConstraint: selectedRow?.versionConstraint ?? true,
    minVersion: selectedRow?.minVersion || 'v2.0.0',
    maxVersion: selectedRow?.maxVersion || 'v3.9.9',
    ruleDescription:
      selectedRow?.ruleDescription ||
      'AI Lead Scoring is compatible with all products from version 2.0.0 and above. Requires AI CRM Assistant for advanced scoring.',
  });

  // When changing row selection, update right panel form
  const handleSelectRow = (item: CompatibilityMatrixRow) => {
    setSelectedRowId(item.id);
    setRuleForm({
      applicableProducts: item.applicableProducts,
      compatibilityType: (item.compatibilityType as any) || 'Compatible',
      dependencies: item.dependencies,
      versionConstraint: item.versionConstraint,
      minVersion: item.minVersion,
      maxVersion: item.maxVersion,
      ruleDescription: item.ruleDescription,
    });
  };

  const handleSaveRule = () => {
    setMatrix((prev) =>
      prev.map((r) =>
        r.id === selectedRow.id
          ? {
              ...r,
              applicableProducts: ruleForm.applicableProducts,
              compatibilityType: ruleForm.compatibilityType,
              dependencies: ruleForm.dependencies,
              versionConstraint: ruleForm.versionConstraint,
              minVersion: ruleForm.minVersion,
              maxVersion: ruleForm.maxVersion,
              ruleDescription: ruleForm.ruleDescription,
            }
          : r
      )
    );
    showToast(`Compatibility rule for "${selectedRow.addonName}" updated successfully!`);
  };

  const handleCreateRuleSubmit = () => {
    if (!newRuleForm.addonName.trim()) {
      showToast('Please enter an Add-on Name');
      return;
    }
    const newEntry: CompatibilityMatrixRow = {
      id: `cmp-${Date.now()}`,
      addonName: newRuleForm.addonName,
      category: newRuleForm.category,
      matrix: {
        education: newRuleForm.applicableProducts.includes('Education') ? 'compatible' : 'incompatible',
        it: newRuleForm.applicableProducts.includes('IT') ? 'compatible' : 'incompatible',
        people: newRuleForm.applicableProducts.includes('People') ? 'compatible' : 'incompatible',
        retail: newRuleForm.applicableProducts.includes('Retail') ? 'compatible' : 'incompatible',
        realEstate: newRuleForm.applicableProducts.includes('Real Estate') ? 'compatible' : 'incompatible',
        crm: newRuleForm.applicableProducts.includes('CRM') ? 'compatible' : 'incompatible',
      },
      applicableProducts: newRuleForm.applicableProducts,
      compatibilityType: newRuleForm.compatibilityType,
      dependencies: newRuleForm.dependencies,
      versionConstraint: newRuleForm.versionConstraint,
      minVersion: newRuleForm.minVersion,
      maxVersion: newRuleForm.maxVersion,
      ruleDescription: newRuleForm.ruleDescription,
      status: 'Active',
    };
    setMatrix((prev) => [newEntry, ...prev]);
    setSelectedRowId(newEntry.id);
    setIsCreateModalOpen(false);
    showToast(`Compatibility rule created for "${newEntry.addonName}"!`);
  };

  const handleToggleProduct = (prod: string) => {
    setRuleForm((prev) => ({
      ...prev,
      applicableProducts: prev.applicableProducts.includes(prod)
        ? prev.applicableProducts.filter((p) => p !== prod)
        : [...prev.applicableProducts, prod],
    }));
  };

  const handleToggleDependency = (dep: string) => {
    setRuleForm((prev) => ({
      ...prev,
      dependencies: prev.dependencies.includes(dep)
        ? prev.dependencies.filter((d) => d !== dep)
        : [...prev.dependencies, dep],
    }));
  };

  // Filter logic
  const filteredMatrix = useMemo(() => {
    return matrix.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.addonName.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
      const matchesCategory =
        filterCategory === 'All Categories' || item.category === filterCategory;
      const matchesProduct =
        filterProduct === 'All Products' || item.applicableProducts.includes(filterProduct);
      return matchesSearch && matchesCategory && matchesProduct;
    });
  }, [matrix, searchQuery, filterCategory, filterProduct]);

  // Status icon renderer matching Screenshot 2
  const renderCellStatus = (status?: CompatibilityStatus) => {
    if (status === 'compatible') {
      return (
        <span className="inline-flex items-center justify-center text-emerald-600 font-bold text-sm">
          <Check className="h-4 w-4 stroke-[2.5]" />
        </span>
      );
    }
    if (status === 'dependency') {
      return (
        <span className="inline-flex items-center justify-center text-purple-600 font-bold text-sm">
          <Link2 className="h-4 w-4 stroke-[2]" />
        </span>
      );
    }
    return (
      <span className="inline-flex items-center justify-center text-rose-500 font-bold text-sm">
        <X className="h-4 w-4 stroke-[2.5]" />
      </span>
    );
  };

  const handleExportMatrix = () => {
    const headers = ['Add-on', 'Category', 'Education', 'IT', 'People', 'Retail', 'Real Estate', 'CRM'];
    const rows = filteredMatrix.map((r) => [
      r.addonName,
      r.category,
      r.matrix.education,
      r.matrix.it,
      r.matrix.people,
      r.matrix.retail,
      r.matrix.realEstate,
      r.matrix.crm,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Product_Compatibility_Matrix.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported compatibility matrix to CSV');
  };

  return (
    <div className="w-full space-y-5 pb-12 font-sans text-slate-800 antialiased">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2 bg-[#6222cc] text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-medium animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Breadcrumbs matching Screenshot 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="hover:text-slate-800 cursor-pointer" onClick={() => router.push('/addon-marketplace')}>
              Add-on Marketplace
            </span>
            <span className="text-slate-400">&gt;</span>
            <span className="text-[#6222cc] font-semibold">Product Compatibility</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Product Compatibility
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Define and manage which add-ons are compatible with which products, editions and versions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="h-9 px-4 text-xs font-semibold bg-[#6366f1] hover:bg-[#5046e5] text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Create Compatibility Rule</span>
          </button>
        </div>
      </div>

      {/* 5 KPI Cards matching Screenshot 2 exactly */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Products */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex items-center gap-3">
          <div className="p-3 bg-purple-50 text-[#6366f1] rounded-xl shrink-0">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Products</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">6</p>
          </div>
        </div>

        {/* Total Add-ons */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0">
            <Puzzle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Add-ons</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">34</p>
          </div>
        </div>

        {/* Compatibility Rules */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
            <Check className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Compatibility Rules</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">128</p>
          </div>
        </div>

        {/* Conflicts */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex items-center gap-3">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Conflicts</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">6</p>
          </div>
        </div>

        {/* Dependencies */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex items-center gap-3">
          <div className="p-3 bg-purple-50 text-[#6366f1] rounded-xl shrink-0">
            <Link2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Dependencies</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">14</p>
          </div>
        </div>
      </div>

      {/* Underline Tabs matching Screenshot 2 */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6 sm:space-x-8 text-xs sm:text-sm">
          {[
            { id: 'matrix', label: 'Compatibility Matrix' },
            { id: 'rules', label: 'Rules & Dependencies' },
            { id: 'conflicts', label: 'Conflicts' },
            { id: 'versions', label: 'Version Compatibility' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as any)}
              className={cn(
                'pb-3 font-semibold transition-all relative cursor-pointer',
                activeSubTab === tab.id
                  ? 'text-[#6222cc] border-b-2 border-[#6222cc] -mb-[1px]'
                  : 'text-slate-500 hover:text-slate-800'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Filter Bar matching Screenshot 2 */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 max-w-2xl">
            {/* Product */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500">Product</label>
              <div className="relative">
                <select
                  value={filterProduct}
                  onChange={(e) => setFilterProduct(e.target.value)}
                  className="w-full appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-3 pr-8 py-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6222cc] cursor-pointer"
                >
                  <option value="All Products">All Products</option>
                  <option value="Education">Education</option>
                  <option value="IT">IT</option>
                  <option value="People">People (HRMS)</option>
                  <option value="Retail">Retail</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="CRM">CRM (Generic)</option>
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Edition */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500">Edition</label>
              <div className="relative">
                <select
                  value={filterEdition}
                  onChange={(e) => setFilterEdition(e.target.value)}
                  className="w-full appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-3 pr-8 py-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6222cc] cursor-pointer"
                >
                  <option value="All Editions">All Editions</option>
                  <option value="Core (Free)">Core (Free)</option>
                  <option value="Standard">Standard</option>
                  <option value="Professional">Professional</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Add-on Category */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500">Add-on Category</label>
              <div className="relative">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-3 pr-8 py-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6222cc] cursor-pointer"
                >
                  <option value="All Categories">All Categories</option>
                  <option value="AI & Automation">AI &amp; Automation</option>
                  <option value="Communication">Communication</option>
                  <option value="Finance">Finance</option>
                  <option value="Workforce">Workforce</option>
                  <option value="Productivity">Productivity</option>
                  <option value="Project & Delivery">Project &amp; Delivery</option>
                  <option value="Testing & QA">Testing &amp; QA</option>
                  <option value="Operations">Operations</option>
                  <option value="Sales & Marketing">Sales &amp; Marketing</option>
                  <option value="Industry Specific">Industry Specific</option>
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 sm:pt-0">
            <button
              type="button"
              onClick={() => {
                setFilterProduct('All Products');
                setFilterEdition('All Editions');
                setFilterCategory('All Categories');
                setSearchQuery('');
                showToast('Filters reset.');
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Reset
            </button>
            <Button
              type="button"
              onClick={() => showToast('Filters applied.')}
              className="bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs h-9 px-4 rounded-lg font-medium shadow-2xs cursor-pointer"
            >
              Apply
            </Button>
          </div>
        </div>
      </div>

      {/* ==============================================================
          TAB 1: COMPATIBILITY MATRIX (EXACT SCREENSHOT LAYOUT)
         ============================================================== */}
      {activeSubTab === 'matrix' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT COLUMN: Compatibility Matrix Table (~60% width) */}
          <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
            {/* Header row with Title and Legend matching Screenshot 2 */}
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-base font-bold text-slate-900">
                Compatibility Matrix
              </h3>

              {/* Legend matching Screenshot 2 */}
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-slate-700 font-medium">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span>Compatible</span>
                </span>
                <span className="flex items-center gap-1 text-slate-700 font-medium">
                  <X className="h-4 w-4 text-rose-500 stroke-[2.5]" />
                  <span>Not Compatible</span>
                </span>
                <span className="flex items-center gap-1 text-slate-700 font-medium">
                  <Link2 className="h-4 w-4 text-purple-600" />
                  <span>Requires Dependency</span>
                </span>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-700 border-b border-slate-200 font-semibold text-[11px]">
                    <th className="py-3 px-4 w-[24%]">Add-on (34)</th>
                    <th className="py-3 px-3 w-[20%]">Category</th>
                    <th className="py-3 px-2 text-center w-[9.3%]">
                      <div className="flex flex-col items-center gap-0.5">
                        <GraduationCap className="h-4 w-4 text-[#6366f1]" />
                        <span className="text-[10px]">Education</span>
                      </div>
                    </th>
                    <th className="py-3 px-2 text-center w-[9.3%]">
                      <div className="flex flex-col items-center gap-0.5">
                        <Code className="h-4 w-4 text-[#6366f1]" />
                        <span className="text-[10px]">IT</span>
                      </div>
                    </th>
                    <th className="py-3 px-2 text-center w-[9.3%]">
                      <div className="flex flex-col items-center gap-0.5">
                        <Users className="h-4 w-4 text-[#6366f1]" />
                        <span className="text-[10px]">People (HRMS)</span>
                      </div>
                    </th>
                    <th className="py-3 px-2 text-center w-[9.3%]">
                      <div className="flex flex-col items-center gap-0.5">
                        <ShoppingCart className="h-4 w-4 text-[#6366f1]" />
                        <span className="text-[10px]">Retail</span>
                      </div>
                    </th>
                    <th className="py-3 px-2 text-center w-[9.3%]">
                      <div className="flex flex-col items-center gap-0.5">
                        <Building2 className="h-4 w-4 text-[#6366f1]" />
                        <span className="text-[10px]">Real Estate</span>
                      </div>
                    </th>
                    <th className="py-3 px-2 text-center w-[9.3%]">
                      <div className="flex flex-col items-center gap-0.5">
                        <Shield className="h-4 w-4 text-[#6366f1]" />
                        <span className="text-[10px]">CRM (Generic)</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMatrix.map((row) => {
                    const isSelected = selectedRowId === row.id;
                    return (
                      <tr
                        key={row.id}
                        onClick={() => handleSelectRow(row)}
                        className={cn(
                          'cursor-pointer transition-colors',
                          isSelected
                            ? 'bg-[#f8f5ff] border-l-2 border-l-[#6222cc]'
                            : 'hover:bg-slate-50/70'
                        )}
                      >
                        <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                          {row.addonName}
                        </td>
                        <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                          {row.category}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {renderCellStatus(row.matrix.education)}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {renderCellStatus(row.matrix.it)}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {renderCellStatus(row.matrix.people)}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {renderCellStatus(row.matrix.retail)}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {renderCellStatus(row.matrix.realEstate)}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {renderCellStatus(row.matrix.crm)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT COLUMN: Compatibility Rule Details Card (~40% width) */}
          <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
            {/* Header matching Screenshot 2 */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                Compatibility Rule Details
              </h2>
              <span className="bg-[#dcfce7] text-[#15803d] px-2.5 py-0.5 rounded-full text-xs font-semibold">
                Active
              </span>
            </div>

            {/* Selected Add-on Header Banner */}
            <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/40">
              <div className="p-2.5 bg-purple-50 text-[#6222cc] rounded-xl border border-purple-100 shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  {selectedRow.addonName}
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  {selectedRow.category}
                </p>
              </div>
            </div>

            {/* Form Fields matching Screenshot 2 */}
            <div className="p-4 space-y-4 text-xs">
              {/* Applicable Products Tags */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">
                  Applicable Products <span className="text-rose-500">*</span>
                </label>
                <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl min-h-[38px]">
                  {ruleForm.applicableProducts.map((prod) => (
                    <span
                      key={prod}
                      className="inline-flex items-center gap-1 bg-white border border-slate-200 text-slate-800 text-[11px] font-semibold px-2 py-0.5 rounded-md shadow-2xs"
                    >
                      <span>{prod}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleProduct(prod)}
                        className="text-slate-400 hover:text-rose-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  <div className="relative ml-auto">
                    <select
                      onChange={(e) => {
                        if (e.target.value) handleToggleProduct(e.target.value);
                      }}
                      className="text-[11px] bg-transparent text-slate-500 font-semibold outline-none cursor-pointer"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        + Add Product
                      </option>
                      {['Education', 'IT', 'People', 'Retail', 'Real Estate', 'CRM'].map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Compatibility Type Radio Options */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">
                  Compatibility Type
                </label>
                <div className="flex flex-wrap items-center gap-4 pt-0.5">
                  {[
                    { val: 'Compatible', label: 'Compatible' },
                    { val: 'Not Compatible', label: 'Not Compatible' },
                    { val: 'Requires Dependency', label: 'Requires Dependency' },
                  ].map((opt) => (
                    <label key={opt.val} className="flex items-center gap-1.5 text-xs text-slate-800 font-medium cursor-pointer">
                      <input
                        type="radio"
                        name="compType"
                        value={opt.val}
                        checked={ruleForm.compatibilityType === opt.val}
                        onChange={() => setRuleForm({ ...ruleForm, compatibilityType: opt.val as any })}
                        className="accent-[#6222cc] h-3.5 w-3.5"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Dependency (Optional) Tags */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">
                  Dependency (Optional)
                </label>
                <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl min-h-[38px]">
                  {ruleForm.dependencies.map((dep) => (
                    <span
                      key={dep}
                      className="inline-flex items-center gap-1 bg-white border border-slate-200 text-slate-800 text-[11px] font-semibold px-2 py-0.5 rounded-md shadow-2xs"
                    >
                      <span>{dep}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleDependency(dep)}
                        className="text-slate-400 hover:text-rose-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  <div className="relative ml-auto">
                    <select
                      onChange={(e) => {
                        if (e.target.value) handleToggleDependency(e.target.value);
                      }}
                      className="text-[11px] bg-transparent text-slate-500 font-semibold outline-none cursor-pointer"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        + Add Dependency
                      </option>
                      {['AI CRM Assistant', 'Data Analytics', 'Invoicing Core', 'Hardware Bridge', 'PDF Engine v4'].map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Version Condition with Checkbox */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={ruleForm.versionConstraint}
                    onChange={(e) => setRuleForm({ ...ruleForm, versionConstraint: e.target.checked })}
                    className="rounded border-slate-300 accent-[#6222cc] text-[#6222cc] h-4 w-4"
                  />
                  <span>Apply version constraint</span>
                </label>

                {ruleForm.versionConstraint && (
                  <div className="grid grid-cols-2 gap-3 pl-6">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-600 block">
                        Minimum Version
                      </label>
                      <Input
                        value={ruleForm.minVersion}
                        onChange={(e) => setRuleForm({ ...ruleForm, minVersion: e.target.value })}
                        className="h-8 text-xs font-mono"
                        placeholder="e.g. v2.0.0"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-600 block">
                        Maximum Version
                      </label>
                      <Input
                        value={ruleForm.maxVersion}
                        onChange={(e) => setRuleForm({ ...ruleForm, maxVersion: e.target.value })}
                        className="h-8 text-xs font-mono"
                        placeholder="e.g. v3.9.9"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Rule Description Textarea */}
              <div className="space-y-1 pt-1 border-t border-slate-100">
                <label className="font-semibold text-slate-700 block">
                  Rule Description
                </label>
                <textarea
                  rows={3}
                  value={ruleForm.ruleDescription}
                  onChange={(e) => setRuleForm({ ...ruleForm, ruleDescription: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-[#6222cc] leading-relaxed"
                />
              </div>
            </div>

            {/* Bottom Buttons matching Screenshot 2 */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (selectedRow) handleSelectRow(selectedRow);
                }}
                className="text-xs h-8 px-4 border-slate-200 text-slate-700"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSaveRule}
                className="text-xs h-8 px-5 bg-[#6222cc] hover:bg-[#521cb0] text-white font-semibold rounded-lg shadow-xs cursor-pointer"
              >
                Save Rule
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          TAB 2: RULES & DEPENDENCIES
         ============================================================== */}
      {activeSubTab === 'rules' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden animate-in fade-in">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Active Compatibility &amp; Prerequisite Rules</h3>
              <p className="text-xs text-slate-500">System enforces these prerequisites before tenant add-on activation.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportMatrix}
              className="text-xs border-slate-200"
            >
              <FileDown className="h-3.5 w-3.5 mr-1" />
              Export Rules
            </Button>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="py-2.5 px-4">Add-on Name</th>
                <th className="py-2.5 px-3">Rule Type</th>
                <th className="py-2.5 px-3">Prerequisite Add-on</th>
                <th className="py-2.5 px-3">Supported Version Window</th>
                <th className="py-2.5 px-3">Enforcement</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {matrix.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-4 font-bold text-slate-900">{row.addonName}</td>
                  <td className="py-2.5 px-3">
                    <span className="bg-purple-50 text-[#6222cc] px-2 py-0.5 rounded-full text-[10px] font-semibold">
                      {row.compatibilityType}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-700">
                    {row.dependencies.length > 0 ? row.dependencies.join(', ') : 'None (Standalone)'}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">
                    {row.versionConstraint ? `${row.minVersion} – ${row.maxVersion}` : 'All versions supported'}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                      Auto-Enforced
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        handleSelectRow(row);
                        setActiveSubTab('matrix');
                      }}
                      className="text-xs font-semibold text-[#6222cc] hover:underline"
                    >
                      Edit Rule
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ==============================================================
          TAB 3: CONFLICTS
         ============================================================== */}
      {activeSubTab === 'conflicts' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Detected Collision &amp; Conflict Rules (6)</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Prevents concurrent installation of competing modules on the same tenant schema.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { addA: 'Razorpay Payment Gateway', addB: 'PayU Payment Gateway', reason: 'Dual checkout interceptors cause webhook collisions on fee records.', level: 'Hard Collision' },
                { addA: 'ZKTeco Biometric Connector', addB: 'Essl Biometric Driver', reason: 'Shared hardware port 4370 collision on biometric attendance pollers.', level: 'Hard Collision' },
                { addA: 'Legacy SMS Gateway', addB: 'WhatsApp Cloud API Notification Hub', reason: 'Redundant notification dispatch leads to duplicate billing.', level: 'Soft Warning' },
                { addA: 'Document Generator v1', addB: 'PDF Engine Pro v4', reason: 'Font rendering driver incompatibility on Linux workers.', level: 'Hard Collision' },
              ].map((conf, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-200">
                      {conf.level}
                    </span>
                    <span className="text-[11px] text-slate-400">Rule ID: CNF-00{idx + 1}</span>
                  </div>
                  <div className="font-bold text-slate-900 text-xs">
                    {conf.addA} <span className="text-rose-500 font-normal">conflicts with</span> {conf.addB}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{conf.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          TAB 4: VERSION COMPATIBILITY
         ============================================================== */}
      {activeSubTab === 'versions' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs p-5 space-y-4 animate-in fade-in">
          <div>
            <h3 className="text-base font-bold text-slate-900">Product Suite Baseline Version Requirements</h3>
            <p className="text-xs text-slate-500 mt-0.5">Minimum platform kernel versions required for marketplace add-ons.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            {[
              { prod: 'Pegatto CRM', current: 'v3.2.0', minAddonVer: 'v2.0.0', status: 'Stable' },
              { prod: 'Pegatto Education', current: 'v2.8.4', minAddonVer: 'v1.8.0', status: 'Stable' },
              { prod: 'Pegatto IT', current: 'v3.1.2', minAddonVer: 'v2.1.0', status: 'Stable' },
              { prod: 'Pegatto People', current: 'v2.4.0', minAddonVer: 'v1.5.0', status: 'Update Queued' },
              { prod: 'Pegatto Retail', current: 'v2.9.0', minAddonVer: 'v2.0.0', status: 'Stable' },
              { prod: 'Pegatto Real Estate', current: 'v3.0.1', minAddonVer: 'v2.2.0', status: 'Stable' },
            ].map((v, idx) => (
              <div key={idx} className="p-3.5 border border-slate-200 rounded-xl bg-slate-50/50 space-y-1.5 text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{v.prod}</span>
                  <span className="font-mono text-[#6222cc]">{v.current}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Marketplace Baseline:</span>
                  <span className="font-mono font-medium text-slate-700">{v.minAddonVer}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==============================================================
          MODAL: CREATE COMPATIBILITY RULE
         ============================================================== */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-xl rounded-2xl p-6">
          <DialogHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-50 text-[#6366f1] rounded-xl border border-purple-100">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-slate-900">
                  Create Compatibility Rule
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Define product compatibility, prerequisites, and version constraints.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Add-on Name *</label>
                <Input
                  value={newRuleForm.addonName}
                  onChange={(e) => setNewRuleForm({ ...newRuleForm, addonName: e.target.value })}
                  placeholder="e.g. AI Customer Agent"
                  className="text-xs h-9"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Category</label>
                <select
                  value={newRuleForm.category}
                  onChange={(e) => setNewRuleForm({ ...newRuleForm, category: e.target.value })}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium"
                >
                  <option value="AI & Automation">AI &amp; Automation</option>
                  <option value="Communication">Communication</option>
                  <option value="Finance">Finance</option>
                  <option value="Productivity">Productivity</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Applicable Products</label>
              <div className="flex flex-wrap gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                {['Education', 'IT', 'People', 'Retail', 'Real Estate', 'CRM'].map((p) => {
                  const isChecked = newRuleForm.applicableProducts.includes(p);
                  return (
                    <label key={p} className="flex items-center gap-1.5 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...newRuleForm.applicableProducts, p]
                            : newRuleForm.applicableProducts.filter((item) => item !== p);
                          setNewRuleForm({ ...newRuleForm, applicableProducts: updated });
                        }}
                        className="rounded border-slate-300 accent-[#6222cc] h-3.5 w-3.5"
                      />
                      <span>{p}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Rule Description</label>
              <textarea
                rows={2}
                value={newRuleForm.ruleDescription}
                onChange={(e) => setNewRuleForm({ ...newRuleForm, ruleDescription: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                placeholder="Details of compatibility prerequisites"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreateRuleSubmit}
              className="bg-[#6366f1] hover:bg-[#5046e5] text-white text-xs font-semibold px-4"
            >
              Create Rule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
