'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Package,
  ArrowLeft,
  Edit2,
  Power,
  History,
  ShieldCheck,
  Globe,
  ExternalLink,
  Layers,
  Cpu,
  Calendar,
  Clock,
  CheckCircle2,
  MapPin,
  Check,
  Copy,
  AlertCircle,
  Tag,
  Hash,
  User,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ProductMasterRecord } from '@/service/api/superAdminService';
import { UserRole, ROLE_PERMISSIONS, MODULE_GROUPS, getModuleMeta } from './productTypes';

interface ProductOverviewPageProps {
  product: ProductMasterRecord;
  currentRole: UserRole;
  onBack: () => void;
  onEdit: (product: ProductMasterRecord) => void;
  onDeactivate: (product: ProductMasterRecord) => void;
  onOpenHistory: (product: ProductMasterRecord) => void;
  onOpenApproval: (product: ProductMasterRecord) => void;
}

export function ProductOverviewPage({
  product,
  currentRole,
  onBack,
  onEdit,
  onDeactivate,
  onOpenHistory,
  onOpenApproval,
}: ProductOverviewPageProps) {
  const router = useRouter();
  const permissions = ROLE_PERMISSIONS[currentRole];
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(product.product_code);
    setCopiedCode(true);
    toast.success(`Copied ${product.product_code} to clipboard`);
    setTimeout(() => setCopiedCode(false), 1500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return (
          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 gap-1.5 font-semibold text-xs px-2.5 py-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Active in Production
          </Badge>
        );
      case 'Inactive':
        return (
          <Badge variant="destructive" className="gap-1.5 font-semibold text-xs px-2.5 py-1">
            <span className="h-2 w-2 rounded-full bg-white" />
            Deactivated
          </Badge>
        );
      case 'Under Review':
        return (
          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 gap-1.5 font-semibold text-xs px-2.5 py-1">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Under Review
          </Badge>
        );
      case 'Draft':
        return (
          <Badge variant="outline" className="gap-1.5 font-semibold text-xs px-2.5 py-1 text-slate-600 dark:text-slate-300">
            <span className="h-2 w-2 rounded-full bg-slate-400" />
            Draft Catalog
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getApprovalBadge = (approvalStatus: string) => {
    switch (approvalStatus) {
      case 'Approved':
        return (
          <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30 gap-1 text-xs px-2.5 py-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            SuperAdmin Approved
          </Badge>
        );
      case 'Pending Approval':
        return (
          <Badge className="bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30 gap-1 text-xs px-2.5 py-1">
            <Clock className="h-3.5 w-3.5" />
            Pending Approval
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs px-2.5 py-1">
            {approvalStatus || 'Draft'}
          </Badge>
        );
    }
  };

  const editionsList = product.editions || [];
  const modulesList = product.modules || [];

  return (
    <div className="space-y-6">
      {/* Top Navigation & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={onBack}
            className="h-9 w-9 shrink-0 rounded-lg hover:bg-muted"
            title="Back to Product Master"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Product Master Overview
              </span>
              <span>·</span>
              <span className="text-xs font-mono text-primary font-semibold">
                #{product.display_order}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
              {product.product_name}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {permissions.canEdit && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(product)}
              className="gap-1.5 text-xs h-9"
            >
              <Edit2 className="h-3.5 w-3.5" />
              Edit Product
            </Button>
          )}

          {permissions.canDeactivate && (
            <Button
              size="sm"
              variant={product.status === 'Active' ? 'destructive' : 'default'}
              onClick={() => onDeactivate(product)}
              className="gap-1.5 text-xs h-9"
            >
              <Power className="h-3.5 w-3.5" />
              {product.status === 'Active' ? 'Deactivate' : 'Activate'}
            </Button>
          )}

          {(permissions.canApprove || permissions.canSubmitApproval) && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onOpenApproval(product)}
              className="gap-1.5 text-xs h-9"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-purple-600" />
              {currentRole === 'SuperAdmin' && product.approval_status === 'Pending Approval'
                ? 'Review Approval'
                : 'Submit for Approval'}
            </Button>
          )}

          <Button
            size="sm"
            variant="ghost"
            onClick={() => onOpenHistory(product)}
            className="gap-1.5 text-xs h-9"
          >
            <History className="h-3.5 w-3.5" />
            History Log
          </Button>
        </div>
      </div>

      {/* Hero Banner Card */}
      <Card className="shadow-xs overflow-hidden border-primary/20 bg-gradient-to-r from-primary/5 via-primary/2 to-transparent">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0 overflow-hidden shadow-sm">
                {product.product_icon ? (
                  <img
                    src={product.product_icon}
                    alt={product.product_name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Package className="h-8 w-8" />
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl font-bold tracking-tight text-foreground">
                    {product.product_name}
                  </h2>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 font-mono text-xs px-2.5 py-0.5 rounded-md bg-muted border font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    title="Copy code"
                  >
                    <span>{product.product_code}</span>
                    {copiedCode ? (
                      <Check className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">
                    {product.category}
                  </Badge>
                  {getStatusBadge(product.status)}
                  {getApprovalBadge(product.approval_status)}
                  <Badge variant="outline" className="text-xs gap-1">
                    <MapPin className="h-3 w-3" />
                    {product.region || 'Global'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Quick stats badges */}
            <div className="flex items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 text-xs">
              <div className="p-3 rounded-xl border bg-card text-center min-w-[100px]">
                <p className="text-[11px] text-muted-foreground font-medium">Editions</p>
                <p className="text-lg font-bold text-foreground mt-0.5">
                  {editionsList.length}
                </p>
              </div>
              <div className="p-3 rounded-xl border bg-card text-center min-w-[100px]">
                <p className="text-[11px] text-muted-foreground font-medium">Modules</p>
                <p className="text-lg font-bold text-foreground mt-0.5">
                  {modulesList.length}
                </p>
              </div>
              <div className="p-3 rounded-xl border bg-card text-center min-w-[100px]">
                <p className="text-[11px] text-muted-foreground font-medium">Display Priority</p>
                <p className="text-lg font-bold text-primary mt-0.5">
                  #{product.display_order}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Core Specs, Editions, and Colorful Modules */}
        <div className="lg:col-span-2 space-y-6">
          {/* Executive Summary & Description */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" />
                Product Description & Scope
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed text-foreground whitespace-pre-line bg-muted/20 p-4 rounded-xl border">
                {product.description}
              </p>

              {/* Attributes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                <div className="p-3.5 rounded-xl border bg-card space-y-1">
                  <span className="text-[11px] font-medium text-muted-foreground">Default Edition</span>
                  <p className="text-sm font-semibold text-foreground">
                    {product.default_edition || 'None Assigned'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border bg-card space-y-1">
                  <span className="text-[11px] font-medium text-muted-foreground">Catalog Region</span>
                  <p className="text-sm font-semibold text-foreground">
                    {product.region || 'Global'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border bg-card space-y-1">
                  <span className="text-[11px] font-medium text-muted-foreground">Portal Website</span>
                  {product.website_url ? (
                    <a
                      href={product.website_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold truncate mt-0.5"
                    >
                      <Globe className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{product.website_url.replace(/^https?:\/\//, '')}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-0.5">Not configured</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configured Editions */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  Configured Product Editions ({editionsList.length})
                </CardTitle>
                <span className="text-xs text-muted-foreground">Available packaging tiers</span>
              </div>
            </CardHeader>
            <CardContent>
              {editionsList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {editionsList.map((edition, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border space-y-2 transition-all ${
                        edition === product.default_edition
                          ? 'border-primary/50 bg-primary/5 shadow-2xs'
                          : 'bg-card'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sm text-foreground">{edition}</span>
                        {edition === product.default_edition && (
                          <Badge variant="default" className="text-[10px] py-0 px-2 h-4">
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Included in commercial subscription matrix.
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground p-4 border rounded-xl bg-muted/20">
                  No editions defined for this product.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Linked Functional Modules (Vibrant Colors by Domain) */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-primary" />
                  Linked Functional Modules ({modulesList.length})
                </CardTitle>
                <span className="text-xs text-muted-foreground">Color-coded by functional domain</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {modulesList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {MODULE_GROUPS.map((group) => {
                    const groupModules = group.modules.filter((m) => modulesList.includes(m));
                    if (groupModules.length === 0) return null;

                    return (
                      <div
                        key={group.category}
                        className="p-3.5 rounded-xl border bg-card space-y-2.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-foreground flex items-center gap-1.5">
                            <span className={`h-2.5 w-2.5 rounded-full ${group.dotColor}`} />
                            {group.category}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {groupModules.length} Active
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {groupModules.map((mod, idx) => (
                            <span
                              key={idx}
                              className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 ${group.badgeClass}`}
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                              {mod}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground p-4 border rounded-xl bg-muted/20">
                  No modules linked to this product catalog.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 Col): Status History, Approval & Timestamps */}
        <div className="space-y-6">
          {/* Status History Timeline */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <History className="h-4 w-4 text-primary" />
                  Status Transition History
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenHistory(product)}
                  className="text-xs h-7 text-primary hover:underline p-0"
                >
                  View Full Audit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {product.status_history && product.status_history.length > 0 ? (
                <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                  {product.status_history.slice(0, 4).map((item, idx) => (
                    <div key={idx} className="relative">
                      {/* Timeline dot */}
                      <div className="absolute -left-5 top-1 h-3.5 w-3.5 rounded-full border-2 border-background bg-primary" />
                      <div className="p-3 rounded-lg border bg-muted/20 text-xs space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-foreground">
                            {item.fromStatus} → {item.toStatus}
                          </span>
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {new Date(item.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        {item.reason && (
                          <p className="text-muted-foreground text-[11px] leading-relaxed">
                            {item.reason}
                          </p>
                        )}
                        <p className="text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                          By {item.changedBy} ({item.userRole})
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No status transitions recorded.</p>
              )}
            </CardContent>
          </Card>

          {/* Governance & Sign-off Details */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Governance & Lifecycle State
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center p-3 rounded-lg border bg-muted/20">
                <span className="text-muted-foreground">Approval Status</span>
                {getApprovalBadge(product.approval_status)}
              </div>

              {product.approval_notes && (
                <div className="p-3 rounded-lg border bg-card space-y-1">
                  <span className="font-medium text-muted-foreground text-[11px]">Approval Notes:</span>
                  <p className="italic text-foreground text-xs">{product.approval_notes}</p>
                </div>
              )}

              <div className="space-y-2 pt-2 border-t text-[11px] text-muted-foreground">
                <div className="flex justify-between">
                  <span>Created At:</span>
                  <span className="font-mono text-foreground font-medium">
                    {new Date(product.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Last Modified:</span>
                  <span className="font-mono text-foreground font-medium">
                    {new Date(product.updated_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
