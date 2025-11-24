"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Edit2, Loader2, Trash2 } from "lucide-react";
import { z } from "zod";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { requestHandler } from "@/utils";
import {
  getUserById,
  updateUserProfile,
  updateUserRole,
  deleteUser as apiDeleteUser,
} from "@/lib/apiClient";

import FormModal from "../forms/FormModal";
import FormWrapper from "../forms/FormWrapper";
import Button from "../ui/Button";
import dateFormat from "dateformat";
import { ParamValue } from "next/dist/server/request/params";
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import ProfileForm from "../forms/ProfileForm";

/* ---------- SCHEMAS ---------------- */
// User can edit only these fields
  const UserUpdateSchema = z.object({
    fullName: z.string().min(5, "Full Name must be at least of 5 characters").nonempty().max(30, "Full Name must be less than of 30 characters."),
    bio : z.string().min(16, "Must be greater than 15 characters").nonempty().max(700, "Bio must be less than 700 characters"),
    avatar: z.instanceof(File).optional(), 
  })






export const RoleUpdateSchema = z.object({
  role: z.string()
});

type RoleUpdateType = z.infer<typeof RoleUpdateSchema>;

type UserProfileType = {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  role?: string;
  lastlogin?: string | Date;
  createdAt?: string | Date;
};

const DESIGN_AVATAR =
  "/mnt/data/A_user_profile_page_in_TaskPilot,_a_web_applicatio.png";

