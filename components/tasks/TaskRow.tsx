"use client";
import { motion } from "framer-motion";
import TaskMoreMenu from "./TaskMoreMenu";

export default function TaskRow({
  task,
  index,
  onEdit,
  onDelete,
  onOpen,
}: {
  task: any;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onOpen: () => void;
}) {
  return (
    <motion.div
      onClick={(e) => {
        // MOBILE: open modal on click
        if (window.innerWidth < 768) onOpen();
      }}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="grid grid-cols-4 gap-3 items-center bg-tp-bgLight/10 rounded-lg 
                 py-3 px-4 text-sm cursor-pointer md:cursor-default 
                 hover:bg-tp-bgLight/20 transition"
    >
      <p className="text-tp-bg font-medium">{task.title}</p>
      <p className="text-tp-textMuted">{task.status}</p>
      <p className="text-tp-textMuted">{task.priority}</p>
      <div className="flex justify-between items-center">
        <p className="text-tp-textMuted">{task.dueDate}</p>

        {/* DESKTOP ONLY */}
        <div
          className="hidden md:block"
          onClick={(e) => e.stopPropagation()} // prevent modal opening
        >
          <TaskMoreMenu onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>
    </motion.div>
  );
}
