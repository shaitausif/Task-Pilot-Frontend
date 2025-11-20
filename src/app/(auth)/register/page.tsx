"use client";
import React, { useState } from "react";
import AuthCard from "../../../../components/ui/AuthCard";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";
import ErrorMessage from "../../../../components/ui/ErrorMessage";
import AnimatedPage from "../../../../components/ui/AnimatedPage";

import { useForm } from "react-hook-form";
import { set, z } from "zod";
import { RegisterSchema } from "@/schemas/RegisterSchema";
import { zodResolver } from "@hookform/resolvers/zod";

import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { useToast } from "@/context/ToastContext";
import { requestHandler } from "@/utils";
import { registerUser } from "@/lib/apiClient";

export type RegisterInputs = z.infer<typeof RegisterSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast} = useToast();

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<RegisterInputs>({
    resolver: zodResolver(RegisterSchema),
  });

  async function onSubmit(data: RegisterInputs) {
        if(!data.email || !data.fullName || !data.password || !data.username) return showToast("Please fill the required fields",'info')
        requestHandler(
    // @ts-ignore
            async() => await registerUser(data),
            setLoading,
            (res) => {
                showToast("User Registered Successully.",'success')
                router.push("/login")
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
      <div className="mx-4 flex w-full max-w-6xl items-center gap-12 lg:mx-0">
        {/* Form */}
        <div className="flex w-full justify-center">
          <AuthCard title="Create Account" subtitle="Join TaskPilot to manage your workflow.">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Full Name"
                
                placeholder="Your full name"
                {...register("fullName")}
                error={errors.fullName}
              />

              <Input
                label="Username"
                
                placeholder="username"
                {...register("username")}
                error={errors.username}
              />

              <Input
                label="Email"
                placeholder="you@example.com"
                {...register("email")}
                error={errors.email}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Your password"
                {...register("password")}
                error={errors.password}
              />

              {/* Avatar upload (optional) */}
              <div>
                <label className="text-sm font-medium text-gray-700">Avatar (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="mt-1 w-full text-sm dark:text darkText border border-gray-200 px-2 py-1 rounded-lg"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setValue("avatar", e.target.files[0]);
                    }
                  }}
                />
                {errors.avatar && (
                  <p className="text-xs text-red-500 mt-1">{errors.avatar.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full dark:text darkText" loading={loading}>
                Create Account
              </Button>

              <ErrorMessage message={serverError ?? undefined} />

              <div className="mt-3 text-center text-sm">
                <span className="dark:text darkText">Already have an account?</span>{" "}
                <Link href="/login" className="text-blue-600">
                   Sign in
                </Link>
              </div>
            </form>
          </AuthCard>
        </div>

        {/* Right side visual */}
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
            className="max-w-sm rounded-lg shadow-md"
            alt="dashboard"
          />
          <h2 className="text-3xl dark:text darkText font-semibold">Organize your workflow</h2>
          <p className="max-w-sm text-gray-600">
            TaskPilot helps you stay productive and manage your tasks seamlessly.
          </p>
        </motion.div>
      </div>
    </AnimatedPage>
  );
}
