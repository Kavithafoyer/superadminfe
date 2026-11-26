'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { INITIAL_PRODUCTS } from './productData';
import {
  Users,
  GraduationCap,
  CreditCard,
  Calendar,
  ClipboardList,
  BookOpen,
  BarChart2,
  Megaphone,
  Layers,
  ChevronLeft,
  ChevronRight,
  Plus,
  Upload,
  HelpCircle,
  Edit2,
  Copy,
  Trash2,
  X,
  Check,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { IsometricBoxIcon } from './ProductIcons';

export interface ModuleItem {
  id: string;
  name: string;
  category: string;
  featureCount: number;
  editionsAvailability: string;
  status: 'Active' | 'Inactive';
  iconType: 'users' | 'grad' | 'card' | 'calendar' | 'clipboard' | 'book' | 'chart' | 'megaphone';
  description: string;
  features: {
    id: string;
    name: string;
    description: string;
    core: boolean;
    standard: boolean;
    enterprise: boolean;
    availability?: Record<string, boolean>;
    status: 'Active' | 'Inactive';
  }[];
}

const INITIAL_MODULES: ModuleItem[] = [
  {
    id: 'mod-1',
    name: 'Admission & Enquiry',
    category: 'Admissions',
    featureCount: 6,
    editionsAvailability: 'Core, Standard, Enterprise',
    status: 'Active',
    iconType: 'users',
    description: 'Manage end-to-end lead capture, counselling, shortlisting, admission and enrollment process.',
    features: [
      {
        id: 'f-1',
        name: 'Lead Capture',
        description: 'Capture enquiries from web, social, WhatsApp, walk-in',
        core: true,
        standard: true,
        enterprise: true,
        status: 'Active',
      },
      {
        id: 'f-2',
        name: 'Enquiry Management',
        description: 'Track and manage enquiries',
        core: true,
        standard: true,
        enterprise: true,
        status: 'Active',
      },
      {
        id: 'f-3',
        name: 'Counselling',
        description: 'Schedule and track counselling sessions',
        core: false,
        standard: true,
        enterprise: true,
        status: 'Active',
      },
      {
        id: 'f-4',
        name: 'Shortlisting',
        description: 'Evaluate and shortlist applicants',
        core: false,
        standard: true,
        enterprise: true,
        status: 'Active',
      },
      {
        id: 'f-5',
        name: 'Admission & Enrolment',
        description: 'Convert shortlisted leads to students and enrol',
        core: false,
        standard: true,
        enterprise: true,
        status: 'Active',
      },
      {
        id: 'f-6',
        name: 'Application Management',
        description: 'Online application form and document collection',
        core: true,
        standard: true,
        enterprise: true,
        status: 'Active',
      },
    ],
  },
  {
    id: 'mod-2',
    name: 'Student Management',
    category: 'Academics',
    featureCount: 8,
    editionsAvailability: 'Core, Standard, Enterprise',
    status: 'Active',
    iconType: 'grad',
    description: 'Student profiles, roll number generation, section allocation, and guardian records.',
    features: [
      { id: 'f-21', name: 'Student Profile & KYC', description: 'Central student bio-data and records', core: true, standard: true, enterprise: true, status: 'Active' },
      { id: 'f-22', name: 'Roll & Section Allocation', description: 'Smart classroom division rules', core: true, standard: true, enterprise: true, status: 'Active' },
      { id: 'f-23', name: 'House & Club Assignments', description: 'Extracurricular tracking', core: false, standard: true, enterprise: true, status: 'Active' },
    ],
  },
  {
    id: 'mod-3',
    name: 'Fees & Payments',
    category: 'Finance',
    featureCount: 6,
    editionsAvailability: 'Standard, Enterprise',
    status: 'Active',
    iconType: 'card',
    description: 'Installment scheduling, online payment gateway, concession policies, and tax receipts.',
    features: [
      { id: 'f-31', name: 'Fee Structure Builder', description: 'Category and standard specific tuition', core: false, standard: true, enterprise: true, status: 'Active' },
      { id: 'f-32', name: 'Payment Gateway Integration', description: 'Razorpay, PayU, Stripe collection', core: false, standard: true, enterprise: true, status: 'Active' },
    ],
  },
  {
    id: 'mod-4',
    name: 'Attendance',
    category: 'Academics',
    featureCount: 5,
    editionsAvailability: 'Core, Standard, Enterprise',
    status: 'Active',
    iconType: 'calendar',
    description: 'Biometric device sync, subject-wise attendance, and automated SMS alerts for absentees.',
    features: [
      { id: 'f-41', name: 'Daily Period Attendance', description: 'Class teacher attendance registers', core: true, standard: true, enterprise: true, status: 'Active' },
    ],
  },
  {
    id: 'mod-5',
    name: 'Timetable',
    category: 'Academics',
    featureCount: 4,
    editionsAvailability: 'Standard, Enterprise',
    status: 'Active',
    iconType: 'calendar',
    description: 'Automatic clash-free timetable generator, teacher substitutions, and room allocations.',
    features: [
      { id: 'f-51', name: 'Schedule Matrix', description: 'Period grid and teacher workload tracker', core: false, standard: true, enterprise: true, status: 'Active' },
    ],
  },
  {
    id: 'mod-6',
    name: 'Assessment & Exams',
    category: 'Academics',
    featureCount: 7,
    editionsAvailability: 'Standard, Enterprise',
    status: 'Active',
    iconType: 'clipboard',
    description: 'Exam scheduling, hall tickets, mark sheets, grading scales, and ranking.',
    features: [
      { id: 'f-61', name: 'Grade Book Engine', description: 'Summative & formative exam evaluation', core: false, standard: true, enterprise: true, status: 'Active' },
    ],
  },
  {
    id: 'mod-7',
    name: 'Homework & Assignments',
    category: 'Academics',
    featureCount: 4,
    editionsAvailability: 'Core, Standard, Enterprise',
    status: 'Active',
    iconType: 'book',
    description: 'Digital homework dispatch, attachment submissions, teacher remarks, and deadline trackers.',
    features: [
      { id: 'f-71', name: 'Homework Diary', description: 'Daily syllabus homework and assignments', core: true, standard: true, enterprise: true, status: 'Active' },
    ],
  },
  {
    id: 'mod-8',
    name: 'Progress & Report Card',
    category: 'Analytics',
    featureCount: 5,
    editionsAvailability: 'Standard, Enterprise',
    status: 'Active',
    iconType: 'chart',
    description: 'Customizable report card templates, digital signatures, PDF export, and parent downloads.',
    features: [
      { id: 'f-81', name: 'Report Card Generator', description: 'CBSE / ICSE / IB compliant report templates', core: false, standard: true, enterprise: true, status: 'Active' },
    ],
  },
  {
    id: 'mod-9',
    name: 'Communication',
    category: 'Engagement',
    featureCount: 6,
    editionsAvailability: 'Core, Standard, Enterprise',
    status: 'Active',
    iconType: 'megaphone',
    description: 'Broadcast notices, circulars, automated SMS/WhatsApp alerts, and email notifications.',
    features: [
      { id: 'f-91', name: 'Notice Board Circulars', description: 'School-wide and section broadcast circulars', core: true, standard: true, enterprise: true, status: 'Active' },
    ],
  },
  {
    id: 'mod-10',
    name: 'Portals (Student/Parent/Teacher)',
    category: 'Collaboration',
    featureCount: 8,
    editionsAvailability: 'Standard, Enterprise',
    status: 'Active',
    iconType: 'users',
    description: 'Dedicated web & mobile portals with single sign-on, dashboard metrics, and document downloads.',
    features: [
      { id: 'f-101', name: 'Parent Mobile App Sync', description: 'Real-time notifications and fee receipts', core: false, standard: true, enterprise: true, status: 'Active' },
    ],
  },
];

export function FeaturesModulesScreen({
  initialTab = 'details',
}: {
  initialTab?: 'details' | 'features' | 'mapping';
}) {
  return <Suspense fallback={<p role="status">Loading product workspace...</p>}><ModulesWorkspace initialTab={initialTab} /></Suspense>;
}

function ModulesWorkspace({ initialTab }: { initialTab: 'details' | 'features' | 'mapping' }) {
  const productId = useSearchParams().get('product');
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('PEGATTO_PRODUCT_MASTER_RECORDS_V4') ?? 'null');
      if (Array.isArray(saved) && saved.length) setProducts(saved);
    } catch {
      // Keep the default preview if browser storage cannot be read.
    }
  }, []);
  const product = products.find(item => item.id === productId || (productId && item.product_code?.toLowerCase() === productId.toLowerCase())) ?? products[0];
  return <ProductModules key={product.id} product={product} initialTab={initialTab} />;
}

