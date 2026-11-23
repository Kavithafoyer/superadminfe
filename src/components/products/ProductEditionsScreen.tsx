'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Plus,
  Upload,
  HelpCircle,
  X,
  Check,
  Trash2,
  Edit2,
  Copy,
  ChevronDown,
  Layers,
  GraduationCap,
  Users,
  BookOpen,
  CreditCard,
  Calendar,
  Award,
  Globe,
  PieChart,
  Building2,
  ArrowLeft,
  Sparkles,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  IsometricBoxIcon,
  IsometricLayersIcon,
  ProductBadgeIcon,
} from './ProductIcons';
import {
  InitialProductConfig,
  EditionRecord,
  INITIAL_PRODUCTS,
} from './productData';

const LOCAL_STORAGE_KEY = 'PEGATTO_PRODUCT_MASTER_RECORDS_V4';

// Feature capabilities matching screenshot
interface CapabilityRow {
  id: string;
  name: string;
  icon: React.ElementType;
}

const CAPABILITY_LIST: CapabilityRow[] = [
  { id: 'cap-lead', name: 'Lead & Admission Management', icon: Users },
  { id: 'cap-student', name: 'Student & Academic Management', icon: BookOpen },
  { id: 'cap-fees', name: 'Fees & Payments', icon: CreditCard },
  { id: 'cap-att', name: 'Attendance & Timetable', icon: Calendar },
  { id: 'cap-assess', name: 'Assessment & Progress Card', icon: Award },
  { id: 'cap-portal', name: 'Parent & Student Portals', icon: Globe },
  { id: 'cap-analytics', name: 'Analytics & Reports', icon: PieChart },
  { id: 'cap-campus', name: 'Multi-Campus / Group Management', icon: Building2 },
];

