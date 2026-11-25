'use client';

import React from 'react';
import {
  GraduationCap,
  Laptop,
  Users,
  ShoppingCart,
  Building2,
  Handshake,
  Layers,
  Box,
  BookOpen,
  CreditCard,
  Calendar,
  Award,
  Globe,
  PieChart,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function IsometricBoxIcon({ className = 'h-8 w-8 text-[#6222cc]' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* 3D Isometric Cube matching the top-left logo icon in screenshots */}
      <path d="M16 2 L29 9.5 L29 22.5 L16 30 L3 22.5 L3 9.5 Z" />
      <path d="M16 2 L16 16 L29 9.5" />
      <path d="M16 16 L3 9.5" />
      <path d="M16 16 L16 30" />
    </svg>
  );
}

export function IsometricLayersIcon({
  className = 'h-5 w-5',
  color = '#6222cc',
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Top layer */}
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      {/* Middle layer */}
      <path d="M2 12l10 5 10-5" />
      {/* Bottom layer */}
      <path d="M2 17l10 5 10-5" />
    </svg>
  );
}

export function ProductBadgeIcon({
  type,
  size = 'md',
  className,
}: {
  type?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'w-7 h-7 p-1.5 rounded-lg',
    md: 'w-8 h-8 p-1.5 rounded-xl',
    lg: 'w-10 h-10 p-2 rounded-xl',
    xl: 'w-12 h-12 p-2.5 rounded-2xl',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-4.5 h-4.5',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  };

  const t = (type || '').toLowerCase();

  if (t.includes('edu')) {
    return (
      <div className={cn('flex items-center justify-center bg-purple-50 text-[#6222cc] border border-purple-100 shrink-0', sizeClasses[size], className)}>
        <GraduationCap className={iconSizes[size]} />
      </div>
    );
  }

  if (t.includes('it') || t.includes('tech') || t.includes('service')) {
    return (
      <div className={cn('flex items-center justify-center bg-sky-50 text-sky-600 border border-sky-100 shrink-0', sizeClasses[size], className)}>
        <Laptop className={iconSizes[size]} />
      </div>
    );
  }

  if (t.includes('people') || t.includes('hr')) {
    return (
      <div className={cn('flex items-center justify-center bg-purple-50 text-purple-600 border border-purple-100 shrink-0', sizeClasses[size], className)}>
        <Users className={iconSizes[size]} />
      </div>
    );
  }

  if (t.includes('retail') || t.includes('pos') || t.includes('shop') || t.includes('ret')) {
    return (
      <div className={cn('flex items-center justify-center bg-rose-50 text-rose-600 border border-rose-100 shrink-0', sizeClasses[size], className)}>
        <ShoppingCart className={iconSizes[size]} />
      </div>
    );
  }

  if (t.includes('real') || t.includes('estate') || t.includes('property') || t.includes('re')) {
    return (
      <div className={cn('flex items-center justify-center bg-purple-50 text-purple-700 border border-purple-100 shrink-0', sizeClasses[size], className)}>
        <Building2 className={iconSizes[size]} />
      </div>
    );
  }

  if (t.includes('crm') || t.includes('sale') || t.includes('cust')) {
    return (
      <div className={cn('flex items-center justify-center bg-indigo-50 text-indigo-600 border border-indigo-100 shrink-0', sizeClasses[size], className)}>
        <Handshake className={iconSizes[size]} />
      </div>
    );
  }

  if (t.includes('fin') || t.includes('bill') || t.includes('pay')) {
    return (
      <div className={cn('flex items-center justify-center bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0', sizeClasses[size], className)}>
        <CreditCard className={iconSizes[size]} />
      </div>
    );
  }

  if (t.includes('health') || t.includes('med') || t.includes('care')) {
    return (
      <div className={cn('flex items-center justify-center bg-rose-50 text-rose-600 border border-rose-100 shrink-0', sizeClasses[size], className)}>
        <Award className={iconSizes[size]} />
      </div>
    );
  }

  if (t.includes('core') || t.includes('plat') || t.includes('free')) {
    return (
      <div className={cn('flex items-center justify-center bg-purple-50 text-[#6222cc] border border-purple-100 shrink-0', sizeClasses[size], className)}>
        <Layers className={iconSizes[size]} />
      </div>
    );
  }

  return (
    <div className={cn('flex items-center justify-center bg-slate-50 text-slate-700 border border-slate-200 shrink-0', sizeClasses[size], className)}>
      <Box className={iconSizes[size]} />
    </div>
  );
}

export function CapabilityIcon({
  type,
  className = 'w-4 h-4 text-[#6222cc]',
}: {
  type?: string;
  className?: string;
}) {
  switch (type) {
    case 'users':
      return <Users className={className} />;
    case 'book':
      return <BookOpen className={className} />;
    case 'card':
      return <CreditCard className={className} />;
    case 'calendar':
      return <Calendar className={className} />;
    case 'award':
      return <Award className={className} />;
    case 'portal':
      return <Globe className={className} />;
    case 'analytics':
      return <PieChart className={className} />;
    case 'building':
      return <Building2 className={className} />;
    default:
      return <Box className={className} />;
  }
}
