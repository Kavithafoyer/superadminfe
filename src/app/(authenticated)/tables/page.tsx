'use client';

import React from 'react';
import Link from 'next/link';
import {
  Building2,
  Layers,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Table as TableIcon,
  Users,
  DollarSign,
  FileText,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  useGetAccountsListQuery,
  useGetPlansListQuery,
  useGetSubscriptionsListQuery,
} from '@/service/api/superAdminService';

export default function TablesHubPage() {
  const { data: accounts = [] } = useGetAccountsListQuery();
  const { data: plans = [] } = useGetPlansListQuery();
  const { data: subscriptions = [] } = useGetSubscriptionsListQuery();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
          <TableIcon className="h-6 w-6 text-primary" />
          Data Tables & Registry Hub
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Access specialized data management tables for customer tenant accounts, subscription plans, and commercial contracts.
        </p>
      </div>

      {/* Grid of Main Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Module 1: Customer Accounts */}
        <Card className="shadow-xs border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:border-primary/50 transition-colors">
          <div>
            <CardHeader className="p-5 pb-3">
              <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center mb-2">
                <Building2 className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg font-bold">Customer Accounts</CardTitle>
              <CardDescription className="text-xs">
                Account Menu: corporate tenant registries, contact personnel, and billing terms.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 py-2">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">Total Accounts</span>
                  <span className="font-bold">{accounts.length}</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">Active Provisioned</span>
                  <span className="font-bold text-emerald-600">
                    {accounts.filter((a) => a.Active_Flag !== false).length}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Backend API</span>
                  <span className="font-mono text-[11px] text-muted-foreground">superadmin/AccountCRUD/</span>
                </div>
              </div>
            </CardContent>
          </div>
          <CardFooter className="p-5 pt-3 border-t bg-slate-50/50 dark:bg-slate-900/50">
            <Link href="/accounts" className="w-full">
              <Button className="w-full gap-2 cursor-pointer bg-primary text-xs font-semibold">
                Open Accounts Table
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Module 2: Plans Management */}
        <Card className="shadow-xs border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:border-primary/50 transition-colors">
          <div>
            <CardHeader className="p-5 pb-3">
              <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center mb-2">
                <Layers className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg font-bold">Plans Management</CardTitle>
              <CardDescription className="text-xs">
                Sales Module: subscription tiers, feature matrices, user/storage limits, and pricing.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 py-2">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">Configured Plans</span>
                  <span className="font-bold">{plans.length}</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">Commercial Tiers</span>
                  <span className="font-bold text-emerald-600">
                    {plans.filter((p) => p.plantype?.toLowerCase() === 'paid').length}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Backend API</span>
                  <span className="font-mono text-[11px] text-muted-foreground">superadmin/planCRUD/</span>
                </div>
              </div>
            </CardContent>
          </div>
          <CardFooter className="p-5 pt-3 border-t bg-slate-50/50 dark:bg-slate-900/50">
            <Link href="/sales/plans" className="w-full">
              <Button className="w-full gap-2 cursor-pointer bg-primary text-xs font-semibold">
                Open Plans Table
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Module 3: Subscriptions */}
        <Card className="shadow-xs border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:border-primary/50 transition-colors">
          <div>
            <CardHeader className="p-5 pb-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mb-2">
                <CreditCard className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg font-bold">Subscriptions & Invoicing</CardTitle>
              <CardDescription className="text-xs">
                Sales Module: live customer subscriptions, invoice generation, tax and server costs.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 py-2">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">Active Contracts</span>
                  <span className="font-bold">
                    {subscriptions.filter((s) => s.status === 'active').length}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">In Trial</span>
                  <span className="font-bold text-amber-600">
                    {subscriptions.filter((s) => s.status === 'trial').length}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Backend API</span>
                  <span className="font-mono text-[11px] text-muted-foreground">superadmin/subscription/</span>
                </div>
              </div>
            </CardContent>
          </div>
          <CardFooter className="p-5 pt-3 border-t bg-slate-50/50 dark:bg-slate-900/50">
            <Link href="/sales/subscriptions" className="w-full">
              <Button className="w-full gap-2 cursor-pointer bg-primary text-xs font-semibold">
                Open Subscriptions Table
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Quick Access to Forms */}
      <Card className="shadow-xs border-slate-200 dark:border-slate-800 bg-linear-to-r from-blue-50/50 to-indigo-50/50 dark:from-slate-900 dark:to-slate-900">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-sm">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                SuperAdmin Multi-Step Operations Form Hub
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Need to create multiple entities or onboard new products? Use the dedicated 3-in-1 wizard forms.
              </p>
            </div>
          </div>
          <Link href="/forms">
            <Button variant="outline" className="cursor-pointer gap-2 text-xs font-semibold">
              Go to Forms
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
