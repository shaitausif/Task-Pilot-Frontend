"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  Users,
  CheckSquare,
  FileText,
  Layers,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { LogouttheUser } from "@/lib/logout";
import { useToast } from "@/context/ToastContext";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
};

export default function Sidebar() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const { user , clearUser } = useAuth();

  const router = useRouter()
  const { showToast } = useToast();


  
  const nav: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: <Home size={18} /> },
    { label: "Users", href: "/users", icon: <Users size={18} />, adminOnly: true },
    { label: "Tasks", href: "/tasks", icon: <CheckSquare size={18} /> },
    { label: "Notes", href: "/notes", icon: <FileText size={18} /> },
    { label: "Projects", href: "/projects", icon: <Layers size={18} /> },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Mobile top bar */}
      <div className={` ${open ? 'w-10': 'w-20'} fixed top-3 left-3 z-40 flex items-center gap-3 lg:hidden`}>
        <button
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((s) => !s)}
          className="flex h-11 w-11 items-center text-secondary justify-center rounded-lg bg-tp-bgLight text-tp-text focus:outline-none focus:ring-2 focus:ring-tp-primary"
        >
          <Menu size={20} />
        </button>
        <Image
        onClick={() => router.push('/')}
        height={60}
        width={60}
        src={'/Logo.png'} alt="TaskPilot" className="h-10 w-10 rounded-md" />
      </div>

      {/* Desktop sidebar */}
      <motion.aside
      initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.22 }}
        className={`hidden text-secondary lg:flex  dark:bg-primary lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 lg:bg-tp-bg lg:pt-6 lg:px-4 lg:pb-4"
        aria-label="Sidebar  ${open ? 'hidden': 'w-20'}`}
      >
        <div className="flex items-center pb-6 justify-between">
          <div 
          onClick={() => router.push('/')}
          className="flex items-center gap-3 px-3 justify-start ">
            <Image
          width={60}
          height={60}
          src={'/Logo.png'} alt="TaskPilot" className="h-10 w-10 rounded-md" />
          <span className="text-lg font-semibold  text-tp-text">TaskPilot</span>
          </div>
          {/* <motion.span
          onClick={() => setOpen((s) => !s)}
          className="text-end mb-1 mr-1 p-1 rounded-md duration-200 hover:bg-[#28343e]"><Menu size={20}/></motion.span> */}
        </div>
        

        <nav className={` flex-1 overflow-y-auto px-2`}>
          <ul role="list" className="space-y-1">
            {nav.map((item) => {
              // For now, I'm allowing everyone to see the users but only admins will delete or edit their info
              // if (item.adminOnly && user?.role !== "Admin") return null;
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`group flex duration-200 hover:bg-[#28343e] items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
                      ${active ? "bg-tp-bgLight text-tp-text" : "text-tp-textMuted hover:bg-tp-bgLight/30 hover:text-tp-text"}`}
                  >
                    <span className="opacity-90">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto px-3">
          <div 
          onClick={() => router.push('/profile')}
          className="flex items-center gap-3 rounded-md bg-tp-bgLight/50 p-3">
            <Image

              width={55}
              height={55}
              src={user?.avatar || "/Profile.png"}
              alt={user?.fullName || "User avatar"}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="truncate text-sm font-medium text-tp-text">{user?.fullName || "Guest"}</div>
              <div className="truncate text-xs text-tp-textMuted">{user?.role || "User"}</div>
            </div>
            <button
              onClick={async(e) => {
                e.stopPropagation()
                await LogouttheUser(router, showToast)
                clearUser()
              }}
              className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#28343e]/70 hover:bg-[#28343e] text-tp-textMuted hover:text-white hover:bg-tp-bgLight/60"
              aria-label="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Mobile slide-in */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black"
            />
            {/* panel */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.22 }}
              className="relative z-50 h-full text-secondary bg-primary w-80 max-w-full bg-tp-bg p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                  width={55}
                  height={55}
                  src={"/Logo.png"} alt="TaskPilot" className="h-9 w-9 rounded-md" />
                  <span className="text-lg font-semibold text-tp-text">TaskPilot</span>
                </div>
                <button onClick={() => setOpen(false)} className="p-2 text-tp-textMuted">
                  <X size={20} />
                </button>
              </div>

              <nav className="mt-6">
                <ul role="list" className="space-y-2">
                  {nav.map((item) => {
                    if (item.adminOnly && user?.role !== "Admin") return null;
                    const active = isActive(item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
                          ${active ? "bg-tp-bgLight text-tp-text" : "text-tp-textMuted hover:bg-tp-bgLight/30 hover:text-tp-text"}`}
                        >
                          <span>{item.icon}</span>
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-3 rounded-md bg-tp-bgLight/50 p-3">
                  <Image
                  width={55}
                  height={55}
                    src={user?.avatar || "/Profile.png"}
                    alt={user?.fullName || "User avatar"}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-sm font-medium text-tp-text">{user?.fullName || "Guest"}</div>
                    <div className="truncate text-xs text-tp-textMuted">{user?.role || "User"}</div>
                  </div>
                  <button
                    onClick={() => {
                      setOpen(false);
                      LogouttheUser(router, showToast)
                    }}
                    className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent text-tp-textMuted hover:text-white hover:bg-tp-bgLight/60"
                    aria-label="Logout"
                  > 
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
