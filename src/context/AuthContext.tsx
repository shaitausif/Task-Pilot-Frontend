"use client";

import { LocalStorage } from "@/utils";
import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/interfaces/user";

interface AuthContextType {
  user: User | null;
  setUser: (userData: User) => void;
  clearUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);

  
  // Loading user from localStorage (persist on refresh)
  
  useEffect(() => {
    const storedUser = LocalStorage.get("taskpilot-user")
    if (storedUser) {
      setUserState(storedUser);
    }
  }, []);


  // Saving user to localStorage
 
  const setUser = (userData: User) => {
    setUserState(userData);
    LocalStorage.set("taskpilot-user",userData)
  };

  
  // Clear user from state and storage
  
  const clearUser = () => {
    setUserState(null);
    LocalStorage.remove('taskpilot-user')
  };

  return (
    <AuthContext.Provider value={{ user, setUser, clearUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
