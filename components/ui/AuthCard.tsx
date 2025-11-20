"use client";
import React from "react";
import { motion } from "motion/react";

export default function AuthCard({ children, title, subtitle }: { children: React.ReactNode; title?: string; subtitle?: string; }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-md rounded-2xl bg-white/90 px-8 py-8 shadow-lg backdrop-blur-sm"
    >
      {title && <h1 className="text-2xl font-semibold dark:text darkText">{title}</h1>}
      {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </motion.div>
  );
}
