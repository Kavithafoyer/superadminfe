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
        "fixed left-0 top-0 z-40 h-screen border-r border-[#1a233d] bg-[#0c1427] text-white transition-all duration-300 ease-in-out hidden md:block"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Top Pegatto Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-[#1a233d] shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0">
              P
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm tracking-tight leading-tight">
                  Pegatto
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  Super Admin
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation items */}
        <ScrollArea className="flex-1 px-3 py-3">
          <Navigation collapsed={!isSidebarOpen} />
        </ScrollArea>

        {/* Footer collapse button */}
        <div className="px-3 py-3 border-t border-[#1a233d] mt-auto shrink-0">
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
