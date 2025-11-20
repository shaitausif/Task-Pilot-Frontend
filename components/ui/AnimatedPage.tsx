"use client";
import React from "react";
import { motion } from "framer-motion";

export default function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0, scale: 0.995 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100"
    >
      {children}
    </motion.main>
  );
}
