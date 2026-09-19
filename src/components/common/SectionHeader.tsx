import { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  action?: ReactNode;
  subtitle?: string;
}

export function SectionHeader({ title, action, subtitle }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4 mt-8 first:mt-0">
      <div>
        <h2 className="font-bold text-lg text-gray-900 dark:text-gray-50">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
