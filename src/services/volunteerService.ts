import { api } from "./api";
import {
  OperationResult,
  Subject,
  VolunteerProfileDto,
  CreateVolunteerProfileRequest,
  UpdateVolunteerProfileRequest,
} from "@/types";

export const volunteerService = {
  // Get volunteer's own profile
  getMyProfile: async (): Promise<OperationResult<VolunteerProfileDto>> => {
    const response = await api.get<OperationResult<VolunteerProfileDto>>("/volunteer-profiles/me");
    return response.data;
  },

  // Create volunteer profile
  createProfile: async (
    data: CreateVolunteerProfileRequest
  ): Promise<OperationResult<VolunteerProfileDto>> => {
    const response = await api.post<OperationResult<VolunteerProfileDto>>(
      "/volunteer-profiles/me",
      data
    );
    return response.data;
  },

  // Update volunteer profile
  updateProfile: async (
    data: UpdateVolunteerProfileRequest
  ): Promise<OperationResult<VolunteerProfileDto>> => {
    const response = await api.patch<OperationResult<VolunteerProfileDto>>(
      "/volunteer-profiles/me",
      data
    );
    return response.data;
  },

  // Get all available subjects (for form dropdown)
  getAllSubjects: async (): Promise<OperationResult<Subject[]>> => {
    const response = await api.get<OperationResult<Subject[]>>("/subjects");
    return response.data;
  },
};
