'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users,
  UserPlus,
  PackagePlus,
  HardDrive,
  CalendarClock,
  UserMinus,
  ArrowRight,
  ShieldCheck,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function CustomerManagementPage() {
  const customerModules = [
    {
      title: 'Customer Accounts',
      description: 'Directory of enterprise tenant accounts, organizations, billing contacts, and GST records.',
      href: '/accounts',
      icon: Building2,
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      badge: 'Core Directory',
    },
    {
      title: 'Additional License Request',
      description: 'Manage extra seat allocation requests for expanding organizations and calculate user tiers.',
      href: '/customer/additional-license',
      icon: UserPlus,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      badge: 'Seat Scaling',
    },
    {
      title: 'Addon Subscription',
      description: 'Process specialty feature add-ons, module enhancements, and tenant synchronized packages.',
      href: '/customer/addon-subscription',
      icon: PackagePlus,
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      badge: 'Feature Addons',
    },
    {
      title: 'Additional Storage',
      description: 'Manage cloud storage expansion quotas (GB), per-GB pricing tiers, and disk allocations.',
      href: '/customer/additional-storage',
      icon: HardDrive,
      color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
      badge: 'Storage Quota',
    },
    {
      title: 'Renewal Due',
      description: 'Track upcoming subscription expirations, schedule term renewals, and automate renewal quotes.',
      href: '/customer/renewal-due',
      icon: CalendarClock,
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      badge: 'Renewals & Terms',
    },
    {
      title: 'Cancel Plan',
      description: 'Track customer deactivation requests, domain decommissioning, and churn reason analytics.',
      href: '/customer/cancel-plan',
      icon: UserMinus,
      color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
      badge: 'Deactivations',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Customer Management
          </h1>
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
            6 Modules
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Complete lifecycle management for tenant accounts, license expansion, addon packages, storage, and renewals.
        </p>
      </div>

      {/* Grid of 6 Customer Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {customerModules.map((mod) => {
          const Icon = mod.icon;
          return (
            <Link
              key={mod.href}
              href={mod.href}
              className="group p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-11 w-11 rounded-lg flex items-center justify-center ${mod.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary" className="text-xs font-normal">
                    {mod.badge}
                  </Badge>
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                  {mod.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {mod.description}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <span>Open Module</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
