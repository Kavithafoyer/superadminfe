'use client';

import { Menu, Bell, Sun, Moon, Monitor, Sparkles, LayoutGrid, HelpCircle, Mail, Table, FileText, Check } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
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
  const [unreadNotifications, setUnreadNotifications] = useState(3);

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

  return (
    <header className="fixed top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left side: Hamburger button & Logo */}
        <div className="flex items-center gap-4">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden h-10 w-10 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800"
                />
              }
            >
              <Menu className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[260px] p-0">
              <SheetHeader className="p-6 border-b">
                <SheetTitle className="flex items-center gap-2 cursor-pointer" onClick={() => { router.push('/dashboard'); setIsSheetOpen(false); }}>
                  <img src="/logo_blue.png" alt="PEGATTO SuperAdmin Logo" style={{ height: '55px', width: 'auto', objectFit: 'contain' }} />
                </SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-80px)] p-4">
                <Navigation onNavigate={() => setIsSheetOpen(false)} />
              </ScrollArea>
            </SheetContent>
          </Sheet>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleSidebar}
            className="hidden md:flex h-10 w-10 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
          >
            <Menu className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </Button>

          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => router.push('/dashboard')}>
            <img src="/logo_blue.png" alt="PEGATTO SuperAdmin Logo" style={{ height: '55px', width: 'auto', objectFit: 'contain' }} />
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 hidden sm:inline-block">
              SuperAdmin
            </span>
          </div>
        </div>

        {/* Right side: Notifications, Quick Apps, Theme, & User profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="relative h-10 w-10 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer transition-colors"
                  title="Notifications"
                >
                  <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-600 border-2 border-background dark:border-slate-900" />
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
                      className="text-[11px] text-primary hover:underline font-medium"
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

          {/* Quick Navigation Grid Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer transition-colors"
                  title="Quick Links"
                >
                  <LayoutGrid className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </Button>
              }
            />
            <DropdownMenuContent className="w-72 p-3 border dark:border-slate-800 rounded-2xl shadow-xl bg-white dark:bg-slate-950" align="end">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Dashboard', icon: LayoutGrid, path: '/' },
                  { label: 'Reusable Table', icon: Table, path: '/tables' },
                  { label: 'Sample Form', icon: FileText, path: '/forms' },
                  { label: 'Mail Config', icon: Mail, action: () => setIsMailConfigOpen(true) },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (item.action) {
                          item.action();
                        } else if (item.path) {
                          router.push(item.path);
                        }
                      }}
                      className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all duration-200 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 text-center cursor-pointer group"
                    >
                      <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform duration-200">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-2 block tracking-tight">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Help & Support Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => toast.info('Help system loaded. Screen analysis & scanner ready.')}
            className="h-10 w-10 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer transition-colors"
            title="Help & Support"
          >
            <HelpCircle className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </Button>

          {/* Dark / Light Toggle Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleThemeMode}
            className="h-10 w-10 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer transition-colors"
            title={currentTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {currentTheme === 'dark' ? (
              <Sun className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            ) : (
              <Moon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            )}
          </Button>

          {/* Vertical Divider */}
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  className="relative h-auto py-1 px-2 flex items-center gap-3 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-xl transition-all duration-200"
                >
                  <div className="flex flex-col items-end text-right hidden sm:flex">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">{user.name}</span>
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{user.jobTitle || user.role}</span>
                  </div>
                  <Avatar className="h-10 w-10 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                      {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'AD'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
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
