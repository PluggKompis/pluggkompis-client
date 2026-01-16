import { api } from "./api";
import { RegisterRequest, LoginRequest, AuthResponse, OperationResult } from "@/types";

export const authService = {
  // Register new user
  register: async (data: RegisterRequest): Promise<OperationResult<AuthResponse>> => {
    const response = await api.post<OperationResult<AuthResponse>>(
      "/auth/register",
      data // role will be sent as 0, 1, 2, or 3
    );
    return response.data;
  },

  // Login user
  login: async (data: LoginRequest): Promise<OperationResult<AuthResponse>> => {
    const response = await api.post<OperationResult<AuthResponse>>("/auth/login", data);
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<OperationResult<AuthResponse>> => {
    const response = await api.post<OperationResult<AuthResponse>>("/auth/refresh", {
      refreshToken,
    });
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get("/users/me");
    return response.data;
  },

  // Logout (clear local storage)
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },
};
