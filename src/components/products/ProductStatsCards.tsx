'use client';

import React from 'react';
import { Package, CheckCircle2, AlertCircle, Clock, ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductMasterRecord } from '@/service/api/superAdminService';

interface ProductStatsCardsProps {
  products: ProductMasterRecord[];
  onFilterByStatus?: (status: string) => void;
}

export function ProductStatsCards({ products, onFilterByStatus }: ProductStatsCardsProps) {
  const total = products.length;
  const activeCount = products.filter((p) => p.status === 'Active').length;
  const underReviewCount = products.filter(
    (p) => p.status === 'Under Review' || p.approval_status === 'Pending Approval'
  ).length;
  const inactiveCount = products.filter((p) => p.status === 'Inactive' || p.status === 'Archived').length;
  const draftCount = products.filter((p) => p.status === 'Draft').length;

  const uniqueCategories = new Set(products.map((p) => p.category)).size;
  const activePercentage = total > 0 ? Math.round((activeCount / total) * 100) : 0;

  const stats = [
    {
      title: 'Total Master Products',
      value: total,
      subtext: `${uniqueCategories} Unique Domains Covered`,
      icon: Package,
      gradient: 'from-blue-600/15 via-indigo-600/8 to-transparent',
      borderColor: 'border-blue-500/30 dark:border-blue-500/20 hover:border-blue-500/60',
      accentColor: 'from-blue-600 to-indigo-600',
      textColor: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25',
      badge: 'Master Catalog',
      badgeClass: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30',
      onClick: () => onFilterByStatus?.('all'),
    },
    {
      title: 'Active in Production',
      value: activeCount,
      subtext: `${activePercentage}% Catalog Readiness`,
      icon: CheckCircle2,
      gradient: 'from-emerald-600/15 via-teal-600/8 to-transparent',
      borderColor: 'border-emerald-500/30 dark:border-emerald-500/20 hover:border-emerald-500/60',
      accentColor: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25',
      badge: 'Live & Provisioned',
      badgeClass: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
      onClick: () => onFilterByStatus?.('Active'),
    },
    {
      title: 'Pending Approvals',
      value: underReviewCount,
      subtext: underReviewCount > 0 ? 'Requires SuperAdmin sign-off' : 'All reviews completed',
      icon: Clock,
      gradient: 'from-amber-600/15 via-orange-600/8 to-transparent',
      borderColor: 'border-amber-500/30 dark:border-amber-500/20 hover:border-amber-500/60',
      accentColor: 'from-amber-500 to-orange-500',
      textColor: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25',
      badge: underReviewCount > 0 ? 'Action Required' : 'Up to Date',
      badgeClass: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
      onClick: () => onFilterByStatus?.('Under Review'),
    },
    {
      title: 'Inactive & Drafts',
      value: inactiveCount + draftCount,
      subtext: `${draftCount} Drafts · ${inactiveCount} Inactive`,
      icon: AlertCircle,
      gradient: 'from-rose-600/15 via-purple-600/8 to-transparent',
      borderColor: 'border-rose-500/30 dark:border-rose-500/20 hover:border-rose-500/60',
      accentColor: 'from-rose-500 to-purple-600',
      textColor: 'text-rose-600 dark:text-rose-400',
      iconBg: 'bg-gradient-to-br from-rose-500 to-purple-600 text-white shadow-lg shadow-rose-500/25',
      badge: 'Maintenance / Draft',
      badgeClass: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
      onClick: () => onFilterByStatus?.('Inactive'),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <Card
            key={idx}
            onClick={stat.onClick}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border ${stat.borderColor} relative overflow-hidden group bg-gradient-to-br ${stat.gradient} bg-card`}
          >
            {/* Top Color Accent Line */}
            <div className={`h-1 w-full bg-gradient-to-r ${stat.accentColor}`} />

            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">
                    {stat.title}
                  </p>
                  <h3 className={`text-3xl font-extrabold mt-1.5 tracking-tight ${stat.textColor} transition-transform group-hover:scale-105 duration-200 inline-block`}>
                    {stat.value}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {stat.subtext}
                  </p>
                </div>

                <div className={`p-3 rounded-2xl ${stat.iconBg} transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300 shrink-0`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between pt-2.5 border-t border-border/40">
                <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-1">
                  View filtered list
                  <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
                <span className={`text-[10px] font-semibold py-0.5 px-2 rounded-full border ${stat.badgeClass}`}>
                  {stat.badge}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
