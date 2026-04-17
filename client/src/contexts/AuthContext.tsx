import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "@/lib/api";
import { toast } from "sonner";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /* =========================
     CHECK TOKEN ON LOAD
  ========================== */

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    authAPI
      .me()
      .then(() => {
        setIsAuthenticated(true);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  /* =========================
     LOGIN
  ========================== */

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);

      const token = response.data.token;

      localStorage.setItem("token", token);

      setIsAuthenticated(true);

      toast.success("Login successful");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Login failed");
      throw error;
    }
  };

  /* =========================
     REGISTER
  ========================== */

  const register = async (email: string, password: string) => {
    try {
      const response = await authAPI.register(email, password);

      const token = response.data.token;

      localStorage.setItem("token", token);

      setIsAuthenticated(true);

      toast.success("Registration successful");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Registration failed");
      throw error;
    }
  };

  /* =========================
     LOGOUT
  ========================== */

  const logout = () => {
    localStorage.removeItem("token");

    setIsAuthenticated(false);

    toast.success("Logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* =========================
   HOOK
========================= */

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
