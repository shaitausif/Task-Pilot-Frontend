"use client";
import {motion} from 'motion/react'

export default function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;
  return <motion.div 
  initial={{
    opacity : 0
  }}
  animate={{
    opacity : 1
  }}
  exit={{
    opacity : 0,
    y : -20
  }}
  className="mt-2 rounded-lg bg-red-50 p-2 text-sm text-red-700">{message}</motion.div>;
}
