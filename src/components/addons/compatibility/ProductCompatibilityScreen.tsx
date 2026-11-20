'use client';

import React, { useState, useMemo } from 'react';
import {
  Layers,
  Puzzle,
  Search,
  CheckCircle2,
  AlertTriangle,
  Link2,
  Plus,
  Check,
  X,
  Sparkles,
  RotateCcw,
  GraduationCap,
  Code,
  Users,
  ShoppingCart,
  Building,
  Briefcase,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  ArrowLeft,
  FileDown,
  RefreshCw,
  Save,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { INITIAL_COMPATIBILITY_MATRIX } from '../mockData';
import { CompatibilityMatrixRow, CompatibilityStatus } from '../types';

type ScreenViewMode = 'list' | 'create' | 'edit' | 'overview';

export function ProductCompatibilityScreen() {
  const [matrixRows, setMatrixRows] = useState<CompatibilityMatrixRow[]>(INITIAL_COMPATIBILITY_MATRIX);
  const [viewMode, setViewMode] = useState<ScreenViewMode>('list');
  const [selectedRowId, setSelectedRowId] = useState<string>(INITIAL_COMPATIBILITY_MATRIX[0]?.id || '');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [suiteFilter, setSuiteFilter] = useState('All Suites');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // Row selection
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  // Active Dropdown Menu
  const [activeMenuRowId, setActiveMenuRowId] = useState<string | null>(null);

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<CompatibilityMatrixRow | null>(null);

  const selectedRow = useMemo(() => {
    return matrixRows.find((r) => r.id === selectedRowId) || matrixRows[0];
  }, [matrixRows, selectedRowId]);

  const [formData, setFormData] = useState<CompatibilityMatrixRow>(
    selectedRow || {
      id: '',
      addonName: '',
      category: 'AI & Automation',
      matrix: {
        education: 'compatible',
        it: 'compatible',
        people: 'compatible',
        retail: 'compatible',
        realEstate: 'compatible',
        crm: 'compatible',
      },
      applicableProducts: ['Education', 'IT', 'CRM'],
      compatibilityType: 'Compatible',
      dependencies: ['AI CRM Assistant'],
      versionConstraint: true,
      minVersion: 'v2.0.0',
      maxVersion: 'v3.9.9',
      ruleDescription: '',
      status: 'Active',
    }
  );

  const filteredRows = useMemo(() => {
    return matrixRows.filter((r) => {
      const matchesSearch =
        r.addonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === 'All Categories' || r.category === categoryFilter;
      const matchesStatus =
        statusFilter === 'All Status' || r.status === statusFilter;
      const matchesSuite =
        suiteFilter === 'All Suites' ||
        (suiteFilter === 'Education' && r.matrix.education === 'compatible') ||
        (suiteFilter === 'IT Suite' && r.matrix.it === 'compatible') ||
        (suiteFilter === 'CRM' && r.matrix.crm === 'compatible') ||
        (suiteFilter === 'Retail' && r.matrix.retail === 'compatible') ||
        (suiteFilter === 'Real Estate' && r.matrix.realEstate === 'compatible') ||
        (suiteFilter === 'HRMS' && r.matrix.people === 'compatible');
      return matchesSearch && matchesCategory && matchesStatus && matchesSuite;
    });
  }, [matrixRows, searchQuery, categoryFilter, suiteFilter, statusFilter]);

  const handleOpenCreate = () => {
    setFormData({
      id: `cmp-${Date.now()}`,
      addonName: '',
      category: 'AI & Automation',
      matrix: {
        education: 'compatible',
        it: 'compatible',
        people: 'compatible',
        retail: 'compatible',
        realEstate: 'compatible',
        crm: 'compatible',
      },
      applicableProducts: ['Education', 'IT', 'CRM'],
      compatibilityType: 'Compatible',
      dependencies: ['Core Module'],
      versionConstraint: true,
      minVersion: 'v1.0.0',
      maxVersion: 'v4.0.0',
      ruleDescription: '',
      status: 'Active',
    });
    setViewMode('create');
    setActiveMenuRowId(null);
  };

  const handleOpenEdit = (row: CompatibilityMatrixRow) => {
    setSelectedRowId(row.id);
    setFormData({ ...row });
    setViewMode('edit');
    setActiveMenuRowId(null);
  };

  const handleOpenOverview = (row: CompatibilityMatrixRow) => {
    setSelectedRowId(row.id);
    setViewMode('overview');
    setActiveMenuRowId(null);
  };

  const handleSaveForm = (asDraft = false) => {
    const updatedStatus = asDraft ? 'Draft' : formData.status || 'Active';
    const recordToSave: CompatibilityMatrixRow = {
      ...formData,
      status: updatedStatus,
      addonName: formData.addonName.trim() || 'Untitled Add-on Compatibility',
    };

    if (viewMode === 'create') {
      setMatrixRows((prev) => [recordToSave, ...prev]);
    } else {
      setMatrixRows((prev) =>
        prev.map((item) => (item.id === recordToSave.id ? recordToSave : item))
      );
    }
    setSelectedRowId(recordToSave.id);
    setViewMode('list');
  };

  const handleDeletePrompt = (row: CompatibilityMatrixRow) => {
    setItemToDelete(row);
    setDeleteDialogOpen(true);
    setActiveMenuRowId(null);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    setMatrixRows((prev) => prev.filter((item) => item.id !== itemToDelete.id));
    if (selectedRowId === itemToDelete.id) {
      const remaining = matrixRows.filter((item) => item.id !== itemToDelete.id);
      setSelectedRowId(remaining[0]?.id || '');
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleToggleSelectAll = () => {
    if (selectedRowIds.length === filteredRows.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(filteredRows.map((item) => item.id));
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Quick matrix toggle in table
  const handleToggleCell = (rowId: string, colKey: keyof CompatibilityMatrixRow['matrix']) => {
    setMatrixRows((prev) =>
      prev.map((row) => {
        if (row.id !== rowId) return row;
        const current = row.matrix[colKey];
        const next: CompatibilityStatus =
          current === 'compatible'
            ? 'incompatible'
            : current === 'incompatible'
              ? 'dependency'
              : 'compatible';
        return {
          ...row,
          matrix: {
            ...row.matrix,
            [colKey]: next,
          },
        };
      })
    );
  };

  const renderCellStatus = (status: CompatibilityStatus) => {
    if (status === 'compatible') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          ✓ Compatible
        </span>
      );
    }
    if (status === 'incompatible') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
          ✕ Incompatible
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
        ⚡ Dependency
      </span>
    );
  };

  // =========================================================================
  // VIEW MODE: CREATE OR EDIT (Single Unified Card Container - HRM Style)
  // =========================================================================
  if (viewMode === 'create' || viewMode === 'edit') {
    const isEditing = viewMode === 'edit';

    return (
      <div className="w-full space-y-6 pb-12">
        {/* Top Header & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>Add-on Marketplace</span>
              <span>&gt;</span>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="hover:text-[#1574fe] transition-colors"
              >
                Product Compatibility
              </button>
              <span>&gt;</span>
              <span className="text-[#1574fe] dark:text-purple-400 font-medium">
                {isEditing ? 'Edit Rule' : 'Create Rule'}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {isEditing ? `Edit Rule: ${formData.addonName}` : 'Create Compatibility Rule'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isEditing
                ? 'Update cross-product matrix flags, version constraints, and required dependencies.'
                : 'Define compatibility boundaries across Pegatto cloud suites for this extension.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('list')}
              className="text-xs border-slate-200 dark:border-slate-800"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Cancel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSaveForm(true)}
              className="text-xs border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300"
            >
              Save as Draft
            </Button>
            <Button
              size="sm"
              onClick={() => handleSaveForm(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-5 shadow-sm"
            >
              <Save className="h-3.5 w-3.5 mr-1.5" />
              {isEditing ? 'Update Rule' : 'Save Rule'}
            </Button>
          </div>
        </div>

        {/* Single Unified Card (HRM Style) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          {/* Card Header Strip */}
          <div className="bg-gradient-to-r from-purple-50/80 via-indigo-50/40 to-slate-50/60 dark:from-purple-950/40 dark:via-slate-900 dark:to-slate-900 px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-[#1574fe] flex items-center justify-center text-[#1574fe] dark:text-purple-400 font-bold">
                <Puzzle className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Compatibility Matrix & Constraint Configuration
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Fill in all required fields marked with an asterisk (<span className="text-rose-500">*</span>)
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className={
                formData.status === 'Active'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700 text-[11px]'
                  : 'border-amber-200 bg-amber-50 text-amber-700 text-[11px]'
              }
            >
              ● {formData.status || 'Active'}
            </Badge>
          </div>

          {/* Form Body - 3 Column Grid */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Target Add-on Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={formData.addonName}
                  onChange={(e) => setFormData({ ...formData, addonName: e.target.value })}
                  placeholder="e.g. AI Lead Scoring"
                  className="h-10 text-xs rounded-lg border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-purple-600"
                />
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Add-on for which compatibility is being defined
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-purple-600"
                >
                  <option>AI & Automation</option>
                  <option>Communication</option>
                  <option>Productivity</option>
                  <option>Testing & QA</option>
                  <option>Compliance</option>
                </select>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Category taxonomy
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Default Compatibility <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.compatibilityType}
                  onChange={(e) =>
                    setFormData({ ...formData, compatibilityType: e.target.value as any })
                  }
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-purple-600"
                >
                  <option>Compatible</option>
                  <option>Incompatible</option>
                  <option>Dependency</option>
                </select>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Default behavior when new product suites launch
                </span>
              </div>
            </div>

            {/* Version Constraints */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Min Core Version
                </label>
                <Input
                  value={formData.minVersion}
                  onChange={(e) => setFormData({ ...formData, minVersion: e.target.value })}
                  placeholder="v1.0.0"
                  className="h-10 text-xs font-mono rounded-lg border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-purple-600"
                />
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Minimum platform API version supported
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Max Tested Version
                </label>
                <Input
                  value={formData.maxVersion}
                  onChange={(e) => setFormData({ ...formData, maxVersion: e.target.value })}
                  placeholder="v4.0.0"
                  className="h-10 text-xs font-mono rounded-lg border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-purple-600"
                />
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Upper boundary for verified stability
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Rule Status <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-purple-600"
                >
                  <option>Active</option>
                  <option>Draft</option>
                  <option>Inactive</option>
                </select>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Enforce in catalog activation flow
                </span>
              </div>
            </div>

            {/* Matrix Suite-by-Suite Selectors */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                Cloud Suite Compatibility Flags
              </label>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {[
                  { key: 'education', label: 'Education' },
                  { key: 'it', label: 'IT Suite' },
                  { key: 'crm', label: 'CRM' },
                  { key: 'retail', label: 'Retail' },
                  { key: 'realEstate', label: 'Real Estate' },
                  { key: 'people', label: 'HRMS / People' },
                ].map(({ key, label }) => {
                  const currentVal = formData.matrix[key as keyof CompatibilityMatrixRow['matrix']];
                  return (
                    <div
                      key={key}
                      className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 space-y-1.5"
                    >
                      <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block">
                        {label}
                      </span>
                      <select
                        value={currentVal}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            matrix: {
                              ...formData.matrix,
                              [key]: e.target.value as CompatibilityStatus,
                            },
                          })
                        }
                        className="w-full h-8 px-2 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[11px] text-slate-700 dark:text-slate-300"
                      >
                        <option value="compatible">Compatible</option>
                        <option value="incompatible">Incompatible</option>
                        <option value="dependency">Dependency</option>
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Description Textarea */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Rule Notes & Dependency Details
              </label>
              <textarea
                rows={3}
                value={formData.ruleDescription || ''}
                onChange={(e) => setFormData({ ...formData, ruleDescription: e.target.value })}
                placeholder="Requires AI CRM Assistant to be provisioned first before activating this module..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-purple-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="px-6 py-4 bg-slate-50/70 dark:bg-slate-900/70 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('list')}
              className="text-xs border-slate-200 dark:border-slate-800 hover:bg-slate-100"
            >
              Cancel
            </Button>
            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSaveForm(true)}
                className="text-xs border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300"
              >
                Save as Draft
              </Button>
              <Button
                size="sm"
                onClick={() => handleSaveForm(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-6 shadow-sm"
              >
                <Save className="h-3.5 w-3.5 mr-1.5" />
                {isEditing ? 'Update Rule' : 'Save Rule'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW MODE: OVERVIEW
  // =========================================================================
  if (viewMode === 'overview') {
    const row = selectedRow;

    return (
      <div className="w-full space-y-6 pb-12">
        {/* Top Header & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>Add-on Marketplace</span>
              <span>&gt;</span>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="hover:text-[#1574fe] transition-colors"
              >
                Product Compatibility
              </button>
              <span>&gt;</span>
              <span className="text-[#1574fe] dark:text-purple-400 font-medium">
                {row.addonName}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {row.addonName}
              </h1>
              <Badge
                variant="outline"
                className="font-mono text-xs border-blue-200 bg-blue-50 text-[#1574fe] dark:bg-blue-950 dark:text-blue-300"
              >
                {row.category}
              </Badge>
              <Badge
                variant="outline"
                className={
                  row.status === 'Active'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 text-xs'
                    : 'border-amber-200 bg-amber-50 text-amber-700 text-xs'
                }
              >
                ● {row.status}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('list')}
              className="text-xs border-slate-200 dark:border-slate-800"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              Back to List
            </Button>
            <Button
              size="sm"
              onClick={() => handleOpenEdit(row)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 shadow-sm"
            >
              <Pencil className="h-3.5 w-3.5 mr-1.5" />
              Edit Rule
            </Button>
          </div>
        </div>

        {/* 4 Light KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-blue-200/80 dark:border-purple-800/40 bg-gradient-to-br from-purple-50 via-purple-50/40 to-white dark:from-purple-950/30 dark:via-purple-900/10 dark:to-slate-900 shadow-sm">
            <p className="text-xs font-medium text-purple-900 dark:text-blue-300">Default Type</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {row.compatibilityType}
            </p>
            <p className="text-[11px] text-[#1574fe] dark:text-purple-400 mt-1">Global fallback</p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-200/80 dark:border-emerald-800/40 bg-gradient-to-br from-emerald-50 via-emerald-50/40 to-white dark:from-emerald-950/30 dark:via-emerald-900/10 dark:to-slate-900 shadow-sm">
            <p className="text-xs font-medium text-emerald-900 dark:text-emerald-300">Min Core Version</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono">
              {row.minVersion || 'v1.0.0'}
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Required framework</p>
          </div>

          <div className="p-4 rounded-xl border border-blue-200/80 dark:border-blue-800/40 bg-gradient-to-br from-blue-50 via-blue-50/40 to-white dark:from-blue-950/30 dark:via-blue-900/10 dark:to-slate-900 shadow-sm">
            <p className="text-xs font-medium text-blue-900 dark:text-blue-300">Max Supported</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono">
              {row.maxVersion || 'v4.0.0'}
            </p>
            <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1">Tested compatibility</p>
          </div>

          <div className="p-4 rounded-xl border border-amber-200/80 dark:border-amber-800/40 bg-gradient-to-br from-amber-50 via-amber-50/40 to-white dark:from-amber-950/30 dark:via-amber-900/10 dark:to-slate-900 shadow-sm">
            <p className="text-xs font-medium text-amber-900 dark:text-amber-300">Dependencies</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {(row.dependencies || []).length} Required
            </p>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">Prerequisite modules</p>
          </div>
        </div>

        {/* Matrix Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50/80 via-indigo-50/40 to-slate-50/60 dark:from-purple-950/40 dark:via-slate-900 dark:to-slate-900 px-6 py-4 border-b border-slate-200/80 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Cross-Platform Compatibility Breakdown
            </h3>
          </div>
          <div className="p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-center">
              <span className="text-xs text-slate-500 block mb-1">Education</span>
              {renderCellStatus(row.matrix.education)}
            </div>
            <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-center">
              <span className="text-xs text-slate-500 block mb-1">IT Suite</span>
              {renderCellStatus(row.matrix.it)}
            </div>
            <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-center">
              <span className="text-xs text-slate-500 block mb-1">CRM</span>
              {renderCellStatus(row.matrix.crm)}
            </div>
            <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-center">
              <span className="text-xs text-slate-500 block mb-1">Retail</span>
              {renderCellStatus(row.matrix.retail)}
            </div>
            <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-center">
              <span className="text-xs text-slate-500 block mb-1">Real Estate</span>
              {renderCellStatus(row.matrix.realEstate)}
            </div>
            <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-center">
              <span className="text-xs text-slate-500 block mb-1">HRMS / People</span>
              {renderCellStatus(row.matrix.people)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW MODE: LIST (Interactive Matrix Table with Light-Colored Cards)
  // =========================================================================
  return (
    <div className="w-full space-y-6 pb-12">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Add-on Marketplace</span>
            <span>&gt;</span>
            <span className="text-[#1574fe] dark:text-purple-400 font-medium">Product Compatibility</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Product Compatibility ({matrixRows.length})
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage cross-product compatibility, version constraints, and required dependencies.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            onClick={() => setSearchQuery('')}
            className="h-9 px-3.5 text-xs font-medium border-slate-200 dark:border-slate-800 shadow-xs"
          >
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Refresh
          </Button>
          <Button
            variant="outline"
            className="h-9 px-3.5 text-xs font-medium border-slate-200 dark:border-slate-800 shadow-xs"
          >
            <FileDown className="h-4 w-4 mr-1.5" />
            Export
          </Button>
          <Button
            onClick={handleOpenCreate}
            className="h-9 px-4.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Add Rule
          </Button>
        </div>
      </div>

      {/* 4 Light-Colored KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-emerald-200/80 dark:border-emerald-800/40 bg-gradient-to-br from-emerald-50 via-emerald-50/40 to-white dark:from-emerald-950/30 dark:via-emerald-900/10 dark:to-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-emerald-900 dark:text-emerald-300">Compatible Links</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">38</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-300">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-blue-200/80 dark:border-blue-800/40 bg-gradient-to-br from-blue-50 via-blue-50/40 to-white dark:from-blue-950/30 dark:via-blue-900/10 dark:to-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-blue-900 dark:text-blue-300">Dependency Links</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">6</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-300">
            <Link2 className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-rose-200/80 dark:border-rose-800/40 bg-gradient-to-br from-rose-50 via-rose-50/40 to-white dark:from-rose-950/30 dark:via-rose-900/10 dark:to-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-rose-900 dark:text-rose-300">Incompatible Blocks</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">4</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-rose-100 dark:bg-rose-900/60 flex items-center justify-center text-rose-600 dark:text-rose-300">
            <ShieldAlert className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-amber-200/80 dark:border-amber-800/40 bg-gradient-to-br from-amber-50 via-amber-50/40 to-white dark:from-amber-950/30 dark:via-amber-900/10 dark:to-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-amber-900 dark:text-amber-300">Version Constraints</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">8 Rules</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-amber-600 dark:text-amber-300">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Light-Tinted Search & Filter Panel (Matching Add-on Master 4-Column Balanced Layout) */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-50 via-purple-50/20 to-white dark:from-slate-900 dark:via-purple-950/20 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
          <div>
            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Search Add-on
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder="Search by Code, Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 text-xs bg-white dark:bg-slate-900 rounded-lg border-slate-200 dark:border-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300"
            >
              <option>All Categories</option>
              <option>AI & Automation</option>
              <option>Communication</option>
              <option>Productivity</option>
              <option>Testing & QA</option>
              <option>Compliance</option>
              <option>Industry Specific</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Suite Target
            </label>
            <select
              value={suiteFilter}
              onChange={(e) => setSuiteFilter(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300"
            >
              <option>All Suites</option>
              <option>Education</option>
              <option>IT Suite</option>
              <option>CRM</option>
              <option>Retail</option>
              <option>Real Estate</option>
              <option>HRMS</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Status
            </label>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300"
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Draft</option>
                <option>Inactive</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('All Categories');
                  setSuiteFilter('All Suites');
                  setStatusFilter('All Status');
                }}
                className="text-xs px-3 border-slate-200 dark:border-slate-800 shrink-0"
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Matrix Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Cross-Product Compatibility Matrix
            </h3>
            <Badge
              variant="secondary"
              className="bg-blue-50 text-[#1574fe] dark:bg-blue-950 dark:text-blue-300 text-xs"
            >
              Click cells to toggle status
            </Badge>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 text-[11px]">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Compatible
            </span>
            <span className="flex items-center gap-1.5 text-[11px]">
              <span className="h-2 w-2 rounded-full bg-amber-500" /> Dependency
            </span>
            <span className="flex items-center gap-1.5 text-[11px]">
              <span className="h-2 w-2 rounded-full bg-rose-500" /> Incompatible
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      filteredRows.length > 0 &&
                      selectedRowIds.length === filteredRows.length
                    }
                    onChange={handleToggleSelectAll}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">ADD-ON NAME</th>
                <th className="py-3 px-4">CATEGORY</th>
                <th className="py-3 px-4 text-center">EDUCATION</th>
                <th className="py-3 px-4 text-center">IT SUITE</th>
                <th className="py-3 px-4 text-center">CRM</th>
                <th className="py-3 px-4 text-center">RETAIL</th>
                <th className="py-3 px-4 text-center">REAL ESTATE</th>
                <th className="py-3 px-4 text-center">HRMS</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredRows.map((row) => {
                const isSelected = selectedRowIds.includes(row.id);
                const isMenuOpen = activeMenuRowId === row.id;

                return (
                  <tr
                    key={row.id}
                    className={`transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40 ${
                      isSelected ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleRow(row.id)}
                        className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      <button
                        type="button"
                        onClick={() => handleOpenOverview(row)}
                        className="hover:underline hover:text-[#1574fe] font-semibold"
                      >
                        {row.addonName}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                      {row.category}
                    </td>
                    <td
                      className="py-3.5 px-4 text-center cursor-pointer select-none hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors"
                      onClick={() => handleToggleCell(row.id, 'education')}
                      title="Click to toggle status"
                    >
                      {renderCellStatus(row.matrix.education)}
                    </td>
                    <td
                      className="py-3.5 px-4 text-center cursor-pointer select-none hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors"
                      onClick={() => handleToggleCell(row.id, 'it')}
                      title="Click to toggle status"
                    >
                      {renderCellStatus(row.matrix.it)}
                    </td>
                    <td
                      className="py-3.5 px-4 text-center cursor-pointer select-none hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors"
                      onClick={() => handleToggleCell(row.id, 'crm')}
                      title="Click to toggle status"
                    >
                      {renderCellStatus(row.matrix.crm)}
                    </td>
                    <td
                      className="py-3.5 px-4 text-center cursor-pointer select-none hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors"
                      onClick={() => handleToggleCell(row.id, 'retail')}
                      title="Click to toggle status"
                    >
                      {renderCellStatus(row.matrix.retail)}
                    </td>
                    <td
                      className="py-3.5 px-4 text-center cursor-pointer select-none hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors"
                      onClick={() => handleToggleCell(row.id, 'realEstate')}
                      title="Click to toggle status"
                    >
                      {renderCellStatus(row.matrix.realEstate)}
                    </td>
                    <td
                      className="py-3.5 px-4 text-center cursor-pointer select-none hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors"
                      onClick={() => handleToggleCell(row.id, 'people')}
                      title="Click to toggle status"
                    >
                      {renderCellStatus(row.matrix.people)}
                    </td>
                    <td className="py-3.5 px-4 text-right relative">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(row)}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-[#1574fe] transition-colors"
                          title="Quick Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>

                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveMenuRowId(isMenuOpen ? null : row.id)
                            }
                            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                            title="Actions"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>

                          {/* 3-Dots Action Popover */}
                          {isMenuOpen && (
                            <div className="absolute right-0 top-8 z-30 w-36 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1 text-xs">
                              <button
                                type="button"
                                onClick={() => handleOpenOverview(row)}
                                className="w-full px-3 py-2 text-left flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-[#1574fe] transition-colors"
                              >
                                <Eye className="h-3.5 w-3.5 text-slate-400" />
                                Overview
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(row)}
                                className="w-full px-3 py-2 text-left flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-[#1574fe] transition-colors"
                              >
                                <Pencil className="h-3.5 w-3.5 text-slate-400" />
                                Edit
                              </button>
                              <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                              <button
                                type="button"
                                onClick={() => handleDeletePrompt(row)}
                                className="w-full px-3 py-2 text-left flex items-center gap-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5 text-rose-500" />
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
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Compatibility Rule"
        description={`Are you sure you want to delete the compatibility rule for "${itemToDelete?.addonName}"?`}
      />
    </div>
  );
}
