'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  RefreshCw,
  Plus,
  Download,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Edit2,
  Trash2,
  Power,
  History,
  ShieldCheck,
  Send,
  MoreVertical,
  X,
  Copy,
  Check,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Package,
  Calendar,
  Layers,
  Cpu,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { ProductMasterRecord } from '@/service/api/superAdminService';
import { SearchableSelect } from '@/components/ui/searchable-select';
import {
  PRODUCT_CATEGORIES,
  PRODUCT_STATUSES,
  PRODUCT_REGIONS,
  UserRole,
  ROLE_PERMISSIONS,
  getModuleMeta,
} from './productTypes';

interface ProductListTableProps {
  products: ProductMasterRecord[];
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onAddProduct: () => void;
  onViewProduct: (product: ProductMasterRecord) => void;
  onEditProduct: (product: ProductMasterRecord) => void;
  onDeactivateProduct: (product: ProductMasterRecord) => void;
  onOpenHistory: (product: ProductMasterRecord) => void;
  onOpenApproval: (product: ProductMasterRecord) => void;
  onDeleteProduct: (product: ProductMasterRecord) => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

type SortField =
  | 'product_code'
  | 'product_name'
  | 'category'
  | 'status'
  | 'editions_count'
  | 'modules_count'
  | 'updated_at'
  | 'display_order';

export function ProductListTable({
  products,
  currentRole,
  onRoleChange,
  onAddProduct,
  onViewProduct,
  onEditProduct,
  onDeactivateProduct,
  onOpenHistory,
  onOpenApproval,
  onDeleteProduct,
  onRefresh,
  isLoading = false,
}: ProductListTableProps) {
  const permissions = ROLE_PERMISSIONS[currentRole];

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all'); // 'all' | 'last7' | 'last30' | 'thisYear'
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Server-side / Client Pagination & Sorting State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<SortField>('display_order');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Copy state
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Copy product code to clipboard
  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Copied ${code} to clipboard`);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search by name, code, category, description, and website URL
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchCode = p.product_code?.toLowerCase().includes(q);
        const matchName = p.product_name?.toLowerCase().includes(q);
        const matchCat = p.category?.toLowerCase().includes(q);
        const matchDesc = p.description?.toLowerCase().includes(q);
        const matchUrl = p.website_url?.toLowerCase().includes(q);
        if (!matchCode && !matchName && !matchCat && !matchDesc && !matchUrl) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== 'all' && p.status !== statusFilter) {
        return false;
      }

      // Category filter
      if (categoryFilter !== 'all' && p.category !== categoryFilter) {
        return false;
      }

      // Region filter
      if (regionFilter !== 'all' && p.region !== regionFilter) {
        return false;
      }

      // Date filter
      if (dateFilter !== 'all') {
        const itemDate = new Date(p.updated_at || p.created_at).getTime();
        const now = Date.now();
        if (dateFilter === 'last7' && now - itemDate > 7 * 24 * 60 * 60 * 1000) return false;
        if (dateFilter === 'last30' && now - itemDate > 30 * 24 * 60 * 60 * 1000) return false;
        if (dateFilter === 'thisYear' && new Date(itemDate).getFullYear() !== new Date().getFullYear())
          return false;
      }

      return true;
    });
  }, [products, searchQuery, statusFilter, categoryFilter, regionFilter, dateFilter]);

  // Sort Logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    list.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === 'editions_count') {
        valA = a.editions_count ?? a.editions?.length ?? 0;
        valB = b.editions_count ?? b.editions?.length ?? 0;
      } else if (sortField === 'modules_count') {
        valA = a.modules_count ?? a.modules?.length ?? 0;
        valB = b.modules_count ?? b.modules?.length ?? 0;
      } else if (sortField === 'updated_at') {
        valA = new Date(a.updated_at || a.created_at).getTime();
        valB = new Date(b.updated_at || b.created_at).getTime();
      }

      if (valA === valB) return 0;
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;

      if (typeof valA === 'string') {
        return sortOrder === 'asc'
          ? valA.localeCompare(String(valB))
          : String(valB).localeCompare(valA);
      }

      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });
    return list;
  }, [filteredProducts, sortField, sortOrder]);

  // Pagination Logic
  const totalRecords = sortedProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + pageSize);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/60 ml-1" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="h-3.5 w-3.5 text-primary ml-1" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-primary ml-1" />
    );
  };

  const hasActiveFilters =
    statusFilter !== 'all' ||
    categoryFilter !== 'all' ||
    regionFilter !== 'all' ||
    dateFilter !== 'all' ||
    Boolean(searchQuery.trim());

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setRegionFilter('all');
    setDateFilter('all');
    setPage(1);
  };

  // Permission-Controlled Export
  const handleExport = async (format: 'xlsx' | 'csv' | 'pdf') => {
    if (!permissions.canExport) {
      toast.error('Permission denied: Your current role does not have export rights.');
      return;
    }

    const rows = sortedProducts.map((p, idx) => ({
      '#': idx + 1,
      'Product Code': p.product_code,
      'Product Name': p.product_name,
      Category: p.category,
      Status: p.status,
      'Approval Status': p.approval_status || 'Approved',
      Editions: p.editions?.join(', ') || `${p.editions_count || 0} Editions`,
      Modules: p.modules?.join(', ') || `${p.modules_count || 0} Modules`,
      'Default Edition': p.default_edition || '',
      Region: p.region || 'Global',
      'Display Order': p.display_order,
      'Website URL': p.website_url || '',
      'Last Updated': new Date(p.updated_at).toLocaleDateString(),
    }));

    if (format === 'xlsx') {
      try {
        const XLSX = await import('xlsx');
        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Product Master');
        XLSX.writeFile(workbook, `Product_Master_${new Date().toISOString().slice(0, 10)}.xlsx`);
        toast.success('Product Master Excel report generated successfully!');
      } catch (err) {
        toast.error('Failed to export to Excel.');
      }
    } else if (format === 'csv') {
      const headers = Object.keys(rows[0] || {});
      const csvContent = [
        headers.join(','),
        ...rows.map((r) =>
          headers.map((h) => `"${String((r as any)[h] || '').replace(/"/g, '""')}"`).join(',')
        ),
      ].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Product_Master_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Product Master CSV file downloaded successfully!');
    } else if (format === 'pdf') {
      try {
        const { default: jsPDF } = await import('jspdf');
        const { default: autoTable } = await import('jspdf-autotable');
        const doc = new jsPDF('landscape');
        doc.setFontSize(14);
        doc.text('PEGATTO SuperAdmin - Product Master Catalog', 14, 15);
        doc.setFontSize(9);
        doc.text(`Generated on: ${new Date().toLocaleString()} · Role: ${currentRole}`, 14, 22);

        autoTable(doc, {
          startY: 28,
          head: [
            ['Code', 'Product Name', 'Category', 'Status', 'Editions', 'Modules', 'Order', 'Last Updated'],
          ],
          body: sortedProducts.map((p) => [
            p.product_code,
            p.product_name,
            p.category,
            p.status,
            `${p.editions_count || p.editions?.length || 0}`,
            `${p.modules_count || p.modules?.length || 0}`,
            `#${p.display_order}`,
            new Date(p.updated_at).toLocaleDateString(),
          ]),
          styles: { fontSize: 8 },
          headStyles: { fillColor: [5, 101, 253] },
        });

        doc.save(`Product_Master_${new Date().toISOString().slice(0, 10)}.pdf`);
        toast.success('Product Master PDF generated successfully!');
      } catch (err) {
        toast.error('Failed to export to PDF.');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return (
          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 gap-1.5 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </Badge>
        );
      case 'Inactive':
        return (
          <Badge variant="destructive" className="gap-1.5 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            Inactive
          </Badge>
        );
      case 'Under Review':
        return (
          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 gap-1.5 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Under Review
          </Badge>
        );
      case 'Draft':
        return (
          <Badge variant="outline" className="gap-1.5 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            Draft
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Toolbar Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl border bg-card shadow-xs">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Search by code, name, category, url, description..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="text-xs pl-9 pr-8 h-9"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Action & Filter Controls */}
          <div className="flex items-center gap-2 flex-wrap justify-between md:justify-end">
            {/* Filter Toggle Button */}
            <Button
              variant={isFilterOpen || hasActiveFilters ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="gap-1.5 text-xs h-9"
            >
              <Filter className="h-3.5 w-3.5" />
              Filters
              {hasActiveFilters && (
                <span className="h-2 w-2 rounded-full bg-primary ml-0.5" />
              )}
            </Button>

            {/* Role Switcher Pill (Requirement 7: Role-Based Action Visibility) */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border bg-muted/30 text-xs">
              <span className="text-[11px] text-muted-foreground hidden sm:inline">Role:</span>
              <select
                value={currentRole}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
                className="bg-transparent font-semibold text-foreground text-xs focus:outline-none cursor-pointer"
              >
                <option value="SuperAdmin">SuperAdmin (Full)</option>
                <option value="Product Manager">Product Manager</option>
                <option value="Operations Manager">Operations Manager</option>
                <option value="Auditor">Auditor (Read-Only)</option>
              </select>
            </div>

            {/* Export Dropdown (Requirement 8) */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!permissions.canExport}
                    className="gap-1.5 text-xs h-9"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Export
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="text-xs">
                <DropdownMenuItem onClick={() => handleExport('xlsx')} className="gap-2 cursor-pointer">
                  Export to Excel (.xlsx)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('csv')} className="gap-2 cursor-pointer">
                  Export to CSV (.csv)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('pdf')} className="gap-2 cursor-pointer">
                  Export to PDF (.pdf)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Add Product Button (Single Primary Button) */}
            <Tooltip>
              <TooltipTrigger
                render={
                  <span>
                    <Button
                      size="sm"
                      onClick={onAddProduct}
                      disabled={!permissions.canCreate}
                      className="gap-1.5 text-xs h-9 shadow-xs"
                    >
                      <Plus className="h-4 w-4" />
                      Add Product
                    </Button>
                  </span>
                }
              />
              {!permissions.canCreate && (
                <TooltipContent>
                  <p className="text-xs">
                    Role restricted: Requires SuperAdmin or Product Manager rights
                  </p>
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </div>

        {/* Expandable Filter Panel */}
        {isFilterOpen && (
          <div className="p-4 rounded-xl border bg-muted/20 space-y-3 animate-in fade-in-50 duration-200">
            <div className="flex items-center justify-between pb-2 border-b">
              <span className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-primary" />
                Advanced Filters (Searchable)
              </span>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-xs text-muted-foreground hover:text-foreground h-7 px-2"
                >
                  Reset All Filters
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Status Filter (Searchable) */}
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-muted-foreground">Status</label>
                <SearchableSelect
                  options={[
                    { value: 'all', label: 'All Statuses' },
                    ...PRODUCT_STATUSES.map((st) => ({ value: st, label: st })),
                  ]}
                  value={statusFilter}
                  onChange={(val) => {
                    setStatusFilter(val);
                    setPage(1);
                  }}
                  placeholder="Filter by Status..."
                  triggerClassName="flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-2.5 py-1.5 text-xs outline-none"
                />
              </div>

              {/* Category Filter (Searchable) */}
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-muted-foreground">Category</label>
                <SearchableSelect
                  options={[
                    { value: 'all', label: 'All Categories' },
                    ...PRODUCT_CATEGORIES.map((cat) => ({ value: cat, label: cat })),
                  ]}
                  value={categoryFilter}
                  onChange={(val) => {
                    setCategoryFilter(val);
                    setPage(1);
                  }}
                  placeholder="Filter by Category..."
                  triggerClassName="flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-2.5 py-1.5 text-xs outline-none"
                />
              </div>

              {/* Region Filter (Searchable) */}
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-muted-foreground">Region</label>
                <SearchableSelect
                  options={[
                    { value: 'all', label: 'All Regions' },
                    ...PRODUCT_REGIONS.map((r) => ({ value: r, label: r })),
                  ]}
                  value={regionFilter}
                  onChange={(val) => {
                    setRegionFilter(val);
                    setPage(1);
                  }}
                  placeholder="Filter by Region..."
                  triggerClassName="flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-2.5 py-1.5 text-xs outline-none"
                />
              </div>

              {/* Date Filter (Searchable) */}
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-muted-foreground">Date Modified</label>
                <SearchableSelect
                  options={[
                    { value: 'all', label: 'All Time' },
                    { value: 'last7', label: 'Last 7 Days' },
                    { value: 'last30', label: 'Last 30 Days' },
                    { value: 'thisYear', label: 'This Year' },
                  ]}
                  value={dateFilter}
                  onChange={(val) => {
                    setDateFilter(val);
                    setPage(1);
                  }}
                  placeholder="Filter by Date..."
                  triggerClassName="flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-2.5 py-1.5 text-xs outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-muted-foreground text-[11px]">Active Filters:</span>
            {searchQuery && (
              <Badge variant="secondary" className="gap-1 text-[11px] py-0.5">
                Search: "{searchQuery}"
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery('')} />
              </Badge>
            )}
            {statusFilter !== 'all' && (
              <Badge variant="secondary" className="gap-1 text-[11px] py-0.5">
                Status: {statusFilter}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setStatusFilter('all')} />
              </Badge>
            )}
            {categoryFilter !== 'all' && (
              <Badge variant="secondary" className="gap-1 text-[11px] py-0.5">
                Category: {categoryFilter}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setCategoryFilter('all')} />
              </Badge>
            )}
            {regionFilter !== 'all' && (
              <Badge variant="secondary" className="gap-1 text-[11px] py-0.5">
                Region: {regionFilter}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setRegionFilter('all')} />
              </Badge>
            )}
            {dateFilter !== 'all' && (
              <Badge variant="secondary" className="gap-1 text-[11px] py-0.5">
                Date: {dateFilter}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setDateFilter('all')} />
              </Badge>
            )}
            <button
              type="button"
              onClick={resetFilters}
              className="text-[11px] text-primary hover:underline font-medium ml-1"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Data Table Container */}
        <div className="rounded-xl border bg-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              {/* Table Header: Columns: Product Code, Product Name, Category, Status, Editions, Modules, Last Updated, Actions */}
              <thead className="bg-muted/50 border-b text-muted-foreground font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  {/* Order */}
                  <th
                    scope="col"
                    className="py-3 px-3 w-12 text-center cursor-pointer hover:bg-muted/80 transition-colors"
                    onClick={() => handleSort('display_order')}
                  >
                    <div className="flex items-center justify-center">
                      #
                      {getSortIcon('display_order')}
                    </div>
                  </th>

                  {/* Product Code */}
                  <th
                    scope="col"
                    className="py-3 px-4 cursor-pointer hover:bg-muted/80 transition-colors"
                    onClick={() => handleSort('product_code')}
                  >
                    <div className="flex items-center">
                      Product Code
                      {getSortIcon('product_code')}
                    </div>
                  </th>

                  {/* Product Name */}
                  <th
                    scope="col"
                    className="py-3 px-4 cursor-pointer hover:bg-muted/80 transition-colors"
                    onClick={() => handleSort('product_name')}
                  >
                    <div className="flex items-center">
                      Product Name
                      {getSortIcon('product_name')}
                    </div>
                  </th>

                  {/* Category */}
                  <th
                    scope="col"
                    className="py-3 px-4 cursor-pointer hover:bg-muted/80 transition-colors"
                    onClick={() => handleSort('category')}
                  >
                    <div className="flex items-center">
                      Category
                      {getSortIcon('category')}
                    </div>
                  </th>

                  {/* Status */}
                  <th
                    scope="col"
                    className="py-3 px-4 cursor-pointer hover:bg-muted/80 transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      {getSortIcon('status')}
                    </div>
                  </th>

                  {/* Editions */}
                  <th
                    scope="col"
                    className="py-3 px-4 cursor-pointer hover:bg-muted/80 transition-colors"
                    onClick={() => handleSort('editions_count')}
                  >
                    <div className="flex items-center">
                      Editions
                      {getSortIcon('editions_count')}
                    </div>
                  </th>

                  {/* Modules */}
                  <th
                    scope="col"
                    className="py-3 px-4 cursor-pointer hover:bg-muted/80 transition-colors"
                    onClick={() => handleSort('modules_count')}
                  >
                    <div className="flex items-center">
                      Modules
                      {getSortIcon('modules_count')}
                    </div>
                  </th>

                  {/* Last Updated */}
                  <th
                    scope="col"
                    className="py-3 px-4 cursor-pointer hover:bg-muted/80 transition-colors"
                    onClick={() => handleSort('updated_at')}
                  >
                    <div className="flex items-center">
                      Last Updated
                      {getSortIcon('updated_at')}
                    </div>
                  </th>

                  {/* Action Column */}
                  <th scope="col" className="py-3 px-4 text-right w-28">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-border/60">
                {paginatedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-muted-foreground">
                      <Package className="h-10 w-10 mx-auto text-muted-foreground/40 mb-2" />
                      <p className="text-sm font-semibold text-foreground">No Products Found</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {hasActiveFilters
                          ? 'Try clearing applied filters or searching with a different term.'
                          : 'Get started by creating your first product in the master catalog.'}
                      </p>
                      {hasActiveFilters ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={resetFilters}
                          className="mt-3 text-xs"
                        >
                          Reset Filters
                        </Button>
                      ) : permissions.canCreate ? (
                        <Button size="sm" onClick={onAddProduct} className="mt-3 text-xs">
                          <Plus className="h-3.5 w-3.5 mr-1" />
                          Add Product
                        </Button>
                      ) : null}
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((product) => {
                    const editionsCount = product.editions_count ?? product.editions?.length ?? 0;
                    const modulesCount = product.modules_count ?? product.modules?.length ?? 0;

                    return (
                      <tr
                        key={product.id}
                        onClick={() => onViewProduct(product)}
                        className="hover:bg-muted/40 transition-colors cursor-pointer group"
                      >
                        {/* Order */}
                        <td className="py-3.5 px-3 text-center font-mono text-muted-foreground text-[11px]">
                          {product.display_order}
                        </td>

                        {/* Product Code */}
                        <td className="py-3.5 px-4 font-mono font-medium text-foreground">
                          <div className="flex items-center gap-2">
                            <span className="bg-muted px-2 py-0.5 rounded border border-border/80 text-[11px] font-semibold">
                              {product.product_code}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleCopyCode(product.product_code, e)}
                              className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Copy code"
                            >
                              {copiedCode === product.product_code ? (
                                <Check className="h-3.5 w-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Product Name */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 overflow-hidden shadow-2xs">
                              {product.product_icon ? (
                                <img
                                  src={product.product_icon}
                                  alt={product.product_name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Package className="h-4 w-4" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-foreground truncate max-w-[220px]">
                                {product.product_name}
                              </p>
                              {product.website_url && (
                                <span className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-0.5 truncate max-w-[200px]">
                                  {product.website_url.replace(/^https?:\/\//, '')}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4">
                          <Badge variant="secondary" className="text-[11px] font-normal">
                            {product.category}
                          </Badge>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col gap-1 items-start">
                            {getStatusBadge(product.status)}
                            {product.approval_status === 'Pending Approval' && (
                              <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium flex items-center gap-0.5">
                                <Sparkles className="h-2.5 w-2.5" />
                                Awaiting Approval
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Editions */}
                        <td className="py-3.5 px-4">
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <div className="flex items-center gap-1.5 cursor-help">
                                  <Badge variant="outline" className="text-[11px] gap-1 font-normal">
                                    <Layers className="h-3 w-3 text-muted-foreground" />
                                    {editionsCount} {editionsCount === 1 ? 'Tier' : 'Tiers'}
                                  </Badge>
                                </div>
                              }
                            />
                            <TooltipContent>
                              <p className="text-xs font-semibold mb-1">Configured Editions:</p>
                              <ul className="text-xs list-disc pl-3 space-y-0.5">
                                {product.editions?.map((ed, idx) => (
                                  <li key={idx}>
                                    {ed} {ed === product.default_edition && '(Default)'}
                                  </li>
                                )) || <li>None defined</li>}
                              </ul>
                            </TooltipContent>
                          </Tooltip>
                        </td>

                        {/* Modules */}
                        <td className="py-3.5 px-4">
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <div className="flex items-center gap-1.5 cursor-help">
                                  <Badge variant="outline" className="text-[11px] gap-1 font-normal">
                                    <Cpu className="h-3 w-3 text-muted-foreground" />
                                    {modulesCount} {modulesCount === 1 ? 'Module' : 'Modules'}
                                  </Badge>
                                </div>
                              }
                            />
                            <TooltipContent className="max-w-xs p-3">
                              <p className="text-xs font-semibold mb-2">Bundled Functional Modules ({modulesCount}):</p>
                              <div className="flex flex-wrap gap-1 max-h-48 overflow-y-auto">
                                {product.modules?.map((m, idx) => {
                                  const meta = getModuleMeta(m);
                                  return (
                                    <span
                                      key={idx}
                                      className={`text-[10px] px-2 py-0.5 rounded-md border font-medium flex items-center gap-1 ${meta.badgeClass}`}
                                    >
                                      <span className={`h-1.5 w-1.5 rounded-full ${meta.dotColor}`} />
                                      {m}
                                    </span>
                                  );
                                }) || <span className="text-xs text-muted-foreground">None linked</span>}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </td>

                        {/* Last Updated */}
                        <td className="py-3.5 px-4 text-muted-foreground text-[11px] font-mono">
                          {new Date(product.updated_at || product.created_at).toLocaleDateString()}
                        </td>

                        {/* Actions */}
                        <td
                          className="py-3.5 px-4 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1">
                            {/* View Button */}
                            <Tooltip>
                              <TooltipTrigger
                                render={
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onViewProduct(product)}
                                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                  >
                                    <Eye className="h-3.5 w-3.5" />
                                  </Button>
                                }
                              />
                              <TooltipContent>View Details</TooltipContent>
                            </Tooltip>

                            {/* Edit Button */}
                            <Tooltip>
                              <TooltipTrigger
                                render={
                                  <span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => onEditProduct(product)}
                                      disabled={!permissions.canEdit}
                                      className="h-7 w-7 text-muted-foreground hover:text-primary"
                                    >
                                      <Edit2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </span>
                                }
                              />
                              <TooltipContent>
                                {permissions.canEdit ? 'Edit Product' : 'Role Restricted'}
                              </TooltipContent>
                            </Tooltip>

                            {/* 3-dots Menu for Deactivate, History, Approval, Delete */}
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                render={
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                  >
                                    <MoreVertical className="h-3.5 w-3.5" />
                                  </Button>
                                }
                              />
                              <DropdownMenuContent align="end" className="text-xs w-48">
                                <DropdownMenuItem
                                  onClick={() => onViewProduct(product)}
                                  className="gap-2 cursor-pointer"
                                >
                                  <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                                  Inspect Details
                                </DropdownMenuItem>

                                {permissions.canEdit && (
                                  <DropdownMenuItem
                                    onClick={() => onEditProduct(product)}
                                    className="gap-2 cursor-pointer"
                                  >
                                    <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                                    Edit Specifications
                                  </DropdownMenuItem>
                                )}

                                <DropdownMenuItem
                                  onClick={() => onOpenHistory(product)}
                                  className="gap-2 cursor-pointer"
                                >
                                  <History className="h-3.5 w-3.5 text-muted-foreground" />
                                  Status & Audit History
                                </DropdownMenuItem>

                                {/* Approval Action */}
                                {(permissions.canApprove || permissions.canSubmitApproval) && (
                                  <DropdownMenuItem
                                    onClick={() => onOpenApproval(product)}
                                    className="gap-2 cursor-pointer"
                                  >
                                    <ShieldCheck className="h-3.5 w-3.5 text-purple-600" />
                                    {currentRole === 'SuperAdmin' &&
                                      product.approval_status === 'Pending Approval'
                                      ? 'Review Approval'
                                      : 'Submit for Approval'}
                                  </DropdownMenuItem>
                                )}

                                <DropdownMenuSeparator />

                                {/* Permitted Deactivate (Requirement 4 & 9) */}
                                {permissions.canDeactivate && (
                                  <DropdownMenuItem
                                    onClick={() => onDeactivateProduct(product)}
                                    className={`gap-2 cursor-pointer ${product.status === 'Active'
                                        ? 'text-rose-600 dark:text-rose-400'
                                        : 'text-emerald-600 dark:text-emerald-400'
                                      }`}
                                  >
                                    <Power className="h-3.5 w-3.5" />
                                    {product.status === 'Active'
                                      ? 'Deactivate Product...'
                                      : 'Activate Product...'}
                                  </DropdownMenuItem>
                                )}

                                {/* Delete Draft */}
                                {permissions.canDelete && product.status === 'Draft' && (
                                  <DropdownMenuItem
                                    onClick={() => onDeleteProduct(product)}
                                    className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Delete Draft
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls (Requirement 3: Server-side pagination & sorting) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t bg-card text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>
                Showing <strong>{totalRecords === 0 ? 0 : startIndex + 1}</strong> to{' '}
                <strong>{Math.min(startIndex + pageSize, totalRecords)}</strong> of{' '}
                <strong>{totalRecords}</strong> records
              </span>

              <span className="hidden sm:inline">·</span>

              <div className="flex items-center gap-1.5 hidden sm:flex">
                <span>Rows per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="rounded border border-input bg-background px-2 py-1 text-xs focus:outline-none"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(1)}
                disabled={currentPage <= 1}
                className="h-8 w-8"
                title="First Page"
              >
                <ChevronsLeft className="h-3.5 w-3.5" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="h-8 w-8"
                title="Previous Page"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>

              <span className="px-2 text-muted-foreground font-medium">
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
              </span>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="h-8 w-8"
                title="Next Page"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(totalPages)}
                disabled={currentPage >= totalPages}
                className="h-8 w-8"
                title="Last Page"
              >
                <ChevronsRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
