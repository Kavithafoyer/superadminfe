'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Package,
  Plus,
  Search,
  Download,
  SlidersHorizontal,
  ChevronDown,
  Edit2,
  MoreVertical,
  Eye,
  Trash2,
  Calendar,
  Check,
  X,
  AlertTriangle,
  Building2,
  Globe,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export interface ProductCatalogItem {
  id: string;
  code: string;
  name: string;
  category: string;
  editionsCount: number;
  deploymentType: string;
  defaultVersion: string;
  status: 'Active' | 'Draft' | 'Inactive';
  activeTenants: number;
  monthlyArr: string;
  color: string;
}

const INITIAL_CATALOG: ProductCatalogItem[] = [
  {
    id: 'prd-crm',
    code: 'PRD-CRM',
    name: 'Pegatto CRM',
    category: 'Enterprise CRM & Sales',
    editionsCount: 3,
    deploymentType: 'Multi-Tenant Cloud',
    defaultVersion: 'v2.4.0',
    status: 'Active',
    activeTenants: 274,
    monthlyArr: '₹84,50,000',
    color: '#5046e5',
  },
  {
    id: 'prd-edu',
    code: 'PRD-EDU',
    name: 'Pegatto Education',
    category: 'Higher Education ERP',
    editionsCount: 4,
    deploymentType: 'Multi-Tenant Cloud',
    defaultVersion: 'v3.1.2',
    status: 'Active',
    activeTenants: 182,
    monthlyArr: '₹62,30,000',
    color: '#2563eb',
  },
  {
    id: 'prd-it',
    code: 'PRD-ITSM',
    name: 'Pegatto IT',
    category: 'IT Service Management',
    editionsCount: 2,
    deploymentType: 'Dedicated DB SaaS',
    defaultVersion: 'v1.8.0',
    status: 'Active',
    activeTenants: 96,
    monthlyArr: '₹28,80,000',
    color: '#0d9488',
  },
  {
    id: 'prd-rtl',
    code: 'PRD-POS',
    name: 'Pegatto Retail',
    category: 'Retail POS & Inventory',
    editionsCount: 3,
    deploymentType: 'Multi-Tenant Cloud',
    defaultVersion: 'v2.0.4',
    status: 'Active',
    activeTenants: 145,
    monthlyArr: '₹41,20,000',
    color: '#16a34a',
  },
  {
    id: 'prd-peo',
    code: 'PRD-HRMS',
    name: 'Pegatto People',
    category: 'HRMS & Payroll',
    editionsCount: 2,
    deploymentType: 'Multi-Tenant Cloud',
    defaultVersion: 'v1.4.1',
    status: 'Draft',
    activeTenants: 38,
    monthlyArr: '₹12,40,000',
    color: '#d97706',
  },
  {
    id: 'prd-rea',
    code: 'PRD-REALT',
    name: 'Pegatto Real Estate',
    category: 'Real Estate & Properties',
    editionsCount: 2,
    deploymentType: 'Multi-Tenant Cloud',
    defaultVersion: 'v1.1.0',
    status: 'Active',
    activeTenants: 64,
    monthlyArr: '₹24,90,000',
    color: '#9333ea',
  },
];

