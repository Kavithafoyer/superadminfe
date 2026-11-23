'use client';

import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'motion/react';
import React from 'react';
import { Navigation } from './Navigation';
import Link from 'next/link';

export function Sidebar() {
  const { isSidebarOpen, toggleSidebar } = useStore();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isSidebarOpen ? 260 : 80 }}
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-[#12192d] bg-[#060b1b] text-white transition-all duration-300 ease-in-out hidden md:block"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Top Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-[#12192d] shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <img
              src="/CRMFARM_LOGO.png"
              alt="Logo"
              className="h-8 w-auto object-contain shrink-0"
            />
            {isSidebarOpen && (
              <div className="flex flex-col">
                <span className="text-white font-bold text-[15px] tracking-tight leading-tight">
                  Pegatto
                </span>
                <span className="text-[11px] text-slate-400 font-medium tracking-normal">
                  Super Admin
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation items */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-3 py-3 sidebar-scroll">
          <Navigation collapsed={!isSidebarOpen} />
        </div>

        {/* Footer collapse button */}
        <div className="px-3 py-3 border-t border-[#12192d] mt-auto shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-3 text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Collapse View</span>
              </>
            ) : (
              <ChevronRight className="h-5 w-5 mx-auto" />
            )}
          </Button>
        </div>
      </div>
    </motion.aside>
  );
}
