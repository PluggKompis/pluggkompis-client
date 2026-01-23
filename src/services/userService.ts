import { api } from "./api";
import { OperationResult, User, UpdateMyProfileDto, ChangePasswordDto } from "@/types";

export const userService = {
  getMe: async (): Promise<OperationResult<User>> => {
    const response = await api.get<OperationResult<User>>("/users/me");
    return response.data;
  },

  updateProfile: async (data: UpdateMyProfileDto): Promise<OperationResult<User>> => {
    const response = await api.patch<OperationResult<User>>("/users/me", data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordDto): Promise<OperationResult<void>> => {
    const response = await api.put<OperationResult<void>>("/users/me/password", data);
    return response.data;
  },

  deleteAccount: async (): Promise<OperationResult<void>> => {
    const response = await api.delete<OperationResult<void>>("/users/me");
    return response.data;
  },
};
