import { createContext } from "react";
import { UserRole, Child } from "@/types";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
  children?: Child[];
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
  }) => Promise<void>;
  logout: () => void;
  refreshUserData: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
