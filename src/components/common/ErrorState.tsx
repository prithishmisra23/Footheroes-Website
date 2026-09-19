"use client";

import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  retryAction?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "An unexpected error occurred while trying to load this content.",
  retryAction,
  className = "",
}: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-red-50/50 dark:bg-red-950/10 rounded-xl border border-red-100 dark:border-red-900/30 ${className}`}>
      <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500 mb-4">
        <AlertTriangle size={24} />
      </div>
      <h3 className="font-bold text-gray-900 dark:text-gray-50 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
        {description}
      </p>
      {retryAction && (
        <Button variant="secondary" onClick={retryAction} className="gap-2">
          <RefreshCcw size={16} /> Try Again
        </Button>
      )}
    </div>
  );
}
