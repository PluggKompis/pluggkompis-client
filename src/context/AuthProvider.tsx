import React, { useState, useEffect } from "react";
import { authService, parentService } from "@/services"; // ← Use parentService
import { AuthContext, AuthContextType, User } from "./AuthContext";
import { Child, UserRole } from "@/types";
import { userService } from "@/services";

interface AuthProviderProps {
  children: React.ReactNode;
}

// Backend sends strings now, so just validate
const convertToUserRole = (role: string): UserRole => {
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

  const fetchChildrenForParent = async (): Promise<Child[]> => {
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

      if (user.role === UserRole.Parent) {
        user.children = await fetchChildrenForParent();
      }

      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } else {
      throw new Error(result.errors?.join(", ") || "Registration failed");
    }
  };

  // Refresh user data (mainly for updating children)
  const refreshUserData = async () => {
    // 1. Fetch fresh user data from backend
    const result = await userService.getMe();

    if (result.isSuccess && result.data) {
      console.log("🔄 User data refreshed from backend");

      // FIX: Explicitly type this variable as 'User' (from AuthContext)
      // This tells TS: "It's okay, this object is allowed to have 'children'"
      let updatedUser: User = { ...result.data };

      // 2. If Parent, keep fetching children logic
      if (updatedUser.role === UserRole.Parent) {
        const children = await fetchChildrenForParent();
        updatedUser = { ...updatedUser, children };
      }

      // 3. Update State and LocalStorage
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