function ProductModules({ product, initialTab }: { product: typeof INITIAL_PRODUCTS[number]; initialTab: 'details' | 'features' | 'mapping' }) {
  const router = useRouter();
  const [modules, setModules] = useState<ModuleItem[]>(product.id === INITIAL_PRODUCTS[0].id ? INITIAL_MODULES : []);
  const [transferOpen, setTransferOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const activePage = Math.min(page, Math.max(0, Math.ceil(modules.length / pageSize) - 1));
  const visibleModules = modules.slice(activePage * pageSize, (activePage + 1) * pageSize);
  const [selectedModuleId, setSelectedModuleId] = useState<string>('mod-1');
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [rightActiveTab, setRightActiveTab] = useState<'details' | 'features' | 'mapping'>(initialTab);

  const selectedModule = modules.find((m) => m.id === selectedModuleId) || modules[0];

  const [formState, setFormState] = useState<Partial<ModuleItem>>({
    name: selectedModule?.name ?? '',
    category: selectedModule?.category ?? '',
    status: selectedModule?.status ?? 'Active',
    description: selectedModule?.description ?? '',
  });

  const handleSelectModule = (mod: ModuleItem) => {
    setSelectedModuleId(mod.id);
    setFormState({
      name: mod.name,
      category: mod.category,
      status: mod.status,
      description: mod.description,
    });
    setIsDrawerOpen(true);
  };

  function changeFeature(featureId: string, changes: Partial<ModuleItem['features'][number]>) {
    setModules(current => current.map(module => module.id === selectedModule?.id ? {
      ...module, features: module.features.map(feature => feature.id === featureId ? { ...feature, ...changes } : feature),
    } : module));
  }

  function includesFeature(feature: ModuleItem['features'][number], edition: typeof product.editions_details[number]) {
    const name = edition.name.toLowerCase();
    const original = name.startsWith('core') ? feature.core : name === 'standard' ? feature.standard : name === 'enterprise' ? feature.enterprise : false;
    return feature.availability?.[edition.id] ?? original;
  }

  const handleSaveModule = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = modules.map((m) => {
      if (m.id === selectedModuleId) {
        return {
          ...m,
          ...formState,
        } as ModuleItem;
      }
      return m;
    });
    setModules(updated);
    toast.success(`Module "${formState.name}" updated successfully!`);
  };

  const renderModuleIcon = (iconType: string) => {
    switch (iconType) {
      case 'users':
        return <Users className="h-4 w-4 text-[#6222cc]" />;
      case 'grad':
        return <GraduationCap className="h-4 w-4 text-[#6222cc]" />;
      case 'card':
        return <CreditCard className="h-4 w-4 text-[#6222cc]" />;
      case 'calendar':
        return <Calendar className="h-4 w-4 text-[#6222cc]" />;
      case 'clipboard':
        return <ClipboardList className="h-4 w-4 text-[#6222cc]" />;
      case 'book':
        return <BookOpen className="h-4 w-4 text-[#6222cc]" />;
      case 'chart':
        return <BarChart2 className="h-4 w-4 text-[#6222cc]" />;
      case 'megaphone':
        return <Megaphone className="h-4 w-4 text-[#6222cc]" />;
      default:
        return <Layers className="h-4 w-4 text-[#6222cc]" />;
    }
  };

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto">
      {/* 1. Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl shadow-xs">
            <IsometricBoxIcon className="h-8 w-8 text-[#6222cc]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Product Master
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Create and manage all Pegatto products, editions, versions and lifecycle
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={() => router.push('/products/master?mode=add')}
            className="bg-[#5024e8] hover:bg-[#4218ce] text-white font-medium text-sm px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => setTransferOpen(true)}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-sm px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-xs"
          >
            <Upload className="h-4 w-4 text-slate-600" />
            <span>Import / Export</span>
          </Button>

          <Button
            variant="outline"
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-sm px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-xs"
          >
            <HelpCircle className="h-4 w-4 text-slate-600" />
            <span>Help</span>
          </Button>
        </div>
      </div>

      {/* 5. Main Split Screen (Image 1) */}
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-12 xl:items-stretch">
        {/* Left Side: Features & Modules Table */}
        <div className={cn('min-w-0 space-y-4 rounded-2xl border border-indigo-100 bg-white p-4', isDrawerOpen ? 'lg:col-span-12 xl:col-span-6' : 'lg:col-span-12')}>
          <div className="space-y-3">
          {/* 2. Breadcrumb */}
          <div>
            <button
              type="button"
              onClick={() => router.push('/products/master')}
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#6222cc] hover:text-[#521cb0] transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Product List</span>
            </button>
          </div>

          {/* 3. Product Summary Banner */}
          <div className="flex items-start justify-between gap-4 p-1 ">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 p-2.5 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#6222cc]">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">{product.product_name}</h2>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    {product.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 max-w-xl">
                  {product.short_description}
                </p>
              </div>
            </div>
          </div>

          {/* 4. Navigation Tabs */}
          <div className="grid grid-cols-2 gap-1.5 border-b border-indigo-100 sm:grid-cols-4">
            <button
              type="button"
              onClick={() => router.push('/products/master')}
              className="px-2 py-3 text-xs font-semibold rounded-t-lg bg-violet-50 hover:bg-violet-100 text-indigo-950 border border-violet-100 transition-all"
            >
              Product Details
            </button>
            <button
              type="button"
              onClick={() => router.push('/products/editions?product=' + encodeURIComponent(product.id))}
              className="px-2 py-3 text-xs font-semibold rounded-t-lg bg-violet-50 hover:bg-violet-100 text-indigo-950 border border-violet-100 transition-all"
            >
              Editions ({(product.editions_details ?? []).length})
            </button>
            <button
              type="button"
              className="px-2 py-3 text-xs font-semibold rounded-t-lg bg-[#5024e8] text-white "
            >
              Features & Modules
            </button>
            <button
              type="button"
              onClick={() => router.push('/products/plans-pricing')}
              className="px-2 py-3 text-xs font-semibold rounded-t-lg bg-violet-50 hover:bg-violet-100 text-indigo-950 border border-violet-100 transition-all"
            >
              Plans & Pricing
            </button>
          </div>
          </div>
          {/* Section Header */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-blue-50 text-[#6222cc]">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Features & Modules</h3>
                <p className="text-xs text-slate-500">
                  Preview modules, features, and their edition availability.
                </p>
              </div>
            </div>

            <Button
              onClick={() => {
                const newMod: ModuleItem = {
                  id: `mod-${Date.now()}`,
                  name: '',
                  category: 'Admissions',
                  featureCount: 0,
                  editionsAvailability: '',
                  status: 'Active',
                  iconType: 'users',
                  description: '',
                  features: [],
                };
                setModules([...modules, newMod]);
                handleSelectModule(newMod);
                setRightActiveTab('details');
                setPage(Math.floor(modules.length / pageSize));

              }}
              className="bg-[#5024e8] hover:bg-[#4218ce] text-white font-medium text-xs sm:text-sm px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Add Module</span>
            </Button>
          </div>

          {/* Modules Table */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-indigo-50 text-slate-800 font-semibold text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-3 text-center w-8">#</th>
                    <th className="py-3 px-4">Module / Feature</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3 text-center">Features</th>
                    <th className="py-3 px-4">Editions Availability</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {!modules.length && <tr><td colSpan={7} className="p-4 text-slate-500">No modules to show for this product.</td></tr>}
                  {visibleModules.map((mod, index) => {
                    const isSelected = selectedModuleId === mod.id && isDrawerOpen;
                    return (
                      <tr
                        key={mod.id}
                        onClick={() => handleSelectModule(mod)}
                        className={cn(
                          'cursor-pointer transition-colors',
                          isSelected ? 'bg-violet-100/70 font-medium' : 'hover:bg-slate-50/70'
                        )}
                      >
                        <td className="py-3 px-3 text-center text-slate-500 text-xs font-semibold">
                          {activePage * pageSize + index + 1}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="p-1 rounded-md bg-blue-50 text-[#6222cc]">
                              {renderModuleIcon(mod.iconType)}
                            </div>
                            <span className="font-semibold text-slate-900">{mod.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-600 text-xs">{mod.category}</td>
                        <td className="py-3 px-3 text-center font-semibold text-slate-800">
                          {mod.features.length}
                        </td>
                        <td className="py-3 px-4 text-slate-600 text-xs">{(product.editions_details ?? []).filter(edition => mod.features.some(feature => includesFeature(feature, edition))).map(edition => edition.name).join(', ') || '—'}</td>
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            {mod.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => handleSelectModule(mod)}
                              title="Edit Module"
                              className="p-1 rounded-md text-[#6222cc] hover:bg-blue-50 transition-colors"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const cloned: ModuleItem = {
                                  ...mod,
                                  id: `mod-${Date.now()}`,
                                  name: `${mod.name} (Copy)`,
                                };
                                setModules([...modules, cloned]);
                                toast.success(`Cloned ${mod.name}`);
                              }}
                              title="Duplicate Module"
                              className="p-1 rounded-md text-[#6222cc] hover:bg-blue-50 transition-colors"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setModules(modules.filter((m) => m.id !== mod.id));
                                if (selectedModuleId === mod.id) setIsDrawerOpen(false);
                                toast.success(`Deleted ${mod.name}`);
                              }}
                              title="Delete Module"
                              className="p-1 rounded-md text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-slate-100 bg-white text-xs text-slate-600">
              <div>Showing {modules.length ? activePage * pageSize + 1 : 0} - {activePage * pageSize + visibleModules.length} of {modules.length} modules</div>
              <div className="flex items-center gap-1.5">
                <button type="button" aria-label="Previous page" disabled={!activePage} onClick={() => setPage(activePage - 1)} className="p-1.5 rounded-md border border-slate-200 disabled:opacity-50">
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button type="button" className="w-7 h-7 flex items-center justify-center rounded-md bg-[#5024e8] text-white font-semibold shadow-xs">
                  {activePage + 1}
                </button>
                <button type="button" aria-label="Next page" disabled={(activePage + 1) * pageSize >= modules.length} onClick={() => setPage(activePage + 1)} className="p-1.5 rounded-md border border-slate-200 disabled:opacity-50">
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-1.5">
                <span>Items per page</span>
                <select aria-label="Items per page" value={pageSize} onChange={event => { setPageSize(Number(event.target.value)); setPage(0); }} className="h-7 px-2 border border-slate-200 rounded-md bg-white text-slate-700 outline-hidden">
                  <option value="10">10</option>
                  <option value="20">20</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Module Details Panel (Image 1) */}
        {isDrawerOpen && selectedModule && (
          <div className="min-w-0 lg:col-span-12 xl:col-span-6 rounded-2xl border border-indigo-100 bg-white p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-blue-50 text-[#6222cc]">
                  {renderModuleIcon(selectedModule.iconType)}
                </div>
                <h3 className="text-base font-bold text-slate-900">{selectedModule.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Right Tabs */}
            <div className="grid grid-cols-3 items-stretch gap-1.5 border-b border-indigo-100">
              <button
                type="button"
                onClick={() => setRightActiveTab('details')}
                className={cn(
                  'px-2 py-3 text-xs font-semibold rounded-t-lg transition-colors',
                  rightActiveTab === 'details'
                    ? 'bg-[#5024e8] text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                )}
              >
                Module Details
              </button>
              <button
                type="button"
                onClick={() => setRightActiveTab('features')}
                className={cn(
                  'px-2 py-3 text-xs font-semibold rounded-t-lg transition-colors',
                  rightActiveTab === 'features'
                    ? 'bg-[#5024e8] text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                )}
              >
                Features ({selectedModule.features.length})
              </button>
              <button
                type="button"
                onClick={() => setRightActiveTab('mapping')}
                className={cn(
                  'px-2 py-3 text-xs font-semibold rounded-t-lg transition-colors',
                  rightActiveTab === 'mapping'
                    ? 'bg-[#5024e8] text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                )}
              >
                Edition Mapping
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveModule} className="space-y-3.5">
              {/* Row 1: Module Name, Category, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="space-y-1 sm:col-span-1">
                  <label className="text-xs font-semibold text-slate-800">
                    Module Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formState.name || ''}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="h-8.5 text-xs bg-white border-slate-200 rounded-lg"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-800">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formState.category || 'Admissions'}
                    onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                    className="w-full h-8.5 px-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 outline-hidden"
                  >
                    <option value="Admissions">Admissions</option>
                    <option value="Academics">Academics</option>
                    <option value="Finance">Finance</option>
                    <option value="Analytics">Analytics</option>
                    <option value="Engagement">Engagement</option>
                    <option value="Collaboration">Collaboration</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-800">Status</label>
                  <div className="relative">
                    <select
                      value={formState.status || 'Active'}
                      onChange={(e) => setFormState({ ...formState, status: e.target.value as any })}
                      className="w-full h-8.5 pl-6 pr-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 outline-hidden"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                </div>
              </div>

              {/* Row 2: Description */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-800">
                  Description <span className="text-red-500">*</span>
                </label>
                <Textarea
                  rows={2}
                  value={formState.description || ''}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  className="text-xs bg-white border-slate-200 rounded-lg resize-none"
                  required
                />
              </div>

              {/* Section: Features in this Module */}
              <div className="pt-2">
                <div className="flex items-center justify-between pb-2">
                  <h4 className="text-xs font-bold text-slate-900">
                    {rightActiveTab === 'mapping' ? 'Edition Mapping' : 'Features in this Module'} ({selectedModule.features.length})
                  </h4>
                  <Button
                    type="button"
                    onClick={() => {
                      const newFeature = {
                        id: `f-${Date.now()}`,
                        name: '',
                        description: '',
                        core: false,
                        standard: false,
                        enterprise: false,
                        status: 'Active' as const,
                      };
                      const updated = modules.map((m) => {
                        if (m.id === selectedModuleId) {
                          return {
                            ...m,
                            features: [...m.features, newFeature],
                          };
                        }
                        return m;
                      });
                      setModules(updated);
                      setRightActiveTab('features');
                    }}
                    className="bg-[#5024e8] hover:bg-[#4218ce] text-white font-medium text-[11px] px-2.5 py-1 h-7 rounded-md flex items-center gap-1 shadow-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Feature</span>
                  </Button>
                </div>

                {/* Features Table */}
                <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-indigo-50 text-slate-800 font-semibold border-b border-slate-200 text-[11px]">
                        <th className="py-2 px-2 text-center w-6">#</th>
                        <th className="py-2 px-3">Feature Name</th>
                        <th className="py-2 px-3">Description</th>
                        {(product.editions_details ?? []).map(edition => <th key={edition.id} className="px-2 py-2 text-center">{edition.name}</th>)}
                        <th className="py-2 px-2 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedModule.features.map((feat, fIdx) => (
                        <tr key={feat.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-2 px-2 text-center text-slate-500 text-[11px]">
                            {fIdx + 1}
                          </td>
                          <td className="py-2 px-3 font-semibold text-slate-900 text-xs">
                            {rightActiveTab === 'features' ? <Input aria-label="Feature name" value={feat.name} onChange={event => changeFeature(feat.id, { name: event.target.value })} /> : feat.name}
                          </td>
                          <td className="py-2 px-3 text-[11px] text-slate-500 max-w-[140px] truncate">
                            {rightActiveTab === 'features' ? <Input aria-label="Feature description" value={feat.description} onChange={event => changeFeature(feat.id, { description: event.target.value })} /> : feat.description}
                          </td>
                          {(product.editions_details ?? []).map(edition => <td key={edition.id} className="px-2 py-2 text-center">
                            <input type="checkbox" aria-label={feat.name + ' in ' + edition.name} checked={includesFeature(feat, edition)}
                              onChange={event => changeFeature(feat.id, { availability: { ...feat.availability, [edition.id]: event.target.checked } })}
                              className="size-3.5 cursor-pointer accent-violet-700" />
                          </td>)}
                          {/* Status Pill */}
                          <td className="py-2 px-2 text-center">
                            <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-green-100 text-green-800">
                              {feat.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 border-t border-indigo-100 pt-4">
                <Button
                  type="submit"
                  className="bg-[#5024e8] hover:bg-[#4218ce] text-white font-medium text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Check className="h-4 w-4" />
                  <span>Update Module</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDrawerOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 border-none text-slate-700 font-medium text-xs px-4 py-2 rounded-lg"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
      <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Import / Export</DialogTitle>
            <DialogDescription>Transfer preview modules for {product.product_name} as JSON.</DialogDescription>
          </DialogHeader>
          <Button type="button" variant="outline" onClick={() => {
            const url = URL.createObjectURL(new Blob([JSON.stringify(modules, null, 2)], { type: 'application/json' }));
            const link = document.createElement('a');
            link.href = url;
            link.download = product.id + '-modules.json';
            link.click();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
          }}>Export Modules</Button>
          <label className="grid gap-2 text-sm font-medium">Import Modules
            <Input type="file" accept=".json,application/json" onChange={async event => {
              const file = event.target.files?.[0];
              if (!file) return;
              try {
                const input: unknown = JSON.parse(await file.text());
                if (!Array.isArray(input) || !input.every(item =>
                  item && typeof item.name === 'string' && typeof item.category === 'string' &&
                  typeof item.description === 'string' && ['Active', 'Inactive'].includes(item.status) &&
                  Array.isArray(item.features) && item.features.every((feature: ModuleItem['features'][number]) =>
                    feature && typeof feature.name === 'string' && typeof feature.description === 'string' &&
                    ['Active', 'Inactive'].includes(feature.status)
                  )
                )) throw Error('Invalid module file');
                const imported = (input as ModuleItem[]).map(item => ({
                  ...item, id: crypto.randomUUID(),
                  features: item.features.map(feature => ({ ...feature, id: crypto.randomUUID() })),
                }));
                setModules(current => [...current, ...imported]);
                setTransferOpen(false);
                toast.success('Modules imported into this preview.');
              } catch {
                toast.error('Choose a valid modules JSON export.');
              }
            }} />
          </label>
        </DialogContent>
      </Dialog>
      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Modules &amp; Features</DialogTitle>
            <DialogDescription>How editions, modules, and features fit together.</DialogDescription>
          </DialogHeader>
          <ul className="list-disc space-y-2 pl-5 text-sm">
            <li>Create editions for the product before mapping feature availability.</li>
            <li>Group related features under a module. Use Edition Mapping to review which editions include those features.</li>
            <li>This UI preview uses sample records and keeps module edits in this session.</li>
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
}
