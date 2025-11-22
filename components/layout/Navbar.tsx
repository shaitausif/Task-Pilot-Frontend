"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ThemeSwitcher from "../ThemeSwitcher";
import UserDropdown from "../ui/UserDropdown";
import Image from "next/image";

export default function Navbar(
) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();

 

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  



  return (
    <nav className="fixed top-0 text-secondary right-0 left-0 lg:left-64 z-30 bg-primary backdrop-blur lg:border-l rounded-b-sm border-gray-500 px-6 py-3 flex items-center justify-end">
      <div className="relative" ref={dropdownRef}>
        {/* Profile button */}
        <div className="flex gap-2 items-center">
            <ThemeSwitcher />
            <button
          onClick={() => setOpen((p) => !p)}
          className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-tp-bgLight/20 transition"
        >
          <div className="relative w-10 h-10">
            <Image
            fill
            sizes="55"
            src={user?.avatar || "/Profile.png"}
            alt="User Avatar"
            className="absolute rounded-full object-cover border"
          />

          </div>
          <ChevronDown size={16} className="text-tp-textMuted hover:cursor-pointer" />
        </button>

        </div>

        
        {/* Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-48 rounded-lg bg-primary/70 backdrop-blur-xl duration-200  shadow-xl  overflow-hidden"
            >
             <UserDropdown user={user} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
