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
    title: 'Dashboard',
    items: [
      {
        icon: LayoutDashboard,
        label: 'Business Overview',
        path: '/dashboard',
      },
      {
        icon: BarChart2,
        label: 'Product-wise Performance',
        path: '/dashboard/product-wise-performance',
      },
      {
        icon: Users,
        label: 'Customer & Partner KPIs',
        path: '/dashboard/customer-partner-kpis',
      },
      {
        icon: Layers,
        label: 'Revenue & Subscription Analytics',
        path: '/dashboard/revenue-subscription-analytics',
      },
      {
        icon: Activity,
        label: 'System Health & Alerts',
        path: '/dashboard/system-health',
      },
      {
        icon: Server,
        label: 'Tenant & Fleet Telemetry',
        path: '/dashboard/tenant-fleet-telemetry',
      },
      {
        icon: TrendingUp,
        label: 'Financial & Operations Analytics',
        path: '/dashboard/financial-operations-analytics',
      },
    ],
  },
  {
    title: 'Product Management',
    items: [
      {
        icon: Package,
        label: 'Product Management',
        path: '/products/master',
        subItems: [
          {
            label: 'Product Master',
            path: '/products/master',
          },
          {
            label: 'Editions & Versions',
            path: '/products/editions',
          },
          {
            label: 'Module Master',
            path: '/products/modules',
          },
          {
            label: 'Feature Master',
            path: '/products/features',
          },
          {
            label: 'Free Core Configuration',
            path: '/products/configuration',
          },
          {
            label: 'Trial Configuration',
            path: '/products/trial-configuration',
          },
          {
            label: 'Product Releases',
            path: '/products/releases',
          },
          {
            label: 'Feature Mapping',
            path: '/products/feature-mapping',
          },
          {
            label: 'Product Pricing',
            path: '/products/pricing',
          },
          {
            label: 'Free & Paid Plans',
            path: '/products/free-paid-plans',
          },
          {
            label: 'License & Entitlements',
            path: '/products/license-entitlements',
          },
        ],
      },
    ],
  },
  {
    title: 'Subscriptions',
    items: [
      {
        icon: Layers,
        label: 'Subscriptions',
        path: '/subscriptions/plans',
        subItems: [
          {
            label: 'Subscription Plans',
            path: '/subscriptions/plans',
          },
          {
            label: 'Subscription Lifecycle',
            path: '/subscriptions/lifecycle',
          },
          {
            label: 'Renewals & Expiry',
            path: '/subscriptions/renewals',
          },
          {
            label: 'Discounts & Coupons',
            path: '/subscriptions/discounts-coupons',
          },
          {
            label: 'Tenant Trials',
            path: '/subscriptions/trials',
          },
        ],
      },
    ],
  },
  {
    title: 'Tenant Management',
    items: [
      {
        icon: Building2,
        label: 'Tenant Management',
        path: '/tenant-management/onboarding',
        subItems: [
          {
            label: 'Tenants (All)',
            path: '/tenant-management/all',
          },
          {
            label: 'Tenant Registration',
            path: '/tenant-management/registration',
          },
          {
            label: 'Approval & Onboarding',
            path: '/tenant-management/onboarding',
          },
          {
            label: 'Tenant Provisioning',
            path: '/tenant-management/provisioning',
          },
          {
            label: 'Tenant Status & Lifecycle',
            path: '/tenant-management/lifecycle',
          },
          {
            label: 'Tenant Usage & Limits',
            path: '/tenant-management/usage',
          },
          {
            label: 'Tenant Settings',
            path: '/tenant-management/settings',
          },
          {
            label: 'Tenant Suspension & Reactivation',
            path: '/tenant-management/suspension',
          },
          {
            label: 'Tenant Data Export & Deletion',
            path: '/tenant-management/export-deletion',
          },
        ],
      },
      {
        icon: Users,
        label: 'Customer Management',
        path: '/customer/master',
        subItems: [
          {
            label: 'Customer Master',
            path: '/customer/master',
          },
          {
            label: 'Customer Overview',
            path: '/customer/overview',
          },
          {
            label: 'Subscription Management',
            path: '/customer/subscription-management',
          },
          {
            label: 'Customer Usage',
            path: '/customer/usage',
          },
          {
            label: 'Renewals & Expiry',
            path: '/customer/renewals-expiry',
          },
        ],
      },
      {
        icon: PackagePlus,
        label: 'Add-on Marketplace',
        path: '/addon-marketplace/master',
        subItems: [
          {
            label: 'Add-on Master',
            path: '/addon-marketplace/master',
          },
          {
            label: 'Add-on Categories',
            path: '/addon-marketplace/categories',
          },
          {
            label: 'Add-on Pricing',
            path: '/addon-marketplace/pricing',
          },
          {
            label: 'Price Templates',
            path: '/addon-marketplace/price-templates',
          },
          {
            label: 'Tiered Pricing',
            path: '/addon-marketplace/tiered-pricing',
          },
          {
            label: 'Discounts & Coupons',
            path: '/addon-marketplace/discounts-coupons',
          },
          {
            label: 'Price History',
            path: '/addon-marketplace/price-history',
          },
          {
            label: 'Product Compatibility',
            path: '/addon-marketplace/compatibility',
          },
        ],
      },
    ],
  },

  {
    title: 'Sales Module',
    items: [
      {
        icon: ShoppingCart,
        label: 'Purchase & Activation',
        path: '/purchase-activation/purchases',
        subItems: [
          {
            label: 'Purchases',
            path: '/purchase-activation/purchases',
          },
          {
            label: 'Activations',
            path: '/purchase-activation/activations',
          },
          {
            label: 'Activation Queue',
            path: '/purchase-activation/activation-queue',
          },
          {
            label: 'Payment Transactions',
            path: '/purchase-activation/payment-transactions',
          },
          {
            label: 'Invoices',
            path: '/purchase-activation/invoices',
          },
        ],
      },
      {
        icon: Activity,
        label: 'Usage',
        path: '/usage',
      },
      {
        icon: Layers,
        label: 'Plans Management',
        path: '/sales/plans',
      },
      {
        icon: CreditCard,
        label: 'Subscriptions',
        path: '/sales/subscriptions',
      },
      {
        icon: Receipt,
        label: 'Sales Invoices',
        path: '/sales/invoices',
      },
      {
        icon: DollarSign,
        label: 'Payments',
        path: '/sales/payments',
      },
      {
        icon: Server,
        label: 'Instance Requests',
        path: '/sales/instance-requests',
      },
      {
        icon: Cpu,
        label: 'Instance Creation',
        path: '/sales/instance-creation',
      },
    ],
  },
  {
    title: 'License & Operations',
    items: [
      {
        icon: Building2,
        label: 'Customer Accounts',
        path: '/accounts',
      },
      {
        icon: UserPlus,
        label: 'Additional License',
        path: '/customer/additional-license',
      },
      {
        icon: HardDrive,
        label: 'Additional Storage',
        path: '/customer/additional-storage',
      },
      {
        icon: CalendarClock,
        label: 'Renewal Due',
        path: '/customer/renewal-due',
      },
      {
        icon: UserMinus,
        label: 'Cancel Plan',
        path: '/customer/cancel-plan',
      },
    ],
  },
  {
    title: 'Task Management',
    items: [
      {
        icon: CheckSquare,
        label: 'List Task',
        path: '/task-management/tasks',
      },
      {
        icon: Kanban,
        label: 'Task Status',
        path: '/task-management/status',
      },
      {
        icon: BarChart2,
        label: 'Task Gantt Chart',
        path: '/task-management/gantt',
      },
      {
        icon: Calendar,
        label: 'Task Calendar',
        path: '/task-management/calendar',
      },
    ],
  },
  {
    title: 'Ticket Management',
    items: [
      {
        icon: Users,
        label: 'Ticket Groups',
        path: '/ticket-management/groups',
      },
      {
        icon: Ticket,
        label: 'Ticket Created List',
        path: '/ticket-management/tickets',
      },
    ],
  },
  {
    title: 'Settings Module',
    items: [
      {
        icon: Menu,
        label: 'Product Menu Setup',
        path: '/settings/product-menu',
      },
      {
        icon: Building2,
        label: 'Company Details',
        path: '/settings/company-details',
      },
      {
        icon: Users,
        label: 'Roles & Users',
        path: '/settings/roles-users',
      },
      {
        icon: HardDrive,
        label: 'Storage Master',
        path: '/settings/storage',
      },
      {
        icon: UserCheck,
        label: 'User Master',
        path: '/settings/user-master',
      },
      {
        icon: Sliders,
        label: 'System Preference',
        path: '/settings/preferences',
      },
    ],
  },
  {
    title: 'Operations & Forms',
    items: [
      {
        icon: FileText,
        label: 'SuperAdmin Forms',
        path: '/forms',
      },
      {
        icon: Table,
        label: 'Data Tables',
        path: '/tables',
      },
    ],
  },
  {
    title: 'Administration',
    items: [
      {
        icon: User,
        label: 'Profile',
        path: '/profile',
      },
      {
        icon: Settings,
        label: 'Platform Settings',
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
      currentPath === '/dashboard/business-overview'
    );
  }
  if (targetPath === '/dashboard/tenant-fleet-telemetry') {
    return currentPath === '/superadmin-dashboard';
  }
  if (targetPath === '/dashboard/financial-operations-analytics') {
    return currentPath === '/analytics-dashboard';
  }

  // Product Management aliases & deep routes
  if (targetPath === '/products/master') {
    return currentPath === '/products' || currentPath.startsWith('/products/master');
  }

  // Tenant Management aliases & deep routes
  if (targetPath === '/tenant-management/onboarding') {
    return currentPath === '/tenant-management';
  }
  if (targetPath === '/tenant-management/export-deletion') {
    return currentPath === '/tenant-management/retention-policy';
  }

  // Customer Management aliases & deep routes
  if (targetPath === '/customer/master') {
    return currentPath === '/customer' || currentPath.startsWith('/customer/master');
  }

  // Subscriptions deep routes & aliases
  if (targetPath === '/subscriptions/plans') {
    return (
      currentPath === '/subscriptions' ||
      currentPath === '/subscriptions/plans' ||
      currentPath === '/subscriptions/subscription-plans'
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

  // Nested paths (e.g., /products/configuration/branding matches /products/configuration)
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
    'Tenant Management',
    'Customer Management',
    'Purchase & Activation',
    'Add-on Marketplace',
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
    <nav className="flex flex-col gap-5 py-2">
      {menuSections.map((section, idx) => (
        <div key={idx} className="flex flex-col gap-1.5">
          {section.title && !collapsed && (
            <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              {section.title}
            </span>
          )}

          <div className="flex flex-col gap-1">
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
                        <span>{item.label}</span>
                      </div>
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 transition-transform duration-200 shrink-0",
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
        </div>
      ))}
    </nav>
  );
}
