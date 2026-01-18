import React, { useState, useEffect } from "react";
import { authService } from "@/services";
import { AuthContext, AuthContextType, User } from "./AuthContext";
import { UserRole } from "@/types";

interface AuthProviderProps {
  children: React.ReactNode;
}

// Helper function to convert c# enum role to TypeScript enum string
const convertToUserRole = (role: number | string): UserRole => {
  // If it's already a number, return it directly
  if (typeof role === "number") {
    return role as UserRole;
  }

  // If it's a string, convert role NAME to role number
  const roleNameMap: Record<string, UserRole> = {
    Coordinator: UserRole.Coordinator, // 0
    Volunteer: UserRole.Volunteer, // 1
    Parent: UserRole.Parent, // 2
    Student: UserRole.Student, // 3
  };

  const converted = roleNameMap[role];
  console.log("🔄 Converting role string:", role, "→", converted);
  return converted !== undefined ? converted : UserRole.Student; // Default to Student
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Failed to parse stored user:", error);
          authService.logout();
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authService.login({ email, password });

    if (result.isSuccess && result.data) {
      const { token, refreshToken, user: userData } = result.data;

      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);

      const user: User = {
        id: userData.id,
        email: userData.email,
        role: convertToUserRole(userData.role), // convert back the enum to string role
        firstName: userData.firstName,
        lastName: userData.lastName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } else {
      throw new Error(result.errors?.join(", ") || "Login failed");
    }
  };

  const register = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
  }) => {
    const result = await authService.register(data);

    if (result.isSuccess && result.data) {
      const { token, refreshToken, user: userData } = result.data;

      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);

      const user: User = {
        id: userData.id,
        email: userData.email,
        role: convertToUserRole(userData.role), // convert back the enum to string role
        firstName: userData.firstName,
        lastName: userData.lastName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log("🔍 Backend userData.role:", userData.role);
      console.log("🔍 Converted role:", user.role);
      console.log("🔍 User object to store:", user);

      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } else {
      throw new Error(result.errors?.join(", ") || "Registration failed");
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
