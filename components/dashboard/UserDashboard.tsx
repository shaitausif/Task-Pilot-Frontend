"use client";
import React, { useEffect, useState } from "react";
import StatCard from "./StatCard";
import TaskPie from "./TaskPie";
import RecentTasks from "./RecentTasks";
import { motion } from "motion/react";
import Image from "next/image";
import { requestHandler } from "@/utils";
import { getUserDashboardStats, getUserInfo } from "@/lib/apiClient";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import dateFormat, { masks } from "dateformat";
import { useRouter } from "next/navigation";
const now = new Date();
/**
 * UserDashboard
 * - pass data as props in real app (API)
 * - here we include sample mock data for demonstration
 *
 * Uses your uploaded image as header illustration:
 * /mnt/data/ChatGPT Image Nov 19, 2025, 07_49_10 PM.png
 */

interface Stats{
  totalTasks?: number;
  completedTasks?: number
  pendingTasks?: number;
  totalProjects?: number;
  totalNotes?: number;
}

interface PieData {
  name: string;
  value: number;
}

interface Recent {
  _id: string;
  title: string;
}


export default function UserDashboard() {


  const { user , clearUser , setUser} = useAuth()
  const [loading, setloading] = useState(false)


  const [stats, setstats] = useState<Stats>({})



  const [pieData, setpieData] = useState<PieData[]>([])


  const [recent, setrecent] = useState<Recent[]>([])
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardStats = async() => {
      requestHandler(
        async() => await getUserDashboardStats(),
        setloading,
        (res) => {
          const { data } = res
          setstats({totalTasks: data.totalTasks, completedTasks : data.completedTasks, pendingTasks : data.pendingTasks, totalProjects: data.totalProjects, totalNotes: data.totalNotes})
          setpieData([{name: "Completed", value: data.completedTasks}, {name : "Pending", value: data.pendingTasks}, {name : "In Progress", value : data.inProgressTasks}])
          setrecent(data.recentTasks)
        },
        (err: any) => {
          showToast(err.message || "Something went wrong")
          if(err.statusCode == 401){
            clearUser()
          }
        }
      )
    }

    if(!user?._id){
    requestHandler(
      async() => await getUserInfo(),
      null,
      (res) => {
        
        setUser(res.data)
      },
      (err: any) => {
        
        console.log(err)
        if(err.statusCode == 401){
          clearUser()
        }
      }
    )
  }


    fetchDashboardStats()
  },[])


  const formattedDate = dateFormat(user?.lastlogin,'fullDate')



  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <div className="mx-auto max-w-7xl px-6 pt-8 pb-6">
        <div className="flex items-center justify-between gap-6">
          <div>
            <motion.h1 initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45 }} className="text-4xl font-bold text-tp-bg">
              Welcome, <span className="">{user?.username }</span>!
            </motion.h1>
            <motion.p initial={{ y: -4, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.06, duration: 0.45 }} className="mt-2 text-sm text-tp-textMuted">
              Last login: <span className="font-medium">{formattedDate}</span>
            </motion.p>
          </div>

        
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column: Overview cards (span 2 columns on large) */}
          <div className="lg:col-span-2 grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <StatCard title="Total Tasks" value={stats.totalTasks!} />
              <StatCard title="Completed Tasks" value={stats.completedTasks!} />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <StatCard title="Pending Tasks" value={stats.pendingTasks!} />
              <StatCard title="Total Projects" value={stats.totalProjects!} />
            </div>

            {/* Large cards row */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <TaskPie data={pieData!} />
              <RecentTasks tasks={recent!} />
            </div>
          </div>

          {/* Right column: smaller summary panels */}
          <div className="space-y-6">
            <motion.div initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.35 }} className="rounded-xl bg-tp-card p-6 dark:shadow-xl shadow-sm">
              <div className="text-lg font-semibold text-tp-bg">Total Notes</div>
              <div className="mt-4 flex flex-col gap-3">
                <div 
                onClick={() => router.push(`/notes`)}
                className="rounded-md items-center hover:cursor-pointer bg-tp-bgLight/10 px-4 py-3 text-tp-bgMuted flex justify-evenly">Total Notes  <span className="font-bold lg:text-2xl">{stats.totalNotes}</span></div>
                <div
                onClick={() => router.push('/projects')}
                className="rounded-md hover:cursor-pointer bg-tp-bgLight/10 px-4 py-3 text-tp-bgMuted flex justify-evenly items-center">Total Projects
                <span className="font-bold lg:text-2xl">{stats.totalProjects}</span>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.06, duration: 0.35 }} className="rounded-xl bg-tp-card dark:shadow-xl p-6 shadow-sm">
              <div className="text-lg font-semibold text-tp-bg">Quick Actions</div>
              <div className="mt-4 flex flex-col gap-3">
                <button onClick={() => router.push('/tasks')} className="rounded-md bg-tp-primary px-4 py-2 ">New Task</button>
                <button onClick={() => router.push('/notes')}  className="rounded-md border border-tp-border px-4 py-2 text-tp-bg">New Note</button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
