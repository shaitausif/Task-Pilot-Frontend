"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ToastMessage } from "@/interfaces/toast";

export default function ToastContainer({ toasts }: { toasts: ToastMessage[] }) {
  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.25 }}
            className={`min-w-[240px] rounded-md px-4 py-3 shadow-lg text-white 
              ${toast.type === "success" ? "bg-green-600" : ""} 
              ${toast.type === "error" ? "bg-red-600" : ""} 
              ${toast.type === "info" ? "bg-blue-600" : ""}`}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
