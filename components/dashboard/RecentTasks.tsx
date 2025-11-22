"use client";
import React from "react";
import { motion } from "framer-motion";

export default function RecentTasks({ tasks }: { tasks: { _id: string; title: string }[] }) {
  return (
    <motion.div
      initial={{ y: 8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="rounded-xl bg-tp-card p-6 dark:shadow-xl overflow-y-hidden h-[35vh] lg:h-[45vh] shadow-sm"
    >
      <div className="text-lg font-semibold  text-tp-bg">Recent Tasks</div>
      <ul className="mt-4 space-y-3 text-tp-textMuted ">
        {tasks.map((t) => (
          <li key={t._id} className="rounded-md px-3 py-2 hover:bg-tp-bgLight/10 transition-colors truncate">
            {t.title}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
