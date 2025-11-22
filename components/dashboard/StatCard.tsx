"use client";
import React from "react";
import { motion } from "motion/react";

export default function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
}) {
  return (
    <motion.div
      initial={{ y: 6, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="rounded-xl bg-tp-card p-5 dark:shadow-xl shadow-sm"
    >
      <div className="text-sm font-medium text-tp-textMuted">{title}</div>
      <div className="mt-3 text-2xl font-extrabold text-tp-bg">{value}</div>
      {subtitle && <div className="mt-2 text-xs text-tp-textMuted">{subtitle}</div>}
    </motion.div>
  );
}
