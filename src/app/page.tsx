'use client'
import React from "react";
import LandingNavbar from "../../components/layout/LandingNavbar";
import Hero from "../../components/landing/Hero";
import Features from "../../components/landing/Features";
import Footer from "../../components/landing/Footer";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/interfaces/user";
import { requestHandler } from "@/utils";
import { getUserInfo } from "@/lib/apiClient";



export default function HomePage() {

  // I will fetch the user info in the / route
  const { user , setUser, clearUser } = useAuth()

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




  return (
    <>
      <LandingNavbar />
      <main className="bg-linear-to-b from-tp-card/50 to-transparent">
        <Hero />
        <Features />
        <div className="mx-auto max-w-7xl px-6">
          <section className="mt-12 rounded-2xl bg-tp-card p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-tp-bg">Why TaskPilot?</h3>
            <p className="mt-3 text-tp-textMuted">Built for developers and teams who want a simple, scalable dashboard to manage tasks, notes and projects - with secure authentication and a clean UI.</p>
          </section>
        </div>
        <Footer />
      </main>
    </>
  );
}