export function ProductMasterListScreen() {
  const router = useRouter();

  const [products, setProducts] = useState<ProductCatalogItem[]>(INITIAL_CATALOG);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All Categories');
  const [filterStatus, setFilterStatus] = useState('All Statuses');

  // Active action menu row id
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductCatalogItem | null>(null);

  const filteredProducts = products.filter((p) => {
    if (filterCategory !== 'All Categories' && p.category !== filterCategory) return false;
    if (filterStatus !== 'All Statuses' && p.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCode = p.code.toLowerCase().includes(q);
      const matchName = p.name.toLowerCase().includes(q);
      const matchCategory = p.category.toLowerCase().includes(q);
      if (!matchCode && !matchName && !matchCategory) return false;
    }
    return true;
  });

  const handleOpenDelete = (item: ProductCatalogItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(null);
    setProductToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      toast.success(`Product "${productToDelete.name}" (${productToDelete.code}) deleted successfully`);
      setDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  return (
    <div className="w-full space-y-5 pb-12 font-sans text-slate-800 antialiased">
      {/* 1. BREADCRUMBS & TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <span
              className="hover:text-slate-800 cursor-pointer"
              onClick={() => router.push('/products/master')}
            >
              Product Management
            </span>
            <span className="text-slate-400">&gt;</span>
            <span className="text-slate-800 font-semibold">Product Master</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Product Master
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure and manage core product catalog, editions, deployment architecture, and pricing rules.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success('Product catalog exported to CSV')}
            className="h-9 gap-1.5 text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            Export
          </Button>
          <Button
            onClick={() => router.push('/products/master/create')}
            className="h-9 gap-1.5 bg-[#5046e5] hover:bg-[#4338ca] text-white text-xs font-semibold shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Product
          </Button>
        </div>
      </div>

      {/* 2. FILTER BAR (MATCHING REFERENCE IMAGE 2) */}
      <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
          <Input
            placeholder="Search by Code, Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-8 text-xs bg-white border-slate-200 rounded-lg"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Category:</span>
            <div className="relative">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="h-8 pl-2.5 pr-7 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-[#5046e5] cursor-pointer"
              >
                <option>All Categories</option>
                <option>Enterprise CRM &amp; Sales</option>
                <option>Higher Education ERP</option>
                <option>IT Service Management</option>
                <option>Retail POS &amp; Inventory</option>
                <option>HRMS &amp; People Management</option>
                <option>Real Estate &amp; Properties</option>
              </select>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Status:</span>
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="h-8 pl-2.5 pr-7 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-[#5046e5] cursor-pointer"
              >
                <option>All Statuses</option>
                <option>Active</option>
                <option>Draft</option>
                <option>Inactive</option>
              </select>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. TABLE CONTAINER WITH SUB-HEADER (MATCHING REFERENCE IMAGE 2) */}
      <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-xs">
        {/* Table Sub-header */}
        <div className="p-3.5 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900 tracking-tight">Product Catalog</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-[#5046e5] border border-indigo-100">
              {filteredProducts.length} Products
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Showing active product definitions and architecture versions
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Editions</th>
                <th className="py-3 px-4">Deployment</th>
                <th className="py-3 px-4">Version</th>
                <th className="py-3 px-4">Tenants</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => {
                const isMenuOpen = activeMenuId === p.id;

                return (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    onClick={() => router.push(`/products/master/view/${p.id}`)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#5046e5] whitespace-nowrap">
                      {p.code}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: p.color }}
                        />
                        <span>{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {p.category}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                        {p.editionsCount} Editions
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {p.deploymentType}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">
                      {p.defaultVersion}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                      {p.activeTenants}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold',
                          p.status === 'Active' &&
                            'bg-emerald-50 text-emerald-700 border border-emerald-200',
                          p.status === 'Draft' &&
                            'bg-amber-50 text-amber-700 border border-amber-200',
                          p.status === 'Inactive' &&
                            'bg-slate-100 text-slate-600 border border-slate-200'
                        )}
                      >
                        <span
                          className={cn(
                            'h-1.5 w-1.5 rounded-full',
                            p.status === 'Active' && 'bg-emerald-500',
                            p.status === 'Draft' && 'bg-amber-500',
                            p.status === 'Inactive' && 'bg-slate-400'
                          )}
                        />
                        {p.status}
                      </span>
                    </td>
                    <td
                      className="py-3.5 px-4 text-right whitespace-nowrap relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => setActiveMenuId(isMenuOpen ? null : p.id)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {/* Dropdown Menu (Matching Reference Image 2) */}
                      {isMenuOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setActiveMenuId(null)}
                          />
                          <div className="absolute right-4 top-10 z-50 w-36 bg-white rounded-lg border border-slate-200 shadow-md py-1 text-xs">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                router.push(`/products/master/view/${p.id}`);
                              }}
                              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5 text-slate-500" />
                              <span>Overview</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                router.push(`/products/master/edit/${p.id}`);
                              }}
                              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                            >
                              <Edit2 className="h-3.5 w-3.5 text-slate-500" />
                              <span>Edit</span>
                            </button>
                            <div className="border-t border-slate-100 my-0.5" />
                            <button
                              type="button"
                              onClick={(e) => handleOpenDelete(p, e)}
                              className="w-full px-3 py-1.5 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-rose-600" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-slate-50/75 border-t border-slate-200 px-4 py-2.5 flex items-center justify-between text-xs text-slate-500">
          <div>Showing 1-{filteredProducts.length} of {products.length} products</div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span>Rows per page:</span>
              <select className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs text-slate-700">
                <option>10</option>
                <option>25</option>
              </select>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400">
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="px-2 py-0.5 bg-[#5046e5] text-white rounded text-xs font-semibold">
                1
              </span>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400">
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRM DELETE MODAL */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="h-10 w-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-2">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <DialogTitle className="text-base font-bold text-slate-900">
              Delete Product Definition
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 mt-1">
              Are you sure you want to permanently delete{' '}
              <strong className="text-slate-800">
                {productToDelete?.name} ({productToDelete?.code})
              </strong>
              ? This action cannot be undone and will affect all dependent catalog listings.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeleteModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirmDelete}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
            >
              Delete Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
