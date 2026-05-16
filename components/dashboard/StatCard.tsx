import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  color?: "purple" | "green" | "yellow" | "red" | "blue";
}

const colorMap = {
  purple: { bg: "bg-purple-100", text: "text-purple-600", icon: "text-purple-600" },
  green:  { bg: "bg-green-100",  text: "text-green-600",  icon: "text-green-600" },
  yellow: { bg: "bg-yellow-100", text: "text-yellow-600", icon: "text-yellow-600" },
  red:    { bg: "bg-red-100",    text: "text-red-600",    icon: "text-red-600" },
  blue:   { bg: "bg-blue-100",   text: "text-blue-600",   icon: "text-blue-600" },
};

export function StatCard({ title, value, subtitle, icon: Icon, trend, color = "purple" }: StatCardProps) {
  const colors = colorMap[color];
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            {trend && (
              <p className={cn("text-xs font-medium", trend.positive ? "text-green-600" : "text-red-600")}>
                {trend.positive ? "↑" : "↓"} {trend.value}
              </p>
            )}
          </div>
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", colors.bg)}>
            <Icon className={cn("h-6 w-6", colors.icon)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
