"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";

interface AdminContextType {
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // We're using plain text passwords for simplicity
  // In a real app, you'd use a proper password hashing method

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);

      // TEMPORARY FALLBACK: Check default credentials until database is set up
      if (username === 'admin' && password === 'cardleague123') {
        console.log("Using fallback authentication (database table not set up yet)");
        setIsLoggedIn(true);
        sessionStorage.setItem("adminLoggedIn", "true");
        sessionStorage.setItem("adminUsername", username);
        return true;
      }

      try {
        // Check credentials against the database with plain text password
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("username", username)
          .eq("password", password)  // Using plain text password
          .eq("is_admin", true)
          .single();

        if (error || !data) {
          console.error("Login error:", error);
          return false;
        }
      } catch (dbError) {
        console.error("Database error (likely users table not set up yet):", dbError);
        return false;
      }

      setIsLoggedIn(true);
      sessionStorage.setItem("adminLoggedIn", "true");
      sessionStorage.setItem("adminUsername", username);

      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("adminLoggedIn");
    sessionStorage.removeItem("adminUsername");
  };

  // Check if user was previously logged in this session
  useEffect(() => {
    const checkPreviousLogin = async () => {
      if (typeof window !== "undefined") {
        const loggedIn = sessionStorage.getItem("adminLoggedIn") === "true";
        setIsLoggedIn(loggedIn);
        setIsLoading(false);
      }
    };

    checkPreviousLogin();
  }, []);

  return (
    <AdminContext.Provider value={{ isLoggedIn, login, logout, isLoading }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
