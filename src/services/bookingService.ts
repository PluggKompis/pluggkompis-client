import { api } from "./api";
import { Booking, CreateBookingRequest, OperationResult } from "@/types";

export const bookingService = {
  // Get all bookings for logged-in user
  getMyBookings: async (): Promise<OperationResult<Booking[]>> => {
    const response = await api.get<OperationResult<Booking[]>>("/bookings");
    return response.data;
  },

  // Create a booking
  createBooking: async (
    timeSlotId: string,
    bookingDate: string,
    childId?: string,
    notes?: string
  ): Promise<OperationResult<Booking>> => {
    const request: CreateBookingRequest = {
      timeSlotId,
      bookingDate,
      childId,
      notes,
    };
    const response = await api.post<OperationResult<Booking>>("/bookings", request);
    return response.data;
  },

  // Cancel a booking - handles 204 No Content response
  cancelBooking: async (bookingId: string): Promise<OperationResult<void>> => {
    try {
      const response = await api.delete(`/bookings/${bookingId}`);

      // Backend returns 204 No Content with empty body
      if (response.status >= 200 && response.status < 300) {
        console.log("✅ Booking cancelled successfully");
        return {
          isSuccess: true,
          data: undefined,
          errors: [],
        };
      }

      return {
        isSuccess: false,
        data: undefined,
        errors: ["Unexpected response from server"],
      };
    } catch (err) {
      console.error("❌ Cancel booking error:", err);

      // Simple error handling without complex type checking
      return {
        isSuccess: false,
        data: undefined,
        errors: ["Kunde inte avboka bokningen"],
      };
    }
  },
};
