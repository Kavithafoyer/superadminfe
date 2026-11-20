'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Package,
  Save,
  ArrowLeft,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Globe,
  ExternalLink,
  Layers,
  Cpu,
  Eye,
  Check,
  Send,
  Sparkles,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { ProductMasterRecord } from '@/service/api/superAdminService';
import { SearchableSelect } from '@/components/ui/searchable-select';
import {
  PRODUCT_CATEGORIES,
  PRODUCT_STATUSES,
  PRODUCT_REGIONS,
  DEFAULT_EDITION_OPTIONS,
  AVAILABLE_MODULES,
  MODULE_GROUPS,
  UserRole,
  ROLE_PERMISSIONS,
} from './productTypes';

interface ProductFormProps {
  initialData?: ProductMasterRecord | null;
  existingProducts: ProductMasterRecord[];
  isEdit?: boolean;
  currentRole: UserRole;
  onSave: (data: Partial<ProductMasterRecord>) => Promise<void> | void;
  onCancel: () => void;
  isSaving?: boolean;
}

export function ProductForm({
  initialData,
  existingProducts,
  isEdit = false,
  currentRole,
  onSave,
  onCancel,
  isSaving = false,
}: ProductFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form State
  const [productCode, setProductCode] = useState(initialData?.product_code || '');
  const [productName, setProductName] = useState(initialData?.product_name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState<string>(initialData?.category || PRODUCT_CATEGORIES[0]);
  const [productIcon, setProductIcon] = useState<string>(initialData?.product_icon || '');
  const [iconName, setIconName] = useState<string>(initialData?.icon_name || '');
  const [websiteUrl, setWebsiteUrl] = useState(initialData?.website_url || '');
  const [defaultEdition, setDefaultEdition] = useState<string>(
    initialData?.default_edition || DEFAULT_EDITION_OPTIONS[0]
  );
  const [status, setStatus] = useState<ProductMasterRecord['status']>(
    initialData?.status || 'Active'
  );
  const [displayOrder, setDisplayOrder] = useState<number>(
    initialData?.display_order !== undefined ? initialData.display_order : existingProducts.length + 1
  );
  const [region, setRegion] = useState<string>(initialData?.region || 'Global');

  // Multi-select for editions and modules
  const [selectedEditions, setSelectedEditions] = useState<string[]>(
    initialData?.editions && initialData.editions.length > 0
      ? initialData.editions
      : ['Standard', 'Professional', 'Enterprise']
  );
  const [selectedModules, setSelectedModules] = useState<string[]>(
    initialData?.modules && initialData.modules.length > 0
      ? initialData.modules
      : ['Inventory Control', 'Procurement', 'Ledger Accounting', 'Audit Reports']
  );

  // Approval flow switch
  const [submitForApproval, setSubmitForApproval] = useState(
    initialData?.approval_status === 'Pending Approval' || false
  );
  const [approvalNotes, setApprovalNotes] = useState(initialData?.approval_notes || '');

  // Validation & Duplicate Checking state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [codeDuplicate, setCodeDuplicate] = useState(false);
  const [nameDuplicate, setNameDuplicate] = useState(false);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);

  // Dirty state tracking for unsaved changes confirmation
  const [isDirty, setIsDirty] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  // Mark form as dirty when values change
  const markDirty = () => {
    if (!isDirty) setIsDirty(true);
  };

  // Real-time Duplicate Checking (Debounced)
  useEffect(() => {
    setIsCheckingDuplicate(true);
    const timer = setTimeout(() => {
      const trimmedCode = productCode.trim().toUpperCase();
      const trimmedName = productName.trim().toLowerCase();
      const currentId = initialData?.id;

      if (trimmedCode) {
        const foundCode = existingProducts.some(
          (p) => p.product_code.trim().toUpperCase() === trimmedCode && p.id !== currentId
        );
        setCodeDuplicate(foundCode);
      } else {
        setCodeDuplicate(false);
      }

      if (trimmedName) {
        const foundName = existingProducts.some(
          (p) => p.product_name.trim().toLowerCase() === trimmedName && p.id !== currentId
        );
        setNameDuplicate(foundName);
      } else {
        setNameDuplicate(false);
      }

      setIsCheckingDuplicate(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [productCode, productName, existingProducts, initialData?.id]);

  // Handle File Upload for Icon
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (PNG, JPG, SVG, WebP)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProductIcon(reader.result as string);
      setIconName(file.name);
      markDirty();
      toast.success(`Icon "${file.name}" uploaded successfully`);
    };
    reader.readAsDataURL(file);
  };

  const removeIcon = () => {
    setProductIcon('');
    setIconName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    markDirty();
  };

  // Toggle Edition
  const toggleEdition = (edition: string) => {
    markDirty();
    if (selectedEditions.includes(edition)) {
      if (selectedEditions.length === 1) {
        toast.error('A product must have at least one edition');
        return;
      }
      setSelectedEditions(selectedEditions.filter((e) => e !== edition));
      if (defaultEdition === edition) {
        const remaining = selectedEditions.filter((e) => e !== edition);
        setDefaultEdition(remaining[0] || '');
      }
    } else {
      setSelectedEditions([...selectedEditions, edition]);
    }
  };

  // Toggle Module
  const toggleModule = (moduleName: string) => {
    markDirty();
    if (selectedModules.includes(moduleName)) {
      setSelectedModules(selectedModules.filter((m) => m !== moduleName));
    } else {
      setSelectedModules([...selectedModules, moduleName]);
    }
  };

  // Validation Routine
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Product Code: Text, max 30, Required
    const trimmedCode = productCode.trim().toUpperCase();
    if (!trimmedCode) {
      newErrors.productCode = 'Product Code is required';
    } else if (trimmedCode.length > 30) {
      newErrors.productCode = 'Product Code must not exceed 30 characters';
    } else if (!/^[A-Z0-9_-]+$/i.test(trimmedCode)) {
      newErrors.productCode = 'Product Code can only contain letters, numbers, hyphens, and underscores';
    } else if (codeDuplicate) {
      newErrors.productCode = `Product Code "${trimmedCode}" is already in use by another product`;
    }

    // Product Name: Text, max 100, Required
    const trimmedName = productName.trim();
    if (!trimmedName) {
      newErrors.productName = 'Product Name is required';
    } else if (trimmedName.length > 100) {
      newErrors.productName = 'Product Name must not exceed 100 characters';
    } else if (trimmedName.length < 3) {
      newErrors.productName = 'Product Name must be at least 3 characters';
    } else if (nameDuplicate) {
      newErrors.productName = `Product Name "${trimmedName}" is already in use`;
    }

    // Description: Textarea, Required
    const trimmedDesc = description.trim();
    if (!trimmedDesc) {
      newErrors.description = 'Description is required';
    } else if (trimmedDesc.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    // Category: Dropdown, Required
    if (!category) {
      newErrors.category = 'Category is required';
    }

    // Website URL: URL, Optional
    if (websiteUrl.trim()) {
      try {
        const parsed = new URL(websiteUrl.trim());
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          newErrors.websiteUrl = 'URL must start with http:// or https://';
        }
      } catch {
        newErrors.websiteUrl = 'Please enter a valid URL (e.g. https://pegatto.com/product)';
      }
    }

    // Status: Dropdown, Required
    if (!status) {
      newErrors.status = 'Status is required';
    }

    // Display Order: Number, Required
    if (displayOrder === undefined || displayOrder === null || isNaN(displayOrder)) {
      newErrors.displayOrder = 'Display Order is required';
    } else if (displayOrder < 1) {
      newErrors.displayOrder = 'Display Order must be greater than or equal to 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please resolve form errors before saving.');
      return;
    }

    const finalStatus: ProductMasterRecord['status'] = submitForApproval
      ? 'Under Review'
      : status;

    const finalApprovalStatus: ProductMasterRecord['approval_status'] = submitForApproval
      ? 'Pending Approval'
      : initialData?.approval_status || (status === 'Active' ? 'Approved' : 'Draft');

    const payload: Partial<ProductMasterRecord> = {
      product_code: productCode.trim().toUpperCase(),
      product_name: productName.trim(),
      description: description.trim(),
      category,
      product_icon: productIcon,
      icon_name: iconName,
      website_url: websiteUrl.trim(),
      default_edition: defaultEdition,
      status: finalStatus,
      display_order: Number(displayOrder),
      region,
      editions: selectedEditions,
      editions_count: selectedEditions.length,
      modules: selectedModules,
      modules_count: selectedModules.length,
      approval_status: finalApprovalStatus,
      approval_notes: approvalNotes.trim() || undefined,
      submitted_for_approval: submitForApproval,
    };

    setIsDirty(false);
    await onSave(payload);
  };

  const handleBackClick = () => {
    if (isDirty) {
      setShowDiscardConfirm(true);
    } else {
      onCancel();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={handleBackClick}
            className="h-9 w-9 shrink-0 rounded-lg hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {isEdit ? 'Edit Product Master' : 'Create New Product'}
              </h1>
              {isEdit && (
                <Badge variant="outline" className="font-mono text-xs">
                  {initialData?.product_code}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isEdit
                ? 'Update master product attributes, editions, functional modules, and release states.'
                : 'Define a new master product for subscription provisioning and enterprise tenant deployments.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleBackClick} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={isSaving || codeDuplicate || nameDuplicate}
            className="gap-2 shadow-xs"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
        {/* Section 1: Basic Identity & Classification */}
        <Card className="shadow-xs">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              1. Product Identity & Category
            </CardTitle>
            <CardDescription className="text-xs">
              Essential identification codes, product title, and domain classification.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Product Code */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="productCode" className="text-xs font-semibold">
                    Product Code <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {productCode.length}/30
                  </span>
                </div>
                <div className="relative">
                  <Input
                    id="productCode"
                    placeholder="e.g. PRD-ERP-CORE"
                    value={productCode}
                    maxLength={30}
                    onChange={(e) => {
                      setProductCode(e.target.value.toUpperCase());
                      markDirty();
                      if (errors.productCode) setErrors({ ...errors, productCode: '' });
                    }}
                    className={`text-xs font-mono uppercase pr-8 ${errors.productCode || codeDuplicate ? 'border-destructive focus-visible:ring-destructive' : ''
                      }`}
                  />
                  {productCode && !codeDuplicate && !errors.productCode && (
                    <Check className="h-4 w-4 text-emerald-500 absolute right-2.5 top-2.5 pointer-events-none" />
                  )}
                </div>

                {/* Feedback badges */}
                {codeDuplicate ? (
                  <p className="text-[11px] text-destructive font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    Duplicate: Product Code "{productCode}" already exists.
                  </p>
                ) : errors.productCode ? (
                  <p className="text-[11px] text-destructive flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {errors.productCode}
                  </p>
                ) : productCode ? (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    Unique Product Code verified
                  </p>
                ) : (
                  <p className="text-[11px] text-muted-foreground">
                    Unique alphanumeric identifier (Max 30 chars).
                  </p>
                )}
              </div>

              {/* Product Name */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="productName" className="text-xs font-semibold">
                    Product Name <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-[11px] text-muted-foreground">
                    {productName.length}/100
                  </span>
                </div>
                <div className="relative">
                  <Input
                    id="productName"
                    placeholder="e.g. PEGATTO ERP Core"
                    value={productName}
                    maxLength={100}
                    onChange={(e) => {
                      setProductName(e.target.value);
                      markDirty();
                      if (errors.productName) setErrors({ ...errors, productName: '' });
                    }}
                    className={`text-xs pr-8 ${errors.productName || nameDuplicate ? 'border-destructive focus-visible:ring-destructive' : ''
                      }`}
                  />
                  {productName && !nameDuplicate && !errors.productName && (
                    <Check className="h-4 w-4 text-emerald-500 absolute right-2.5 top-2.5 pointer-events-none" />
                  )}
                </div>

                {nameDuplicate ? (
                  <p className="text-[11px] text-destructive font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    Duplicate: Product Name "{productName}" already exists.
                  </p>
                ) : errors.productName ? (
                  <p className="text-[11px] text-destructive flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {errors.productName}
                  </p>
                ) : (
                  <p className="text-[11px] text-muted-foreground">
                    Official commercial product name (Max 100 chars).
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="description" className="text-xs font-semibold">
                  Description <span className="text-destructive">*</span>
                </Label>
                <span className="text-[11px] text-muted-foreground">
                  {description.length} chars
                </span>
              </div>
              <Textarea
                id="description"
                placeholder="Provide an executive summary of capabilities, target personas, and functional scope..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  markDirty();
                  if (errors.description) setErrors({ ...errors, description: '' });
                }}
                className={`text-xs resize-y min-h-[90px] ${errors.description ? 'border-destructive focus-visible:ring-destructive' : ''
                  }`}
              />
              {errors.description && (
                <p className="text-[11px] text-destructive flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Category, Display Order & Region */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="category" className="text-xs font-semibold">
                  Category <span className="text-destructive">*</span>
                </Label>
                <SearchableSelect
                  options={PRODUCT_CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
                  value={category}
                  onChange={(val) => {
                    setCategory(val);
                    markDirty();
                  }}
                  placeholder="Search category..."
                  triggerClassName="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-xs outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="displayOrder" className="text-xs font-semibold">
                  Display Order <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="displayOrder"
                  type="number"
                  min={1}
                  value={displayOrder}
                  onChange={(e) => {
                    setDisplayOrder(parseInt(e.target.value) || 1);
                    markDirty();
                    if (errors.displayOrder) setErrors({ ...errors, displayOrder: '' });
                  }}
                  className={`text-xs font-mono h-9 ${errors.displayOrder ? 'border-destructive focus-visible:ring-destructive' : ''
                    }`}
                />
                {errors.displayOrder && (
                  <p className="text-[11px] text-destructive">{errors.displayOrder}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="region" className="text-xs font-semibold">
                  Target Region
                </Label>
                <SearchableSelect
                  options={PRODUCT_REGIONS.map((r) => ({ value: r, label: r }))}
                  value={region}
                  onChange={(val) => {
                    setRegion(val);
                    markDirty();
                  }}
                  placeholder="Search region..."
                  triggerClassName="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-xs outline-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Media, Assets & Website */}
        <Card className="shadow-xs">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              2. Product Icon & Web Portal
            </CardTitle>
            <CardDescription className="text-xs">
              Visual brand assets and external documentation/landing page links.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Product Icon Upload Dropzone */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Product Icon (File, Max 2MB)</Label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {productIcon ? (
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                    <div className="h-12 w-12 rounded-lg bg-background border flex items-center justify-center overflow-hidden shrink-0">
                      <img src={productIcon} alt="Icon Preview" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">
                        {iconName || 'Uploaded Icon'}
                      </p>
                      <p className="text-[11px] text-muted-foreground">Ready for catalog display</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={removeIcon}
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-all group"
                  >
                    <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary mx-auto mb-1 transition-colors" />
                    <p className="text-xs font-medium text-foreground">Click to upload product icon</p>
                    <p className="text-[11px] text-muted-foreground">PNG, JPG, SVG, WebP (Max 2MB)</p>
                  </div>
                )}
              </div>

              {/* Website URL */}
              <div className="space-y-1.5">
                <Label htmlFor="websiteUrl" className="text-xs font-semibold">
                  Website Landing URL
                </Label>
                <div className="relative">
                  <Input
                    id="websiteUrl"
                    type="url"
                    placeholder="https://pegatto.com/products/erp-core"
                    value={websiteUrl}
                    onChange={(e) => {
                      setWebsiteUrl(e.target.value);
                      markDirty();
                      if (errors.websiteUrl) setErrors({ ...errors, websiteUrl: '' });
                    }}
                    className={`text-xs pr-8 ${errors.websiteUrl ? 'border-destructive' : ''}`}
                  />
                  {websiteUrl && (
                    <a
                      href={websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-primary"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
                {errors.websiteUrl ? (
                  <p className="text-[11px] text-destructive">{errors.websiteUrl}</p>
                ) : (
                  <p className="text-[11px] text-muted-foreground">
                    Public product landing page or documentation portal.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Editions & Functional Modules */}
        <Card className="shadow-xs">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              3. Editions & Modules Configuration
            </CardTitle>
            <CardDescription className="text-xs">
              Select default edition tiers and enabled functional modules.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Default Edition Dropdown (Searchable) */}
            <div className="space-y-1.5 max-w-sm">
              <Label htmlFor="defaultEdition" className="text-xs font-semibold">
                Default Edition Tier
              </Label>
              <SearchableSelect
                options={DEFAULT_EDITION_OPTIONS.map((ed) => ({ value: ed, label: ed }))}
                value={defaultEdition}
                onChange={(val) => {
                  setDefaultEdition(val);
                  markDirty();
                }}
                placeholder="Select default edition..."
                triggerClassName="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-xs outline-none"
              />
              <p className="text-[11px] text-muted-foreground">
                Pre-selected edition tier presented during new customer sign-up.
              </p>
            </div>

            {/* Supported Editions Chips */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">
                Supported Product Editions ({selectedEditions.length})
              </Label>
              <div className="flex flex-wrap gap-2">
                {DEFAULT_EDITION_OPTIONS.map((edition) => {
                  const isSelected = selectedEditions.includes(edition);
                  return (
                    <button
                      key={edition}
                      type="button"
                      onClick={() => toggleEdition(edition)}
                      className={`text-xs px-3.5 py-1.5 rounded-lg border font-medium transition-all flex items-center gap-1.5 ${isSelected
                          ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                          : 'bg-background hover:bg-muted text-muted-foreground'
                        }`}
                    >
                      {isSelected && <Check className="h-3.5 w-3.5" />}
                      {edition}
                      {edition === defaultEdition && isSelected && (
                        <span className="text-[10px] bg-background/25 px-1.5 py-0.2 rounded font-semibold">Default</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Linked Functional Modules by Domain (Vibrant & Colorful) */}
            <div className="space-y-4 pt-3 border-t">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <Label className="text-xs font-semibold">
                    Linked Functional Modules ({selectedModules.length} Selected)
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    Modules are organized by functional domain. Click any module to toggle inclusion.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedModules([...AVAILABLE_MODULES]);
                      markDirty();
                    }}
                    className="text-[11px] h-7 px-2.5 text-primary hover:text-primary/80"
                  >
                    Select All
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedModules([]);
                      markDirty();
                    }}
                    className="text-[11px] h-7 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    Clear All
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {MODULE_GROUPS.map((group) => {
                  const selectedInGroup = group.modules.filter((m) => selectedModules.includes(m)).length;
                  const allSelected = selectedInGroup === group.modules.length;

                  return (
                    <div
                      key={group.category}
                      className="p-3.5 rounded-xl border bg-card space-y-2.5 transition-all hover:border-border hover:shadow-2xs"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-foreground flex items-center gap-1.5">
                          <span className={`h-2.5 w-2.5 rounded-full ${group.dotColor}`} />
                          {group.category}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {selectedInGroup}/{group.modules.length}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              if (allSelected) {
                                setSelectedModules(selectedModules.filter((m) => !group.modules.includes(m)));
                              } else {
                                const combined = Array.from(new Set([...selectedModules, ...group.modules]));
                                setSelectedModules(combined);
                              }
                              markDirty();
                            }}
                            className="text-[10px] text-primary hover:underline font-medium"
                          >
                            {allSelected ? 'Deselect all' : 'Select all'}
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {group.modules.map((mod) => {
                          const isSelected = selectedModules.includes(mod);
                          return (
                            <button
                              key={mod}
                              type="button"
                              onClick={() => toggleModule(mod)}
                              className={`text-[11px] px-2.5 py-1.5 rounded-lg border font-medium transition-all flex items-center gap-1.5 cursor-pointer ${isSelected
                                  ? group.activeClass
                                  : `${group.badgeClass} hover:opacity-85`
                                }`}
                            >
                              {isSelected ? (
                                <Check className="h-3 w-3 shrink-0" />
                              ) : (
                                <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${group.dotColor}`} />
                              )}
                              {mod}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Status, Governance & Approval */}
        <Card className="shadow-xs">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              4. Status & Approval Governance
            </CardTitle>
            <CardDescription className="text-xs">
              Production lifecycle state and SuperAdmin submission options.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Status Dropdown (Searchable) */}
              <div className="space-y-1.5">
                <Label htmlFor="status" className="text-xs font-semibold">
                  Master Status <span className="text-destructive">*</span>
                </Label>
                <SearchableSelect
                  options={PRODUCT_STATUSES.map((st) => ({ value: st, label: st }))}
                  value={status}
                  onChange={(val) => {
                    setStatus(val as ProductMasterRecord['status']);
                    markDirty();
                  }}
                  placeholder="Select status..."
                  triggerClassName="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-xs outline-none"
                />
                <p className="text-[11px] text-muted-foreground">
                  Sets initial availability status in product catalog.
                </p>
              </div>

              {/* Submit for Approval Switch */}
              <div className="space-y-1.5 p-3 rounded-lg border bg-muted/20">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={submitForApproval}
                    onChange={(e) => {
                      setSubmitForApproval(e.target.checked);
                      markDirty();
                    }}
                    className="mt-0.5 rounded border-input text-primary focus:ring-primary h-4 w-4"
                  />
                  <div>
                    <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Send className="h-3.5 w-3.5 text-primary" />
                      Submit for SuperAdmin Approval
                    </span>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                      Flags this product as "Pending Approval" and notifies SuperAdmins before production publication.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Approval Notes */}
            {submitForApproval && (
              <div className="space-y-1.5 pt-2">
                <Label htmlFor="approvalNotes" className="text-xs font-semibold">
                  Approval / Launch Notes
                </Label>
                <Input
                  id="approvalNotes"
                  placeholder="e.g. Verified commercial pricing and cloud cluster SLA."
                  value={approvalNotes}
                  onChange={(e) => {
                    setApprovalNotes(e.target.value);
                    markDirty();
                  }}
                  className="text-xs h-9"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </form>

      {/* Discard Confirmation Dialog */}
      <Dialog open={showDiscardConfirm} onOpenChange={setShowDiscardConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Discard Unsaved Changes?</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              You have unsaved edits in this product form. Leaving now will cause all changes to be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setShowDiscardConfirm(false)}>
              Keep Editing
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setShowDiscardConfirm(false);
                onCancel();
              }}
            >
              Discard Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