/* ---------- COMPONENT ---------------- */
export default function UserProfile({ userId }: { userId?: string | ParamValue }) {
  const { user: me , setUser} = useAuth();
  const { showToast } = useToast();

  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [loading, setLoading] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
    

    const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof UserUpdateSchema>>({
    resolver : zodResolver(UserUpdateSchema),
  })

  const isOwner = Boolean(me?._id && profile?._id && me._id === profile._id);
  const isAdmin = me?.role === "Admin";

  useEffect(() => {
    const id = userId ?? me?._id;
    if (!id) return;

    requestHandler(
        // @ts-ignore
      async () => await getUserById(id),
      setLoading,
      (res) => setProfile(res.data),
      (err: any) => showToast(err?.message || "Failed to load profile", "error")
    );
  }, [userId, me?._id]);

  if (!profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-tp-textMuted text-base sm:text-lg">
          Loading profile...
        </div>
      </div>
    );
  }

  /* ---------- Handlers (unchanged) ---------- */



 
  


   const onSubmit: SubmitHandler<any> = (data) => {
  
         requestHandler(
      // @ts-ignore
      async () => await updateUserProfile(data),
      null,
      (res) => {
        setProfile(res.data);
        setEditOpen(false);
        showToast("Profile updated", "success");
        setUser(res.data)
      },
      (err: any) => showToast(err?.message, "error")
    );
      
   
  }
  async function handleRoleUpdate(values: RoleUpdateType) {
    if (!isAdmin) return;

    requestHandler(
      async () => await updateUserRole(profile?._id),
      null,
      (res) => {
        setProfile((p) => (p ? { ...p, role: res.data.role } : p));
        setRoleOpen(false);
        showToast("Role updated", "success");
      },
      (err: any) => showToast(err?.message || "Something wemt wrong", "error")
    );
  }

  async function handleDeleteAccount() {
    if (!isOwner) return;
    if (!confirm("Delete your account? This is irreversible.")) return;

    requestHandler(
      async () => await apiDeleteUser(profile?._id!),
      setDeleting,
      (res) => showToast("Account deleted", "success"),
      (err: any) => showToast(err?.message, "error")
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-3 sm:px-6 py-6 sm:py-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="rounded-xl bg-tp-card p-4 sm:p-6 shadow-sm"
      >
        {/* -------- HEADER -------- */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-6">
            {/* Avatar */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-gray-200 shrink-0">
              <Image
                src={profile?.avatar || "/Profile.png"}
                alt={profile?.fullName! || profile?.username!}
                fill
                className="object-cover"
              />
            </div>

            {/* Details */}
            <div className="w-full">
              <h1 className="text-2xl sm:text-3xl font-bold text-tp-bg leading-tight wrap-break-word">
                {profile?.fullName}
              </h1>

              <p className="text-sm sm:text-base text-tp-textMuted wrap-break-word">
                @{profile?.username}
              </p>

              <p className="mt-2 text-sm sm:text-base text-tp-textMuted leading-relaxed wrap-break-word max-w-2xl">
                {profile?.bio || "No bio provided."}
              </p>

              {/* Chips */}
              <div className="mt-4 flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm">
                <div className="px-3 py-1 rounded-md bg-tp-bgLight/20 text-tp-textMuted">
                  Role:
                  <span className="text-tp-bg ml-1 font-medium">
                    {profile?.role}
                  </span>
                </div>

                <div className="px-3 py-1 rounded-md bg-tp-bgLight/20 text-tp-textMuted">
                  Member since:
                  <span className="text-tp-bg ml-1 font-medium">
                    {profile?.createdAt
                      ? dateFormat(profile.createdAt, "d mmm, yyyy")
                      : "—"}
                  </span>
                </div>

                <div className="px-3 py-1 rounded-md bg-tp-bgLight/20 text-tp-textMuted">
                  Last login:
                  <span className="text-tp-bg ml-1 font-medium">
                    {profile?.lastlogin
                      ? dateFormat(profile.lastlogin, "d mmm, yyyy")
                      : "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {isOwner && (
              <Button className="px-3 sm:px-4 py-2 text-sm sm:text-base flex items-center gap-2"
                onClick={() => {
                 
                  setEditOpen(true)
                }}>
                  
                <Edit2 size={16} /> Edit Profile
              </Button>
            )}

            {isAdmin && !isOwner && (
              <Button
                className="px-3 sm:px-4 py-2 text-sm sm:text-base flex items-center gap-2"
                onClick={() => setRoleOpen(true)}
              >
                Edit Role
              </Button>
            )}

            {!isOwner && !isAdmin && (
              <p className="text-xs sm:text-sm text-tp-textMuted">
                Viewing profile
              </p>
            )}
          </div>
        </div>

        {/* -------- BODY -------- */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className="md:col-span-2 space-y-4 sm:space-y-6"
          >
            {/* Profile Section */}
            <section className="rounded-lg bg-tp-bgLight/5 p-4 sm:p-5">
              <h3 className="text-lg sm:text-xl font-semibold text-tp-bg mb-3">
                Profile Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
                <div>
                  <p className="text-xs sm:text-sm text-tp-textMuted">
                    Full name
                  </p>
                  <p className="text-tp-bg font-medium wrap-break-word mt-1">
                    {profile?.fullName}
                  </p>
                </div>

                <div>
                  <p className="text-xs sm:text-sm text-tp-textMuted">
                    Username
                  </p>
                  <p className="text-tp-bg font-medium wrap-break-word mt-1">
                    @{profile?.username}
                  </p>
                </div>

                <div>
                  <p className="text-xs sm:text-sm text-tp-textMuted">
                    Email
                  </p>
                  <p className="text-tp-bg font-medium wrap-break-word mt-1">
                    {profile?.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs sm:text-sm text-tp-textMuted">Bio</p>
                  <p className="text-tp-bg font-medium wrap-break-word mt-1">
                    {profile?.bio || "—"}
                  </p>
                </div>
              </div>
            </section>

            {/* Security */}
            <section className="rounded-lg bg-tp-bgLight/5 p-4 sm:p-5">
              <h3 className="text-lg sm:text-xl font-semibold text-tp-bg mb-2">
                Security & Tokens
              </h3>

              <p className="text-sm sm:text-base text-tp-textMuted leading-relaxed">
                Refresh tokens and authentication details are stored on the
                server. You can revoke sessions from account settings.
              </p>
            </section>
          </motion.div>

          {/* SIDE PANEL */}
          <motion.aside
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.09 }}
            className="space-y-4 sm:space-y-6"
          >
            <div className="rounded-lg bg-tp-bgLight/5 p-4">
              <h4 className="text-sm sm:text-base text-tp-textMuted mb-2">
                Account
              </h4>

              <div className="space-y-2 text-sm sm:text-base text-tp-textMuted">
                <div>
                  Role:
                  <span className="font-medium text-tp-bg ml-1">
                    {profile?.role}
                  </span>
                </div>
                <div>
                  Member since:
                  <span className="font-medium text-tp-bg ml-1">
                    {profile?.createdAt
                      ? dateFormat(profile.createdAt, "d mmm, yyyy")
                      : "—"}
                  </span>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </motion.div>

      {/* -------- DELETE BLOCK -------- */}
      {isOwner && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12 }}
          className="mt-6 sm:mt-8 max-w-3xl"
        >
          <div className="rounded-lg bg-red-50 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm sm:text-base font-medium text-red-700">
                  Delete Account
                </p>
                <p className="text-xs sm:text-sm text-red-600/90">
                  This action is irreversible. All your data will be permanently removed.
                </p>
              </div>

              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="rounded-md px-3 sm:px-4 py-2 bg-red-600 text-white hover:bg-red-700 text-sm sm:text-base"
              >
                {deleting ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* -------- MODALS (UNCHANGED) -------- */}
     <FormModal
  open={editOpen}
  onClose={() => setEditOpen(false)}
  title="Edit Profile"
>
 <form onSubmit={handleSubmit(onSubmit)}>
      <ProfileForm defaultValue={{
        fullName : profile.fullName,
        bio : profile.bio
      }} register={register} setValue={setValue} errors={errors} />

        <div className="pt-5">
          {
            loading ? (
              <Button
              disabled
        type='button'
        >
          <Loader2 className="animate-spin" /> 
        </Button>
            ) : (
              <Button
        type='submit'
        >
          Save
        </Button>
            )
          }
        </div>
 </form>
</FormModal>

      <FormModal open={roleOpen} onClose={() => setRoleOpen(false)} title={`Edit role for ${profile?.username}`}>
        <FormWrapper
          key={profile?._id + "-role-edit"}
          schema={RoleUpdateSchema}
          defaultValues={{ role: profile?.role || "User" }}
          onSubmit={handleRoleUpdate as any}
          submitLabel="Update role"
        >
          <label className="block">
            <span className="text-sm text-tp-textMuted">Role</span>
            <select
              name="role"
              defaultValue={profile?.role || "User"}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm bg-tp-bgLight"
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </label>
        </FormWrapper>
      </FormModal>
    </div>
  );
}
