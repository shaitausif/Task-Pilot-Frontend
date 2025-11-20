"use client";
import React, { useState } from "react";
import AnimatedPage from "../../../../components/ui/AnimatedPage";
import AuthCard from "../../../../components/ui/AuthCard";
import Button from "../../../../components/ui/Button";
import Input from "../../../../components/ui/Input";
import ErrorMessage from "../../../../components/ui/ErrorMessage";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { SigninSchema } from "@/schemas/LoginSchema";
import { zodResolver } from "@hookform/resolvers/zod";

import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {motion} from 'motion/react'
import { useToast } from "@/context/ToastContext";
import { requestHandler } from "@/utils";
import { loginUser } from "@/lib/apiClient";

export type LoginInputs = z.infer<typeof SigninSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(SigninSchema),
  });

  async function onSubmit(data: LoginInputs) {
    if(!data.identifier || !data.password) return showToast("All fields are required","info")
    requestHandler(
        async() => await loginUser(data),
        setLoading,
        (res) => {
            showToast("User Logged in Successfully.",'success')
            router.push('/dashboard')
        },
        (err: any) => {
            console.log(err)
            setServerError(err?.message || "Login failed.");   
            setTimeout(() => {
                setServerError(null)
            }, 3000);
        } 
    )
  }

  return (
    <AnimatedPage>
      <div className="mx-4 flex w-full max-w-6xl items-center gap-12">
        <motion.div
         animate={{
            y : 0,
            opacity : 1
        }}
        initial={{
            y : 20,
            opacity : 0
        }}
        transition={{
            duration : 0.5
        }}
        className="hidden lg:flex flex-1 flex-col items-center gap-6">
          <Image
            width={55}
            height={55}
            src="/Logo.png"
            className="max-w-sm rounded-lg shadow-md "
            alt="dashboard"
          />
          <h2 className="text-3xl dark:text darkText font-semibold">Welcome Back</h2>
          <p className="max-w-sm text-gray-600">Access your dashboard and stay productive.</p>
        </motion.div>

        <div className="flex w-full justify-center">
          <AuthCard title="Sign in" subtitle="Access your TaskPilot dashboard">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email or Username"
                placeholder="email or username"
                {...register("identifier")}
                error={errors.identifier}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Your password"
                {...register("password")}
                error={errors.password}
              />

              <Button type="submit" className="w-full dark:text darkText" loading={loading}>
                Continue
              </Button>

              <ErrorMessage message={serverError ?? undefined} />

              <div className="mt-3 text-center text-sm">
                <span className="dark:text darkText">Don't have an Account?</span>{" "}
                <Link href="/register" className="text-blue-600">
                  Create an account
                </Link>
              </div>
            </form>
          </AuthCard>
        </div>
      </div>
    </AnimatedPage>
  );
}
