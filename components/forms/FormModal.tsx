"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import React from "react";


export default function FormModal({
  open,
  onClose,
  children,
  title,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-xl bg-tp-card bg-secondary p-6 shadow-lg"
          >
            <div className="justify-between flex">
              <h2 className="text-xl font-semibold text-tp-bg text-primary mb-4">{title}</h2>
              <X className="text-primary" onClick={() => onClose()}/>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
