"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import { Menu } from "lucide-react";
import Image from "next/image";
import { LocalStorage } from "@/utils";
import { useAuth } from "@/context/AuthContext";

export default function LandingNavbar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const theme = LocalStorage.get("theme")
  return (
    <header className="relative z-30">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
          width={55}
          height={55}
          src={`${theme == "dark" ? '/InvertLogo.png' : "/Logo.png"}`} alt="TaskPilot" className="h-10 w-10 rounded-md" />
          <span className="text-xl font-semibold text-tp-bg">TaskPilot</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="#features" className="text-sm text-tp-textMuted hover:text-tp-text">Features</Link>
          <Link href="#pricing" className="text-sm text-tp-textMuted hover:text-tp-text">Pricing</Link>
          {
            user?._id ? (
              <Link href="/dashboard"><Button variant="outline">Dashboard</Button></Link>
            ) : (
              <Link href="/login"><Button variant="outline">Sign in</Button></Link>
            )
          }
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <button onClick={() => setOpen((s)=>!s)} className="p-2">
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <motion.div initial={{opacity:0, y:-6}} animate={{opacity:1, y:0}} className="md:hidden bg-white/60 backdrop-blur-sm border-t border-tp-border">
          <div className="flex flex-col gap-1 px-4 py-4">
            <Link href="#features" onClick={()=>setOpen(false)} className="py-2">Features</Link>
            <Link href="#pricing" onClick={()=>setOpen(false)} className="py-2">Pricing</Link>
            <Link href="/login" onClick={()=>setOpen(false)} className="py-2">Sign in</Link>
          </div>
        </motion.div>
      )}
    </header>
  );
}
