"use client";
import { motion, AnimatePresence } from "framer-motion";

export default function TaskDetailsModal({
  open,
  onClose,
  task,
}: {
  open: boolean;
  onClose: () => void;
  task: any;
}) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Panel */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-lg bg-tp-card rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold text-tp-bg mb-4">
            Task Details
          </h2>

          <div className="space-y-3">
            {Object.entries(task).map(([key, value], index) => (
              <div key={`${key}-${index}`}>
                <p className="text-xs uppercase tracking-wide text-tp-textMuted">
                  {key.replace(/([A-Z])/g, " $1")}
                </p>
                <p className="text-tp-bg font-medium wrap-break-word">
                  {String(value)}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full rounded-md bg-tp-primary py-2 text-white hover:bg-tp-primaryDark"
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
