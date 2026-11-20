'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  History,
  ShieldAlert,
  ArrowRight,
  Clock,
  User,
  ShieldCheck,
  FileText,
  Activity,
  Layers,
  Search,
  Download,
} from 'lucide-react';
import { ProductMasterRecord, StatusHistoryEntry, AuditHistoryEntry } from '@/service/api/superAdminService';
import { toast } from 'sonner';

interface ProductHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductMasterRecord | null;
}

export function ProductHistoryModal({ open, onOpenChange, product }: ProductHistoryModalProps) {
  const [activeTab, setActiveTab] = useState<'status' | 'audit'>('status');
  const [searchQuery, setSearchQuery] = useState('');

  if (!product) return null;

  const statusHistory = product.status_history || [];
  const auditHistory = product.audit_history || [];

  const filteredAudit = auditHistory.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.action.toLowerCase().includes(q) ||
      item.performedBy.toLowerCase().includes(q) ||
      item.details.toLowerCase().includes(q) ||
      (item.userRole && item.userRole.toLowerCase().includes(q))
    );
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Inactive':
        return 'destructive';
      case 'Under Review':
        return 'secondary';
      case 'Draft':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'CREATE':
        return <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30">Created</Badge>;
      case 'UPDATE':
        return <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30">Updated</Badge>;
      case 'DEACTIVATE':
        return <Badge variant="destructive">Deactivated</Badge>;
      case 'ACTIVATE':
        return <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30">Activated</Badge>;
      case 'APPROVED':
        return <Badge className="bg-emerald-600 text-white">Approved</Badge>;
      case 'APPROVAL_SUBMIT':
        return <Badge className="bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30">Submitted</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };

  const exportAuditLog = () => {
    const csvRows = [
      ['Timestamp', 'Action', 'Performed By', 'Role', 'IP Address', 'Details'].join(','),
      ...auditHistory.map((item) =>
        [
          `"${new Date(item.timestamp).toLocaleString()}"`,
          `"${item.action}"`,
          `"${item.performedBy}"`,
          `"${item.userRole}"`,
          `"${item.ipAddress || 'Internal'}"`,
          `"${item.details.replace(/"/g, '""')}"`,
        ].join(',')
      ),
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${product.product_code}_audit_trail_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Audit trail downloaded successfully!');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl sm:max-w-3xl max-h-[85vh] flex flex-col p-6">
        <DialogHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <History className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold flex items-center gap-2">
                  Status & Audit Trail
                  <Badge variant="outline" className="font-mono text-xs font-normal">
                    {product.product_code}
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Immutable revision logs and status transition lifecycle for {product.product_name}
                </DialogDescription>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={exportAuditLog}
              className="text-xs gap-1.5 h-8 hidden sm:flex"
            >
              <Download className="h-3.5 w-3.5" />
              Export Log
            </Button>
          </div>
        </DialogHeader>

        <Tabs
          defaultValue="status"
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as 'status' | 'audit')}
          className="flex-1 flex flex-col min-h-0 pt-3"
        >
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex border rounded-lg p-0.5 bg-muted/30">
              <button
                type="button"
                onClick={() => setActiveTab('status')}
                className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
                  activeTab === 'status'
                    ? 'bg-background shadow-xs text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Status History ({statusHistory.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('audit')}
                className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
                  activeTab === 'audit'
                    ? 'bg-background shadow-xs text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Audit Trail ({auditHistory.length})
              </button>
            </div>

            {activeTab === 'audit' && (
              <div className="relative w-48 sm:w-60">
                <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Filter logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-1.5 rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            )}
          </div>

          {/* STATUS HISTORY TAB */}
          {activeTab === 'status' && (
            <div className="flex-1 overflow-y-auto pr-1 space-y-4">
              {statusHistory.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-xs">
                  No status transition history recorded yet.
                </div>
              ) : (
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                  {statusHistory.map((item, idx) => (
                    <div key={item.id || idx} className="relative group">
                      {/* Timeline dot */}
                      <div className="absolute -left-6 top-1 h-5 w-5 rounded-full border-2 border-background bg-primary flex items-center justify-center text-primary-foreground shadow-xs">
                        <div className="h-1.5 w-1.5 rounded-full bg-background" />
                      </div>

                      <div className="p-3.5 rounded-xl border bg-card hover:border-primary/40 transition-colors space-y-2">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <Badge variant={getStatusBadgeVariant(item.fromStatus)} className="text-xs">
                              {item.fromStatus}
                            </Badge>
                            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                            <Badge variant={getStatusBadgeVariant(item.toStatus)} className="text-xs">
                              {item.toStatus}
                            </Badge>
                          </div>
                          <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(item.timestamp).toLocaleString()}
                          </span>
                        </div>

                        {item.reason && (
                          <p className="text-xs text-foreground bg-muted/40 p-2.5 rounded-md border border-border/50">
                            <strong>Reason:</strong> {item.reason}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            Changed by: <strong className="text-foreground">{item.changedBy}</strong>
                          </span>
                          <span className="font-medium bg-muted px-2 py-0.5 rounded text-[10px]">
                            {item.userRole}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* AUDIT TRAIL TAB */}
          {activeTab === 'audit' && (
            <div className="flex-1 overflow-y-auto pr-1">
              {filteredAudit.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-xs">
                  No matching audit logs found.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredAudit.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="p-3.5 rounded-xl border bg-card hover:border-primary/40 transition-colors space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          {getActionBadge(item.action)}
                          <span className="font-semibold text-foreground">{item.details}</span>
                        </div>
                        <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(item.timestamp).toLocaleString()}
                        </span>
                      </div>

                      {item.changes && item.changes.length > 0 && (
                        <div className="p-2 rounded bg-muted/40 border text-[11px] space-y-1">
                          <span className="font-semibold text-muted-foreground">Field Updates:</span>
                          <div className="divide-y divide-border/60">
                            {item.changes.map((ch, cidx) => (
                              <div key={cidx} className="py-1 flex items-center justify-between">
                                <span className="font-mono text-primary font-medium">{ch.field}</span>
                                <div className="flex items-center gap-2 font-mono">
                                  <span className="text-muted-foreground line-through">
                                    {String(ch.oldValue ?? 'none')}
                                  </span>
                                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-foreground font-semibold">
                                    {String(ch.newValue ?? 'none')}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {item.performedBy}
                          </span>
                          <span>·</span>
                          <span className="text-foreground font-medium">{item.userRole}</span>
                        </div>
                        <span className="font-mono text-[10px]">
                          IP: {item.ipAddress || 'Internal Network'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
