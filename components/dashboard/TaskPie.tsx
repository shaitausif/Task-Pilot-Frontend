"use client";

import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { motion } from "framer-motion";

// Theme colors (light/dark safe)
const COLORS = ["#4F46E5", "#3B82F6", "#60A5FA"];

export default function TaskPie({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  // Calculate total for percentages
  const total = data.reduce((acc, item) => acc + item.value, 0);

  // Custom label renderer
  const renderLabel = (entry: any) => {
    const percent = total === 0 ? 0 : ((entry.value / total) * 100).toFixed(0);

    return `${percent}%`;
  };

  return (
    <motion.div
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="rounded-xl bg-tp-card dark:bg-tp-cardDark shadow-sm "
    >
      <div className="ml-2 text-lg font-semibold text-tp-bg">
        Task Overview
      </div>

      <div style={{ width: "100%", height: 240 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={45}
              outerRadius={85}
              paddingAngle={2}
              label={renderLabel}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Legend
              verticalAlign="top"
              
              layout="vertical"
              align="left"
              formatter={(label) => (
                <span className="text-tp-text dark:text-gray-300">{label}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
