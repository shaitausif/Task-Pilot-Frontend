"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreHorizontal, MoreVertical } from "lucide-react";

export default function TaskMoreMenu({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    function handleClick(e: any) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => {
          e.stopPropagation()
          setOpen((o) => !o)
        }}
        className="p-2 z-10 rounded-md hover:bg-tp-bgLight/20 transition"
      >
        <MoreHorizontal className="h-5 w-5 text-tp-textMuted" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute  right-0 mt-2 w-32 rounded-md bg-tp-card py-2 shadow-md border border-tp-border duration-200 z-50"
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                setOpen(false);
                onEdit();
              }}
              className="w-full px-4 py-2 text-left hover:bg-tp-bgLight/30 text-sm text-tp-bg z-10"
            >
              Edit
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                setOpen(false);
                onDelete();
              }}
              className="w-full px-4 py-2 text-left hover:bg-red-500/20 text-sm text-red-600"
            >
              Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
