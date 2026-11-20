'use client';

import React, { useState, useMemo } from 'react';
import {
  PackagePlus,
  Plus,
  Search,
  Filter,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  Tag,
  DollarSign,
  ChevronRight,
  Shield,
  HardDrive,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MOCK_ADDONS, MOCK_ADDON_CATEGORIES } from './addonsData';
import { AddonItem } from './addonsTypes';

export function AddonsScreen() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredAddons = useMemo(() => {
    return MOCK_ADDONS.filter((addon) => {
      const matchesSearch =
        addon.name.toLowerCase().includes(search.toLowerCase()) ||
        addon.code.toLowerCase().includes(search.toLowerCase()) ||
        addon.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || addon.category === selectedCategory;

      const matchesStatus =
        selectedStatus === 'all' || addon.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [search, selectedCategory, selectedStatus]);

  // Statistics
  const totalCount = MOCK_ADDONS.length;
  const activeCount = MOCK_ADDONS.filter((a) => a.status === 'active').length;
  const draftCount = MOCK_ADDONS.filter((a) => a.status === 'draft').length;

  return (
    <div className="space-y-6 p-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <PackagePlus className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Addons Management</h1>
              <p className="text-sm text-muted-foreground">
                Configure, manage, and monitor subscription addons and operational boosters (UI Preview)
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Addon
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">Total Addons</p>
              <h3 className="mt-1 text-2xl font-bold">{totalCount}</h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <Layers className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">Active Addons</p>
              <h3 className="mt-1 text-2xl font-bold text-emerald-600">{activeCount}</h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">Drafts / In Review</p>
              <h3 className="mt-1 text-2xl font-bold text-amber-600">{draftCount}</h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search addons by name, code or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {MOCK_ADDON_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Addons Grid View */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAddons.map((addon) => (
          <Card key={addon.id} className="transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-mono uppercase text-muted-foreground">{addon.code}</span>
                  <CardTitle className="text-lg font-semibold">{addon.name}</CardTitle>
                </div>
                <Badge
                  variant={
                    addon.status === 'active'
                      ? 'default'
                      : addon.status === 'draft'
                      ? 'secondary'
                      : 'outline'
                  }
                >
                  {addon.status}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2 text-xs">{addon.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline justify-between border-t pt-3">
                <span className="text-xs text-muted-foreground">Pricing:</span>
                <span className="text-lg font-bold text-foreground">
                  ${addon.price.toFixed(2)}
                  <span className="text-xs font-normal text-muted-foreground">/{addon.billingCycle}</span>
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {addon.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[10px]">
                    <Tag className="mr-1 h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex justify-end gap-2 border-t pt-3">
                <Button variant="outline" size="sm" className="text-xs">
                  Edit
                </Button>
                <Button size="sm" className="text-xs">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAddons.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-sm text-muted-foreground">No addons match your search criteria.</p>
        </Card>
      )}
    </div>
  );
}
