"use client";

import * as React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MediaPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  type: "IMAGE" | "VIDEO";
  title?: string;
}

export function MediaPreviewModal({ isOpen, onClose, url, type, title }: MediaPreviewModalProps) {
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-gray-950/95 flex flex-col"
        >
          <div className="flex justify-between items-center p-4">
            <h2 className="text-white font-bold text-lg">{title || "Media"}</h2>
            <button 
              onClick={onClose} 
              className="text-white hover:text-gray-300 bg-white/10 rounded-full p-2 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="flex-1 flex items-center justify-center p-4 overflow-hidden" onClick={onClose}>
            {type === "IMAGE" ? (
              <img 
                src={url} 
                alt={title || "Preview"} 
                className="max-w-full max-h-full object-contain select-none"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <video 
                src={url} 
                controls 
                autoPlay
                className="max-w-full max-h-full outline-none"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
