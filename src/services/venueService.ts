import { api } from "./api";
import {
  Venue,
  VenueDetail,
  VenueFilterParams,
  CreateVenueRequest,
  UpdateVenueRequest,
  OperationResult,
  TimeSlotSummary,
} from "@/types";

export const venueService = {
  // Get all venues with optional filtering
  getVenues: async (filters?: VenueFilterParams): Promise<OperationResult<Venue[]>> => {
    const response = await api.get<OperationResult<Venue[]>>("/venues", {
      params: filters,
    });
    return response.data;
  },

  // Get venue details by ID
  getVenueById: async (id: string): Promise<OperationResult<VenueDetail>> => {
    const response = await api.get<OperationResult<VenueDetail>>(`/venues/${id}`);
    return response.data;
  },

  // Get my venue (coordinator only)
  getMyVenue: async (): Promise<OperationResult<VenueDetail>> => {
    const response = await api.get<OperationResult<VenueDetail>>("/venues/my-venue");
    return response.data;
  },

  // Get timeslots for a venue
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

  // Create a new venue (coordinator only)
  createVenue: async (data: CreateVenueRequest): Promise<OperationResult<VenueDetail>> => {
    const response = await api.post<OperationResult<VenueDetail>>("/venues", data);
    return response.data;
  },

  // Update venue (coordinator only)
  updateVenue: async (
    id: string,
    data: UpdateVenueRequest
  ): Promise<OperationResult<VenueDetail>> => {
    const response = await api.put<OperationResult<VenueDetail>>(`/venues/${id}`, data);
    return response.data;
  },

  // Delete venue (coordinator only)
  deleteVenue: async (id: string): Promise<OperationResult<void>> => {
    const response = await api.delete<OperationResult<void>>(`/venues/${id}`);
    return response.data;
  },
};
