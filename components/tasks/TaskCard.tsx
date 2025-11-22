"use client";
import { motion } from "framer-motion";

export default function TaskCard({
  task,
  index,
  onOpen,
}: {
  task: any;
  index: number;
  onOpen: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={onOpen}
      className="md:hidden rounded-xl bg-tp-card p-4 shadow-sm border border-tp-border 
                 active:scale-[0.98] transition cursor-pointer space-y-2"
    >
      <h3 className="text-lg font-semibold text-tp-bg">{task.title}</h3>

      <div className="flex items-center justify-between text-sm text-tp-textMuted">
        <span className="font-medium">Status:</span>
        <span className="text-tp-bg">{task.status}</span>
      </div>

      <div className="flex items-center justify-between text-sm text-tp-textMuted">
        <span className="font-medium">Priority:</span>
        <span className="text-tp-bg">{task.priority}</span>
      </div>

      <div className="flex items-center justify-between text-sm text-tp-textMuted">
        <span className="font-medium">Due:</span>
        <span className="text-tp-bg">
          {new Date(task.dueDate).toLocaleDateString()}
        </span>
      </div>
    </motion.div>
  );
}
