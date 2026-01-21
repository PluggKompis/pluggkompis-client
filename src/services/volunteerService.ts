import { api } from "./api";
import {
  OperationResult,
  Subject,
  VolunteerProfileDto,
  CreateVolunteerProfileRequest,
  UpdateVolunteerProfileRequest,
  VolunteerApplication,
} from "@/types";

export const volunteerService = {
  // Get my volunteer profile
  getMyProfile: async (): Promise<OperationResult<VolunteerProfileDto>> => {
    const response = await api.get<OperationResult<VolunteerProfileDto>>("/volunteers/me/profile");
    return response.data;
  },

  // Create my volunteer profile
  createProfile: async (
    data: CreateVolunteerProfileRequest
  ): Promise<OperationResult<VolunteerProfileDto>> => {
    const response = await api.post<OperationResult<VolunteerProfileDto>>(
      "/volunteers/me/profile",
      data
    );
    return response.data;
  },

  // Update my volunteer profile (PATCH instead of PUT)
  updateProfile: async (
    data: UpdateVolunteerProfileRequest
  ): Promise<OperationResult<VolunteerProfileDto>> => {
    const response = await api.patch<OperationResult<VolunteerProfileDto>>(
      "/volunteers/me/profile",
      data
    );
    return response.data;
  },

  // Get all my applications (pending, approved, declined)
  getMyApplications: async (): Promise<OperationResult<VolunteerApplication[]>> => {
    const response = await api.get<OperationResult<VolunteerApplication[]>>(
      "/volunteers/me/applications"
    );
    return response.data;
  },

  // Get all available subjects
  getAllSubjects: async (): Promise<OperationResult<Subject[]>> => {
    const response = await api.get<OperationResult<Subject[]>>("/subjects");
    return response.data;
  },
};
