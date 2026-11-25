import {
  BarChart2, Briefcase, Building2, Calculator, CalendarCheck, CalendarDays,
  Cpu, CreditCard, Database, FileText, Globe, GraduationCap, Headphones,
  HeartPulse, Layers, Link2, Mail, MapPin, MessageSquare, Package, Puzzle,
  Rocket, Settings, ShieldCheck, ShoppingCart, Smartphone, Sparkles, Truck, Users,
  Wallet, Workflow, Zap,
} from 'lucide-react';

export const categoryIcons = [
  ['cpu', 'CPU', Cpu],
  ['message', 'Message', MessageSquare],
  ['chart', 'Chart', BarChart2],
  ['shield', 'Shield', ShieldCheck],
  ['link', 'Link', Link2],
  ['users', 'Users', Users],
  ['grad', 'Graduation', GraduationCap],
  ['layers', 'Layers', Layers],
  ['calendar-check', 'Calendar Check', CalendarCheck],
  ['briefcase', 'Business', Briefcase],
  ['building', 'Company', Building2],
  ['calculator', 'Calculator', Calculator],
  ['calendar-days', 'Calendar', CalendarDays],
  ['credit-card', 'Payment Card', CreditCard],
  ['database', 'Database', Database],
  ['file-text', 'Document', FileText],
  ['globe', 'Globe', Globe],
  ['headphones', 'Support', Headphones],
  ['heart-pulse', 'Health', HeartPulse],
  ['mail', 'Email', Mail],
  ['map-pin', 'Location', MapPin],
  ['package', 'Package', Package],
  ['puzzle', 'Integration', Puzzle],
  ['rocket', 'Launch', Rocket],
  ['settings', 'Settings', Settings],
  ['shopping-cart', 'Shopping Cart', ShoppingCart],
  ['smartphone', 'Mobile', Smartphone],
  ['sparkles', 'AI & Automation', Sparkles],
  ['truck', 'Delivery', Truck],
  ['wallet', 'Wallet', Wallet],
  ['workflow', 'Workflow', Workflow],
  ['zap', 'Lightning', Zap],
] as const;

const categoryIconDefaults = [
  [/\bai\b|automation/i, Cpu],
  [/communication|messaging/i, MessageSquare],
  [/analytics|insights/i, BarChart2],
  [/productivity/i, Settings],
  [/compliance|security/i, ShieldCheck],
  [/integration/i, Link2],
  [/crm/i, Users],
  [/education|training/i, GraduationCap],
] as const;

export function CategoryIcon({ value, categoryName, className = 'size-4 text-violet-700 dark:text-purple-300' }: {
  value?: string | null;
  categoryName?: string;
  className?: string;
}) {
  const Icon = categoryIcons.find(([key]) => key === value)?.[2]
    ?? categoryIconDefaults.find(([pattern]) => pattern.test(categoryName ?? ''))?.[1]
    ?? Layers;
  return <Icon aria-hidden="true" className={className} />;
}
