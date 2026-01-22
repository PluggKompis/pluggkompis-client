import { api } from "./api";
import {
  TimeSlotSummary,
  CreateTimeSlotRequest,
  UpdateTimeSlotRequest,
  OperationResult,
} from "@/types";

export const timeSlotService = {
  // Get all timeslots for a specific venue
  getVenueTimeSlots: async (
    venueId: string,
    includeCancelled: boolean = false
  ): Promise<OperationResult<TimeSlotSummary[]>> => {
    const response = await api.get<OperationResult<TimeSlotSummary[]>>(
      `/venues/${venueId}/timeslots`,
      {
        params: { includeCancelled },
      }
    );
    return response.data;
  },

  // Get timeslot by ID
  getTimeSlotById: async (id: string): Promise<OperationResult<TimeSlotSummary>> => {
    const response = await api.get<OperationResult<TimeSlotSummary>>(`/timeslots/${id}`);
    return response.data;
  },

  // Create a new timeslot (Coordinator only)
  createTimeSlot: async (
    data: CreateTimeSlotRequest
  ): Promise<OperationResult<TimeSlotSummary>> => {
    const response = await api.post<OperationResult<TimeSlotSummary>>("/timeslots", data);
    return response.data;
  },

  // Update a timeslot (Coordinator only)
  updateTimeSlot: async (
    id: string,
    data: UpdateTimeSlotRequest
  ): Promise<OperationResult<TimeSlotSummary>> => {
    const response = await api.put<OperationResult<TimeSlotSummary>>(`/timeslots/${id}`, data);
    return response.data;
  },

  // Cancel a timeslot
  cancelTimeSlot: async (id: string): Promise<OperationResult<void>> => {
    const response = await api.put<OperationResult<void>>(`/timeslots/${id}/cancel`);
    return response.data;
  },

  // Delete a timeslot (Coordinator only)
  deleteTimeSlot: async (id: string): Promise<OperationResult<void>> => {
    const response = await api.delete<OperationResult<void>>(`/timeslots/${id}`);
    return response.data;
  },
};
