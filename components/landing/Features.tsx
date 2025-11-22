"use client";
import React from "react";
import { motion } from "motion/react";
import { CheckSquare, Clock, Layers, BookOpen } from "lucide-react";

const items = [
  { title: "Tasks & Notes", desc: "Simple CRUD for tasks and notes with search & filter.", icon: <CheckSquare/> },
  { title: "Projects", desc: "Group tasks into projects and track progress.", icon: <Layers/> },
  { title: "Analytics", desc: "Lightweight dashboard stats & charts.", icon: <Clock/> },
  { title: "Secure", desc: "JWT auth, bcrypt hashing and validation.", icon: <BookOpen/> },
];

export default function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <motion.div key={it.title}
            initial={{ y: 10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-xl bg-tp-card p-6 shadow-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-tp-primary/10 text-tp-primary">
              {it.icon}
            </div>
            <h4 className="mt-4 text-lg font-semibold text-tp-bg">{it.title}</h4>
            <p className="mt-2 text-sm text-tp-textMuted">{it.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
