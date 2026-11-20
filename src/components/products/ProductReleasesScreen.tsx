'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Package,
  Plus,
  Search,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  Tag,
  GitBranch,
  Shield,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ReleaseItem {
  id: string;
  version: string;
  product: string;
  releaseDate: string;
  channel: 'Stable' | 'Staged Rollout' | 'Beta';
  status: 'General Availability' | 'Active Rollout' | 'Deprecated';
  summary: string;
  highlights: string[];
  affectedTenants: number;
}

const INITIAL_RELEASES: ReleaseItem[] = [
  {
    id: 'rel-1',
    version: 'v2.4.0',
    product: 'Pegatto CRM',
    releaseDate: '18 Nov 2026',
    channel: 'Stable',
    status: 'General Availability',
    summary: 'Enhanced AI Lead Scoring pipeline, improved WhatsApp business connector, and real-time webhook retries.',
    highlights: [
      'Native AI Lead Scoring model upgrade to v4.2',
      'Multi-currency payment gateway integrations',
      'Custom RBAC permission presets for enterprise audit compliance',
    ],
    affectedTenants: 274,
  },
  {
    id: 'rel-2',
    version: 'v3.1.2',
    product: 'Pegatto Education',
    releaseDate: '10 Nov 2026',
    channel: 'Stable',
    status: 'General Availability',
    summary: 'Student timetable automation, parent portal notification push, and multi-campus gradebook syncing.',
    highlights: [
      'Campus-wide exam scheduling automation',
      'Automated parent portal SMS and email push triggers',
      'High-throughput bulk student roster import tool',
    ],
    affectedTenants: 182,
  },
  {
    id: 'rel-3',
    version: 'v2.0.4',
    product: 'Pegatto Retail',
    releaseDate: '02 Nov 2026',
    channel: 'Staged Rollout',
    status: 'Active Rollout',
    summary: 'Cloud barcode synchronization, multi-store physical stock audit, and thermal receipt print caching.',
    highlights: [
      'Multi-store real-time inventory ledger lock',
      'Thermal receipt offline spooling engine',
      'Loyalty tier auto-calculation rules',
    ],
    affectedTenants: 145,
  },
  {
    id: 'rel-4',
    version: 'v1.8.0',
    product: 'Pegatto IT',
    releaseDate: '24 Oct 2026',
    channel: 'Stable',
    status: 'General Availability',
    summary: 'IT asset auto-discovery agent, SLA breach predictive warning, and JIRA bi-directional sync.',
    highlights: [
      'Auto-discovery network agent for Windows/Mac workstations',
      'SLA escalation auto-reassignment workflows',
      'Incident ticket bi-directional webhook gateway',
    ],
    affectedTenants: 96,
  },
];

export function ProductReleasesScreen() {
  const router = useRouter();
  const [productFilter, setProductFilter] = useState('All Products');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReleases = INITIAL_RELEASES.filter((r) => {
    const matchesProduct = productFilter === 'All Products' || r.product === productFilter;
    const matchesSearch =
      r.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProduct && matchesSearch;
  });

  return (
    <div className="w-full space-y-5 pb-12 font-sans text-slate-800 antialiased">
      {/* 1. BREADCRUMBS */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <span
          className="hover:text-slate-800 cursor-pointer"
          onClick={() => router.push('/products/master')}
        >
          Product Management
        </span>
        <span className="text-slate-400">&gt;</span>
        <span className="text-slate-800 font-semibold">Product Releases</span>
      </div>

      {/* 2. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Product Releases &amp; Version History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track and deploy software release versions, changelogs, migration guides, and rollout channels.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => toast.success('New release deployment workflow initialized.')}
          className="bg-[#1574fe] hover:bg-[#0d62e0] text-white font-medium text-xs sm:text-sm h-9 px-4 rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New Release</span>
        </Button>
      </div>

      {/* 3. FILTERS BAR */}
      <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
          <Input
            placeholder="Search version, product, changelog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-xs bg-slate-50 border-slate-200"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Product:</span>
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#1574fe]"
          >
            <option>All Products</option>
            <option>Pegatto CRM</option>
            <option>Pegatto Education</option>
            <option>Pegatto Retail</option>
            <option>Pegatto IT</option>
          </select>
        </div>
      </div>

      {/* 4. RELEASES TIMELINE LIST */}
      <div className="space-y-4">
        {filteredReleases.map((release) => (
          <div
            key={release.id}
            className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-base font-bold text-slate-900">{release.version}</span>
                <span className="text-xs font-semibold text-[#1574fe] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                  {release.product}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {release.status}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>Released: {release.releaseDate}</span>
                <span className="text-slate-300">•</span>
                <span className="font-semibold text-slate-700">{release.affectedTenants} Active Tenants</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {release.summary}
            </p>

            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Key Highlights
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {release.highlights.map((hl, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{hl}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
