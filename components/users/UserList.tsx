"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Search, Plus, MoreHorizontal } from "lucide-react";
import { requestHandler } from "@/utils";
import { getAllUsers, deleteUser as apiDeleteUser } from "@/lib/apiClient";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import dateFormat from "dateformat";
import DetailModal from "../modals/DetailModal";
import { useRouter } from "next/navigation";

/**
 * User type (adjust to match backend)
 */
interface UserType {
  _id: string;
  fullName?: string;
  username?: string;
  email?: string;
  role?: string;
  avatar?: string;
  createdAt?: string | Date;
  lastlogin?: string | Date;

}

/**
 * Small reusable More menu used for each row/card.
 * keeps UI consistent. Emits onEdit/onDelete.
 */
function UserMoreMenu({
  onEdit,
  onDelete,
  isAdmin,
}: {
  onEdit?: () => void;
  onDelete?: () => void;
  isAdmin?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((s) => !s);
        }}
        className="p-2 rounded-md hover:bg-tp-bgLight/20 text-tp-textMuted"
        aria-label="more"
      >
        <MoreHorizontal size={18} />
      </button>

      {open && isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-10 w-40 rounded-md bg-tp-card shadow-lg border border-tp-border z-40"
        >
          <button
            onClick={() => {
              setOpen(false);
              onEdit?.();
            }}
            className="w-full text-left px-3 py-2 hover:bg-tp-bgLight/10"
          >
            Edit
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onDelete?.();
            }}
            className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600"
          >
            Delete
          </button>
        </motion.div>
      )}
    </div>
  );
}

/**
 * Main UserList component
 */
