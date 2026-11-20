'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Plus,
  ArrowUpDown,
  Upload,
  Download,
  HelpCircle,
  X,
  Check,
  CheckCircle2,
  Trash2,
  Edit2,
  Copy,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Layers,
  ArrowLeft,
  FileText,
  Sparkles,
  Package,
  RotateCcw,
  CheckSquare,
  Square,
  ChevronDown,
  Sprout,
  Award,
  Building2,
  Tag,
  GraduationCap,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
  ProductBadgeIcon,
  CapabilityIcon,
} from './ProductIcons';
import {
  InitialProductConfig,
  EditionRecord,
  EDUCATION_CAPABILITIES,
  INITIAL_PRODUCTS,
} from './productData';
import { FreePaidPlansScreen } from './FreePaidPlansScreen';

const LOCAL_STORAGE_KEY = 'PEGATTO_PRODUCT_MASTER_RECORDS_V3';

interface ProductMasterScreenProps {
  initialTab?: 'details' | 'editions' | 'features' | 'plans';
}

export function ProductMasterScreen({ initialTab }: ProductMasterScreenProps) {
  const router = useRouter();
  // Master products state
  const [products, setProducts] = useState<InitialProductConfig[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (err) {
        console.warn('Could not read cached products, using initial:', err);
      }
    }
    return INITIAL_PRODUCTS;
  });

  // Selected product
  const [selectedProductId, setSelectedProductId] = useState<string>(() => {
    return products[0]?.id || 'prd-edu';
  });

  const selectedProduct = useMemo(() => {
    return products.find((p) => p.id === selectedProductId) || products[0];
  }, [products, selectedProductId]);

  // View state: 'list' (Image 1) or 'editions' (Image 2) or 'plans' (Image 3)
  const [viewState, setViewState] = useState<'list' | 'editions' | 'plans'>(
    initialTab === 'editions' ? 'editions' : initialTab === 'plans' ? 'plans' : 'list'
  );

  const [pricingCurrency, setPricingCurrency] = useState('INR (₹)');
  const [pricingBillingCycle, setPricingBillingCycle] = useState('Monthly');

  // Active tab in details panel / edition header
  const [activeTab, setActiveTab] = useState<'details' | 'editions' | 'features' | 'plans'>(
    initialTab || 'details'
  );

  // Is right side drawer open?
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);

  // Drawer mode: 'edit_product' | 'add_product' | 'edit_edition' | 'add_edition'
  const [drawerMode, setDrawerMode] = useState<
    'edit_product' | 'add_product' | 'edit_edition' | 'add_edition'
  >('edit_product');

  // Selected edition id for Image 2
  const [selectedEditionId, setSelectedEditionId] = useState<string>('ed-edu-std');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Product Form state for right side
  const [productForm, setProductForm] = useState<Partial<InitialProductConfig>>({});

  // Edition Form state for right side
  const [editionForm, setEditionForm] = useState<Partial<EditionRecord>>({});

  // Capabilities state
  const [capabilities, setCapabilities] = useState(EDUCATION_CAPABILITIES);

  // Modal dialog states
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'product' | 'edition';
    id: string;
    name: string;
    code: string;
  } | null>(null);

  // Sync form when selected product changes
  useEffect(() => {
    if (selectedProduct) {
      setProductForm({ ...selectedProduct });
      if (selectedProduct.editions_details && selectedProduct.editions_details.length > 0) {
        const found =
          selectedProduct.editions_details.find((e) => e.id === selectedEditionId) ||
          selectedProduct.editions_details[0];
        setSelectedEditionId(found.id);
        setEditionForm({ ...found });
      }
    }
  }, [selectedProduct]);

  // Sync edition form when selected edition changes
  useEffect(() => {
    if (selectedProduct?.editions_details) {
      const ed = selectedProduct.editions_details.find((e) => e.id === selectedEditionId);
      if (ed) {
        setEditionForm({ ...ed });
      }
    }
  }, [selectedEditionId, selectedProduct]);

  // Persist products to localStorage
  const persistProducts = useCallback((newProducts: InitialProductConfig[]) => {
    setProducts(newProducts);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newProducts));
      } catch (err) {
        console.error('Failed to persist products:', err);
      }
    }
  }, []);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        p.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.product_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'All' || p.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesCategory =
        categoryFilter === 'All' || p.category.toLowerCase() === categoryFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [products, searchQuery, statusFilter, categoryFilter]);

  // Categories list for filter dropdown
  const uniqueCategories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.category));
    return ['All', ...Array.from(set)];
  }, [products]);

  // Handle resetting filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setCategoryFilter('All');
    toast.info('Filters have been reset');
  };

  // Handle clicking a product row
  const handleSelectProduct = (product: InitialProductConfig) => {
    setSelectedProductId(product.id);
    setDrawerMode('edit_product');
    setIsDrawerOpen(true);
  };

  // Handle switching to Editions view (Image 2)
  const handleOpenEditionsView = (product?: InitialProductConfig) => {
    if (product) {
      setSelectedProductId(product.id);
    }
    setViewState('editions');
    setActiveTab('editions');
    setDrawerMode('edit_edition');
    setIsDrawerOpen(true);
    if (product?.editions_details && product.editions_details.length > 0) {
      setSelectedEditionId(product.editions_details[0].id);
    }
  };

  // Handle going back to Products List (Image 1)
  const handleBackToProductList = () => {
    setViewState('list');
    setActiveTab('details');
    setDrawerMode('edit_product');
  };

  // Handle Update Product
  const handleSaveProduct = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!productForm.product_name || !productForm.product_code) {
      toast.error('Please enter product name and code');
      return;
    }

    if (drawerMode === 'add_product') {
      const newProduct: InitialProductConfig = {
        id: `prd-${Date.now().toString(36)}`,
        product_name: productForm.product_name || 'New Product',
        product_code: productForm.product_code || `PEG-${Date.now().toString().slice(-4)}`,
        category: productForm.category || 'Education',
        status: productForm.status || 'Active',
        short_description: productForm.short_description || '',
        description: productForm.description || '',
        current_version: productForm.current_version || 'v1.0.0',
        release_date: productForm.release_date || '19 Nov 2026',
        lifecycle_stage: productForm.lifecycle_stage || 'General Availability',
        logo_file: productForm.logo_file || 'product-logo.svg',
        logo_dimensions: productForm.logo_dimensions || '(120 x 120)',
        icon_file: productForm.icon_file || 'product-icon.svg',
        icon_dimensions: productForm.icon_dimensions || '(32 x 32)',
        icon_type: 'education',
        editions_count: 1,
        editions: ['Standard'],
        editions_details: [
          {
            id: `ed-${Date.now()}-std`,
            name: 'Standard',
            code: `${productForm.product_code}-STD`,
            description: 'Standard operational suite',
            status: 'Active',
            displayOrder: 1,
            capabilities: {
              'Lead & Admission Management': true,
              'Fees & Payments': true,
              'Analytics & Reports': true,
            },
          },
        ],
      };

      const updated = [newProduct, ...products];
      persistProducts(updated);
      setSelectedProductId(newProduct.id);
      setDrawerMode('edit_product');
      toast.success(`Product "${newProduct.product_name}" created successfully!`);
    } else {
      const updated = products.map((p) => {
        if (p.id === selectedProductId) {
          return {
            ...p,
            ...productForm,
          } as InitialProductConfig;
        }
        return p;
      });
      persistProducts(updated);
      toast.success(`Product "${productForm.product_name}" updated successfully!`);
    }
  };

  // Handle Update Edition
  const handleSaveEdition = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editionForm.name || !editionForm.code) {
      toast.error('Please enter edition name and code');
      return;
    }

    if (drawerMode === 'add_edition') {
      const newEdition: EditionRecord = {
        id: `ed-${Date.now().toString(36)}`,
        name: editionForm.name || 'New Edition',
        code: editionForm.code || `${selectedProduct.product_code}-NEW`,
        description: editionForm.description || '',
        status: editionForm.status || 'Active',
        displayOrder: (selectedProduct.editions_details?.length || 0) + 1,
        capabilities: editionForm.capabilities || {},
      };

      const updatedDetails = [...(selectedProduct.editions_details || []), newEdition];
      const updatedProducts = products.map((p) => {
        if (p.id === selectedProductId) {
          return {
            ...p,
            editions_count: updatedDetails.length,
            editions: updatedDetails.map((e) => e.name),
            editions_details: updatedDetails,
          };
        }
        return p;
      });

      persistProducts(updatedProducts);
      setSelectedEditionId(newEdition.id);
      setDrawerMode('edit_edition');
      toast.success(`Edition "${newEdition.name}" created successfully!`);
    } else {
      const updatedDetails = (selectedProduct.editions_details || []).map((ed) => {
        if (ed.id === selectedEditionId) {
          return {
            ...ed,
            ...editionForm,
          } as EditionRecord;
        }
        return ed;
      });

      const updatedProducts = products.map((p) => {
        if (p.id === selectedProductId) {
          return {
            ...p,
            editions: updatedDetails.map((e) => e.name),
            editions_details: updatedDetails,
          };
        }
        return p;
      });

      persistProducts(updatedProducts);
      toast.success(`Edition "${editionForm.name}" updated successfully!`);
    }
  };

  // Toggle capability in comparison matrix
  const handleToggleCapability = (editionCode: string, capabilityName: string) => {
    if (!selectedProduct?.editions_details) return;

    const updatedDetails = selectedProduct.editions_details.map((ed) => {
      const isTarget =
        ed.code.toLowerCase().includes(editionCode.toLowerCase()) ||
        ed.name.toLowerCase().includes(editionCode.toLowerCase());

      if (isTarget) {
        const currentVal = Boolean(ed.capabilities[capabilityName]);
        return {
          ...ed,
          capabilities: {
            ...ed.capabilities,
            [capabilityName]: !currentVal,
          },
        };
      }
      return ed;
    });

    const updatedProducts = products.map((p) => {
      if (p.id === selectedProductId) {
        return {
          ...p,
          editions_details: updatedDetails,
        };
      }
      return p;
    });

    persistProducts(updatedProducts);

    // Update active editionForm if it matches
    const activeEd = updatedDetails.find((e) => e.id === selectedEditionId);
    if (activeEd) {
      setEditionForm({ ...activeEd });
    }

    toast.success(`Updated capability for ${editionCode}`);
  };

  // Duplicate Product
  const handleDuplicateProduct = (p: InitialProductConfig, e: React.MouseEvent) => {
    e.stopPropagation();
    const cloned: InitialProductConfig = {
      ...p,
      id: `prd-${Date.now().toString(36)}`,
      product_name: `${p.product_name} (Copy)`,
      product_code: `${p.product_code}-COPY`,
      status: 'Draft',
    };
    persistProducts([cloned, ...products]);
    toast.success(`Cloned "${p.product_name}"`);
  };

  // Duplicate Edition
  const handleDuplicateEdition = (ed: EditionRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedProduct) return;

    const cloned: EditionRecord = {
      ...ed,
      id: `ed-${Date.now().toString(36)}`,
      name: `${ed.name} (Copy)`,
      code: `${ed.code}-COPY`,
      status: 'Draft',
      displayOrder: (selectedProduct.editions_details?.length || 0) + 1,
    };

    const updatedDetails = [...(selectedProduct.editions_details || []), cloned];
    const updatedProducts = products.map((prod) => {
      if (prod.id === selectedProductId) {
        return {
          ...prod,
          editions_count: updatedDetails.length,
          editions: updatedDetails.map((e) => e.name),
          editions_details: updatedDetails,
        };
      }
      return prod;
    });

    persistProducts(updatedProducts);
    toast.success(`Cloned edition "${ed.name}"`);
  };

  // Delete Action Trigger
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'product') {
      const remaining = products.filter((p) => p.id !== deleteTarget.id);
      persistProducts(remaining);
      if (selectedProductId === deleteTarget.id && remaining.length > 0) {
        setSelectedProductId(remaining[0].id);
      }
      toast.success(`Product "${deleteTarget.name}" deleted.`);
    } else {
      if (selectedProduct) {
        const remainingDetails = (selectedProduct.editions_details || []).filter(
          (e) => e.id !== deleteTarget.id
        );
        const updatedProducts = products.map((p) => {
          if (p.id === selectedProductId) {
            return {
              ...p,
              editions_count: remainingDetails.length,
              editions: remainingDetails.map((e) => e.name),
              editions_details: remainingDetails,
            };
          }
          return p;
        });
        persistProducts(updatedProducts);
        if (selectedEditionId === deleteTarget.id && remainingDetails.length > 0) {
          setSelectedEditionId(remainingDetails[0].id);
        }
        toast.success(`Edition "${deleteTarget.name}" deleted.`);
      }
    }
    setDeleteTarget(null);
  };

  // Export Data to JSON
  const handleExportJson = () => {
    const dataStr = JSON.stringify(products, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pegatto_product_master_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Product catalog exported as JSON');
    setIsImportExportOpen(false);
  };

  // Export Data to CSV
  const handleExportCsv = () => {
    const headers = ['Product Name', 'Product Code', 'Category', 'Editions Count', 'Status', 'Current Version', 'Release Date'];
    const rows = products.map((p) => [
      `"${p.product_name}"`,
      `"${p.product_code}"`,
      `"${p.category}"`,
      p.editions_count,
      `"${p.status}"`,
      `"${p.current_version}"`,
      `"${p.release_date}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pegatto_product_master_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Product catalog exported as CSV');
    setIsImportExportOpen(false);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* 1. TOP HEADER - EXACT MATCH WITH SCREENSHOTS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl shadow-xs">
            <IsometricBoxIcon className="h-8 w-8 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Product Master
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Create and manage all Pegatto products, editions, versions and lifecycle
            </p>
          </div>
        </div>

        {/* Action Buttons Top Right */}
        <div className="flex items-center gap-2.5">
          <Button
            onClick={() => {
              setDrawerMode('add_product');
              setProductForm({
                product_name: '',
                product_code: '',
                category: 'Education',
                status: 'Active',
                short_description: '',
                description: '',
                current_version: 'v1.0.0',
                release_date: '19 Nov 2026',
                lifecycle_stage: 'General Availability',
                logo_file: 'new-logo.svg',
                logo_dimensions: '(120 x 120)',
                icon_file: 'new-icon.svg',
                icon_dimensions: '(32 x 32)',
              });
              setIsDrawerOpen(true);
            }}
            className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium text-sm px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => setIsImportExportOpen(true)}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-sm px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-xs"
          >
            <Upload className="h-4 w-4 text-slate-600" />
            <span>Import / Export</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => setIsHelpOpen(true)}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-sm px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-xs"
          >
            <HelpCircle className="h-4 w-4 text-slate-600" />
            <span>Help</span>
          </Button>
        </div>
      </div>

      {/* 2. MAIN SPLIT CONTENT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ==============================================================
            LEFT COLUMN (Takes 7 cols when drawer open, 12 when drawer closed)
           ============================================================== */}
        <div
          className={cn(
            'space-y-4 transition-all duration-300',
            isDrawerOpen && viewState !== 'plans' ? 'lg:col-span-7' : 'lg:col-span-12'
          )}
        >
          {/* ==========================================
              VIEW A: PRODUCT LIST VIEW (Screenshot 1)
             ========================================== */}
          {viewState === 'list' && (
            <div className="space-y-4">
              {/* Filter Row matching Screenshot 1 */}
              <div className="flex flex-wrap items-end gap-3.5 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
                {/* Search Input */}
                <div className="flex-1 min-w-[240px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by product name, code or category..."
                      className="pl-9 pr-3 py-1.5 text-xs sm:text-sm h-9 bg-white border-slate-200 rounded-lg placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-9 px-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg text-slate-700 outline-hidden focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="All">All</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                    Category
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="h-9 px-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg text-slate-700 outline-hidden focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    {uniqueCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Reset Link */}
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-indigo-600 hover:text-indigo-800 text-xs sm:text-sm font-semibold pb-2 px-1 transition-colors cursor-pointer self-end"
                >
                  Reset
                </button>
              </div>

              {/* Product Master Table */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/60 text-slate-600 font-semibold text-[11px] uppercase tracking-wider">
                        <th className="py-3 px-3 text-center w-10">#</th>
                        <th className="py-3 px-4">Product Name</th>
                        <th className="py-3 px-3">Product Code</th>
                        <th className="py-3 px-3">Category</th>
                        <th className="py-3 px-3 text-center">Editions</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProducts.map((p, index) => {
                        const isSelected = selectedProductId === p.id && isDrawerOpen;
                        return (
                          <tr
                            key={p.id}
                            onClick={() => handleSelectProduct(p)}
                            className={cn(
                              'cursor-pointer transition-colors',
                              isSelected
                                ? 'bg-indigo-50/60 font-medium'
                                : 'hover:bg-slate-50/70'
                            )}
                          >
                            <td className="py-3 px-3 text-center text-slate-500 text-xs font-semibold">
                              {index + 1}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <ProductBadgeIcon type={p.icon_type || p.category} size="md" />
                                <div>
                                  <span className="font-semibold text-slate-900 block">
                                    {p.product_name}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3 font-mono text-slate-700 text-xs font-medium">
                              {p.product_code}
                            </td>
                            <td className="py-3 px-3 text-slate-600 text-xs">
                              {p.category}
                            </td>
                            <td className="py-3 px-3 text-center">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenEditionsView(p);
                                }}
                                className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-md bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-700 transition-colors"
                                title="Click to view & manage editions"
                              >
                                {p.editions_count}
                              </button>
                            </td>
                            <td className="py-3 px-3">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                                {p.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  onClick={() => handleSelectProduct(p)}
                                  title="Edit Product"
                                  className="p-1 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => handleDuplicateProduct(p, e)}
                                  title="Duplicate Product"
                                  className="p-1 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
                                >
                                  <Copy className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setDeleteTarget({
                                      type: 'product',
                                      id: p.id,
                                      name: p.product_name,
                                      code: p.product_code,
                                    })
                                  }
                                  title="Delete Product"
                                  className="p-1 rounded-md text-red-500 hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredProducts.length === 0 && (
                        <tr>
                          <td colSpan={7} className="text-center py-10 text-slate-500 text-sm">
                            No products found matching your filter criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Pagination Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-slate-100 bg-white text-xs text-slate-600">
                  <div>
                    Showing 1 - {filteredProducts.length} of {filteredProducts.length} products
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled
                      className="p-1.5 rounded-md border border-slate-200 text-slate-400 cursor-not-allowed opacity-50"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      className="w-7 h-7 flex items-center justify-center rounded-md bg-[#4F46E5] text-white font-semibold shadow-xs"
                    >
                      1
                    </button>
                    <button
                      type="button"
                      disabled
                      className="p-1.5 rounded-md border border-slate-200 text-slate-400 cursor-not-allowed opacity-50"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>Items per page</span>
                    <select
                      defaultValue="10"
                      className="h-7 px-2 border border-slate-200 rounded-md bg-white text-slate-700 outline-hidden"
                    >
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              VIEW B: EDITIONS VIEW (Screenshot 2)
             ========================================== */}
          {viewState === 'editions' && (
            <div className="space-y-4">
              {/* Top Back Link */}
              <div>
                <button
                  type="button"
                  onClick={handleBackToProductList}
                  className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back to Product List</span>
                </button>
              </div>

              {/* Product Header in Edition view */}
              <div className="flex items-start justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="flex items-start gap-3">
                  <ProductBadgeIcon
                    type={selectedProduct.icon_type || selectedProduct.category}
                    size="lg"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-900">
                        {selectedProduct.product_name}
                      </h2>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                        {selectedProduct.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 max-w-xl">
                      {selectedProduct.short_description || selectedProduct.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs on Left Pane */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('details');
                    setDrawerMode('edit_product');
                  }}
                  className={cn(
                    'px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all',
                    activeTab === 'details'
                      ? 'bg-[#4F46E5] text-white shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                  )}
                >
                  Product Details
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('editions');
                    setDrawerMode('edit_edition');
                  }}
                  className={cn(
                    'px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all',
                    activeTab === 'editions'
                      ? 'bg-[#4F46E5] text-white shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                  )}
                >
                  Editions ({selectedProduct.editions_count || selectedProduct.editions_details?.length || 3})
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/products/features-modules')}
                  className={cn(
                    'px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all',
                    activeTab === 'features'
                      ? 'bg-[#4F46E5] text-white shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                  )}
                >
                  Features & Modules
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('plans');
                    setViewState('plans');
                  }}
                  className={cn(
                    'px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all',
                    activeTab === 'plans'
                      ? 'bg-[#4F46E5] text-white shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                  )}
                >
                  Plans & Pricing
                </button>
              </div>

              {/* Edition Master Section Header */}
              <div className="flex items-center justify-between gap-4 pt-1">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-indigo-600" />
                  <h3 className="text-base font-bold text-slate-900">Edition Master</h3>
                </div>

                <Button
                  onClick={() => {
                    setDrawerMode('add_edition');
                    setEditionForm({
                      name: '',
                      code: '',
                      description: '',
                      status: 'Active',
                      capabilities: {},
                    });
                    setIsDrawerOpen(true);
                  }}
                  className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium text-xs sm:text-sm px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Edition</span>
                </Button>
              </div>

              {/* Editions Table */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/60 text-slate-600 font-semibold text-[11px] uppercase tracking-wider">
                        <th className="py-3 px-3 text-center w-10">#</th>
                        <th className="py-3 px-4">Edition Name</th>
                        <th className="py-3 px-3">Edition Code</th>
                        <th className="py-3 px-4">Description</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(selectedProduct.editions_details || []).map((ed, index) => {
                        const isSelected = selectedEditionId === ed.id && isDrawerOpen;
                        return (
                          <tr
                            key={ed.id}
                            onClick={() => {
                              setSelectedEditionId(ed.id);
                              setDrawerMode('edit_edition');
                              setIsDrawerOpen(true);
                            }}
                            className={cn(
                              'cursor-pointer transition-colors',
                              isSelected
                                ? 'bg-indigo-50/60 font-medium'
                                : 'hover:bg-slate-50/70'
                            )}
                          >
                            <td className="py-3.5 px-3 text-center text-slate-500 text-xs font-semibold">
                              {index + 1}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2.5">
                                <div className="p-1 rounded-md bg-indigo-50 text-indigo-600">
                                  <Layers className="h-4 w-4" />
                                </div>
                                <span className="font-semibold text-slate-900">{ed.name}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-3 font-mono text-slate-700 text-xs font-medium">
                              {ed.code}
                            </td>
                            <td className="py-3.5 px-4 text-slate-600 text-xs max-w-xs truncate">
                              {ed.description}
                            </td>
                            <td className="py-3.5 px-3">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                                {ed.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedEditionId(ed.id);
                                    setDrawerMode('edit_edition');
                                    setIsDrawerOpen(true);
                                  }}
                                  title="Edit Edition"
                                  className="p-1 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => handleDuplicateEdition(ed, e)}
                                  title="Duplicate Edition"
                                  className="p-1 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
                                >
                                  <Copy className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setDeleteTarget({
                                      type: 'edition',
                                      id: ed.id,
                                      name: ed.name,
                                      code: ed.code,
                                    })
                                  }
                                  title="Delete Edition"
                                  className="p-1 rounded-md text-red-500 hover:bg-red-50 transition-colors"
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

                {/* Editions Pagination Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-slate-100 bg-white text-xs text-slate-600">
                  <div>
                    Showing 1 - {selectedProduct.editions_details?.length || 0} of{' '}
                    {selectedProduct.editions_details?.length || 0} editions
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled
                      className="p-1.5 rounded-md border border-slate-200 text-slate-400 cursor-not-allowed opacity-50"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      className="w-7 h-7 flex items-center justify-center rounded-md bg-[#4F46E5] text-white font-semibold shadow-xs"
                    >
                      1
                    </button>
                    <button
                      type="button"
                      disabled
                      className="p-1.5 rounded-md border border-slate-200 text-slate-400 cursor-not-allowed opacity-50"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>Items per page</span>
                    <select
                      defaultValue="10"
                      className="h-7 px-2 border border-slate-200 rounded-md bg-white text-slate-700 outline-hidden"
                    >
                      <option value="10">10</option>
                      <option value="20">20</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              VIEW C: PLANS & PRICING (Image 3)
             ========================================== */}
          {viewState === 'plans' && (
            <div className="space-y-4">
              {/* Top Back Link */}
              <div>
                <button
                  type="button"
                  onClick={handleBackToProductList}
                  className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back to Product List</span>
                </button>
              </div>

              <FreePaidPlansScreen />
            </div>
          )}
        </div>

        {/* ==============================================================
            RIGHT COLUMN: DETAILS / DRAWER PANEL (5 cols)
           ============================================================== */}
        {isDrawerOpen && viewState !== 'plans' && (
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/90 shadow-sm p-5 space-y-4">
            {/* Header of Right Panel matching screenshots */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <ProductBadgeIcon
                  type={selectedProduct.icon_type || selectedProduct.category}
                  size="md"
                />
                <h3 className="text-base font-bold text-slate-900">
                  {selectedProduct.product_name}
                </h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                  {selectedProduct.status}
                </span>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                title="Close side panel"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation Tabs in Right Panel */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('details');
                  setDrawerMode('edit_product');
                }}
                className={cn(
                  'px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all',
                  activeTab === 'details'
                    ? 'bg-[#4F46E5] text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                )}
              >
                Product Details
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('editions');
                  setViewState('editions');
                  setDrawerMode('edit_edition');
                }}
                className={cn(
                  'px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all',
                  activeTab === 'editions'
                    ? 'bg-[#4F46E5] text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                )}
              >
                Editions ({selectedProduct.editions_count || selectedProduct.editions_details?.length || 3})
              </button>
              <button
                type="button"
                onClick={() => router.push('/products/features-modules')}
                className={cn(
                  'px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all',
                  activeTab === 'features'
                    ? 'bg-[#4F46E5] text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                )}
              >
                Features & Modules
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('plans');
                  setViewState('plans');
                }}
                className={cn(
                  'px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all',
                  activeTab === 'plans'
                    ? 'bg-[#4F46E5] text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                )}
              >
                Plans & Pricing
              </button>
            </div>

            {/* ==============================================================
                TAB 1: PRODUCT DETAILS FORM (Screenshot 1)
               ============================================================== */}
            {activeTab === 'details' && (
              <form onSubmit={handleSaveProduct} className="space-y-3.5">
                {drawerMode === 'add_product' && (
                  <div className="p-2.5 bg-indigo-50/70 border border-indigo-100 rounded-lg text-xs text-indigo-700 font-semibold">
                    Creating New Product Master
                  </div>
                )}

                {/* Row 1: Product Name & Code */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={productForm.product_name || ''}
                      onChange={(e) =>
                        setProductForm({ ...productForm, product_name: e.target.value })
                      }
                      placeholder="e.g. Pegatto Education"
                      className="h-8.5 text-xs sm:text-sm bg-white border-slate-200 rounded-lg"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Product Code <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={productForm.product_code || ''}
                      onChange={(e) =>
                        setProductForm({ ...productForm, product_code: e.target.value.toUpperCase() })
                      }
                      placeholder="e.g. PEG-EDU"
                      className="h-8.5 font-mono text-xs sm:text-sm bg-white border-slate-200 rounded-lg uppercase"
                      required
                    />
                  </div>
                </div>

                {/* Row 2: Category & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={productForm.category || 'Education'}
                      onChange={(e) =>
                        setProductForm({ ...productForm, category: e.target.value })
                      }
                      className="w-full h-8.5 px-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg text-slate-700 outline-hidden focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="Education">Education</option>
                      <option value="IT / Services">IT / Services</option>
                      <option value="HRMS">HRMS</option>
                      <option value="Retail">Retail</option>
                      <option value="Real Estate">Real Estate</option>
                      <option value="CRM (Generic)">CRM (Generic)</option>
                      <option value="Platform">Platform</option>
                      <option value="ERP">ERP</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Status
                    </label>
                    <div className="relative">
                      <select
                        value={productForm.status || 'Active'}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            status: e.target.value as any,
                          })
                        }
                        className="w-full h-8.5 pl-7 pr-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg text-slate-700 outline-hidden focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Draft">Draft</option>
                        <option value="Under Review">Under Review</option>
                      </select>
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                  </div>
                </div>

                {/* Row 3: Short Description */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Short Description <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    rows={2}
                    value={productForm.short_description || ''}
                    onChange={(e) =>
                      setProductForm({ ...productForm, short_description: e.target.value })
                    }
                    placeholder="Short summary of product purpose"
                    className="text-xs sm:text-sm bg-white border-slate-200 rounded-lg resize-none"
                    required
                  />
                </div>

                {/* Row 4: Detailed Description */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Detailed Description
                  </label>
                  <Textarea
                    rows={3}
                    value={productForm.description || ''}
                    onChange={(e) =>
                      setProductForm({ ...productForm, description: e.target.value })
                    }
                    placeholder="Comprehensive scope and enterprise features"
                    className="text-xs sm:text-sm bg-white border-slate-200 rounded-lg resize-none"
                  />
                </div>

                {/* Row 5: Current Version, Release Date, Lifecycle Stage */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">
                      Current Version
                    </label>
                    <Input
                      value={productForm.current_version || 'v2.1.0'}
                      onChange={(e) =>
                        setProductForm({ ...productForm, current_version: e.target.value })
                      }
                      className="h-8.5 font-mono text-xs bg-white border-slate-200 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">
                      Release Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                      <Input
                        value={productForm.release_date || '10 Nov 2026'}
                        onChange={(e) =>
                          setProductForm({ ...productForm, release_date: e.target.value })
                        }
                        className="h-8.5 pl-8 pr-2 text-xs bg-white border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">
                      Lifecycle Stage
                    </label>
                    <select
                      value={productForm.lifecycle_stage || 'General Availability'}
                      onChange={(e) =>
                        setProductForm({ ...productForm, lifecycle_stage: e.target.value })
                      }
                      className="w-full h-8.5 px-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 outline-hidden"
                    >
                      <option value="General Availability">General Availability</option>
                      <option value="Early Access">Early Access</option>
                      <option value="Beta">Beta</option>
                      <option value="End of Life">End of Life</option>
                    </select>
                  </div>
                </div>

                {/* Row 6: Product Logo & Product Icon (Menu) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Product Logo Box */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">
                      Product Logo
                    </label>
                    <div className="p-2 border border-slate-200 rounded-lg bg-slate-50/50 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <ProductBadgeIcon
                          type={productForm.icon_type || productForm.category}
                          size="sm"
                        />
                        <div className="truncate">
                          <p className="text-xs font-semibold text-slate-800 truncate">
                            {productForm.logo_file || 'pegatto-education.svg'}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {productForm.logo_dimensions || '(120 x 120)'}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setProductForm({ ...productForm, logo_file: 'default-logo.svg' })
                        }
                        className="text-red-500 hover:text-red-700 p-1 rounded-md transition-colors"
                        title="Delete logo"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Product Icon (Menu) Box */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">
                      Product Icon (Menu)
                    </label>
                    <div className="p-2 border border-slate-200 rounded-lg bg-slate-50/50 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <ProductBadgeIcon
                          type={productForm.icon_type || productForm.category}
                          size="sm"
                        />
                        <div className="truncate">
                          <p className="text-xs font-semibold text-slate-800 truncate">
                            {productForm.icon_file || 'edu-icon.svg'}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {productForm.icon_dimensions || '(32 x 32)'}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setProductForm({ ...productForm, icon_file: 'default-icon.svg' })
                        }
                        className="text-red-500 hover:text-red-700 p-1 rounded-md transition-colors"
                        title="Delete menu icon"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form Action Buttons matching Screenshot 1 */}
                <div className="flex items-center gap-2.5 pt-3">
                  <Button
                    type="submit"
                    className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium text-xs sm:text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Check className="h-4 w-4" />
                    <span>{drawerMode === 'add_product' ? 'Create Product' : 'Update Product'}</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDrawerOpen(false)}
                    className="bg-slate-100 hover:bg-slate-200 border-none text-slate-700 font-medium text-xs sm:text-sm px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {/* ==============================================================
                TAB 2: EDITIONS DETAILS FORM + CAPABILITY MATRIX (Screenshot 2)
               ============================================================== */}
            {activeTab === 'editions' && (
              <form onSubmit={handleSaveEdition} className="space-y-3.5">
                {/* Title */}
                <div className="pb-1">
                  <h4 className="text-sm font-bold text-slate-900">
                    {drawerMode === 'add_edition'
                      ? 'Add New Edition'
                      : `Edition Details – ${editionForm.name || 'Standard'}`}
                  </h4>
                </div>

                {/* Row 1: Edition Name & Edition Code */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Edition Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={editionForm.name || ''}
                      onChange={(e) => setEditionForm({ ...editionForm, name: e.target.value })}
                      placeholder="e.g. Standard"
                      className="h-8.5 text-xs sm:text-sm bg-white border-slate-200 rounded-lg"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Edition Code <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={editionForm.code || ''}
                      onChange={(e) =>
                        setEditionForm({ ...editionForm, code: e.target.value.toUpperCase() })
                      }
                      placeholder="e.g. EDU-STD"
                      className="h-8.5 font-mono text-xs sm:text-sm bg-white border-slate-200 rounded-lg uppercase"
                      required
                    />
                  </div>
                </div>

                {/* Row 2: Description & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      rows={2}
                      value={editionForm.description || ''}
                      onChange={(e) =>
                        setEditionForm({ ...editionForm, description: e.target.value })
                      }
                      placeholder="Edition functional scope and inclusions"
                      className="text-xs sm:text-sm bg-white border-slate-200 rounded-lg resize-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Status
                    </label>
                    <div className="relative">
                      <select
                        value={editionForm.status || 'Active'}
                        onChange={(e) =>
                          setEditionForm({
                            ...editionForm,
                            status: e.target.value as any,
                          })
                        }
                        className="w-full h-8.5 pl-6 pr-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 outline-hidden"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Draft">Draft</option>
                      </select>
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                  </div>
                </div>

                {/* Subheading: Key Capabilities (Features Included) */}
                <div className="pt-2">
                  <h5 className="text-xs font-bold text-slate-900 mb-2">
                    Key Capabilities (Features Included)
                  </h5>

                  {/* Capabilities Comparison Matrix Table - EXACT MATCH TO SCREENSHOT 2 */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                          <th className="py-2.5 px-3">Feature / Module</th>
                          <th className="py-2.5 px-3 text-center w-24">Core (Free)</th>
                          <th className="py-2.5 px-3 text-center w-24">Standard</th>
                          <th className="py-2.5 px-3 text-center w-24">Enterprise</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {capabilities.map((cap) => {
                          const coreEd = selectedProduct.editions_details?.find((e) =>
                            e.code.includes('CORE') || e.name.includes('Core')
                          );
                          const stdEd = selectedProduct.editions_details?.find((e) =>
                            e.code.includes('STD') || e.name.includes('Standard')
                          );
                          const entEd = selectedProduct.editions_details?.find((e) =>
                            e.code.includes('ENT') || e.name.includes('Enterprise')
                          );

                          const hasCore = Boolean(coreEd?.capabilities?.[cap.name]);
                          const hasStd = Boolean(stdEd?.capabilities?.[cap.name]);
                          const hasEnt = Boolean(entEd?.capabilities?.[cap.name]);

                          return (
                            <tr key={cap.id} className="hover:bg-slate-50/60 transition-colors">
                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-2">
                                  <CapabilityIcon type={cap.iconType} className="w-4 h-4 text-blue-600" />
                                  <span className="font-medium text-slate-800">{cap.name}</span>
                                </div>
                              </td>

                              {/* Core */}
                              <td className="py-2.5 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleToggleCapability('CORE', cap.name)}
                                  className="inline-flex items-center justify-center p-0.5 rounded-full hover:bg-slate-100 transition-colors"
                                  title="Toggle capability for Core"
                                >
                                  {hasCore ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                                  ) : (
                                    <span className="text-slate-400 font-bold">—</span>
                                  )}
                                </button>
                              </td>

                              {/* Standard */}
                              <td className="py-2.5 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleToggleCapability('STD', cap.name)}
                                  className="inline-flex items-center justify-center p-0.5 rounded-full hover:bg-slate-100 transition-colors"
                                  title="Toggle capability for Standard"
                                >
                                  {hasStd ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                                  ) : (
                                    <span className="text-slate-400 font-bold">—</span>
                                  )}
                                </button>
                              </td>

                              {/* Enterprise */}
                              <td className="py-2.5 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleToggleCapability('ENT', cap.name)}
                                  className="inline-flex items-center justify-center p-0.5 rounded-full hover:bg-slate-100 transition-colors"
                                  title="Toggle capability for Enterprise"
                                >
                                  {hasEnt ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                                  ) : (
                                    <span className="text-slate-400 font-bold">—</span>
                                  )}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Bottom Actions matching Screenshot 2 */}
                <div className="flex items-center gap-2.5 pt-3">
                  <Button
                    type="submit"
                    className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium text-xs sm:text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Check className="h-4 w-4" />
                    <span>{drawerMode === 'add_edition' ? 'Create Edition' : 'Update Edition'}</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDrawerOpen(false)}
                    className="bg-slate-100 hover:bg-slate-200 border-none text-slate-700 font-medium text-xs sm:text-sm px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {/* ==============================================================
                TAB 3: FEATURES & MODULES (Rich Interactive Experience)
               ============================================================== */}
            {activeTab === 'features' && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between pb-1">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Features & Modules</h4>
                    <p className="text-xs text-slate-500">
                      Configure individual SaaS modules active in {selectedProduct.product_name}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                  {capabilities.map((cap) => (
                    <div
                      key={cap.id}
                      className="p-3 border border-slate-200 rounded-lg bg-slate-50/40 hover:bg-indigo-50/20 transition-colors flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-2.5">
                        <CapabilityIcon type={cap.iconType} className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-slate-900">{cap.name}</p>
                          <p className="text-[11px] text-slate-500">{cap.description}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                              Category: {cap.category}
                            </span>
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              Production Ready
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==============================================================
                TAB 4: PLANS & PRICING (Rich Interactive Experience)
               ============================================================== */}
            {activeTab === 'plans' && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between pb-1">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Commercial Plans & Pricing</h4>
                    <p className="text-xs text-slate-500">
                      Tier pricing, license quotas, and multi-tenant billing
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 border border-slate-200 rounded-xl bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-800">Core (Free Edition)</span>
                      <span className="text-xs font-bold text-slate-900">$0 / month</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Essential features for basic single-institution education operations.
                    </p>
                    <div className="text-[10px] text-slate-600 space-y-0.5">
                      <p>✓ Up to 500 active student records</p>
                      <p>✓ Digital Admissions & Fee payments</p>
                      <p>✓ Basic executive reports</p>
                    </div>
                  </div>

                  <div className="p-3.5 border-2 border-indigo-500 rounded-xl bg-indigo-50/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">Standard Tier</span>
                        <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-semibold">
                          Recommended
                        </span>
                      </div>
                      <span className="text-xs font-bold text-indigo-700">$99 / month</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Complete admission, academics, and school management with portal access.
                    </p>
                    <div className="text-[10px] text-slate-700 space-y-0.5">
                      <p>✓ Unlimited active students</p>
                      <p>✓ Automated report cards & GPA</p>
                      <p>✓ Parent & Student mobile portals</p>
                      <p>✓ Full financial ledger & receipts</p>
                    </div>
                  </div>

                  <div className="p-3.5 border border-slate-200 rounded-xl bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-800">Enterprise Group</span>
                      <span className="text-xs font-bold text-slate-900">$299 / month</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Advanced capabilities for multi-campus chains and international groups.
                    </p>
                    <div className="text-[10px] text-slate-600 space-y-0.5">
                      <p>✓ Multi-Campus governance & single tenant isolation</p>
                      <p>✓ Custom API webhooks & audit logs</p>
                      <p>✓ 24/7 dedicated SLA engineering</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ==============================================================
          IMPORT / EXPORT DIALOG
         ============================================================== */}
      <Dialog open={isImportExportOpen} onOpenChange={setIsImportExportOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Upload className="h-5 w-5 text-indigo-600" />
              <span>Import / Export Catalog</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Export the complete Product Master and Edition records or import from standard JSON/CSV schema.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-3">
            <div
              onClick={handleExportJson}
              className="p-3.5 border border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/30 cursor-pointer transition-all flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">Export as JSON</p>
                <p className="text-xs text-slate-500">Complete catalog including edition capability matrices</p>
              </div>
              <Download className="h-4 w-4 text-indigo-600" />
            </div>

            <div
              onClick={handleExportCsv}
              className="p-3.5 border border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/30 cursor-pointer transition-all flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">Export as CSV</p>
                <p className="text-xs text-slate-500">Tabular product overview for spreadsheets & BI tools</p>
              </div>
              <Download className="h-4 w-4 text-indigo-600" />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsImportExportOpen(false)}
              className="text-xs"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ==============================================================
          HELP DIALOG
         ============================================================== */}
      <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
        <DialogContent className="sm:max-w-lg bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-indigo-600" />
              <span>Product Master Guide</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Reference specifications for products, editions, versions, and capability matrices.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs text-slate-700 max-h-[400px] overflow-y-auto">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="font-bold text-slate-900 mb-1">1. Product Master Entity</p>
              <p>
                The Product Master represents the top-level commercial software asset (e.g., Pegatto Education, Pegatto IT). Each product maintains its branding, release lifecycle, and edition configurations.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="font-bold text-slate-900 mb-1">2. Editions Hierarchy</p>
              <p>
                A product contains one or more Editions (such as Core, Standard, Enterprise). Each edition binds a distinct set of capability modules, feature flags, and tenant limits.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="font-bold text-slate-900 mb-1">3. Key Capability Matrix</p>
              <p>
                Clicking checkmarks in the Edition Details matrix directly activates or deactivates module access for that tier across all provisioned tenant instances.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="default"
              onClick={() => setIsHelpOpen(false)}
              className="bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs"
            >
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ==============================================================
          CONFIRM DELETE DIALOG
         ============================================================== */}
      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-red-600 flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              <span>Delete {deleteTarget?.type === 'product' ? 'Product' : 'Edition'}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600 mt-2">
              Are you sure you want to permanently delete{' '}
              <strong className="text-slate-900">{deleteTarget?.name}</strong> (
              <span className="font-mono">{deleteTarget?.code}</span>)? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 mt-3">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white text-xs"
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
