import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function DashboardCard({ title, children, className }: DashboardCardProps) {
  return (
    <Card className={cn("flex flex-col h-full border dark:border-slate-800 shadow-sm overflow-hidden", className)}>
      <CardHeader className="bg-primary/90 dark:bg-primary py-3 px-4 rounded-t-xl">
        <CardTitle className="text-white text-base font-bold font-heading">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col">
        {children}
      </CardContent>
    </Card>
  );
}