export default function UserList() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { showToast } = useToast();
  const { user: me } = useAuth();

  const router = useRouter()

  // fetch users
  useEffect(() => {
    const fetch = async () => {
      requestHandler(
        async () => await getAllUsers(),
        setLoading,
        (res) => {
          // ensure unique keys & stable ordering
          const payload = Array.isArray(res.data) ? res.data : [];
          setUsers(payload);
        },
        (err: any) => {
          showToast(err?.message || "Failed to load users", "error");
        }
      );
    };
    fetch();
  }, []);

  const filtered = users.filter((u) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return (
      (u.fullName || "").toLowerCase().includes(term) ||
      (u.username || "").toLowerCase().includes(term) ||
      (u.email || "").toLowerCase().includes(term)
    );
  });

  const handleDelete = (userId: string) => {
    if (!confirm("Delete user? This is irreversible.")) return;
    requestHandler(
      async () => await apiDeleteUser(userId),
      null,
      (res) => {
        showToast(res?.message || "User deleted", "success");
        setUsers((prev) => prev.filter((p) => p._id !== userId));
        if (selectedUser?._id === userId) {
          setSelectedUser(null);
          setDetailsOpen(false);
        }
      },
      (err: any) => {
        showToast(err?.message || "Failed to delete user", "error");
      }
    );
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 pt-10 pb-16 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-3xl font-semibold text-tp-bg"
        >
          Users
        </motion.h1>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 text-tp-textMuted" />
            <input
              type="text"
              placeholder="Search by name, username, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-3 py-2 rounded-md w-full border border-tp-border bg-tp-card text-tp-bg focus:ring-2 focus:ring-tp-primary outline-none"
            />
          </div>

       
        </div>
      </div>

      {/* Desktop table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="hidden md:block rounded-xl bg-tp-card p-4 shadow-sm"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="text-left text-sm text-tp-textMuted">
                <th className="px-4 py-2">Profile</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Username</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Last Login</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-tp-textMuted">
                    No users found.
                  </td>
                </tr>
              )}

              {filtered.map((u, i) => (
                <motion.tr

                    onClick={() => {
                        setSelectedUser(u);
                        setDetailsOpen(true)
                    }}
                  key={u._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-tp-bgLight/10 rounded-lg"
                >
                  <td
                    className="px-4 py-3 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/profile/${u._id}`)
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar || "/Profile.png"}
                        alt={u.fullName || u.username}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                 
                        
                        
                      
                    </div>
                  </td>
                  <td>
                    <div className="text-sm font-medium text-tp-bg">
                          {u.fullName || "—"}
                        </div>
                  </td>

                  <td
                    className="px-4 py-3 text-tp-bg cursor-pointer"
                    onClick={() => {
                      setSelectedUser(u);
                      setDetailsOpen(true);
                    }}
                  >
                    {u.username || "—"}
                  </td>

                  <td className="px-4 py-3 text-tp-textMuted">{u.email}</td>

                  <td className="px-4 py-3 text-tp-textMuted">{u.role || "User"}</td>

                  <td className="px-4 py-3 text-tp-textMuted">
                    {u.lastlogin ? dateFormat(u.lastlogin, "d mmm, yyyy") : "—"}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <UserMoreMenu
                        isAdmin={me?.role === "Admin"}
                        onEdit={() => {
                          // open edit modal - placeholder
                          setSelectedUser(u);
                          showToast("Edit user - not implemented", "info");
                        }}
                        onDelete={() => handleDeleteUser(u._id)}
                      />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-4">
        {filtered.map((u, i) => (
          <motion.div
            key={u._id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="rounded-xl bg-tp-card p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div
              
              className="flex items-center gap-3 cursor-pointer" onClick={() => { setSelectedUser(u); setDetailsOpen(true); }}>
                <img
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/profile/${u._id}`)
                }}
                  src={u.avatar || "/Profile.png"}
                  alt={u.fullName || u.username}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <div className="text-sm font-medium text-tp-bg">{u.fullName || "—"}</div>
                  <div className="text-xs text-tp-textMuted">{u.username || u.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-sm text-tp-textMuted mr-2">{u.role || "User"}</div>
                <UserMoreMenu
                  isAdmin={me?.role === "Admin"}
                  onEdit={() => {
                    setSelectedUser(u);
                    showToast("Edit user - not implemented", "info");
                  }}
                  onDelete={() => handleDeleteUser(u._id)}
                />
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div className="text-tp-textMuted">Last login</div>
              <div className="text-tp-bg">
                {u.lastlogin ? dateFormat(u.lastlogin, "d mmm, yyyy") : "—"}
              </div>

              <div className="text-tp-textMuted">Created</div>
              <div className="text-tp-bg">{u.createdAt ? dateFormat(u.createdAt, "d mmm, yyyy") : "—"}</div>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <p className="text-center text-tp-textMuted py-10 text-sm">No users found.</p>
        )}
      </div>

      {/* detail modal */}
      <DetailModal
        open={detailsOpen}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedUser(null);
        }}
        title={selectedUser ? `${selectedUser.fullName || selectedUser.username}` : "User"}
        data={
          selectedUser
            ? {
                FullName: selectedUser.fullName || "—",
                Username: selectedUser.username || "—",
                Email: selectedUser.email || "—",
                Role: selectedUser.role || "User",
                "Last Login": selectedUser.lastlogin ? dateFormat(selectedUser.lastlogin, "d mmm, yyyy") : "—",
                "Created At": selectedUser.createdAt ? dateFormat(selectedUser.createdAt, "d mmm, yyyy") : "—",
                ID: selectedUser._id,
              }
            : {}
        }
      />
    </div>
  );

  // helper to delete user with confirmationand  request
  function handleDeleteUser(userId: string) {
    if (userId === me?._id) {
      return showToast("You can't delete your own account.", "error");
    }
    if (!confirm("Are you sure you want to delete this user?")) return;
    requestHandler(
      async () => await apiDeleteUser(userId),
      null,
      (res) => {
        showToast(res?.message || "User deleted", "success");
        setUsers((prev) => prev.filter((p) => p._id !== userId));
        if (selectedUser?._id === userId) {
          setDetailsOpen(false);
          setSelectedUser(null);
        }
      },
      (err: any) => {
        showToast(err?.message || "Failed to delete user", "error");
      }
    );
  }
}
