'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Menu as MenuIcon,
  Plus,
  RefreshCw,
  Edit2,
  Trash2,
  ChevronRight,
  ChevronDown,
  Folder,
  FileText,
  Shield,
  Layers,
  ArrowRight,
  CheckCircle2,
  XCircle,
  FolderPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { toast } from 'sonner';
import {
  useGetProductDropdownQuery,
  useGetMenuListByProductQuery,
  useCreateMenuMutation,
  useUpdateMenuMutation,
  useDeleteMenuMutation,
  ProductMenuRecord,
} from '@/service/api/superAdminService';

const AVAILABLE_ACTIONS = [
  { key: 'create', label: 'Create' },
  { key: 'edit', label: 'Edit' },
  { key: 'delete', label: 'Delete' },
  { key: 'overview', label: 'Overview' },
  { key: 'import', label: 'Import' },
  { key: 'export', label: 'Export' },
];

const sanitizeCodeKey = (name: string) => {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/(^_+|_+$)/g, '');
};

export default function ProductMenuSetupPage() {
  const { data: products = [], isLoading: isLoadingProducts } = useGetProductDropdownQuery();
  const [selectedProduct, setSelectedProduct] = useState<string>('SuperAdmin Cloud');

  const {
    data: menuList = [],
    isLoading: isLoadingMenus,
    refetch,
    isFetching,
  } = useGetMenuListByProductQuery(selectedProduct);

  const [createMenu, { isLoading: isCreating }] = useCreateMenuMutation();
  const [updateMenu, { isLoading: isUpdating }] = useUpdateMenuMutation();
  const [deleteMenu, { isLoading: isDeleting }] = useDeleteMenuMutation();

  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<ProductMenuRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  // Form State - strictly blank initial values (NO static fallback)
  const initialForm = {
    name: '',
    code: '',
    type: 'module' as 'module' | 'submodule' | 'form',
    parent: '',
    display_order: 1,
    is_active: true,
    actions: {
      create: false,
      edit: false,
      delete: false,
      overview: true,
      import: false,
      export: false,
    } as Record<string, boolean>,
  };

  const [formData, setFormData] = useState(initialForm);

  const toggleExpand = (id: string | number) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Build tree hierarchy
  const menuTree = useMemo(() => {
    const list = Array.isArray(menuList) ? menuList : [];
    const map: Record<string, ProductMenuRecord & { children: ProductMenuRecord[] }> = {};
    const roots: (ProductMenuRecord & { children: ProductMenuRecord[] })[] = [];

    list.forEach((item) => {
      map[String(item.id)] = { ...item, children: [] };
    });

    list.forEach((item) => {
      const parentId = item.parent ? (typeof item.parent === 'object' ? item.parent.id : item.parent) : null;
      if (parentId && map[String(parentId)]) {
        map[String(parentId)].children.push(map[String(item.id)]);
      } else {
        roots.push(map[String(item.id)]);
      }
    });

    return roots;
  }, [menuList]);

  // List of potential parent modules
  const parentOptions = useMemo(() => {
    return (Array.isArray(menuList) ? menuList : []).filter(
      (m) => m.type === 'module' || !m.parent
    );
  }, [menuList]);

  const handleOpenCreate = (parentDefaultId?: string | number) => {
    setEditingNode(null);
    setFormData({
      ...initialForm,
      parent: parentDefaultId ? String(parentDefaultId) : '',
      type: parentDefaultId ? 'submodule' : 'module',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (node: ProductMenuRecord) => {
    setEditingNode(node);
    const parentId = node.parent ? (typeof node.parent === 'object' ? node.parent.id : node.parent) : '';
    setFormData({
      name: node.name || '',
      code: node.code || '',
      type: (node.type as any) || 'module',
      parent: String(parentId || ''),
      display_order: node.display_order || 1,
      is_active: node.is_active !== false,
      actions: node.actions || { ...initialForm.actions },
    });
    setIsFormOpen(true);
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      // Auto-generate code key only when creating new item
      code: editingNode ? prev.code : sanitizeCodeKey(name),
    }));
  };

  const handleActionToggle = (actionKey: string) => {
    setFormData((prev) => ({
      ...prev,
      actions: {
        ...prev.actions,
        [actionKey]: !prev.actions[actionKey],
      },
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Module / Menu name is required');
      return;
    }
    if (!formData.code.trim()) {
      toast.error('Module code key is required');
      return;
    }

    try {
      const payload: Partial<ProductMenuRecord> = {
        name: formData.name.trim(),
        code: formData.code.trim(),
        type: formData.type,
        parent: formData.parent ? Number(formData.parent) || formData.parent : null,
        display_order: Number(formData.display_order) || 1,
        is_active: formData.is_active,
        actions: formData.actions,
        product: selectedProduct,
      };

      if (editingNode) {
        await updateMenu({
          id: editingNode.id,
          ...payload,
        }).unwrap();
        toast.success('Menu updated successfully');
      } else {
        await createMenu(payload).unwrap();
        toast.success('Menu created successfully');
      }
      setIsFormOpen(false);
      refetch();
    } catch {
      toast.error('Failed to save menu node');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await deleteMenu({ id: deletingId }).unwrap();
      toast.success('Menu deleted successfully');
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
      refetch();
    } catch {
      toast.error('Failed to delete menu');
    }
  };

  const renderTreeItem = (node: ProductMenuRecord & { children?: ProductMenuRecord[] }, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = !!expandedNodes[String(node.id)];

    return (
      <div key={node.id} className="select-none">
        <div
          className={`flex items-center justify-between p-2.5 rounded-lg border border-transparent hover:border-border hover:bg-muted/30 transition-all ${
            level > 0 ? 'ml-6 border-l border-border/80' : 'bg-card'
          }`}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {hasChildren ? (
              <button
                type="button"
                onClick={() => toggleExpand(node.id)}
                className="p-1 text-muted-foreground hover:text-foreground rounded"
              >
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            ) : (
              <span className="w-6" />
            )}

            {node.type === 'module' ? (
              <Folder className="h-4 w-4 text-blue-600 shrink-0" />
            ) : node.type === 'submodule' ? (
              <Layers className="h-4 w-4 text-blue-600 shrink-0" />
            ) : (
              <FileText className="h-4 w-4 text-emerald-600 shrink-0" />
            )}

            <span className="font-medium text-sm text-foreground truncate">{node.name}</span>
            <code className="text-[11px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded font-mono">
              {node.code}
            </code>

            <Badge variant="outline" className="text-[10px] capitalize ml-1 font-normal">
              {node.type || 'module'}
            </Badge>

            {node.is_active !== false ? (
              <span className="flex items-center gap-1 text-[11px] text-emerald-600">
                <CheckCircle2 className="h-3 w-3" />
                Active
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <XCircle className="h-3 w-3" />
                Inactive
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleOpenCreate(node.id)}
              className="h-8 px-2 text-xs text-muted-foreground hover:text-blue-600 gap-1"
              title="Add Child Submodule"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Add Sub</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleOpenEdit(node)}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-blue-600"
              title="Edit Node"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setDeletingId(node.id);
                setIsDeleteDialogOpen(true);
              }}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-600"
              title="Delete Node"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="space-y-1 mt-1">
            {node.children!.map((child) => renderTreeItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <MenuIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              Product Menu Setup
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Configure hierarchical module menus, submodules, codes, and granular action permissions per product
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoadingMenus || isFetching}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
            onClick={() => handleOpenCreate()}
          >
            <Plus className="h-4 w-4" />
            Add Root Module
          </Button>
        </div>
      </div>

      {/* Product Selection Bar */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Label htmlFor="productSelect" className="text-sm font-semibold text-foreground whitespace-nowrap">
            Select Product:
          </Label>
          <select
            id="productSelect"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium w-full sm:w-64"
          >
            {products.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground self-end sm:self-auto">
          <span>Total Menus: {menuList.length}</span>
        </div>
      </div>

      {/* Menu Tree View Container */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-2">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-600" />
            <h2 className="text-sm font-semibold text-foreground">
              Module Hierarchy & Permissions Matrix ({selectedProduct})
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const all: Record<string, boolean> = {};
                menuList.forEach((m) => {
                  all[String(m.id)] = true;
                });
                setExpandedNodes(all);
              }}
              className="h-7 text-xs"
            >
              Expand All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpandedNodes({})}
              className="h-7 text-xs"
            >
              Collapse All
            </Button>
          </div>
        </div>

        {isLoadingMenus ? (
          <div className="py-12 text-center text-muted-foreground">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-600" />
            Loading menu structure...
          </div>
        ) : menuTree.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            No menus configured for {selectedProduct}. Click &quot;Add Root Module&quot; to begin.
          </div>
        ) : (
          <div className="space-y-1.5 pt-2">
            {menuTree.map((rootNode) => renderTreeItem(rootNode, 0))}
          </div>
        )}
      </div>

      {/* Add / Edit Menu Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editingNode ? <Edit2 className="h-5 w-5 text-blue-600" /> : <FolderPlus className="h-5 w-5 text-blue-600" />}
              {editingNode ? 'Edit Product Menu Node' : 'Add Product Menu Node'}
            </DialogTitle>
            <DialogDescription>
              Define module naming, key hierarchy, and granular CRUD permissions
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="name">
                  Menu / Module Name <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g. Lead Management"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="code">
                  Unique Code Key <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="code"
                  placeholder="e.g. lead_management"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="type">Menu Node Type</Label>
                <select
                  id="type"
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                >
                  <option value="module">Root Module</option>
                  <option value="submodule">Submodule</option>
                  <option value="form">Form Page</option>
                </select>
              </div>

              {formData.type !== 'module' && (
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="parent">Parent Module</Label>
                  <select
                    id="parent"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.parent}
                    onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                  >
                    <option value="">None (Top Level)</option>
                    {parentOptions.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.code})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  min={1}
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) || 1 })}
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-input text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="is_active" className="cursor-pointer text-sm font-normal">
                  Node is Active & Visible
                </Label>
              </div>
            </div>

            {/* Action Permissions */}
            <div className="pt-2 border-t border-border">
              <Label className="block mb-2 font-semibold">Available Actions & Permissions</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {AVAILABLE_ACTIONS.map((action) => {
                  const isChecked = !!formData.actions[action.key];
                  return (
                    <label
                      key={action.key}
                      className="flex items-center gap-2 p-2 rounded border border-border hover:bg-muted/40 cursor-pointer text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleActionToggle(action.key)}
                        className="h-3.5 w-3.5 rounded border-input text-blue-600 focus:ring-blue-500"
                      />
                      <span className={isChecked ? 'font-medium text-foreground' : 'text-muted-foreground'}>
                        {action.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                disabled={isCreating || isUpdating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isCreating || isUpdating}
              >
                {isCreating || isUpdating ? 'Saving...' : editingNode ? 'Update Menu' : 'Create Menu'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        title="Delete Menu Node"
        description="Are you sure you want to delete this menu module? Child submodules and action permissions will be affected."
      />
    </div>
  );
}