export function ProductEditionsScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedProductId = searchParams.get('product') || 'prd-edu';

  // Products master data
  const [products, setProducts] = useState<InitialProductConfig[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (err) {
        console.warn('Could not read cached products:', err);
      }
    }
    return INITIAL_PRODUCTS;
  });

  // Selected Product (default to Pegatto Education)
  const [selectedProductId, setSelectedProductId] = useState<string>(requestedProductId);

  const selectedProduct = useMemo(() => {
    return (
      products.find((p) => p.id === selectedProductId) ||
      products[0] ||
      INITIAL_PRODUCTS[0]
    );
  }, [products, selectedProductId]);

  // Editions of the selected product
  const editions: EditionRecord[] = useMemo(() => {
    return selectedProduct.editions_details || [];
  }, [selectedProduct]);

  // Selected Edition for editing
  const [selectedEditionId, setSelectedEditionId] = useState<string>(() => {
    return editions[1]?.id || editions[0]?.id || 'ed-edu-std';
  });

  // Right Panel visibility and mode ('edit' | 'add')
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(true);
  const [panelMode, setPanelMode] = useState<'edit' | 'add'>('edit');

  // Form State
  const [formEditionName, setFormEditionName] = useState<string>('Standard');
  const [formEditionCode, setFormEditionCode] = useState<string>('EDU-STD');
  const [formDescription, setFormDescription] = useState<string>(
    'Complete school management with admissions, academics, fees, communication and analytics.'
  );
  const [formStatus, setFormStatus] = useState<'Active' | 'Inactive' | 'Draft'>('Active');

  // Modals
  const [showImportExportModal, setShowImportExportModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [deleteTargetEdition, setDeleteTargetEdition] = useState<EditionRecord | null>(null);

  // Sync form when selectedEdition changes or editions change
  useEffect(() => {
    if (panelMode === 'edit') {
      const current = editions.find((e) => e.id === selectedEditionId) || editions[0];
      if (current) {
        setSelectedEditionId(current.id);
        setFormEditionName(current.name);
        setFormEditionCode(current.code);
        setFormDescription(current.description);
        setFormStatus(current.status);
      }
    }
  }, [selectedEditionId, editions, panelMode]);

  // Persist helper
  const persistProducts = (updatedProducts: InitialProductConfig[]) => {
    setProducts(updatedProducts);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProducts));
      } catch (err) {
        console.warn('Failed to persist products:', err);
      }
    }
  };

  // Switch or select edition
  const handleSelectEdition = (ed: EditionRecord) => {
    setPanelMode('edit');
    setSelectedEditionId(ed.id);
    setFormEditionName(ed.name);
    setFormEditionCode(ed.code);
    setFormDescription(ed.description);
    setFormStatus(ed.status);
    setIsPanelOpen(true);
  };

  // Start adding new edition
  const handleStartAddEdition = () => {
    setPanelMode('add');
    const newCode = `EDU-ED${editions.length + 1}`;
    setFormEditionName('');
    setFormEditionCode(newCode);
    setFormDescription('');
    setFormStatus('Active');
    setIsPanelOpen(true);
  };

  // Toggle capability for an edition
  const handleToggleCapability = (editionId: string, capabilityName: string) => {
    const updatedProducts = products.map((prod) => {
      if (prod.id !== selectedProduct.id) return prod;
      const updatedEditions = (prod.editions_details || []).map((ed) => {
        if (ed.id !== editionId) return ed;
        const currentCap = !!ed.capabilities[capabilityName];
        return {
          ...ed,
          capabilities: {
            ...ed.capabilities,
            [capabilityName]: !currentCap,
          },
        };
      });
      return {
        ...prod,
        editions_details: updatedEditions,
      };
    });

    persistProducts(updatedProducts);
    toast.success(`Updated capability for ${capabilityName}`);
  };

  // Save / Update edition
  const handleSaveEdition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEditionName.trim()) {
      toast.error('Edition name is required.');
      return;
    }

    if (!formEditionCode.trim()) {
      toast.error('Edition code is required.');
      return;
    }

    if (panelMode === 'add') {
      const newId = `ed-${Date.now()}`;
      const newEdition: EditionRecord = {
        id: newId,
        name: formEditionName.trim(),
        code: formEditionCode.trim().toUpperCase(),
        description: formDescription.trim(),
        status: formStatus,
        displayOrder: editions.length + 1,
        capabilities: {
          'Lead & Admission Management': true,
          'Student & Academic Management': true,
          'Fees & Payments': true,
          'Attendance & Timetable': true,
          'Assessment & Progress Card': false,
          'Parent & Student Portals': false,
          'Analytics & Reports': true,
          'Multi-Campus / Group Management': false,
        },
      };

      const updatedProducts = products.map((prod) => {
        if (prod.id !== selectedProduct.id) return prod;
        const nextEditions = [...(prod.editions_details || []), newEdition];
        return {
          ...prod,
          editions_count: nextEditions.length,
          editions: nextEditions.map((e) => e.name),
          editions_details: nextEditions,
        };
      });

      persistProducts(updatedProducts);
      setSelectedEditionId(newId);
      setPanelMode('edit');
      toast.success(`Edition "${newEdition.name}" created successfully!`);
    } else {
      // Edit mode
      const updatedProducts = products.map((prod) => {
        if (prod.id !== selectedProduct.id) return prod;
        const nextEditions = (prod.editions_details || []).map((ed) => {
          if (ed.id !== selectedEditionId) return ed;
          return {
            ...ed,
            name: formEditionName.trim(),
            code: formEditionCode.trim().toUpperCase(),
            description: formDescription.trim(),
            status: formStatus,
          };
        });
        return {
          ...prod,
          editions: nextEditions.map((e) => e.name),
          editions_details: nextEditions,
        };
      });

      persistProducts(updatedProducts);
      toast.success(`Edition "${formEditionName}" updated successfully!`);
    }
  };

  // Duplicate edition
  const handleDuplicateEdition = (ed: EditionRecord) => {
    const copyId = `ed-${Date.now()}`;
    const copyEdition: EditionRecord = {
      ...ed,
      id: copyId,
      name: `${ed.name} (Copy)`,
      code: `${ed.code}-COPY`,
      displayOrder: editions.length + 1,
    };

    const updatedProducts = products.map((prod) => {
      if (prod.id !== selectedProduct.id) return prod;
      const nextEditions = [...(prod.editions_details || []), copyEdition];
      return {
        ...prod,
        editions_count: nextEditions.length,
        editions: nextEditions.map((e) => e.name),
        editions_details: nextEditions,
      };
    });

    persistProducts(updatedProducts);
    setSelectedEditionId(copyId);
    setPanelMode('edit');
    toast.success(`Edition "${ed.name}" duplicated successfully!`);
  };

  // Delete edition
  const handleConfirmDelete = () => {
    if (!deleteTargetEdition) return;

    if (editions.length <= 1) {
      toast.error('Cannot delete the last remaining edition.');
      setDeleteTargetEdition(null);
      return;
    }

    const updatedProducts = products.map((prod) => {
      if (prod.id !== selectedProduct.id) return prod;
      const nextEditions = (prod.editions_details || []).filter(
        (e) => e.id !== deleteTargetEdition.id
      );
      return {
        ...prod,
        editions_count: nextEditions.length,
        editions: nextEditions.map((e) => e.name),
        editions_details: nextEditions,
      };
    });

    persistProducts(updatedProducts);
    if (selectedEditionId === deleteTargetEdition.id) {
      const remaining = editions.filter((e) => e.id !== deleteTargetEdition.id);
      if (remaining[0]) setSelectedEditionId(remaining[0].id);
    }
    toast.success(`Edition "${deleteTargetEdition.name}" removed.`);
    setDeleteTargetEdition(null);
  };

  // Helper for edition icon color
  const getEditionColor = (index: number, name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('core') || lower.includes('free') || index === 0) {
      return {
        iconColor: '#0ea5e9', // Sky blue / cyan
        bgColor: 'bg-sky-50 text-sky-600',
      };
    }
    if (lower.includes('standard') || index === 1) {
      return {
        iconColor: '#6222cc', // Brand purple
        bgColor: 'bg-purple-50 text-[#6222cc]',
      };
    }
    return {
      iconColor: '#312e81', // Deep indigo / navy
      bgColor: 'bg-indigo-50 text-indigo-700',
    };
  };

  return (
    <div className="w-full space-y-4 pb-14 font-sans text-slate-800 antialiased">
      {/* 1. TOP HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/90 pb-4">
        <div className="flex items-center gap-3">
          <IsometricBoxIcon className="h-8 w-8 text-[#6222cc] shrink-0" />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Product Master</h1>
            <p className="text-xs text-slate-500 font-medium">
              Create and manage all Pegatto products, editions, versions and lifecycle
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            type="button"
            onClick={() => router.push('/products/master?mode=add')}
            className="h-8.5 px-3.5 bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setShowImportExportModal(true)}
            className="h-8.5 px-3 border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="h-3.5 w-3.5 text-slate-600" />
            <span>Import / Export</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setShowHelpModal(true)}
            className="h-8.5 px-3 border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="h-3.5 w-3.5 text-slate-600" />
            <span>Help</span>
          </Button>
        </div>
      </div>

      {/* 2. BACK TO PRODUCT LIST */}
      <div>
        <button
          type="button"
          onClick={() => router.push('/products/master')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-[#6222cc] transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Product List</span>
        </button>
      </div>

      {/* 3. PRODUCT BANNER */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-[#6222cc] shrink-0">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold text-slate-900">{selectedProduct.product_name}</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#dcfce7] text-[#15803d]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#15803d]" />
                {selectedProduct.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
              {selectedProduct.short_description ||
                'Education management platform for admissions, academics, fees, communication and analytics.'}
            </p>
          </div>
        </div>

        {/* Product Switcher if multiple products exist */}
        {products.length > 1 && (
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-[11px] font-semibold text-slate-500">Switch Product:</span>
            <div className="relative">
              <select
                value={selectedProductId}
                onChange={(e) => {
                  setSelectedProductId(e.target.value);
                  router.push(`/products/editions?product=${e.target.value}`);
                }}
                className="h-8 appearance-none bg-slate-50 border border-slate-200 rounded-lg pl-2.5 pr-7 text-xs font-medium text-slate-800 outline-none focus:ring-1 focus:ring-[#6222cc] cursor-pointer"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.product_name}
                  </option>
                ))}
              </select>
              <ChevronDown className="h-3 w-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      {/* 4. FOUR MAIN PRODUCT TABS */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-2 text-xs">
        <button
          type="button"
          onClick={() => router.push('/products/master')}
          className="px-4 py-2 rounded-lg font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer whitespace-nowrap"
        >
          Product Details
        </button>
        <button
          type="button"
          className="px-4 py-2 rounded-lg font-semibold text-white bg-[#6222cc] shadow-xs transition-all cursor-pointer whitespace-nowrap"
        >
          Editions ({editions.length})
        </button>
        <button
          type="button"
          onClick={() => router.push('/products/features-modules')}
          className="px-4 py-2 rounded-lg font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer whitespace-nowrap"
        >
          Features &amp; Modules
        </button>
        <button
          type="button"
          onClick={() => router.push('/products/plans-pricing')}
          className="px-4 py-2 rounded-lg font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer whitespace-nowrap"
        >
          Plans &amp; Pricing
        </button>
      </div>

      {/* 5. MAIN TWO-COLUMN SPLIT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ==============================================================
            LEFT COLUMN: EDITION MASTER TABLE (~58% width or full if closed)
           ============================================================== */}
        <div className={cn(isPanelOpen ? 'lg:col-span-7' : 'lg:col-span-12', 'space-y-3.5')}>
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <IsometricLayersIcon className="h-5 w-5 text-[#6222cc]" color="#6222cc" />
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Edition Master</h3>
            </div>

            <Button
              type="button"
              onClick={handleStartAddEdition}
              className="h-8.5 px-3.5 bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Edition</span>
            </Button>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-700 border-b border-slate-200 font-semibold text-[11px]">
                    <th className="py-3 px-3 text-center w-8">#</th>
                    <th className="py-3 px-3 font-semibold text-slate-800">Edition Name</th>
                    <th className="py-3 px-3 font-semibold text-slate-800">Edition Code</th>
                    <th className="py-3 px-3 font-semibold text-slate-800">Description</th>
                    <th className="py-3 px-3 text-center font-semibold text-slate-800">Status</th>
                    <th className="py-3 px-3 text-center font-semibold text-slate-800">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {editions.map((ed, index) => {
                    const isSelected = selectedEditionId === ed.id && isPanelOpen;
                    const { iconColor } = getEditionColor(index, ed.name);

                    return (
                      <tr
                        key={ed.id}
                        onClick={() => handleSelectEdition(ed)}
                        className={cn(
                          'cursor-pointer transition-colors',
                          isSelected
                            ? 'bg-[#f8f5ff] border-l-2 border-l-[#6222cc]'
                            : 'hover:bg-slate-50/70'
                        )}
                      >
                        <td className="py-3 px-3 text-center text-slate-500 font-semibold text-xs">
                          {index + 1}
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <IsometricLayersIcon className="h-4 w-4 shrink-0" color={iconColor} />
                            <span className="font-semibold text-slate-900">{ed.name}</span>
                          </div>
                        </td>

                        <td className="py-3 px-3 font-mono text-slate-700 text-xs font-semibold whitespace-nowrap">
                          {ed.code}
                        </td>

                        <td className="py-3 px-3 text-slate-600 text-xs max-w-xs truncate">
                          {ed.description}
                        </td>

                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span
                            className={cn(
                              'px-2.5 py-0.5 rounded-full text-[10px] font-semibold',
                              ed.status === 'Active'
                                ? 'bg-[#dcfce7] text-[#15803d]'
                                : 'bg-slate-100 text-slate-600'
                            )}
                          >
                            {ed.status}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() => handleSelectEdition(ed)}
                              className="p-1 rounded hover:bg-purple-50 text-[#6222cc] transition-colors cursor-pointer"
                              title="Edit Edition"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>

                            {/* Duplicate */}
                            <button
                              type="button"
                              onClick={() => handleDuplicateEdition(ed)}
                              className="p-1 rounded hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
                              title="Duplicate Edition"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => setDeleteTargetEdition(ed)}
                              className="p-1 rounded hover:bg-red-50 text-red-500 transition-colors cursor-pointer"
                              title="Delete Edition"
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

            {/* Table Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-white border-t border-slate-100 text-xs text-slate-500">
              <div>
                Showing 1 &ndash; {editions.length} of {editions.length} editions
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled
                    className="p-1 rounded hover:bg-slate-100 text-slate-400 disabled:opacity-50"
                  >
                    &lt;
                  </button>
                  <button
                    type="button"
                    className="h-6 w-6 rounded bg-[#6222cc] text-white font-semibold text-xs flex items-center justify-center shadow-xs"
                  >
                    1
                  </button>
                  <button
                    type="button"
                    disabled
                    className="p-1 rounded hover:bg-slate-100 text-slate-400 disabled:opacity-50"
                  >
                    &gt;
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <span>Items per page</span>
                  <select
                    defaultValue="10"
                    className="border border-slate-200 rounded px-1.5 py-0.5 bg-white text-slate-700 font-medium"
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==============================================================
            RIGHT COLUMN: EDITION DETAILS & CAPABILITIES PANEL (~42% width)
           ============================================================== */}
        {isPanelOpen && (
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            {/* Header: Product Icon + Name + Badge + Close Button */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-[#6222cc] shrink-0">
                  <GraduationCap className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{selectedProduct.product_name}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#dcfce7] text-[#15803d]">
                  {selectedProduct.status}
                </span>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsPanelOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                title="Close side panel"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Pill Tabs inside panel */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => router.push('/products/master')}
                className="px-3.5 py-1.5 rounded-lg font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all cursor-pointer whitespace-nowrap"
              >
                Product Details
              </button>
              <button
                type="button"
                className="px-3.5 py-1.5 rounded-lg font-semibold bg-[#6222cc] text-white shadow-xs transition-all cursor-pointer whitespace-nowrap"
              >
                Editions ({editions.length})
              </button>
              <button
                type="button"
                onClick={() => router.push('/products/features-modules')}
                className="px-3.5 py-1.5 rounded-lg font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all cursor-pointer whitespace-nowrap"
              >
                Features &amp; Modules
              </button>
              <button
                type="button"
                onClick={() => router.push('/products/plans-pricing')}
                className="px-3.5 py-1.5 rounded-lg font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all cursor-pointer whitespace-nowrap"
              >
                Plans &amp; Pricing
              </button>
            </div>

            {/* Edition Details Form */}
            <form onSubmit={handleSaveEdition} className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">
                  {panelMode === 'add'
                    ? 'New Edition Details'
                    : `Edition Details \u2013 ${formEditionName || 'Standard'}`}
                </h4>
              </div>

              {/* Row 1: Edition Name & Edition Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">
                    Edition Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formEditionName}
                    onChange={(e) => setFormEditionName(e.target.value)}
                    placeholder="e.g. Standard"
                    className="h-8.5 text-xs bg-white border-slate-200 rounded-lg font-medium"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">
                    Edition Code <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formEditionCode}
                    onChange={(e) => setFormEditionCode(e.target.value.toUpperCase())}
                    placeholder="e.g. EDU-STD"
                    className="h-8.5 font-mono text-xs bg-white border-slate-200 rounded-lg uppercase font-semibold"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Description & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-slate-700">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    rows={2}
                    placeholder="Provide a clear description of this edition's tier..."
                    className="text-xs bg-white border-slate-200 rounded-lg resize-none leading-relaxed"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Status</label>
                  <div className="relative">
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      className="h-8.5 w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-7 text-xs font-medium text-slate-800 outline-none focus:ring-1 focus:ring-[#6222cc] cursor-pointer"
                    >
                      <option value="Active">&#9679; Active</option>
                      <option value="Inactive">&#9679; Inactive</option>
                      <option value="Draft">&#9679; Draft</option>
                    </select>
                    <ChevronDown className="h-3 w-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Row 3: Key Capabilities Matrix Table */}
              <div className="pt-2 space-y-2">
                <h5 className="font-bold text-slate-900 text-xs">
                  Key Capabilities (Features Included)
                </h5>

                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/90 text-slate-700 border-b border-slate-200 font-semibold text-[11px]">
                        <th className="py-2.5 px-3">Feature / Module</th>
                        {editions.map((ed) => (
                          <th key={ed.id} className="py-2.5 px-2 text-center whitespace-nowrap">
                            {ed.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[11px]">
                      {CAPABILITY_LIST.map((cap) => {
                        const Icon = cap.icon;
                        return (
                          <tr key={cap.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-2 px-3 font-medium text-slate-800">
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-md bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                                  <Icon className="h-3 w-3" />
                                </div>
                                <span className="font-semibold text-slate-800 text-[11px]">
                                  {cap.name}
                                </span>
                              </div>
                            </td>

                            {editions.map((ed) => {
                              const isIncluded = !!ed.capabilities[cap.name];
                              return (
                                <td
                                  key={ed.id}
                                  className="py-2 px-2 text-center cursor-pointer select-none"
                                  onClick={() => handleToggleCapability(ed.id, cap.name)}
                                  title={`Click to toggle ${cap.name} for ${ed.name}`}
                                >
                                  {isIncluded ? (
                                    <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white mx-auto shadow-2xs hover:scale-110 transition-transform">
                                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                                    </div>
                                  ) : (
                                    <span className="text-slate-400 font-bold hover:text-slate-600 transition-colors">
                                      &mdash;
                                    </span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <Button
                  type="submit"
                  className="h-8.5 px-4 bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>{panelMode === 'add' ? 'Create Edition' : 'Update Edition'}</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (panelMode === 'add') {
                      setPanelMode('edit');
                    } else {
                      const current = editions.find((e) => e.id === selectedEditionId);
                      if (current) {
                        setFormEditionName(current.name);
                        setFormEditionCode(current.code);
                        setFormDescription(current.description);
                        setFormStatus(current.status);
                      }
                    }
                  }}
                  className="h-8.5 px-4 bg-purple-50/50 hover:bg-purple-100/50 text-[#6222cc] border-purple-200 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* 6. IMPORT / EXPORT MODAL */}
      <Dialog open={showImportExportModal} onOpenChange={setShowImportExportModal}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Upload className="h-5 w-5 text-[#6222cc]" />
              Import / Export Editions
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Download current product editions and capability matrix or import JSON configurations.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const dataStr =
                  'data:text/json;charset=utf-8,' +
                  encodeURIComponent(JSON.stringify(editions, null, 2));
                const downloadAnchor = document.createElement('a');
                downloadAnchor.setAttribute('href', dataStr);
                downloadAnchor.setAttribute('download', `${selectedProduct.product_code}_editions.json`);
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                downloadAnchor.remove();
                toast.success('Editions exported successfully!');
                setShowImportExportModal(false);
              }}
              className="w-full h-9 border-slate-200 text-slate-800 hover:bg-slate-50 text-xs font-semibold rounded-lg flex items-center justify-center gap-2"
            >
              Export JSON Specification
            </Button>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowImportExportModal(false)}
              className="h-8.5 text-xs"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 7. HELP MODAL */}
      <Dialog open={showHelpModal} onOpenChange={setShowHelpModal}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-[#6222cc]" />
              Edition Master Guide
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Learn how product editions and capability entitlements function in Pegatto Super Admin.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2.5 py-2 text-xs text-slate-600 leading-relaxed">
            <p>
              &bull; <strong>Editions</strong> define feature packages (e.g. Core, Standard, Enterprise)
              packaged for customer segments.
            </p>
            <p>
              &bull; <strong>Key Capabilities</strong> define whether a module or capability is unlocked
              for that edition. You can toggle each cell directly in the matrix table.
            </p>
            <p>
              &bull; <strong>Plans &amp; Pricing</strong> build upon editions to establish billing periods,
              user seat limits, and recurring subscription prices.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="h-8.5 bg-[#6222cc] hover:bg-[#521cb0] text-white text-xs font-semibold rounded-lg"
            >
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 8. DELETE CONFIRMATION DIALOG */}
      <Dialog open={!!deleteTargetEdition} onOpenChange={() => setDeleteTargetEdition(null)}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Delete Edition
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Are you sure you want to delete edition &ldquo;{deleteTargetEdition?.name}&rdquo;?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTargetEdition(null)}
              className="h-8.5 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmDelete}
              className="h-8.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg"
            >
              Delete Edition
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
