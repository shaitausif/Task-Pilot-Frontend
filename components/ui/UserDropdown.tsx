'use client'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { LogouttheUser } from '@/lib/logout'
import { LogOut, Settings, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'





const UserDropdown = ({user}: {user: any}) => {

    const { showToast } = useToast()
    const router = useRouter()
    const [loading, setloading] = useState(false)
    const { clearUser} = useAuth()
    

  return (
    <>
         <div className="px-4 py-3">
                <p className="text-sm font-medium ">
                  {user?.fullName || "Guest User"}
                </p>
                <p className="text-xs text-tp-textMuted capitalize">
                  {user?.role || "User"}
                </p>
              </div>

              <button
              onClick={() => router.push('/profile')}
              className="flex hover:bg-[#28343e] w-full items-center gap-2 px-4 py-3 text-sm text-tp-text hover:bg-tp-bgLight/20 transition">
                <User size={14} /> Profile
              </button>

              <button
              onClick={() => showToast("This Page is under construction",'info')}
              className="flex hover:bg-[#28343e] w-full items-center gap-2 px-4 py-3 text-sm text-tp-text hover:bg-tp-bgLight/20 transition">
                <Settings size={14} /> Settings
              </button>

              <button
                onClick={async() => {
                  setloading(true)
                    await LogouttheUser(router, showToast, clearUser)
                    setloading(false)
                }}
                disabled={loading}
                className="flex w-full  items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-[#28343e] transition"
              >
                <LogOut size={14} /> Logout
              </button>
    </>
  )
}

export default UserDropdown
