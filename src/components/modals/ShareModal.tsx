"use client";

import * as React from "react";
import { X, Copy, CheckCircle2, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
}

export function ShareModal({ isOpen, onClose, title, url }: ShareModalProps) {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Foot Heroes",
          text: title,
          url: url,
        });
      } catch (err) {
        console.error("Error sharing", err);
      }
    }
  };

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
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800 p-5">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-50 flex items-center gap-2">
                  <Share2 size={18} /> Share Profile
                </h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <X size={20} />
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{title}</p>
              
              <div className="flex gap-2 mb-4">
                <div className="flex-1 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-sm px-3 py-2 text-sm text-gray-600 dark:text-gray-400 truncate select-all">
                  {url}
                </div>
                <Button variant={copied ? "primary" : "secondary"} onClick={handleCopy} className="w-10 px-0 shrink-0">
                  {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                </Button>
              </div>
              
              {typeof navigator !== "undefined" && 'share' in navigator && (
                <Button variant="default" className="w-full" onClick={handleNativeShare}>
                  Share via...
                </Button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
