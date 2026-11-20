'use client';

import React from 'react';
import Link from 'next/link';
import {
  Ticket,
  Users,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TicketManagementHubPage() {
  const modules = [
    {
      title: 'Ticket Management Group',
      description: 'Define routing rules and assign specialized support teams to incident and service categories.',
      icon: Users,
      href: '/ticket-management/groups',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Ticket Created List',
      description: 'Review, prioritize, assign, and resolve all reported tenant and customer support tickets.',
      icon: Ticket,
      href: '/ticket-management/tickets',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Ticket Management
          </h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Coordinate support routing groups, SLAs, and customer incident tickets across the platform
        </p>
      </div>

      {/* Grid of submodules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <Link
              key={m.title}
              href={m.href}
              className="group block bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md hover:border-blue-500/50 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-lg ${m.bgColor} ${m.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="group-hover:translate-x-1 transition-transform p-0 h-8 w-8 text-muted-foreground group-hover:text-blue-600"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-blue-600 transition-colors">
                  {m.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {m.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
