'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface NavLinkProps {
  to?: string;
  href?: string;
  icon?: React.ElementType;
  collapsed?: boolean;
  active?: boolean;
  children: React.ReactNode | ((props: { isActive: boolean }) => React.ReactNode);
  className?: string | ((props: { isActive: boolean }) => string);
  onClick?: () => void;
  exact?: boolean;
  style?: React.CSSProperties | ((props: { isActive: boolean }) => React.CSSProperties);
}

export function NavLink({
  to,
  href,
  icon: Icon,
  collapsed = false,
  active,
  children,
  className,
  onClick,
  exact,
  style,
}: NavLinkProps) {
  const pathname = usePathname();
  const targetPath = href || to || '/';

  const isCurrentActive = active !== undefined
    ? active
    : (exact
      ? pathname === targetPath
      : (targetPath === '/' ? pathname === '/' : (pathname === targetPath || pathname.startsWith(targetPath + '/'))));

  const content = typeof children === 'function' ? children({ isActive: isCurrentActive }) : children;
  const labelText = typeof content === 'string' ? content : '';

  const defaultClasses = cn(
    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 cursor-pointer",
    collapsed ? "justify-center px-2" : "justify-start",
    isCurrentActive
      ? "bg-blue-50/90 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold rounded-lg"
      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800/60"
  );

  const resolvedClass = typeof className === 'function'
    ? className({ isActive: isCurrentActive })
    : cn(defaultClasses, className);

  const resolvedStyle = typeof style === 'function' ? style({ isActive: isCurrentActive }) : style;

  const linkNode = (
    <Link
      href={targetPath}
      className={resolvedClass}
      onClick={onClick}
      style={resolvedStyle}
    >
      {Icon && (
        <Icon
          className={cn(
            "h-4 w-4 shrink-0 transition-colors",
            isCurrentActive ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"
          )}
        />
      )}
      {!collapsed && <span className="truncate">{content}</span>}
    </Link>
  );

  if (collapsed && labelText) {
    return (
      <Tooltip>
        <TooltipTrigger render={linkNode} />
        <TooltipContent side="right" className="font-semibold text-xs">
          {labelText}
        </TooltipContent>
      </Tooltip>
    );
  }

  return linkNode;
}
