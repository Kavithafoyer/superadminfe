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
  Building2,
  Tag,
  GraduationCap,
  ShieldCheck,
  DollarSign,
  Info,
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
import { useGetProductCategoryListQuery } from '@/service/api/superAdminService';

const LOCAL_STORAGE_KEY = 'PEGATTO_PRODUCT_MASTER_RECORDS_V4';

interface ProductMasterScreenProps {
  initialMode?: 'edit_product' | 'add_product';
  initialProductId?: string;
  initialTab?: 'details' | 'editions' | 'features' | 'plans';
}

function newProductDraft(): Partial<InitialProductConfig> {
  return {
  id: `prd-${Date.now().toString(36)}`,
  product_name: '',
  product_code: '',
  category: 'Education',
  status: 'Draft',
  short_description: '',
  description: '',
  current_version: 'v1.0.0',
  release_date: '22 Nov 2026',
  lifecycle_stage: 'General Availability',
  logo_file: 'new-product-logo.svg',
  logo_dimensions: '(120 × 120)',
  icon_file: 'new-product-icon.svg',
  icon_dimensions: '(32 × 32)',
  icon_type: 'education',
  editions_count: 1,
  editions: ['Standard'],
  editions_details: [
    {
      id: `ed-${Date.now()}`,
      name: 'Standard',
      code: 'STD',
      description: 'Standard product edition',
      status: 'Active',
      displayOrder: 1,
      capabilities: {},
    },
  ],
};
}

