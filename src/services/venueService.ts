import { api } from "./api";
import {
  Venue,
  VenueDetail,
  VenueFilterParams,
  CreateVenueRequest,
  UpdateVenueRequest,
  OperationResult,
  ApplyToVenueRequest,
  TimeSlotSummary,
  PaginatedResponse,
  VolunteerApplication,
  VolunteerProfileDto,
} from "@/types";

export const venueService = {
  // Get all venues with optional filtering
  getVenues: async (
    filters?: VenueFilterParams
  ): Promise<OperationResult<PaginatedResponse<Venue>>> => {
    // Build URLSearchParams to properly serialize arrays for .NET
    const params = new URLSearchParams();

    if (filters) {
      if (filters.city) params.append("city", filters.city);
      if (filters.isActive !== undefined) params.append("isActive", filters.isActive.toString());
      if (filters.pageNumber) params.append("pageNumber", filters.pageNumber.toString());
      if (filters.pageSize) params.append("pageSize", filters.pageSize.toString());

      // Add array params without brackets (repeat param name)
      filters.subjectIds?.forEach((id) => params.append("subjectIds", id));
      filters.daysOfWeek?.forEach((day) => params.append("daysOfWeek", day));
    }

    const response = await api.get<OperationResult<PaginatedResponse<Venue>>>(
      `/venues?${params.toString()}`
    );
    return response.data;
  },

  // Get venue details by ID
  getVenueById: async (id: string): Promise<OperationResult<VenueDetail>> => {
    const response = await api.get<OperationResult<VenueDetail>>(`/venues/${id}`);
    return response.data;
  },

  // Get my venue (coordinator only)
  getMyVenue: async (): Promise<OperationResult<Venue>> => {
    const response = await api.get<OperationResult<Venue>>("/venues/my-venue");
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

  // Apply to volunteer at a venue (Volunteer only)
  applyToVenue: async (
    data: ApplyToVenueRequest
  ): Promise<OperationResult<VolunteerApplication>> => {
    const response = await api.post<OperationResult<VolunteerApplication>>("/venues/apply", data);
    return response.data;
  },

  // Get volunteers for a venue
  getVenueVolunteers: async (venueId: string): Promise<OperationResult<VolunteerProfileDto[]>> => {
    const response = await api.get<OperationResult<VolunteerProfileDto[]>>(
      `/venues/${venueId}/volunteers`
    );
    return response.data;
  },
};
