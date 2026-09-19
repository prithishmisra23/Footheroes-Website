"use client";

import * as React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
  isLoading = false,
}: ConfirmationModalProps) {
  // Trap focus and close on escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-gray-950/40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 p-4"
          >
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
              <div className="p-5 pb-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-50">{title}</h2>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <X size={20} />
                  </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-950 p-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
                <Button variant="ghost" onClick={onClose} disabled={isLoading}>
                  {cancelText}
                </Button>
                <Button 
                  variant={isDestructive ? "destructive" : "primary"} 
                  onClick={onConfirm} 
                  isLoading={isLoading}
                >
                  {confirmText}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
