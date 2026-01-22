import { api } from "./api";
import {
  OperationResult,
  PaginatedResponse,
  CoordinatorVolunteerApplication,
  ApproveVolunteerRequest,
  DeclineVolunteerRequest,
  MarkAttendanceRequest,
  CoordinatorShift,
  GetShiftsParams,
} from "@/types";

export const coordinatorService = {
  // Get all pending volunteer applications for my venue
  getPendingApplications: async (): Promise<OperationResult<CoordinatorVolunteerApplication[]>> => {
    const response = await api.get<OperationResult<CoordinatorVolunteerApplication[]>>(
      "/coordinator/applications"
    );

    return response.data;
  },

  // Approve a volunteer application
  approveApplication: async (
    applicationId: string,
    data: ApproveVolunteerRequest
  ): Promise<OperationResult<void>> => {
    const response = await api.put<OperationResult<void>>(
      `/coordinator/applications/${applicationId}/approve`,
      data
    );

    return response.data;
  },

  // Decline a volunteer application
  declineApplication: async (
    applicationId: string,
    data: DeclineVolunteerRequest
  ): Promise<OperationResult<void>> => {
    const response = await api.put<OperationResult<void>>(
      `/coordinator/applications/${applicationId}/decline`,
      data
    );
    return response.data;
  },

  // Get shifts with filters
  getShifts: async (
    filters?: GetShiftsParams
  ): Promise<OperationResult<PaginatedResponse<CoordinatorShift>>> => {
    const response = await api.get<OperationResult<PaginatedResponse<CoordinatorShift>>>(
      "/coordinator/shifts",
      { params: filters }
    );
    return response.data;
  },

  // Mark attendance for a shift
  markAttendance: async (
    shiftId: string,
    data: MarkAttendanceRequest
  ): Promise<OperationResult<void>> => {
    const response = await api.put<OperationResult<void>>(
      `/coordinator/shifts/${shiftId}/attendance`,
      data
    );
    return response.data;
  },
};
