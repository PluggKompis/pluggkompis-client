import React, { useState, useEffect } from "react";
import { authService, parentService } from "@/services"; // ← Use parentService
import { AuthContext, AuthContextType, User } from "./AuthContext";
import { Child, UserRole } from "@/types";

interface AuthProviderProps {
  children: React.ReactNode;
}

// Helper function to convert C# enum role to TypeScript enum
const convertToUserRole = (role: number | string): UserRole => {
  if (typeof role === "number") {
    return role as UserRole;
  }

  const roleNameMap: Record<string, UserRole> = {
    Coordinator: UserRole.Coordinator,
    Volunteer: UserRole.Volunteer,
    Parent: UserRole.Parent,
    Student: UserRole.Student,
  };

  const converted = roleNameMap[role];
  console.log("🔄 Converting role string:", role, "→", converted);
  return converted !== undefined ? converted : UserRole.Student;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper: Fetch children for parents
  const fetchChildrenForParent = async (): Promise<Child[]> => {
    // ← Remove userId parameter
    try {
      const result = await parentService.getMyChildren();
      if (result.isSuccess && result.data) {
        console.log("✅ Fetched children:", result.data);
        return result.data;
      }
      console.warn("⚠️ No children data returned");
      return [];
    } catch (error) {
      console.error("❌ Failed to fetch children:", error);
      return [];
    }
  };

  // Check if user is logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);

          // If parent, fetch fresh children data
          if (parsedUser.role === UserRole.Parent) {
            const children = await fetchChildrenForParent();
            parsedUser.children = children;
            localStorage.setItem("user", JSON.stringify(parsedUser));
          }

          setUser(parsedUser);
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
        role: convertToUserRole(userData.role),
        firstName: userData.firstName,
        lastName: userData.lastName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Fetch children if parent
      if (user.role === UserRole.Parent) {
        user.children = await fetchChildrenForParent();
      }

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
        role: convertToUserRole(userData.role),
        firstName: userData.firstName,
        lastName: userData.lastName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log("🔍 Backend userData.role:", userData.role);
      console.log("🔍 Converted role:", user.role);
      console.log("🔍 User object to store:", user);

      // Fetch children if parent (will be empty on first register, but keeps structure consistent)
      if (user.role === UserRole.Parent) {
        user.children = await fetchChildrenForParent();
      }

      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } else {
      throw new Error(result.errors?.join(", ") || "Registration failed");
    }
  };

  // NEW: Refresh user data (mainly for updating children)
  const refreshUserData = async () => {
    if (!user) return;

    console.log("🔄 Refreshing user data...");

    // Only refresh children for parents
    if (user.role === UserRole.Parent) {
      const children = await fetchChildrenForParent();
      const updatedUser = { ...user, children };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      console.log("✅ User data refreshed:", updatedUser);
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
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
