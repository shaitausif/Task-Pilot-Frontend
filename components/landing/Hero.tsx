"use client";
import React from "react";
import { motion } from "motion/react";
import Button from "../ui/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
const heroImg = "/mnt/data/A_2D_digital_design_of_TaskPilot's_landing_page_is.png";

export default function Hero() {

    const router = useRouter();
    const { user } = useAuth();

  return (
    <section className="bg-transparent">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left */}
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{duration:0.6}}>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-tp-bg">Streamline your productivity</h1>
            <p className="mt-4 max-w-xl text-lg text-tp-textMuted">
              Manage tasks, notes, and projects with ease. Boost your productivity with our intuitive and efficient platform.
            </p>

            <div className="mt-8 flex items-center gap-4">
              {
                user?._id ? (
                 <span className="flex gap-4">
                  <Button onClick={()=> router.push('/dashboard') }>Get Started</Button>
              <Button variant="outline" onClick={()=> router.push("/dashboard")}>Dashboard</Button>
                 </span>
                ) : (
                  <span className="flex gap-4">
                    <Button onClick={()=> router.push('/register') }>Get Started</Button>
              <Button variant="outline" onClick={()=> router.push("/login")}>Sign in</Button>
                  </span>
                )
              }
            </div>

            <div className="mt-6 flex gap-4">
              <motion.div whileHover={{ y: -6 }} className="flex items-center gap-3 rounded-lg bg-tp-card/80 p-3 shadow-sm">
                <div className="h-8 w-8 rounded bg-tp-primary" />
                <div>
                  <div className="text-sm font-semibold text-tp-bg">Secure JWT Auth</div>
                  <div className="text-xs text-tp-textMuted">Cookie-based tokens</div>
                </div>
              </motion.div>

              <motion.div whileHover={{ y: -6 }} className="flex items-center gap-3 rounded-lg bg-tp-card/80 p-3 shadow-sm">
                <div className="h-8 w-8 rounded bg-tp-primary" />
                <div>
                  <div className="text-sm font-semibold text-tp-bg">Scalable API</div>
                  <div className="text-xs text-tp-textMuted">Express + MongoDB</div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right (illustration) */}
          <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }} className="flex justify-center">
            <div className="relative w-full max-w-lg">
              <Image 
            src={'/Preview.jpg'}
                alt="TaskPilot preview"
                className="w-full rounded-2xl shadow-2xl"
               width={500}
               height={500}


            />
             
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
