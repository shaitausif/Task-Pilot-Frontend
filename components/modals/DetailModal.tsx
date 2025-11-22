"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import React from "react";

interface DetailModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  data: Record<string, any>;
}

export default function DetailModal({
  open,
  onClose,
  title,
  data,
}: DetailModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="detail-modal-wrapper"
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Box */}
          <motion.div
            key="detail-modal-content"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
            className="absolute inset-0 flex items-center justify-center px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-md md:max-w-lg dark:text-secondary text-primary dark:bg-primary bg-secondary rounded-xl bg-tp-card p-5 shadow-xl border border-gray-600">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-tp-bg">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-md hover:bg-tp-bgLight/20 text-tp-textMuted hover:text-tp-text"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-4">
                {Object.entries(data).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-xs uppercase tracking-wide text-tp-textMuted">
                      {key.replace(/([A-Z])/g, " $1")}
                    </p>
                    <p className="text-tp-bg font-medium mt-1 wrap-break-word">
                      {String(value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
