"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex w-full items-center gap-1 overflow-x-auto rounded-lg bg-gray-100 p-1 dark:bg-gray-800", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "rounded-md px-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap outline-none",
              isActive
                ? "bg-[#F75A0A] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
