'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { NavLink } from './NavLink';
import {
  LayoutDashboard,
  Table,
  FileText,
  User,
  Settings,
  Shield,
  ShieldCheck,
  Layers,
  ChevronDown,
  BarChart3,
  CreditCard,
  Building2,
  Receipt,
  DollarSign,
  Server,
  Cpu,
  UserPlus,
  Package,
  PackagePlus,
  Puzzle,
  GitBranch,
  Store,
  HardDrive,
  CalendarClock,
  UserMinus,
  Users,
  CheckSquare,
  Kanban,
  BarChart2,
  Calendar,
  Ticket,
  ClipboardList,
  Menu,
  UserCheck,
  Sliders,
  Activity,
  TrendingUp,
  ShoppingCart,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export interface MenuItem {
  icon?: React.ElementType;
  label: string;
  path: string;
  subItems?: MenuItem[];
}

export interface MenuSection {
  title?: string;
  items: MenuItem[];
}

export const getMenuGroups = (): MenuSection[] => [
  {
    items: [
      {
        icon: LayoutDashboard,
        label: 'Dashboard',
        path: '/dashboard',
      },
      {
        icon: Package,
        label: 'Product Management',
        path: '/products/master',
        subItems: [
          { label: 'Product Master', path: '/products/master' },
          { label: 'Editions & Versions', path: '/products/editions' },
          { label: 'Module Master', path: '/products/modules' },
          { label: 'Feature Master', path: '/products/features' },
          { label: 'Free Core Configuration', path: '/products/configuration' },
          { label: 'Trial Configuration', path: '/products/trial-configuration' },
          { label: 'Product Releases', path: '/products/releases' },
          { label: 'Feature Mapping', path: '/products/feature-mapping' },
          { label: 'Product Pricing', path: '/products/pricing' },
          { label: 'Free & Paid Plans', path: '/products/free-paid-plans' },
          { label: 'License & Entitlements', path: '/products/license-entitlements' },
        ],
      },
      {
        icon: Layers,
        label: 'Subscriptions',
        path: '/subscriptions/plans',
        subItems: [
          { label: 'Subscription Plans', path: '/subscriptions/plans' },
          { label: 'Subscription Lifecycle', path: '/subscriptions/lifecycle' },
          { label: 'Renewals & Expiry', path: '/subscriptions/renewals' },
          { label: 'Discounts & Coupons', path: '/subscriptions/discounts-coupons' },
          { label: 'Tenant Trials', path: '/subscriptions/trials' },
        ],
      },
      {
        icon: PackagePlus,
        label: 'Add-on Marketplace',
        path: '/addon-marketplace/master',
        subItems: [
          { label: 'Add-on Master', path: '/addon-marketplace/master' },
          { label: 'Add-on Categories', path: '/addon-marketplace/categories' },
          { label: 'Add-on Pricing', path: '/addon-marketplace/pricing' },
          { label: 'Price Templates', path: '/addon-marketplace/price-templates' },
          { label: 'Tiered Pricing', path: '/addon-marketplace/tiered-pricing' },
          { label: 'Discounts & Coupons', path: '/addon-marketplace/discounts-coupons' },
          { label: 'Price History', path: '/addon-marketplace/price-history' },
          { label: 'Product Compatibility', path: '/addon-marketplace/compatibility' },
        ],
      },
      {
        icon: Puzzle,
        label: 'Product Compatibility',
        path: '/addon-marketplace/compatibility',
      },
      {
        icon: ShieldCheck,
        label: 'License & Entitlements',
        path: '/products/license-entitlements',
      },
      {
        icon: ShoppingCart,
        label: 'Purchase & Activation',
        path: '/purchase-activation/purchases',
        subItems: [
          { label: 'Purchases', path: '/purchase-activation/purchases' },
          { label: 'Activations', path: '/purchase-activation/activations' },
          { label: 'Activation Queue', path: '/purchase-activation/activation-queue' },
          { label: 'Payment Transactions', path: '/purchase-activation/payment-transactions' },
          { label: 'Invoices', path: '/purchase-activation/invoices' },
        ],
      },
      {
        icon: Receipt,
        label: 'Invoices',
        path: '/purchase-activation/invoices',
      },
      {
        icon: Activity,
        label: 'Usage',
        path: '/usage',
      },
      {
        icon: GitBranch,
        label: 'Version & Dependencies',
        path: '/products/editions',
      },
      {
        icon: Building2,
        label: 'Tenant Management',
        path: '/tenant-management/all',
        subItems: [
          { label: 'Tenants (All)', path: '/tenant-management/all' },
          { label: 'Tenant Registration', path: '/tenant-management/registration' },
          { label: 'Approval & Onboarding', path: '/tenant-management/onboarding' },
          { label: 'Tenant Provisioning', path: '/tenant-management/provisioning' },
          { label: 'Tenant Status & Lifecycle', path: '/tenant-management/lifecycle' },
          { label: 'Tenant Usage & Limits', path: '/tenant-management/usage' },
          { label: 'Tenant Settings', path: '/tenant-management/settings' },
          { label: 'Tenant Suspension & Reactivation', path: '/tenant-management/suspension' },
          { label: 'Tenant Data Export & Deletion', path: '/tenant-management/export-deletion' },
        ],
      },
      {
        icon: Store,
        label: 'Partner Management',
        path: '/customer/overview',
      },
      {
        icon: Users,
        label: 'User & Access Management',
        path: '/settings/roles-users',
      },
      {
        icon: Settings,
        label: 'Settings',
        path: '/settings',
      },
    ],
  },
];

export function isRouteActive(targetPath: string, currentPath: string | null): boolean {
  if (!currentPath) return false;

  // Direct exact match
  if (currentPath === targetPath) return true;

  // Dashboard root & aliases
  if (targetPath === '/dashboard') {
    return (
      currentPath === '/' ||
      currentPath === '/dashboard' ||
      currentPath.startsWith('/dashboard/')
    );
  }

  // Product Management aliases & deep routes
  if (targetPath === '/products/master') {
    return (
      currentPath === '/products' ||
      (currentPath.startsWith('/products/') &&
        !currentPath.includes('/license-entitlements') &&
        !currentPath.includes('/editions'))
    );
  }

  // Version & Dependencies
  if (targetPath === '/products/editions') {
    return currentPath === '/products/editions' || currentPath.startsWith('/products/editions/');
  }

  // License & Entitlements
  if (targetPath === '/products/license-entitlements') {
    return currentPath === '/products/license-entitlements' || currentPath.startsWith('/products/license-entitlements/');
  }

  // Add-on Marketplace
  if (targetPath === '/addon-marketplace/master') {
    return (
      currentPath === '/addon-marketplace' ||
      (currentPath.startsWith('/addon-marketplace/') && !currentPath.includes('/compatibility'))
    );
  }

  // Product Compatibility
  if (targetPath === '/addon-marketplace/compatibility') {
    return currentPath === '/addon-marketplace/compatibility';
  }

  // Tenant Management aliases & deep routes
  if (targetPath === '/tenant-management/all' || targetPath === '/tenant-management/onboarding') {
    return currentPath === '/tenant-management' || currentPath.startsWith('/tenant-management');
  }

  // Partner / Customer Management
  if (targetPath === '/customer/overview') {
    return (
      currentPath === '/customer' ||
      currentPath.startsWith('/customer/') ||
      currentPath === '/partner-management' ||
      currentPath.startsWith('/partner-management/')
    );
  }

  // User & Access Management
  if (targetPath === '/settings/roles-users') {
    return currentPath === '/settings/roles-users' || currentPath.startsWith('/settings/roles-users/');
  }

  // Settings root (avoid catching /settings/roles-users)
  if (targetPath === '/settings') {
    return currentPath === '/settings' || (currentPath.startsWith('/settings/') && !currentPath.includes('/roles-users'));
  }

  // Subscriptions deep routes & aliases
  if (targetPath === '/subscriptions/plans') {
    return (
      currentPath === '/subscriptions' ||
      (currentPath.startsWith('/subscriptions/') && !currentPath.includes('/usage'))
    );
  }

  // Purchase & Activation aliases & deep routes
  if (targetPath.startsWith('/purchase-activation')) {
    if (targetPath === '/purchase-activation/purchases') {
      return (
        currentPath === '/purchase-activation' ||
        currentPath === '/purchase-activation/purchases' ||
        currentPath === '/subscriptions/purchase-activation'
      );
    }
    return currentPath === targetPath || currentPath.startsWith(targetPath + '/');
  }

  // Usage module aliases
  if (targetPath === '/usage') {
    return currentPath === '/usage' || currentPath === '/subscriptions/usage';
  }

  // Nested paths
  if (targetPath !== '/' && targetPath !== '/dashboard' && currentPath.startsWith(targetPath + '/')) {
    return true;
  }

  return false;
}

export function Navigation({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  const { primaryColor } = useStore();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([
    'Product Management',
    'Subscriptions',
    'Add-on Marketplace',
    'Purchase & Activation',
    'Tenant Management',
  ]);

  const menuSections = React.useMemo(() => getMenuGroups(), []);

  // Universal auto-expand: expand any menu whose child is currently active
  React.useEffect(() => {
    if (!pathname) return;
    menuSections.forEach((section) => {
      section.items.forEach((item) => {
        if (item.subItems && item.subItems.some((sub) => isRouteActive(sub.path, pathname))) {
          setExpandedMenus((prev) => (prev.includes(item.label) ? prev : [...prev, item.label]));
        }
      });
    });
  }, [pathname, menuSections]);

  const toggleSubmenu = (label: string) => {
    setExpandedMenus((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  return (
    <nav className="flex flex-col gap-1 py-1">
      {menuSections.map((section, idx) => (
        <div key={idx} className="flex flex-col gap-1">
          {section.items.map((item) => {
            const Icon = item.icon || Layers;
            const hasSubItems = Boolean(item.subItems && item.subItems.length > 0);
            const isExpanded = expandedMenus.includes(item.label);
            const isItemActive = isRouteActive(item.path, pathname);
            const isChildActive = Boolean(
              hasSubItems && item.subItems?.some((sub) => isRouteActive(sub.path, pathname))
            );

            if (hasSubItems && !collapsed) {
              const isGroupActive = isChildActive || isItemActive;

              return (
                <div key={item.label} className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => toggleSubmenu(item.label)}
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-2.5 text-xs font-medium rounded-xl transition-all duration-150 cursor-pointer",
                      isGroupActive
                        ? "bg-[#6222cc] text-white font-semibold shadow-xs"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-colors",
                          isGroupActive ? "text-white" : "text-slate-300"
                        )}
                      />
                      <span className="text-left leading-tight">{item.label}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-200 shrink-0 ml-2",
                        isExpanded ? "transform rotate-180" : "",
                        isGroupActive ? "text-white" : "text-slate-400"
                      )}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden pl-5 pt-1.5 flex flex-col gap-1"
                      >
                        {item.subItems?.map((sub, subIdx) => {
                          const isSubActive = isRouteActive(sub.path, pathname);
                          return (
                            <NavLink
                              key={`${item.label}-${sub.label}-${subIdx}`}
                              href={sub.path}
                              onClick={onNavigate}
                              active={isSubActive}
                              className={cn(
                                "text-xs py-2 px-3 rounded-lg transition-all duration-150 cursor-pointer font-medium flex items-center gap-2.5",
                                isSubActive
                                  ? "bg-[#24126a] text-white font-semibold"
                                  : "text-slate-300 hover:text-white hover:bg-white/5"
                              )}
                            >
                              {isSubActive ? (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7] shrink-0" />
                              ) : (
                                <span className="w-1.5 h-1.5 rounded-full bg-transparent shrink-0" />
                              )}
                              <span>{sub.label}</span>
                            </NavLink>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <NavLink
                key={`${item.label}-${item.path}`}
                href={item.path}
                icon={Icon}
                collapsed={collapsed}
                onClick={onNavigate}
                active={isItemActive}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-xl transition-all duration-150 cursor-pointer",
                  collapsed ? "justify-center px-2" : "justify-start",
                  isItemActive
                    ? "bg-[#6222cc] text-white font-semibold shadow-xs"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                )}
              >
                {item.label}
              </NavLink>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
