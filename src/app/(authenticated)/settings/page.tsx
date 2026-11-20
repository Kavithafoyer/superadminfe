'use client';

import React from 'react';
import Link from 'next/link';
import {
  Settings as SettingsIcon,
  Menu,
  Building2,
  Users,
  HardDrive,
  UserCheck,
  PackagePlus,
  Sliders,
  ArrowRight,
  Palette,
  Sun,
  Moon,
  Monitor,
  Check,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';

export default function SettingsHubPage() {
  const { mode, setMode, primaryColor, setPrimaryColor } = useStore();

  const settingsModules = [
    {
      title: 'Product Menu Setup',
      description: 'Configure product hierarchy, root modules, submodules, codes, and action permissions.',
      icon: Menu,
      href: '/settings/product-menu',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Edit Company Details',
      description: 'Manage legal organization profile, address, IFSC bank verification, and operating hours.',
      icon: Building2,
      href: '/settings/company-details',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Roles and Users',
      description: 'Role-based access control (RBAC): define security roles, functional permissions, and invite staff.',
      icon: Users,
      href: '/settings/roles-users',
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
    {
      title: 'Storage Master',
      description: 'Define cloud storage catalog SKUs, allocated capacity limits, unit prices, and currencies.',
      icon: HardDrive,
      href: '/settings/storage',
      color: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-500/10',
    },
    {
      title: 'User Master',
      description: 'Configure user seat tier packages, volume slab discount rates, and effective licensing schedules.',
      icon: UserCheck,
      href: '/settings/user-master',
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-500/10',
    },
    {
      title: 'Addon Master',
      description: 'Maintain optional feature extensions, integration add-ons, and recurring billing models.',
      icon: PackagePlus,
      href: '/settings/addons',
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-500/10',
    },
    {
      title: 'System Preference',
      description: 'Global policies for date formatting, password expiry, failed attempt lockouts, and UI filters.',
      icon: Sliders,
      href: '/settings/preferences',
      color: 'text-violet-600 dark:text-violet-400',
      bgColor: 'bg-violet-500/10',
    },
  ];

  const colors = [
    { name: 'Pegatto Purple', value: '#1574fe' },
    { name: 'Classic Blue', value: '#0565FD' },
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Emerald', value: '#10b981' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Rose', value: '#f43f5e' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <SettingsIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Settings & System Administration
          </h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Configure core platform parameters, organization profile, security roles, and catalog masters
        </p>
      </div>

      {/* Submodules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {settingsModules.map((m) => {
          const Icon = m.icon;
          return (
            <Link
              key={m.title}
              href={m.href}
              className="group block bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md hover:border-blue-500/50 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className={`p-2.5 rounded-lg ${m.bgColor} ${m.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="group-hover:translate-x-1 transition-transform p-0 h-7 w-7 text-muted-foreground group-hover:text-blue-600"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-3.5">
                <h3 className="text-base font-semibold text-foreground group-hover:text-blue-600 transition-colors">
                  {m.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                  {m.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Appearance & Workspace Theme */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Palette className="h-4 w-4 text-blue-600" />
            Appearance & Visual Theme
          </CardTitle>
          <CardDescription>
            Customize light/dark mode and workspace primary accent color
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Theme Mode */}
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase block mb-2">
              Color Theme
            </span>
            <div className="grid grid-cols-3 gap-3 max-w-md">
              <Button
                type="button"
                variant={mode === 'light' ? 'default' : 'outline'}
                size="sm"
                className={`gap-2 text-xs ${mode === 'light' ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}`}
                onClick={() => setMode('light')}
              >
                <Sun className="h-3.5 w-3.5" />
                Light
              </Button>
              <Button
                type="button"
                variant={mode === 'dark' ? 'default' : 'outline'}
                size="sm"
                className={`gap-2 text-xs ${mode === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}`}
                onClick={() => setMode('dark')}
              >
                <Moon className="h-3.5 w-3.5" />
                Dark
              </Button>
              <Button
                type="button"
                variant={mode === 'system' ? 'default' : 'outline'}
                size="sm"
                className={`gap-2 text-xs ${mode === 'system' ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}`}
                onClick={() => setMode('system')}
              >
                <Monitor className="h-3.5 w-3.5" />
                System
              </Button>
            </div>
          </div>

          {/* Accent Color */}
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase block mb-2">
              Primary Accent Color
            </span>
            <div className="flex flex-wrap gap-2.5">
              {colors.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => {
                    setPrimaryColor(c.value);
                    toast.success(`Theme color set to ${c.name}`);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:bg-muted/40 transition-colors text-xs font-medium"
                >
                  <span
                    className="h-3 w-3 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: c.value }}
                  />
                  <span>{c.name}</span>
                  {primaryColor === c.value && <Check className="h-3 w-3 text-blue-600" />}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
