import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: ReactNode;
  className?: string;
}

export function StatCard({ label, value, trend, icon, className }: StatCardProps) {
  return (
    <div className={cn("bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4", className)}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</span>
        {icon && <div className="text-gray-400 dark:text-gray-500">{icon}</div>}
      </div>
      <div className="flex items-end gap-2">
        <span className="font-mono text-2xl font-bold text-gray-900 dark:text-gray-50 leading-none">{value}</span>
        {trend && (
          <span className={cn("text-xs font-semibold mb-0.5", trend.isPositive ? "text-[#22C55E]" : "text-red-500")}>
            {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
          </span>
        )}
      </div>
    </div>
  );
}
