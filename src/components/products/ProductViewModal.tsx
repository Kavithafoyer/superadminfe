'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Package,
  Globe,
  ExternalLink,
  Layers,
  Cpu,
  Calendar,
  Clock,
  ShieldCheck,
  Edit2,
  Power,
  History,
  CheckCircle2,
  AlertCircle,
  FileText,
  MapPin,
  Hash,
} from 'lucide-react';
import { ProductMasterRecord } from '@/service/api/superAdminService';
import { UserRole, ROLE_PERMISSIONS, getModuleMeta } from './productTypes';

interface ProductViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductMasterRecord | null;
  currentRole: UserRole;
  onEdit?: (product: ProductMasterRecord) => void;
  onDeactivate?: (product: ProductMasterRecord) => void;
  onOpenHistory?: (product: ProductMasterRecord) => void;
  onOpenApproval?: (product: ProductMasterRecord) => void;
}

export function ProductViewModal({
  open,
  onOpenChange,
  product,
  currentRole,
  onEdit,
  onDeactivate,
  onOpenHistory,
  onOpenApproval,
}: ProductViewModalProps) {
  if (!product) return null;

  const permissions = ROLE_PERMISSIONS[currentRole];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return (
          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Active
          </Badge>
        );
      case 'Inactive':
        return (
          <Badge variant="destructive" className="gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            Inactive
          </Badge>
        );
      case 'Under Review':
        return (
          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Under Review
          </Badge>
        );
      case 'Draft':
        return (
          <Badge variant="outline" className="gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            Draft
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
          <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30 gap-1">
            <ShieldCheck className="h-3 w-3" />
            Approved
          </Badge>
        );
      case 'Pending Approval':
        return (
          <Badge className="bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30 gap-1">
            <Clock className="h-3 w-3" />
            Pending Approval
          </Badge>
        );
      default:
        return <Badge variant="outline">{approvalStatus || 'Draft'}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl sm:max-w-4xl max-h-[90vh] flex flex-col p-6 overflow-hidden">
        {/* Modal Header */}
        <DialogHeader className="pb-4 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 overflow-hidden shadow-xs">
                {product.product_icon ? (
                  <img
                    src={product.product_icon}
                    alt={product.product_name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Package className="h-7 w-7" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <DialogTitle className="text-xl font-bold tracking-tight">
                    {product.product_name}
                  </DialogTitle>
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-muted border font-semibold text-muted-foreground">
                    {product.product_code}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <Badge variant="secondary" className="text-xs">
                    {product.category}
                  </Badge>
                  {getStatusBadge(product.status)}
                  {getApprovalBadge(product.approval_status)}
                  {product.region && (
                    <Badge variant="outline" className="text-xs gap-1">
                      <MapPin className="h-3 w-3" />
                      {product.region}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {permissions.canEdit && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onOpenChange(false);
                    onEdit?.(product);
                  }}
                  className="gap-1.5 h-8 text-xs"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  Edit
                </Button>
              )}

              {permissions.canDeactivate && (
                <Button
                  size="sm"
                  variant={product.status === 'Active' ? 'destructive' : 'default'}
                  onClick={() => {
                    onOpenChange(false);
                    onDeactivate?.(product);
                  }}
                  className="gap-1.5 h-8 text-xs"
                >
                  <Power className="h-3.5 w-3.5" />
                  {product.status === 'Active' ? 'Deactivate' : 'Activate'}
                </Button>
              )}

              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  onOpenChange(false);
                  onOpenHistory?.(product);
                }}
                className="gap-1.5 h-8 text-xs"
              >
                <History className="h-3.5 w-3.5" />
                History
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Tabbed Content */}
        <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0 pt-4">
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="editions">Editions & Modules</TabsTrigger>
            <TabsTrigger value="governance">Lifecycle & Audit</TabsTrigger>
          </TabsList>

          {/* TAB 1: OVERVIEW */}
          <TabsContent value="overview" className="flex-1 overflow-y-auto space-y-5 pr-1">
            {/* Description */}
            <div className="p-4 rounded-xl border bg-card space-y-1.5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Product Description
              </h4>
              <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Key Properties Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                <span className="text-[11px] font-medium text-muted-foreground">Product Code</span>
                <p className="text-sm font-mono font-semibold text-foreground">{product.product_code}</p>
              </div>

              <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                <span className="text-[11px] font-medium text-muted-foreground">Category</span>
                <p className="text-sm font-semibold text-foreground">{product.category}</p>
              </div>

              <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                <span className="text-[11px] font-medium text-muted-foreground">Default Edition</span>
                <p className="text-sm font-semibold text-foreground">
                  {product.default_edition || 'Not Assigned'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                <span className="text-[11px] font-medium text-muted-foreground">Display Priority Order</span>
                <p className="text-sm font-mono font-semibold text-foreground">
                  #{product.display_order}
                </p>
              </div>

              <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                <span className="text-[11px] font-medium text-muted-foreground">Catalog Region</span>
                <p className="text-sm font-semibold text-foreground">{product.region || 'Global'}</p>
              </div>

              <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                <span className="text-[11px] font-medium text-muted-foreground">Website Landing URL</span>
                {product.website_url ? (
                  <a
                    href={product.website_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1 truncate font-medium"
                  >
                    <Globe className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{product.website_url}</span>
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">None specified</p>
                )}
              </div>
            </div>

            {/* Metadata Footer */}
            <div className="p-4 rounded-xl border bg-muted/30 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>Created: {new Date(product.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>Last Updated: {new Date(product.updated_at).toLocaleString()}</span>
              </div>
              {product.approval_notes && (
                <div className="w-full pt-2 border-t text-foreground">
                  <span className="font-semibold text-muted-foreground">Approval Note: </span>
                  {product.approval_notes}
                </div>
              )}
            </div>
          </TabsContent>

          {/* TAB 2: EDITIONS & MODULES */}
          <TabsContent value="editions" className="flex-1 overflow-y-auto space-y-5 pr-1">
            {/* Editions Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  Available Product Editions ({product.editions?.length || 0})
                </h4>
              </div>

              {product.editions && product.editions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {product.editions.map((edition, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border ${edition === product.default_edition
                          ? 'border-primary/50 bg-primary/5 shadow-xs'
                          : 'bg-card'
                        } space-y-1.5`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-sm text-foreground">{edition}</span>
                        {edition === product.default_edition && (
                          <Badge variant="default" className="text-[10px] py-0 px-1.5 h-4">
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Included in master package specifications
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground p-3 border rounded-lg bg-muted/20">
                  No explicit editions defined for this product.
                </p>
              )}
            </div>

            {/* Modules Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-primary" />
                  Bundled Functional Modules ({product.modules?.length || 0})
                </h4>
              </div>

              {product.modules && product.modules.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {product.modules.map((mod, idx) => {
                    const meta = getModuleMeta(mod);
                    return (
                      <span
                        key={idx}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 shadow-2xs transition-colors ${meta.badgeClass}`}
                      >
                        <span className={`h-2 w-2 rounded-full ${meta.dotColor}`} />
                        {mod}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground p-3 border rounded-lg bg-muted/20">
                  No modules linked to this product.
                </p>
              )}
            </div>
          </TabsContent>

          {/* TAB 3: LIFECYCLE & AUDIT */}
          <TabsContent value="governance" className="flex-1 overflow-y-auto space-y-4 pr-1">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <History className="h-4 w-4 text-primary" />
                Latest Status Changes & Audits
              </h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  onOpenHistory?.(product);
                }}
                className="text-xs h-8"
              >
                Open Full Audit Log
              </Button>
            </div>

            {/* Recent Status Changes */}
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status Transitions
              </span>
              <div className="space-y-2">
                {product.status_history?.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl border bg-muted/20 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-foreground">
                        {item.fromStatus} → {item.toStatus}
                      </span>
                      <span className="font-mono text-muted-foreground">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    {item.reason && <p className="text-muted-foreground">{item.reason}</p>}
                    <p className="text-[10px] text-muted-foreground pt-1">
                      By {item.changedBy} ({item.userRole})
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Audit Logs */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Recent Audit Operations
              </span>
              <div className="space-y-2">
                {product.audit_history?.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl border bg-muted/20 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-foreground">{item.details}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {item.action}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground pt-1">
                      <span>By {item.performedBy} ({item.userRole})</span>
                      <span className="font-mono">{new Date(item.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
