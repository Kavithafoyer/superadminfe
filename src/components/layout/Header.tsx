'use client';

import { Menu, Bell, Sun, Moon, Monitor, Sparkles, LayoutGrid, HelpCircle, Mail, Table, FileText, Check, Search } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useRouter, usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { Navigation } from './Navigation';
import MailConfigurationModal from './MailConfigurationModal';
import { ScrollArea } from '@/components/ui/scroll-area';

export function Header() {
  const {
    isSidebarOpen,
    toggleSidebar,
    primaryColor,
    mode,
    setMode,
    setPrimaryColor,
    user,
  } = useStore();

  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const pathname = usePathname() || '';
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isMailConfigOpen, setIsMailConfigOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(4);

  const currentTheme = mode === 'system'
    ? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : mode;

  const toggleThemeMode = () => {
    setMode(currentTheme === 'dark' ? 'light' : 'dark');
  };

  const handleClearNotifications = () => {
    setUnreadNotifications(0);
    toast.success('All notifications marked as read');
  };

  const getBreadcrumbs = () => {
    if (pathname.includes('/addon-marketplace')) {
      let pageTitle = 'Add-on Master';
      if (pathname.includes('/categories')) pageTitle = 'Add-on Categories';
      else if (pathname.includes('/pricing')) pageTitle = 'Add-on Pricing';
      else if (pathname.includes('/price-templates')) pageTitle = 'Price Templates';
      else if (pathname.includes('/tiered-pricing')) pageTitle = 'Tiered Pricing';
      else if (pathname.includes('/discounts-coupons')) pageTitle = 'Discounts & Coupons';
      else if (pathname.includes('/price-history')) pageTitle = 'Price History';
      else if (pathname.includes('/compatibility')) pageTitle = 'Product Compatibility';
      return { parent: 'Add-on Marketplace', current: pageTitle };
    }
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length >= 2) {
      return {
        parent: parts[0].replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        current: parts[1].replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      };
    }
    return null;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-16 border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur transition-all duration-300 w-full",
        isSidebarOpen ? "md:left-[260px] md:w-[calc(100%-260px)]" : "md:left-[80px] md:w-[calc(100%-80px)]"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left side: Hamburger button (mobile) / Breadcrumb */}
        <div className="flex items-center gap-3">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-9 w-9 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                />
              }
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[260px] p-0 bg-[#0c1427] border-r border-[#1a233d] text-white">
              <SheetHeader className="p-4 border-b border-[#1a233d]">
                <SheetTitle className="flex items-center gap-3 cursor-pointer" onClick={() => { router.push('/dashboard'); setIsSheetOpen(false); }}>
                  <div className="h-9 w-9 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    P
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-white font-bold text-sm tracking-tight leading-tight">Pegatto</span>
                    <span className="text-[11px] text-slate-400 font-medium">Super Admin</span>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-70px)] p-3">
                <Navigation onNavigate={() => setIsSheetOpen(false)} />
              </ScrollArea>
            </SheetContent>
          </Sheet>

          {/* Desktop Breadcrumbs */}
          {breadcrumbs ? (
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-slate-500 dark:text-slate-400">{breadcrumbs.parent}</span>
              <span className="text-slate-300 dark:text-slate-600 font-semibold">&gt;</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{breadcrumbs.current}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 capitalize">
                {pathname.split('/')[1] || 'Dashboard'}
              </span>
            </div>
          )}
        </div>

        {/* Right side: Search, Notifications, Help, Theme, & User profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Search"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-9 w-9 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="h-4 w-4" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </Button>
              }
            />
            <DropdownMenuContent className="w-80" align="end">
              <DropdownMenuGroup>
                <div className="flex items-center justify-between px-3 py-2">
                  <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
                  {unreadNotifications > 0 && (
                    <button
                      onClick={handleClearNotifications}
                      className="text-[11px] text-purple-600 hover:underline font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <DropdownMenuSeparator />
                {[
                  { id: 1, title: 'Welcome to your new Next.js template!', time: 'Just now' },
                  { id: 2, title: 'ReusableTable is ready with custom filters & exports', time: '10m ago' },
                  { id: 3, title: 'Static mock authentication enabled', time: '1h ago' },
                ].map((n) => (
                  <DropdownMenuItem key={n.id} className="cursor-pointer gap-1 flex flex-col items-start p-3">
                    <p className="text-sm font-medium leading-snug">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{n.time}</p>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Help & Support Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toast.info('Help system loaded. Screen analysis & scanner ready.')}
            className="h-9 w-9 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer"
            title="Help & Support"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>

          {/* User Profile Avatar SA */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className="h-8 w-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-xs cursor-pointer hover:bg-purple-700 transition-colors shrink-0 ml-1"
                  title={user.name || 'Super Admin'}
                >
                  SA
                </button>
              }
            />
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push('/profile')}
                  className="cursor-pointer"
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsMailConfigOpen(true)} className="gap-2 cursor-pointer">
                  <Mail className="h-4 w-4 text-slate-500" />
                  <span>Mail Configuration</span>
                </DropdownMenuItem>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="gap-2 cursor-pointer flex items-center">
                    <Sparkles className="h-4 w-4 text-slate-500" />
                    <span>Theme Options</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="w-56 p-2 space-y-3 dark:bg-slate-900 border dark:border-slate-800 shadow-md">
                    {/* Mode Selector */}
                    <div className="space-y-1.5 px-2">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Color Mode</span>
                      <div className="grid grid-cols-3 gap-1 pt-1">
                        {[
                          { id: 'light', icon: Sun, label: 'Light' },
                          { id: 'dark', icon: Moon, label: 'Dark' },
                          { id: 'system', icon: Monitor, label: 'Sys' }
                        ].map((m) => {
                          const IconComp = m.icon;
                          const isSel = mode === m.id;
                          return (
                            <button
                              type="button"
                              key={m.id}
                              onClick={() => setMode(m.id as any)}
                              className={`py-1.5 flex flex-col items-center justify-center rounded-lg border text-[10px] font-semibold gap-1 transition-all ${isSel
                                ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/20'
                                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'
                                }`}
                            >
                              <IconComp className="h-3.5 w-3.5" />
                              {m.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <DropdownMenuSeparator />

                    {/* Primary Color Selector */}
                    <div className="space-y-1.5 px-2 pb-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Primary Color</span>
                      <div className="grid grid-cols-4 gap-2 pt-1.5">
                        {[
                          { name: 'Blue', value: '#0565FD' },
                          { name: 'Indigo', value: '#6366f1' },
                          { name: 'Violet', value: '#8b5cf6' },
                          { name: 'Emerald', value: '#10b981' },
                          { name: 'Orange', value: '#f97316' },
                          { name: 'Rose', value: '#f43f5e' },
                          { name: 'Zinc', value: '#71717a' },
                        ].map((color) => (
                          <button
                            type="button"
                            key={color.value}
                            onClick={() => setPrimaryColor(color.value)}
                            className={`h-6 w-6 rounded-full border transition-all hover:scale-110 flex items-center justify-center shrink-0 ${primaryColor === color.value
                              ? 'border-slate-800 dark:border-white ring-1 ring-slate-800 dark:ring-white'
                              : 'border-transparent'
                              }`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          >
                            {primaryColor === color.value && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    toast.info('Logged out');
                    router.push('/login');
                  }}
                  className="text-red-600 cursor-pointer"
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <MailConfigurationModal isOpen={isMailConfigOpen} onClose={() => setIsMailConfigOpen(false)} />
    </header>
  );
}
