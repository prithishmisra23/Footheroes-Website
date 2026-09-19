"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/common/ErrorState";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 text-center">
         <ErrorState 
            title="Something went wrong!" 
            description={error.message || "An unexpected error occurred while loading this page."} 
            retryAction={reset} 
         />
      </div>
    </div>
  );
}
