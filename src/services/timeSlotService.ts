import { api } from "./api";
import { TimeSlotSummary, OperationResult } from "@/types";

export const timeSlotService = {
  /**
   * Get all timeslots for a specific venue
   */
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
};
