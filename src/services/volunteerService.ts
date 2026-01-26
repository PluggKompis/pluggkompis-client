import { api } from "./api";
import {
  OperationResult,
  Subject,
  VolunteerProfileDto,
  CreateVolunteerProfileRequest,
  UpdateVolunteerProfileRequest,
  VolunteerApplication,
  CreateShiftSignupRequest,
  VolunteerShiftDto,
  AvailableShiftDto,
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

  // Get my upcoming shifts
  getUpcomingShifts: async (): Promise<OperationResult<VolunteerShiftDto[]>> => {
    const response = await api.get<OperationResult<VolunteerShiftDto[]>>(
      "/volunteers/me/shifts/upcoming"
    );
    return response.data;
  },

  // Get my past shifts
  getPastShifts: async (): Promise<OperationResult<VolunteerShiftDto[]>> => {
    const response = await api.get<OperationResult<VolunteerShiftDto[]>>(
      "/volunteers/me/shifts/past"
    );
    return response.data;
  },

  // Sign up for a shift
  signUpForShift: async (data: CreateShiftSignupRequest): Promise<OperationResult<void>> => {
    const response = await api.post<OperationResult<void>>("/volunteers/shifts", data);
    return response.data;
  },

  // Cancel a shift
  cancelShift: async (shiftId: string): Promise<OperationResult<void>> => {
    const response = await api.delete<OperationResult<void>>(`/volunteers/shifts/${shiftId}`);
    return response.data;
  },

  // Export hours as PDF
  exportHoursPdf: async (
    startDate: string, // "2026-01-01"
    endDate: string // "2026-01-31"
  ): Promise<Blob> => {
    const response = await api.get(
      `/volunteers/me/reports/hours.pdf?startDate=${startDate}&endDate=${endDate}`,
      {
        responseType: "blob", // Important for PDF download
      }
    );
    return response.data;
  },

  // Get available shifts to sign up for
  getAvailableShifts: async (): Promise<OperationResult<AvailableShiftDto[]>> => {
    const response = await api.get<OperationResult<AvailableShiftDto[]>>(
      "/volunteers/available-shifts"
    );
    return response.data;
  },
};
