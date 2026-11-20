'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [modules, setModules] = useState<ModuleItem[]>(INITIAL_MODULES);
  const [selectedModuleId, setSelectedModuleId] = useState<string>('mod-1');
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [rightActiveTab, setRightActiveTab] = useState<'details' | 'features' | 'mapping'>(initialTab);

  const selectedModule = modules.find((m) => m.id === selectedModuleId) || modules[0];

  const [formState, setFormState] = useState<Partial<ModuleItem>>({
    name: selectedModule.name,
    category: selectedModule.category,
    status: selectedModule.status,
    description: selectedModule.description,
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

  const handleToggleFeature = (featureId: string, editionKey: 'core' | 'standard' | 'enterprise') => {
    const updated = modules.map((m) => {
      if (m.id === selectedModuleId) {
        return {
          ...m,
          features: m.features.map((f) => {
            if (f.id === featureId) {
              return {
                ...f,
                [editionKey]: !f[editionKey],
              };
            }
            return f;
          }),
        };
      }
      return m;
    });
    setModules(updated);
    toast.success('Updated feature edition availability');
  };

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
        return <Users className="h-4 w-4 text-blue-600" />;
      case 'grad':
        return <GraduationCap className="h-4 w-4 text-blue-600" />;
      case 'card':
        return <CreditCard className="h-4 w-4 text-blue-600" />;
      case 'calendar':
        return <Calendar className="h-4 w-4 text-blue-600" />;
      case 'clipboard':
        return <ClipboardList className="h-4 w-4 text-blue-600" />;
      case 'book':
        return <BookOpen className="h-4 w-4 text-blue-600" />;
      case 'chart':
        return <BarChart2 className="h-4 w-4 text-blue-600" />;
      case 'megaphone':
        return <Megaphone className="h-4 w-4 text-blue-600" />;
      default:
        return <Layers className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto">
      {/* 1. Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl shadow-xs">
            <IsometricBoxIcon className="h-8 w-8 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {rightActiveTab === 'features'
                ? 'Feature Master'
                : rightActiveTab === 'mapping'
                ? 'Feature Mapping'
                : 'Module Master'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {rightActiveTab === 'features'
                ? 'Manage, configure, and assign product features across modules'
                : rightActiveTab === 'mapping'
                ? 'Map modules and feature sets to editions and tier packages'
                : 'Configure and manage functional modules, feature counts, and edition assignments'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={() => router.push('/products/master')}
            className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium text-sm px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </Button>

          <Button
            variant="outline"
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

      {/* 2. Breadcrumb */}
      <div>
        <button
          type="button"
          onClick={() => router.push('/products/master')}
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Product List</span>
        </button>
      </div>

      {/* 3. Product Summary Banner */}
      <div className="flex items-start justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Pegatto Education</h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Education management platform for admissions, academics, fees, communication and analytics.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => router.push('/products/master')}
          className="px-4 py-2 text-xs sm:text-sm font-medium rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all"
        >
          Product Details
        </button>
        <button
          type="button"
          onClick={() => router.push('/products/editions')}
          className="px-4 py-2 text-xs sm:text-sm font-medium rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all"
        >
          Editions (3)
        </button>
        <button
          type="button"
          className="px-4 py-2 text-xs sm:text-sm font-medium rounded-lg bg-[#4F46E5] text-white shadow-xs"
        >
          Features & Modules
        </button>
        <button
          type="button"
          onClick={() => router.push('/products/plans-pricing')}
          className="px-4 py-2 text-xs sm:text-sm font-medium rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all"
        >
          Plans & Pricing
        </button>
      </div>

      {/* 5. Main Split Screen (Image 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Side: Features & Modules Table */}
        <div className={cn('space-y-3 transition-all', isDrawerOpen ? 'lg:col-span-7' : 'lg:col-span-12')}>
          {/* Section Header */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-indigo-50 text-indigo-600">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Features & Modules</h3>
                <p className="text-xs text-slate-500">
                  Define and manage modules, features and their edition availability.
                </p>
              </div>
            </div>

            <Button
              onClick={() => {
                const newMod: ModuleItem = {
                  id: `mod-${Date.now()}`,
                  name: 'New Custom Module',
                  category: 'Admissions',
                  featureCount: 1,
                  editionsAvailability: 'Standard, Enterprise',
                  status: 'Active',
                  iconType: 'layers' as any,
                  description: 'Custom capability module description',
                  features: [
                    { id: `f-${Date.now()}`, name: 'Base Feature', description: 'Core feature capability', core: true, standard: true, enterprise: true, status: 'Active' },
                  ],
                };
                setModules([...modules, newMod]);
                setSelectedModuleId(newMod.id);
                toast.success('Added new module');
              }}
              className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium text-xs sm:text-sm px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs"
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
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-slate-600 font-semibold text-[11px] uppercase tracking-wider">
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
                  {modules.map((mod, index) => {
                    const isSelected = selectedModuleId === mod.id && isDrawerOpen;
                    return (
                      <tr
                        key={mod.id}
                        onClick={() => handleSelectModule(mod)}
                        className={cn(
                          'cursor-pointer transition-colors',
                          isSelected ? 'bg-indigo-50/60 font-medium' : 'hover:bg-slate-50/70'
                        )}
                      >
                        <td className="py-3 px-3 text-center text-slate-500 text-xs font-semibold">
                          {index + 1}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="p-1 rounded-md bg-blue-50 text-blue-600">
                              {renderModuleIcon(mod.iconType)}
                            </div>
                            <span className="font-semibold text-slate-900">{mod.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-600 text-xs">{mod.category}</td>
                        <td className="py-3 px-3 text-center font-semibold text-slate-800">
                          {mod.features.length || mod.featureCount}
                        </td>
                        <td className="py-3 px-4 text-slate-600 text-xs">{mod.editionsAvailability}</td>
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                            {mod.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => handleSelectModule(mod)}
                              title="Edit Module"
                              className="p-1 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
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
                              className="p-1 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setModules(modules.filter((m) => m.id !== mod.id));
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
              <div>Showing 1 - {modules.length} of {modules.length} modules</div>
              <div className="flex items-center gap-1.5">
                <button type="button" disabled className="p-1.5 rounded-md border border-slate-200 text-slate-400 opacity-50">
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button type="button" className="w-7 h-7 flex items-center justify-center rounded-md bg-[#4F46E5] text-white font-semibold shadow-xs">
                  1
                </button>
                <button type="button" disabled className="p-1.5 rounded-md border border-slate-200 text-slate-400 opacity-50">
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-1.5">
                <span>Items per page</span>
                <select defaultValue="10" className="h-7 px-2 border border-slate-200 rounded-md bg-white text-slate-700 outline-hidden">
                  <option value="10">10</option>
                  <option value="20">20</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Module Details Panel (Image 1) */}
        {isDrawerOpen && (
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/90 shadow-sm p-5 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-blue-50 text-blue-600">
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
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setRightActiveTab('details')}
                className={cn(
                  'px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all',
                  rightActiveTab === 'details'
                    ? 'bg-[#4F46E5] text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                )}
              >
                Module Details
              </button>
              <button
                type="button"
                onClick={() => setRightActiveTab('features')}
                className={cn(
                  'px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all',
                  rightActiveTab === 'features'
                    ? 'bg-[#4F46E5] text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                )}
              >
                Features ({selectedModule.features.length})
              </button>
              <button
                type="button"
                onClick={() => setRightActiveTab('mapping')}
                className={cn(
                  'px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all',
                  rightActiveTab === 'mapping'
                    ? 'bg-[#4F46E5] text-white shadow-xs'
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
                  <label className="text-[11px] font-semibold text-slate-700">
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
                  <label className="text-[11px] font-semibold text-slate-700">
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
                  <label className="text-[11px] font-semibold text-slate-700">Status</label>
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
                <label className="text-[11px] font-semibold text-slate-700">
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
                    Features in this Module ({selectedModule.features.length})
                  </h4>
                  <Button
                    type="button"
                    onClick={() => {
                      const newFeature = {
                        id: `f-${Date.now()}`,
                        name: 'New Feature',
                        description: 'Custom capability within this module',
                        core: false,
                        standard: true,
                        enterprise: true,
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
                      toast.success('Added new feature');
                    }}
                    className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium text-[11px] px-2.5 py-1 h-7 rounded-md flex items-center gap-1 shadow-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Feature</span>
                  </Button>
                </div>

                {/* Features Table */}
                <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
                        <th className="py-2 px-2 text-center w-6">#</th>
                        <th className="py-2 px-3">Feature Name</th>
                        <th className="py-2 px-3">Description</th>
                        <th className="py-2 px-2 text-center w-12">Core</th>
                        <th className="py-2 px-2 text-center w-14">Standard</th>
                        <th className="py-2 px-2 text-center w-16">Enterprise</th>
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
                            {feat.name}
                          </td>
                          <td className="py-2 px-3 text-[11px] text-slate-500 max-w-[140px] truncate">
                            {feat.description}
                          </td>
                          {/* Core Checkbox */}
                          <td className="py-2 px-2 text-center">
                            <input
                              type="checkbox"
                              checked={feat.core}
                              onChange={() => handleToggleFeature(feat.id, 'core')}
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer h-3.5 w-3.5"
                            />
                          </td>
                          {/* Standard Checkbox */}
                          <td className="py-2 px-2 text-center">
                            <input
                              type="checkbox"
                              checked={feat.standard}
                              onChange={() => handleToggleFeature(feat.id, 'standard')}
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer h-3.5 w-3.5"
                            />
                          </td>
                          {/* Enterprise Checkbox */}
                          <td className="py-2 px-2 text-center">
                            <input
                              type="checkbox"
                              checked={feat.enterprise}
                              onChange={() => handleToggleFeature(feat.id, 'enterprise')}
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer h-3.5 w-3.5"
                            />
                          </td>
                          {/* Status Pill */}
                          <td className="py-2 px-2 text-center">
                            <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700">
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
              <div className="flex items-center gap-2.5 pt-3">
                <Button
                  type="submit"
                  className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
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
    </div>
  );
}