export function ProductMasterScreen({
  initialMode = 'edit_product',
  initialProductId,
  initialTab = 'details',
}: ProductMasterScreenProps) {
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
    return initialProductId || products[0]?.id || 'prd-edu';
  });

  const matchedProduct = useMemo(() => {
    const selection = selectedProductId.toLowerCase();
    return products.find(product => product.id === selectedProductId ||
      product.product_code?.toLowerCase() === selection || product.product_name.toLowerCase() === selection);
  }, [products, selectedProductId]);
  const selectedProduct = matchedProduct ?? products[0];

  function openProductSection(path: string) {
    if (!matchedProduct) return;
    router.push(path + '?product=' + encodeURIComponent(matchedProduct.product_code || matchedProduct.id));
  }

  // Is right side drawer open? (Default open as per Screenshot 1)
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);

  // Drawer mode: 'edit_product' | 'add_product'
  const [drawerMode, setDrawerMode] = useState<'edit_product' | 'add_product'>(initialMode);

  // Active pill tab in right details panel: 'details' | 'editions' | 'features' | 'plans'
  const [activeTab, setActiveTab] = useState<'details' | 'editions' | 'features' | 'plans'>(initialTab);

  // Selected edition ID for editions subview
  const [selectedEditionId, setSelectedEditionId] = useState<string>('ed-edu-std');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Dynamic live categories from ProductCategoryListwithPagination
  const { data: categoryApiResponse } = useGetProductCategoryListQuery();
  const liveCategoryNames = useMemo(() => {
    if (!categoryApiResponse?.results) return [];
    return categoryApiResponse.results
      .map((c: any) => c.Category_Name || c.Category_Code)
      .filter(Boolean);
  }, [categoryApiResponse]);

  // Product Form state for right side
  const [productForm, setProductForm] = useState<Partial<InitialProductConfig>>(() => initialMode === 'add_product' ? newProductDraft() : { ...selectedProduct });

  // Edition Form state
  const [editionForm, setEditionForm] = useState<Partial<EditionRecord>>({});

  // Capabilities state
  const [capabilities, setCapabilities] = useState(EDUCATION_CAPABILITIES);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal dialog states
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
    code: string;
  } | null>(null);

  // Persist products to localStorage
  const persistProducts = (updated: InitialProductConfig[]) => {
    setProducts(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed to persist products:', err);
      }
    }
  };

  // Sync form when selected product changes (unless in add_product mode)
  useEffect(() => {
    if (selectedProduct && drawerMode === 'edit_product') {
      setProductForm({ ...selectedProduct });
      if (selectedProduct.editions_details && selectedProduct.editions_details.length > 0) {
        const found =
          selectedProduct.editions_details.find((e) => e.id === selectedEditionId) ||
          selectedProduct.editions_details[0];
        setSelectedEditionId(found.id);
        setEditionForm({ ...found });
      }
    }
  }, [selectedProduct, drawerMode]);

  // Handle select product from table
  const handleSelectProduct = (p: InitialProductConfig) => {
    setSelectedProductId(p.id);
    setDrawerMode('edit_product');
    setProductForm({ ...p });
    setIsDrawerOpen(true);
    if (p.editions_details && p.editions_details.length > 0) {
      setSelectedEditionId(p.editions_details[0].id);
      setEditionForm({ ...p.editions_details[0] });
    }
  };

  // Open "Add Product" mode in right drawer
  const handleStartAddProduct = () => {
    setDrawerMode('add_product');
    setActiveTab('details');
    setProductForm(newProductDraft());
    setIsDrawerOpen(true);
  };

  // Filtered Products List
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        searchQuery === '' ||
        p.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.product_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'All' || p.status === statusFilter;
      const matchCategory = categoryFilter === 'All' || p.category === categoryFilter;

      return matchSearch && matchStatus && matchCategory;
    });
  }, [products, searchQuery, statusFilter, categoryFilter]);

  // Unique categories for filter dropdown
  const uniqueCategories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.category));
    return ['All', ...Array.from(set)];
  }, [products]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setCategoryFilter('All');
    setCurrentPage(1);
    toast.info('Filters reset to default.');
  };

  // Save / Update Product
  const handleSaveProduct = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!productForm.product_name || !productForm.product_code) {
      toast.error('Please enter product name and code');
      return;
    }

    if (drawerMode === 'add_product') {
      const newProd: InitialProductConfig = {
        id: productForm.id || `prd-${Date.now().toString(36)}`,
        product_name: productForm.product_name,
        product_code: productForm.product_code.toUpperCase(),
        category: productForm.category || 'Education',
        status: (productForm.status as any) || 'Active',
        short_description: productForm.short_description || '',
        description: productForm.description || '',
        current_version: productForm.current_version || 'v1.0.0',
        release_date: productForm.release_date || '22 Nov 2026',
        lifecycle_stage: productForm.lifecycle_stage || 'General Availability',
        logo_file: productForm.logo_file || 'pegatto-default.svg',
        logo_dimensions: productForm.logo_dimensions || '(120 × 120)',
        icon_file: productForm.icon_file || 'default-icon.svg',
        icon_dimensions: productForm.icon_dimensions || '(32 × 32)',
        icon_type: (productForm.category?.toLowerCase().includes('it')
          ? 'it'
          : productForm.category?.toLowerCase().includes('hr')
          ? 'people'
          : productForm.category?.toLowerCase().includes('ret')
          ? 'retail'
          : productForm.category?.toLowerCase().includes('real')
          ? 'real_estate'
          : productForm.category?.toLowerCase().includes('crm')
          ? 'crm'
          : 'education') as any,
        editions_count: productForm.editions_count || 1,
        editions: productForm.editions || ['Standard'],
        editions_details: productForm.editions_details || [
          {
            id: `ed-${Date.now()}`,
            name: 'Standard',
            code: `${productForm.product_code}-STD`,
            description: 'Standard operational tier',
            status: 'Active',
            displayOrder: 1,
            capabilities: {},
          },
        ],
      };

      const updated = [newProd, ...products];
      persistProducts(updated);
      setSelectedProductId(newProd.id);
      setDrawerMode('edit_product');
      toast.success(`Product "${newProd.product_name}" created successfully!`);
    } else {
      const updated = products.map((p) => {
        if (p.id === matchedProduct?.id) {
          return {
            ...p,
            ...productForm,
            product_code: productForm.product_code?.toUpperCase(),
          } as InitialProductConfig;
        }
        return p;
      });
      persistProducts(updated);
      toast.success(`Product "${productForm.product_name}" updated successfully!`);
    }
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
    setSelectedProductId(cloned.id);
    setProductForm({ ...cloned });
    setDrawerMode('edit_product');
    setIsDrawerOpen(true);
    toast.success(`Cloned "${p.product_name}"`);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    const remaining = products.filter((p) => p.id !== deleteTarget.id);
    persistProducts(remaining);
    if (selectedProductId === deleteTarget.id && remaining.length > 0) {
      setSelectedProductId(remaining[0].id);
      setProductForm({ ...remaining[0] });
    }
    toast.success(`Product "${deleteTarget.name}" deleted.`);
    setDeleteTarget(null);
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

  // Toggle capability in editions subview
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
    toast.success(`Updated capability for ${editionCode}`);
  };

  return (
    <div className="w-full space-y-5 pb-12 font-sans text-slate-800 antialiased">
      {/* ==============================================================
          1. TOP HEADER - EXACT MATCH WITH media_1795366877487_39e86412.jpg
         ============================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-purple-50 border border-purple-100/80 rounded-xl shadow-xs">
            <IsometricBoxIcon className="h-8 w-8 text-[#6222cc]" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-0.5">
              <span
                className="hover:text-slate-800 cursor-pointer"
                onClick={() => router.push('/products/category')}
              >
                Product Management
              </span>
              <span className="text-slate-400">&gt;</span>
              <span
                className="hover:text-slate-800 cursor-pointer text-[#6222cc] font-medium"
                onClick={() => router.push('/products/category')}
              >
                Product Category
              </span>
              <span className="text-slate-400">&gt;</span>
              <span className="text-slate-800 font-semibold">Product Master</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Product Master
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Create and manage all Pegatto products, editions, versions and lifecycle
            </p>
          </div>
        </div>

        {/* Action Buttons Top Right */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            type="button"
            onClick={handleStartAddProduct}
            className="bg-[#6222cc] hover:bg-[#521cb0] text-white font-medium text-xs sm:text-sm h-9 px-4 rounded-lg flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setIsImportExportOpen(true)}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs sm:text-sm h-9 px-3.5 rounded-lg flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Upload className="h-3.5 w-3.5 text-slate-600" />
            <span>Import / Export</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setIsHelpOpen(true)}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs sm:text-sm h-9 px-3 rounded-lg flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <HelpCircle className="h-3.5 w-3.5 text-slate-600" />
            <span>Help</span>
          </Button>
        </div>
      </div>

      {/* ==============================================================
          2. MAIN 2-COLUMN SPLIT LAYOUT:
             LEFT: PRODUCTS TABLE LIST (~58% width)
             RIGHT: CREATE / EDIT DETAILS DRAWER (~42% width)
             MATCHING media_1795366877487_39e86412.jpg EXACTLY
         ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ============================================================
            LEFT COLUMN: TABLE CONTAINER
           ============================================================ */}
        <div
          className={cn(
            'space-y-3 transition-all duration-300',
            isDrawerOpen ? 'lg:col-span-7' : 'lg:col-span-12'
          )}
        >
          {/* Filter Bar matching Screenshot */}
          <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by product name, code or category..."
                className="pl-8.5 pr-3 h-8.5 text-xs bg-white border-slate-200/90 rounded-lg placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-[#6222cc]"
              />
            </div>

            {/* Status Dropdown */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[11px] font-semibold text-slate-500">Status</span>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-8.5 appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-2.5 pr-6 text-xs font-medium text-slate-800 outline-none focus:ring-1 focus:ring-[#6222cc] cursor-pointer"
                >
                  <option value="All">All</option>
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <ChevronDown className="h-3 w-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[11px] font-semibold text-slate-500">Category</span>
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-8.5 appearance-none bg-slate-50/70 border border-slate-200 rounded-lg pl-2.5 pr-6 text-xs font-medium text-slate-800 outline-none focus:ring-1 focus:ring-[#6222cc] cursor-pointer"
                >
                  {uniqueCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-3 w-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Reset Button */}
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[#6222cc] hover:text-[#521cb0] text-xs font-semibold px-2 py-1 transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* Product Master Table matching Screenshot */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-700 border-b border-slate-200 font-semibold text-[11px]">
                    <th className="py-3 px-3 text-center w-8">#</th>
                    <th className="py-3 px-3 font-semibold text-slate-800">Product Name</th>
                    <th className="py-3 px-3 font-semibold text-slate-800">Product Code</th>
                    <th className="py-3 px-3 font-semibold text-slate-800">Category</th>
                    <th className="py-3 px-3 text-center font-semibold text-slate-800">Editions</th>
                    <th className="py-3 px-3 text-center font-semibold text-slate-800">Status</th>
                    <th className="py-3 px-3 text-center font-semibold text-slate-800">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p, index) => {
                    const isSelected = matchedProduct?.id === p.id && isDrawerOpen;

                    return (
                      <tr
                        key={p.id}
                        onClick={() => handleSelectProduct(p)}
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
                            <ProductBadgeIcon type={p.icon_type || p.category} size="md" />
                            <span className="font-semibold text-slate-900">{p.product_name}</span>
                          </div>
                        </td>

                        <td className="py-3 px-3 font-mono text-slate-700 text-xs font-semibold whitespace-nowrap">
                          {p.product_code}
                        </td>

                        <td className="py-3 px-3 text-slate-700 text-xs whitespace-nowrap">
                          {p.category}
                        </td>

                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span className="inline-flex items-center justify-center font-bold text-slate-800 text-xs">
                            {p.editions_count}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span
                            className={cn(
                              'inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold',
                              p.status === 'Active'
                                ? 'bg-[#dcfce7] text-[#15803d]'
                                : p.status === 'Draft'
                                ? 'bg-[#e0e7ff] text-[#4338ca]'
                                : 'bg-slate-100 text-slate-700'
                            )}
                          >
                            {p.status}
                          </span>
                        </td>

                        <td
                          className="py-3 px-3 text-center whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleSelectProduct(p)}
                              title="Edit Product"
                              className="p-1 rounded text-slate-400 hover:text-[#6222cc] hover:bg-purple-50 transition-colors cursor-pointer"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDuplicateProduct(p, e)}
                              title="Duplicate Product"
                              className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setDeleteTarget({
                                  id: p.id,
                                  name: p.product_name,
                                  code: p.product_code,
                                })
                              }
                              title="Delete Product"
                              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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

            {/* Pagination Footer matching Screenshot */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-100 text-xs text-slate-500 bg-white">
              <div>
                Showing 1 - {filteredProducts.length} of {filteredProducts.length} products
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
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="border border-slate-200 rounded px-1.5 py-0.5 bg-white text-slate-700 font-medium"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
            RIGHT COLUMN: CREATE / EDIT DRAWER PANEL (~42% width)
            EXACT MATCH WITH media_1795366877487_39e86412.jpg
           ============================================================ */}
        {isDrawerOpen && !matchedProduct && drawerMode !== 'add_product' && (
          <p className="lg:col-span-5 rounded-xl border p-4 text-sm text-muted-foreground">This product isn?t available in the Product Master list. Choose a product from the list.</p>
        )}
        {isDrawerOpen && (matchedProduct || drawerMode === 'add_product') && (
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            {/* Header: Product Icon + Name + Badge + Close Button */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <ProductBadgeIcon
                  type={drawerMode === 'add_product' ? 'core' : selectedProduct.icon_type || selectedProduct.category}
                  size="md"
                />
                <h3 className="text-base font-bold text-slate-900">
                  {drawerMode === 'add_product' ? 'New Product' : selectedProduct.product_name}
                </h3>
                <span
                  className={cn(
                    'px-2.5 py-0.5 rounded-full text-[11px] font-semibold',
                    (drawerMode === 'add_product' ? 'Draft' : selectedProduct.status) === 'Active'
                      ? 'bg-[#dcfce7] text-[#15803d]'
                      : 'bg-[#e0e7ff] text-[#4338ca]'
                  )}
                >
                  {drawerMode === 'add_product' ? 'Draft' : selectedProduct.status}
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

            {/* Pill Tabs matching Screenshot */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap',
                  activeTab === 'details'
                    ? 'bg-[#6222cc] text-white shadow-xs font-semibold'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                )}
              >
                Product Details
              </button>
              <button
                type="button"
                disabled={drawerMode === 'add_product'}
                onClick={() => openProductSection('/products/editions')}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap',
                  activeTab === 'editions'
                    ? 'bg-[#6222cc] text-white shadow-xs font-semibold'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                )}
              >
                Editions
              </button>
              <button
                type="button"
                disabled={drawerMode === 'add_product'}
                onClick={() => openProductSection('/products/features-modules')}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap',
                  activeTab === 'features'
                    ? 'bg-[#6222cc] text-white shadow-xs font-semibold'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                )}
              >
                Features & Modules
              </button>
              <button
                type="button"
                disabled={drawerMode === 'add_product'}
                onClick={() => openProductSection('/products/plans-pricing')}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap',
                  activeTab === 'plans'
                    ? 'bg-[#6222cc] text-white shadow-xs font-semibold'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                )}
              >
                Plans & Pricing
              </button>
            </div>

            {/* ==============================================================
                TAB 1: PRODUCT DETAILS FORM (Screenshot exact fields)
               ============================================================== */}
            {activeTab === 'details' && (
              <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
                {drawerMode === 'add_product' && (
                  <div className="p-2.5 bg-purple-50 border border-purple-100 rounded-lg text-xs text-[#6222cc] font-semibold flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4" />
                    <span>Creating New Product Master Record</span>
                  </div>
                )}

                {/* Row 1: Product Name & Code */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={productForm.product_name || ''}
                      onChange={(e) =>
                        setProductForm({ ...productForm, product_name: e.target.value })
                      }
                      placeholder="e.g. Pegatto Education"
                      className="h-8.5 text-xs bg-white border-slate-200 rounded-lg font-medium"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">
                      Product Code <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={productForm.product_code || ''}
                      onChange={(e) =>
                        setProductForm({ ...productForm, product_code: e.target.value.toUpperCase() })
                      }
                      placeholder="e.g. PEG-EDU"
                      className="h-8.5 font-mono text-xs bg-white border-slate-200 rounded-lg uppercase font-semibold"
                      required
                    />
                  </div>
                </div>

                {/* Row 2: Category & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-slate-700">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => router.push('/products/category')}
                        className="text-[10px] text-[#6222cc] hover:underline font-medium cursor-pointer"
                      >
                        Manage Categories
                      </button>
                    </div>
                    <div className="relative">
                      <select
                        value={productForm.category || 'Education'}
                        onChange={(e) =>
                          setProductForm({ ...productForm, category: e.target.value })
                        }
                        className="w-full h-8.5 appearance-none px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 outline-none focus:ring-1 focus:ring-[#6222cc] cursor-pointer"
                      >
                        {liveCategoryNames.length > 0 ? (
                          liveCategoryNames.map((name: string) => (
                            <option key={name} value={name}>
                              {name}
                            </option>
                          ))
                        ) : (
                          <>
                            <option value="Education">Education</option>
                            <option value="IT / Services">IT / Services</option>
                            <option value="HRMS">HRMS</option>
                            <option value="Retail">Retail</option>
                            <option value="Real Estate">Real Estate</option>
                            <option value="CRM (Generic)">CRM (Generic)</option>
                            <option value="Platform">Platform</option>
                          </>
                        )}
                      </select>
                      <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">
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
                        className="w-full h-8.5 appearance-none pl-7 pr-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 outline-none focus:ring-1 focus:ring-[#6222cc] cursor-pointer"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Draft">Draft</option>
                      </select>
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500" />
                      <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Row 3: Short Description (Input) */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">
                    Short Description <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={productForm.short_description || ''}
                    onChange={(e) =>
                      setProductForm({ ...productForm, short_description: e.target.value })
                    }
                    placeholder="Short summary of product purpose..."
                    className="h-8.5 text-xs bg-white border-slate-200 rounded-lg"
                    required
                  />
                </div>

                {/* Row 4: Detailed Description (Textarea) */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">
                    Detailed Description
                  </label>
                  <Textarea
                    rows={2}
                    value={productForm.description || ''}
                    onChange={(e) =>
                      setProductForm({ ...productForm, description: e.target.value })
                    }
                    placeholder="Comprehensive description of product features and workflows..."
                    className="text-xs bg-white border-slate-200 rounded-lg resize-none"
                  />
                </div>

                {/* Row 5: Current Version, Release Date, Lifecycle Stage */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">
                      Current Version
                    </label>
                    <Input
                      value={productForm.current_version || 'v2.1.0'}
                      onChange={(e) =>
                        setProductForm({ ...productForm, current_version: e.target.value })
                      }
                      className="h-8.5 font-mono text-xs bg-white border-slate-200 rounded-lg font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">
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
                    <label className="font-semibold text-slate-700">
                      Lifecycle Stage
                    </label>
                    <div className="relative">
                      <select
                        value={productForm.lifecycle_stage || 'General Availability'}
                        onChange={(e) =>
                          setProductForm({ ...productForm, lifecycle_stage: e.target.value })
                        }
                        className="w-full h-8.5 appearance-none px-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 outline-none focus:ring-1 focus:ring-[#6222cc] cursor-pointer"
                      >
                        <option value="General Availability">General Availability</option>
                        <option value="Early Access">Early Access</option>
                        <option value="Beta">Beta</option>
                        <option value="Deprecated">Deprecated</option>
                      </select>
                      <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Row 6: Product Logo & Product Icon (Menu) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Product Logo Box */}
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">
                      Product Logo
                    </label>
                    <div className="p-2 border border-slate-200 rounded-xl bg-slate-50/50 flex items-center justify-between gap-2">
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
                            {productForm.logo_dimensions || '(120 × 120)'}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setProductForm({ ...productForm, logo_file: 'default-logo.svg' })
                        }
                        className="text-red-500 hover:text-red-700 p-1 rounded-md transition-colors cursor-pointer"
                        title="Delete logo"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Product Icon (Menu) Box */}
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">
                      Product Icon (Menu)
                    </label>
                    <div className="p-2 border border-slate-200 rounded-xl bg-slate-50/50 flex items-center justify-between gap-2">
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
                            {productForm.icon_dimensions || '(32 × 32)'}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setProductForm({ ...productForm, icon_file: 'default-icon.svg' })
                        }
                        className="text-red-500 hover:text-red-700 p-1 rounded-md transition-colors cursor-pointer"
                        title="Delete menu icon"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form Action Buttons matching Screenshot */}
                <div className="flex items-center gap-2.5 pt-3">
                  <Button
                    type="submit"
                    className="bg-[#6222cc] hover:bg-[#521cb0] text-white font-medium text-xs sm:text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Check className="h-4 w-4" />
                    <span>{drawerMode === 'add_product' ? 'Create Product' : 'Update Product'}</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (drawerMode === 'add_product') {
                        setDrawerMode('edit_product');
                        if (selectedProduct) setProductForm({ ...selectedProduct });
                      } else {
                        setIsDrawerOpen(false);
                      }
                    }}
                    className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs sm:text-sm px-4 py-2 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {/* ==============================================================
                TAB 2: EDITIONS SUBVIEW (Inline in Right Drawer)
               ============================================================== */}
            {activeTab === 'editions' && (
              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between pb-1">
                  <div>
                    <h4 className="font-bold text-slate-900">
                      Product Editions ({selectedProduct.editions_details?.length || 3})
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Editions and capabilities configured for {selectedProduct.product_name}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                  {(selectedProduct.editions_details || []).map((ed) => (
                    <div
                      key={ed.id}
                      className="p-3 border border-slate-200 rounded-xl bg-white space-y-2 hover:border-purple-200 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs">{ed.name}</span>
                          <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {ed.code}
                          </span>
                        </div>
                        <span className="bg-[#dcfce7] text-[#15803d] px-2 py-0.5 rounded-full text-[10px] font-semibold">
                          {ed.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{ed.description}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <h5 className="font-bold text-slate-800 text-[11px] mb-2 uppercase tracking-wider">
                    Feature Capability Entitlements
                  </h5>
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
                          <th className="py-2 px-2.5">Feature</th>
                          <th className="py-2 px-2 text-center">Core</th>
                          <th className="py-2 px-2 text-center">Standard</th>
                          <th className="py-2 px-2 text-center">Enterprise</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-[11px]">
                        {capabilities.slice(0, 5).map((cap) => (
                          <tr key={cap.id} className="hover:bg-slate-50/60">
                            <td className="py-1.5 px-2.5 font-medium text-slate-800">{cap.name}</td>
                            <td className="py-1.5 px-2 text-center">
                              <Check className="h-3.5 w-3.5 text-emerald-600 mx-auto" />
                            </td>
                            <td className="py-1.5 px-2 text-center">
                              <Check className="h-3.5 w-3.5 text-emerald-600 mx-auto" />
                            </td>
                            <td className="py-1.5 px-2 text-center">
                              <Check className="h-3.5 w-3.5 text-emerald-600 mx-auto" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ==============================================================
                TAB 3: FEATURES & MODULES (Inline in Right Drawer)
               ============================================================== */}
            {activeTab === 'features' && (
              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900">Features &amp; Modules</h4>
                  <p className="text-[11px] text-slate-500">
                    Functional capabilities available in {selectedProduct.product_name}
                  </p>
                </div>

                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {capabilities.map((cap) => (
                    <div
                      key={cap.id}
                      className="p-2.5 border border-slate-200 rounded-xl bg-white hover:border-purple-200 transition-colors flex items-start gap-2.5"
                    >
                      <CapabilityIcon type={cap.iconType} className="w-4 h-4 text-[#6222cc] mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-900 text-xs">{cap.name}</p>
                        <p className="text-[11px] text-slate-500">{cap.description}</p>
                        <span className="inline-block mt-1 text-[10px] bg-purple-50 text-[#6222cc] px-2 py-0.5 rounded font-medium">
                          {cap.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==============================================================
                TAB 4: PLANS & PRICING (Inline in Right Drawer)
               ============================================================== */}
            {activeTab === 'plans' && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900">Subscription Plans</h4>
                    <p className="text-[11px] text-slate-500">
                      Tier pricing configured for {selectedProduct.product_name}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => router.push('/products/free-paid-plans')}
                    className="h-7 text-xs bg-purple-50 hover:bg-purple-100 text-[#6222cc] border border-purple-200 font-semibold"
                  >
                    Manage Plans &rarr;
                  </Button>
                </div>

                <div className="space-y-2.5">
                  {[
                    { name: 'Free Core', code: 'EDU-FREE', price: '₹0 / month', target: 'Trial / Entry', status: 'Active' },
                    { name: 'Basic', code: 'EDU-BASIC', price: '₹999 / month', target: 'Small Schools', status: 'Active' },
                    { name: 'Professional', code: 'EDU-PRO', price: '₹2,499 / month', target: 'Growing Schools', status: 'Active' },
                    { name: 'Enterprise', code: 'EDU-ENT', price: '₹4,999 / month', target: 'Multi-Campus / Large', status: 'Active' },
                  ].map((plan, i) => (
                    <div
                      key={i}
                      className="p-3 border border-slate-200 rounded-xl bg-white flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{plan.name}</span>
                          <span className="font-mono text-[10px] text-slate-400 font-semibold">{plan.code}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{plan.target}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-slate-900 block">{plan.price}</span>
                        <span className="bg-[#dcfce7] text-[#15803d] px-2 py-0.5 rounded-full text-[10px] font-semibold">
                          {plan.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* IMPORT / EXPORT DIALOG */}
      <Dialog open={isImportExportOpen} onOpenChange={setIsImportExportOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Import &amp; Export Product Master
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Download or upload complete product specifications, editions, and capability definitions.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <Button
              type="button"
              variant="outline"
              onClick={handleExportCsv}
              className="w-full justify-start h-10 border-slate-200 gap-2 hover:bg-slate-50"
            >
              <Download className="h-4 w-4 text-[#6222cc]" />
              <span>Export Product Catalog (CSV)</span>
            </Button>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsImportExportOpen(false)}
              className="text-xs"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* HELP DIALOG */}
      <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Product Master Guide
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Overview of product hierarchy and edition capabilities in Pegatto.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 text-xs text-slate-600 py-2">
            <p>
              &bull; <strong>Product</strong> is the top-level SaaS offering (e.g. Pegatto Education, Pegatto CRM).
            </p>
            <p>
              &bull; <strong>Editions</strong> define feature packages (Core, Standard, Enterprise).
            </p>
            <p>
              &bull; <strong>Plans</strong> govern pricing, user seats, and billing cycles.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              onClick={() => setIsHelpOpen(false)}
              className="bg-[#6222cc] text-white text-xs"
            >
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CONFIRM DELETE DIALOG */}
      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Delete Product
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Are you sure you want to delete &quot;{deleteTarget?.name}&quot; ({deleteTarget?.code})? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmDelete}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
            >
              Delete Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
