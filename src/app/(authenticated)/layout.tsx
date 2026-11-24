'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { ThemePanel } from '@/components/layout/ThemePanel';
import { Footer } from '@/components/layout/Footer';
import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/useAuthStore';
import { rehydrateAuth } from '@/store/authSlice';
import { cn } from '@/lib/utils';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { refreshAccessToken } from '@/service/tokenRefresh';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isSidebarOpen, mode, primaryColor, density } = useStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    dispatch(rehydrateAuth());
    setIsMounted(true);
  }, [dispatch]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (mode === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(mode);
    }
  }, [mode]);

  useEffect(() => {
    const activeColor = (!primaryColor || primaryColor === '#6366f1' || primaryColor === '#4f46e5' || primaryColor === '#0565FD')
      ? '#1574fe'
      : primaryColor;
    document.documentElement.style.setProperty('--primary', activeColor);
    document.documentElement.style.setProperty('--ring', activeColor);
  }, [primaryColor]);

  useEffect(() => {
    if (isMounted && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isMounted, isAuthenticated, router]);

  // Proactive background token refresh (Matching superadminfe App.js: every 10 minutes)
  useEffect(() => {
    if (!isMounted || !isAuthenticated) return;

    // Refresh token once on initial load if present
    refreshAccessToken();

    // Repeat every 10 minutes (600,000 ms)
    const intervalId = setInterval(() => {
      refreshAccessToken();
    }, 10 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [isMounted, isAuthenticated]);

  if (!isMounted || !isAuthenticated) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className={cn(
        "h-screen overflow-hidden print:h-auto print:overflow-visible print:block bg-background font-sans antialiased flex flex-col",
        density === 'compact' ? 'space-tight' : 'space-comfortable'
      )}>
        <div className="print:hidden">
          <Header />
          <Sidebar />
          <ThemePanel />
        </div>

        <main className={cn(
          "flex flex-col flex-1 min-h-0 pt-16 print:pt-0 print:pl-0 transition-all duration-300 ease-in-out",
          isSidebarOpen ? "md:pl-[260px]" : "md:pl-[80px]"
        )}>
          <div className="flex-1 print:overflow-visible print:p-0 overflow-y-auto p-6 md:p-8">
            {children}
          </div>
          <div className="print:hidden">
            <Footer />
          </div>
        </main>
        <Toaster position="top-right" closeButton richColors />
      </div>
    </TooltipProvider>
  );
}
